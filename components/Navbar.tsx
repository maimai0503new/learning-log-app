// src/components/Navbar.tsx

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-orange-500 text-white shadow-md">
      <nav className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* 左側：ロゴ（クリックでトップへ） */}
        <Link href="/" className="text-xl font-bold hover:text-orange-100 transition-colors">
          📚 Learning Log App
        </Link>

        {/* 右側：メニューリンク */}
        <div className="flex space-x-6 text-sm font-medium">
          <Link href="/" className="hover:text-orange-200 transition-colors">
            Home
          </Link>
          <Link href="/about" className="hover:text-orange-200 transition-colors">
            About
          </Link>
        </div>

      </nav>
    </header>
  );
}