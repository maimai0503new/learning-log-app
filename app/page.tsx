// app/page.tsx
import { createPost } from './actions';
import { prisma } from '../utils/prisma';
import DeleteButton from '../components/DeleteButton';
import SubmitButton from '../components/SubmitButton'; // 👈 追加！

// 💡 日付を綺麗にフォーマットする関数（例：2026/02/15 14:30）
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  }).format(date);
};

export default async function Home() {
  const posts = await prisma.post.findMany({
    orderBy: { created_at: 'desc' }
  });

  return (
    <main className="min-h-screen p-8 bg-orange-50 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-amber-900 mb-8 border-b-2 border-amber-200 pb-2">
          みんなの学びカフェ☕️
        </h1>
        
        {/* 📝 入力フォーム部分 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100 mb-8">
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
              {/* 👇 日付の表示を追加！ */}
              <p className="text-sm text-amber-600 font-medium mb-1">
                {formatDate(post.created_at)}
              </p>
              
              <h3 className="text-lg font-bold text-gray-800 mb-2 pr-8">{post.title}</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{post.content}</p>
              
              <DeleteButton id={post.id} />
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