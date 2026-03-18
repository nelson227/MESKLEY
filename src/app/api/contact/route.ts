import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import { contactSchema } from "@/lib/validations";
import { sendEmail, adminNotificationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const parsed = contactSchema.parse(body);

    const message = await ContactMessage.create({
      ...parsed,
      read: false,
    });

    // Notification admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        await sendEmail({
          to: adminEmail,
          subject: `Nouveau message de contact - ${parsed.subject}`,
          html: adminNotificationEmail("message de contact", parsed.fullName, `Sujet: ${parsed.subject}`),
        });
      }
    } catch {
      // Non bloquant
    }

    return NextResponse.json({ success: true, data: { _id: message._id } }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ success: false, error: "Données invalides" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
