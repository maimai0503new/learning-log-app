export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-orange-50 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-amber-900 mb-6 border-b-2 border-amber-200 pb-2">
          みんなの学びカフェ☕️
        </h1>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            今日の学びを記録しよう
          </h2>
          <p className="text-gray-600 mb-4">
            拙くても大丈夫。あなたの感じたことが、誰かの刺激になります。
          </p>
          <button className="bg-amber-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-700 transition">
            記録を書く
          </button>
        </div>
      </div>
    </main>
  );
}