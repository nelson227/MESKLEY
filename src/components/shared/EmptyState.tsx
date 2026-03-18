import { Search } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export default function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-light flex items-center justify-center mb-4">
        {icon || <Search className="w-8 h-8 text-gray" />}
      </div>
      <h3 className="text-lg font-semibold text-black mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        {title}
      </h3>
      <p className="text-gray text-sm max-w-md">{description}</p>
    </div>
  );
}
