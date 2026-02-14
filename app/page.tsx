import { createPost } from './actions';
import { prisma } from '../utils/prisma';

export default async function Home() {
  // 💡 Prisma執事さんに「今までの投稿を全部、新しい順で持ってきて！」とお願いする
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
          {/* action={createPost} で、送信ボタンを押した時に先ほどの命令書を実行します */}
          <form action={createPost} className="flex flex-col gap-4">
            <input 
              type="text" 
              name="title" 
              placeholder="今日のテーマ（例：Prismaの設定を乗り越えた！）" 
              className="border border-gray-300 rounded-lg p-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
              required
            />
            <textarea 
              name="content" 
              placeholder="どんなことを学びましたか？どんな感情でしたか？" 
              className="border border-gray-300 rounded-lg p-3 h-32 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
              required
            ></textarea>
            <button 
              type="submit" 
              className="bg-amber-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-700 transition w-fit"
            >
              記録を保存する
            </button>
          </form>
        </div>

        {/* 📚 投稿の一覧表示部分 */}
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
              <h3 className="text-lg font-bold text-gray-800 mb-2">{post.title}</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{post.content}</p>
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