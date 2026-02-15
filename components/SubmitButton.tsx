// components/SubmitButton.tsx
'use client'; // ブラウザ側で状態（送信中かどうか）を監視するための宣言

import { useFormStatus } from 'react-dom';

export default function SubmitButton() {
  // 💡 pending（保留中）が true なら送信中、false なら待機中
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending} // 送信中はボタンを押せなくする
      className={`px-6 py-2 rounded-lg font-medium transition w-fit text-white ${
        pending 
          ? 'bg-amber-400 cursor-not-allowed' // 送信中の色（薄くする）
          : 'bg-amber-600 hover:bg-amber-700' // 通常時の色
      }`}
    >
      {/* 状態によってテキストを切り替える */}
      {pending ? '記録中... ☕️' : '記録を保存する'}
    </button>
  );
}