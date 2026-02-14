'use server'

import { prisma } from '../utils/prisma';
import { revalidatePath } from 'next/cache';

// フォームからデータを受け取って保存する関数
export async function createPost(formData: FormData) {
  // 1. フォームの入力内容を取り出す
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  if (!title || !content) return;

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
    }
  });

  // 3. 保存が終わったら、トップページを最新状態に更新する魔法のおまじない
  revalidatePath('/');
}