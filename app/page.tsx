// app/page.tsx
import { createPost } from './actions';
import { prisma } from '../utils/prisma';
import DeleteButton from '../components/DeleteButton';
import SubmitButton from '../components/SubmitButton'; // 👈 追加！
import Link from 'next/link';
import BookSearch from '../components/BookSearch';

// 💡 日付を綺麗にフォーマットする関数（例：2026/02/15 14:30）
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  }).format(date);
};
function getNdcLabel(ndc: string | null) {
  if (!ndc) return null;
  const firstChar = ndc.charAt(0);
  const ndcMap: Record<string, string> = {
    '0': '総記', '1': '哲学', '2': '歴史', '3': '社会科学', '4': '自然科学',
    '5': '技術', '6': '産業', '7': '芸術', '8': '言語', '9': '文学'
  };
  if (ndcMap[firstChar]) return `${ndcMap[firstChar]}（${ndc}）`;
  if (firstChar === 'M') return `文学（${ndc}）`;
  return `その他（${ndc}）`;
}
export default async function Home() {
  const posts = await prisma.post.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      book: true, // 👈 これがリレーショナルデータベース最大の魔法です✨
    }
  });

  return (
    <main className="min-h-screen p-8 bg-orange-50 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-amber-900 mb-8 border-b-2 border-amber-200 pb-2">
          Learning Log App
        </h1>
        
        {/* 📝 入力フォーム部分 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100 mb-8 text-black">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            今日の学びを記録しよう
          </h2>
          <form action={createPost} className="flex flex-col gap-4">
            <input 
              type="text" 
              name="title" 
              placeholder="今日のテーマ" 
              className="border border-gray-300 rounded-lg p-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
              required
            />
            <BookSearch />
            <textarea 
              name="content" 
              placeholder="どんなことを学びましたか？" 
              className="border border-gray-300 rounded-lg p-3 h-32 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
              required
            ></textarea>
            
            {/* 👇 さっき作った賢いボタンに置き換え！ */}
            <SubmitButton />
          </form>
        </div>

        {/* 📚 投稿の一覧表示部分 */}
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-orange-100 relative group">

              
              <h3 className="text-lg font-bold text-gray-800 mb-2 pr-8">{post.title}</h3>

{post.book && (
        <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-sm font-bold text-gray-800">
            📖 {post.book.title} {post.book.author ? `：${post.book.author}` : ""}
          </p>
          {post.book.ndc && (
            <span className="inline-block mt-1 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full border border-blue-200">
              🏷️ 分類: {getNdcLabel(post.book.ndc)}
            </span>
          )}
        </div>
      )}
              {/* 👇 日付の表示を追加！ */}
              <div className="flex gap-4 text-xs text-amber-600 font-medium mb-2">
                <span>🌱 作成: {formatDate(post.created_at)}</span>
        
        {/* 💡 もし作成日時と更新日時が違う（＝編集された）場合だけ、更新日時を出すとスマートです */}
        {post.created_at.getTime() !== post.updated_at.getTime() && (
          <span className="text-gray-500">
            🔄 更新: {formatDate(post.updated_at)}
          </span>
        )}
      </div>
              <p className="text-gray-600 whitespace-pre-wrap">{post.content}</p>
             {/* 👇 右上のボタンエリアをまとめるdivを追加 */}
              <div className="absolute top-6 right-6 flex gap-3">
                {/* ✏️ 編集ページ（/edit/投稿のID）へのリンク */}
                <Link
                  href={`/edit/${post.id}`} 
                  className="text-gray-300 hover:text-blue-500 transition-colors"
                  title="編集する"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                  </svg>
                </Link>
                
                {/* 🗑️ 元々あった削除ボタン */}
                <DeleteButton id={post.id} />
              </div>
            </div>
          ))}
          
          {posts.length === 0 && (
            <p className="text-center text-gray-500 py-8">まだ記録がありません。最初の学びを投稿してみましょう！</p>
          )}
        </div>
      </div>
    </main>
  );
}