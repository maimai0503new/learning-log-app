'use server'
import { redirect } from "next/navigation";
import { prisma } from '../utils/prisma';
import { revalidatePath } from 'next/cache';

// タイトルから国立国会図書館APIを叩いて、NDC（日本十進分類法）を取得する関数
async function fetchNDC(title: string) {
  try {
    // 1. 日本語のタイトルをURLで使える形に変換してAPIを叩く
    const encodedTitle = encodeURIComponent(title);
    const url = `https://ndlsearch.ndl.go.jp/api/opensearch?title=${encodedTitle}`;
    
    // APIへリクエストを送信！
    const response = await fetch(url);
    const xmlText = await response.text(); // NDLはXML形式でデータを返してきます

    // 2. 返ってきたXMLデータから「NDC」の数字だけを正規表現で抜き出す
    const match = xmlText.match(/<dc:subject[^>]*xsi:type="dcndl:NDC[^>]*>([^<]+)<\/dc:subject>/);
    
    // 3. もし見つかったらその数字を返し、見つからなければ null を返す
    if (match && match[1]) {
      return match[1]; // 例: "007.3" や "913.6"
    }
    return null;
  } catch (error) {
    console.error("APIの取得に失敗しました:", error);
    return null;
  }
}

// フォームからデータを受け取って保存する関数
export async function createPost(formData: FormData) {
  // 1. フォームの入力内容を取り出す
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

const bookTitle = formData.get('bookTitle') as string | null;
const bookAuthor = formData.get('bookAuthor') as string | null;
  const bookNdc = formData.get('bookNdc') as string | null;
  if (!title || !content) return;
  let bookId = null; // 最初は本のIDを空にしておく

  // 📚 もし本が選ばれていたら、Bookテーブルに保存（または検索）する
  if (bookTitle) {
    // 同じタイトルの本が既にデータベースの「本棚」にあるか探す
    let book = await prisma.book.findFirst({
      where: { title: bookTitle }
    });

    // 本棚になければ、新しく本を作成する！
    if (!book) {
      book = await prisma.book.create({
        data: {
          title: bookTitle,
          author: bookAuthor || null,
          ndc: bookNdc || null,
        }
      });
    }
    // 結びつけるための「本のID」をセット
    bookId = book.id;
  }
  // ※【裏技】まだログイン機能がないので、エラーを防ぐために「テストユーザー」を自動で1人作ります
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: { name: 'テストユーザー' }
    });
  }

  // 2. Prisma執事さんに、データベースへの保存をお願いする
  await prisma.post.create({
    data: {
      title: title,
      content: content,
      user_id: user.id, // テストユーザーのIDを紐付ける
      book_id: bookId,
    }
  });

  // 3. 保存が終わったら、トップページを最新状態に更新する魔法のおまじない
  revalidatePath('/');

}
export async function deletePost(formData: FormData) {
  // 1. フォームから送られてきた「削除したい投稿のID」を受け取る
  const id = formData.get('id') as string;
  if (!id) return;

  // 2. Prisma執事さんに「このIDの投稿を消して！」とお願いする
  await prisma.post.delete({
    // ※注意：もし schema.prisma で id を Int（数値）に設定している場合は、
    // ここを id: Number(id) に変更してください。String（UUID等）ならそのままでOKです！
    where: { id: id }, 
  });

  // 3. 削除が終わったら、トップページを最新状態に更新！
  revalidatePath('/');
}

export async function updatePost(formData: FormData){
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  if (!id || !title || !content) return;

  await prisma.post.update({
    where: {id: id},
    data: {
      title: title,
      content: content,
    },
  });

  revalidatePath('/');

  redirect('/');
}

export async function searchBooksList(keyword: string): Promise<{title: string, author: string | null, ndc: string | null}[]> {
  if (!keyword) return [];
  
  try {
    const encoded = encodeURIComponent(keyword);
    const url = `https://ndlsearch.ndl.go.jp/api/opensearch?title=${encoded}&cnt=5`;
    
    const response = await fetch(url);
    const xmlText = await response.text();

    const items = xmlText.match(/<item>([\s\S]*?)<\/item>/g) || [];
    
    const results = items.map(itemXml => {
      const titleMatch = itemXml.match(/<title>([^<]+)<\/title>/);
      const ndcMatch = itemXml.match(/<dc:subject[^>]*NDC[^>]*>([^<]+)<\/dc:subject>/);
      // 💡 作者を抜き出す！
      const authorMatch = itemXml.match(/<dc:creator[^>]*>([^<]+)<\/dc:creator>/) || itemXml.match(/<author[^>]*>([^<]+)<\/author>/);
      
      return {
        title: titleMatch ? titleMatch[1] : "不明なタイトル",
        author: authorMatch ? authorMatch[1] : null, // 👈 これが Vercel が欲しがっていたデータです！
        ndc: ndcMatch ? ndcMatch[1] : null,
      };
    });

    return results;
  } catch (error) {
    console.error("検索エラー:", error);
    return [];
  }
}