import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import { loginSchema } from "@/lib/validations";
import { comparePassword, createToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const parsed = loginSchema.parse(body);

    const user = await AdminUser.findOne({ email: parsed.email });
    if (!user) {
      return NextResponse.json({ success: false, error: "Identifiants invalides" }, { status: 401 });
    }

    const validPassword = await comparePassword(parsed.password, user.passwordHash);
    if (!validPassword) {
      return NextResponse.json({ success: false, error: "Identifiants invalides" }, { status: 401 });
    }

    const token = await createToken({
      userId: String(user._id),
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      data: { token, user: { email: user.email, role: user.role } },
    });

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: "/",
    });

    return response;
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ success: false, error: "Données invalides" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
