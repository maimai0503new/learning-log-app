import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-orange-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-orange-100">
        
        {/* タイトルエリア */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-orange-200 pb-2">
          📚 このアプリについて
        </h1>

        {/* 本文エリア */}
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-orange-600 mb-2">読書記録アプリとは？</h2>
            <p>
              日々の読書体験を記録し、振り返ることができるシンプルなアプリです。
              国立国会図書館のAPIを活用して、正確な本の情報と一緒に感想を残すことができます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-orange-600 mb-2">主な機能</h2>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>本のタイトル検索（サジェスト機能付き）</li>
              <li>自動的な書誌情報の取得（作者名・NDC分類）</li>
              <li>読書感想の記録と保存</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-orange-600 mb-2">技術スタック</h2>
            <p className="text-sm bg-gray-100 p-4 rounded-lg">
              Next.js (App Router) / TypeScript / Tailwind CSS / Supabase / Prisma / Vercel
            </p>
          </section>
        </div>

        {/* トップに戻るボタン */}
        <div className="mt-10 text-center">
          <Link 
            href="/" 
            className="inline-block bg-orange-500 text-white font-bold py-3 px-8 rounded-full hover:bg-orange-600 transition-colors shadow-md"
          >
            🏠 ホームに戻る
          </Link>
        </div>

      </div>
    </div>
  );
}