export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Array<{ field: string; message: string }>;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    limit: number;
  };
}

export interface ContactMessage {
  _id: string;
  fullName: string;
  email: string;
  subject: "logement" | "renseignement" | "partenariat" | "autre";
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AdminUser {
  _id: string;
  email: string;
  name: string;
  role: "admin" | "super_admin";
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}
