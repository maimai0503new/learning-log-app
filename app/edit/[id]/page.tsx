// src/app/edit/[id]/page.tsx
import { prisma } from '../../../utils/prisma';
import { updatePost } from '../../actions';
import Link from 'next/link';
import SubmitButton from '../../../components/SubmitButton';

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  }).format(date);
};

// 💡 画面のURLから「id」を受け取るための型定義
export default async function EditPage({ params }: { params: Promise< { id: string } >}) {
  // 1. URLの [id] の部分に入っている文字を取得する（例: /edit/123 なら '123'）
  const { id } = await params;

  // 2. そのIDを使って、データベースから「編集する前の古いデータ」を取ってくる
  const post = await prisma.post.findUnique({
    where: { id: id }, // ※ idが数値の場合は Number(id)
  });

  // もしURLを直接手入力されて、存在しないIDだった場合は「見つかりません」と出す
  if (!post) {
    return <div className="p-8 text-center text-red-500">投稿が見つかりませんでした。</div>;
  }

  // 3. 取得した古いデータを、入力フォームに最初から入れておく（defaultValue）
  return (
    <main className="min-h-screen p-8 bg-orange-50 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <div className="flex justify-between items-center mb-8 border-b-2 border-amber-200 pb-2">
          <h1 className="text-3xl font-bold text-amber-900">
            記録を編集する✏️
          </h1>
          <Link href="/" className="text-amber-700 hover:underline">
            ← 戻る
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
          {/* 更新用のServer Action（updatePost）を呼び出す */}
          <form action={updatePost} className="flex flex-col gap-4">
            {/* 💡 裏側で「どの投稿を直すか」を送るための隠しID */}
            <input type="hidden" name="id" value={post.id} />
            



            <input 
              type="text" 
              name="title" 
              defaultValue={post.title} // 👈 データベースから取ってきた古いタイトルをセット！
              className="border border-gray-300 rounded-lg p-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition text-black"
              required
            />

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

            <textarea 
              name="content" 
              defaultValue={post.content} // 👈 データベースから取ってきた古い内容をセット！
              className="border border-gray-300 rounded-lg p-3 h-48 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition text-black"
              required
            ></textarea>
            
            <SubmitButton />
          </form>
        </div>
      </div>
    </main>
  );
}