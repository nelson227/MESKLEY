import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-gold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>404</h1>
      <p className="text-xl text-gray-600 mb-2">Page introuvable</p>
      <p className="text-gray-400 mb-8">La page que vous recherchez n&apos;existe pas ou a été déplacée.</p>
      <Link href="/" className="px-6 py-3 bg-gold text-black rounded-lg font-semibold hover:bg-gold-dark transition-colors">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
