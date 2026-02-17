// src/components/BookSearch.tsx
"use client";

// 👇 1. useEffect を追加でインポートします！
import { useState, useEffect } from "react";
import { searchBooksList } from "../app/actions";

export default function BookSearch() {
  const [keyword, setKeyword] = useState("");
const [results, setResults] = useState<{title: string, author: string | null, ndc: string | null}[]>([]);
const [selectedBook, setSelectedBook] = useState<{title: string, author: string | null, ndc: string | null} | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // 💡 2. ここがインクリメンタルサーチ（＋デバウンス）の心臓部！
  useEffect(() => {
    // キーワードが空っぽなら、検索結果をクリアして終了
    if (!keyword.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // ⏳ 0.5秒後にAPIを叩くタイマーをセットする
    const timer = setTimeout(async () => {
      const data = await searchBooksList(keyword);
      setResults(data);
      setIsSearching(false);
    }, 500);

    // 🧹 次の文字が入力されたら、前のタイマーをキャンセルする（これが連続アクセスを防ぐ魔法！）
    return () => clearTimeout(timer);
  }, [keyword]); // 👈 keywordが変わるたびにこの処理が走ります

  return (
    <div className="mb-4 p-4 border border-orange-200 rounded-xl bg-orange-50/50">
      <label className="block text-sm font-bold text-gray-700 mb-2">📚 読んだ本を選ぶ（任意）</label>

      {selectedBook ? (
        <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-orange-200 shadow-sm">
          <div>
<p className="font-bold text-gray-800">
              {selectedBook.title} {selectedBook.author ? `：${selectedBook.author}` : ""}
            </p>
            {selectedBook.ndc && <p className="text-xs text-blue-600 mt-1">🏷️ NDC: {selectedBook.ndc}</p>}
            
            <input type="hidden" name="bookTitle" value={selectedBook.title} />
            <input type="hidden" name="bookAuthor" value={selectedBook.author || ""} /> {/* 👈 追加！裏側に送る隠しデータ */}
            <input type="hidden" name="bookNdc" value={selectedBook.ndc || ""} />         </div>
          <button type="button" onClick={() => setSelectedBook(null)} className="text-sm text-red-500 hover:text-red-700 font-medium">
            選び直す ✕
          </button>
        </div>
      ) : (
        <div>
          {/* 👇 3. 検索ボタンを無くして、入力欄だけにしました！ */}
          <div className="relative mb-2">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="本のタイトルを入力すると自動で検索します..."
              className="w-full border border-gray-300 p-2 pl-3 pr-10 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            />
            {/* 検索中のクルクル表示 */}
            {isSearching && (
              <div className="absolute right-3 top-2.5">
                <span className="text-sm text-gray-400">検索中...</span>
              </div>
            )}
          </div>

          {results.length > 0 && (
            <ul className="bg-white border rounded-lg shadow-sm max-h-40 overflow-y-auto mt-2">
              {results.map((book, index) => (
                <li
                  key={index}
                  className="p-3 border-b hover:bg-orange-50 cursor-pointer text-sm flex justify-between items-center transition-colors"
                  onClick={() => setSelectedBook(book)}
                >
<span className="font-medium text-gray-700">
                    {book.title} {book.author ? `：${book.author}` : ""}
                  </span>
                  {book.ndc && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full whitespace-nowrap ml-2">NDC: {book.ndc}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}