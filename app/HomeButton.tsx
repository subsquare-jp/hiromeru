import Link from 'next/link';

export default function HomeButton() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-gray-800 shadow-md transition-all hover:bg-gray-50 active:scale-95 border-2 border-green-500"
    >
      <span className="text-lg" role="img" aria-label="home">🏠</span>
      <span>ホーム</span>
    </Link>
  );
}
