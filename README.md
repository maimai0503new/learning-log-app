
```markdown
# 📚 読書記録アプリ (Reading Log App)

日々の読書体験を記録し、振り返ることができるWebアプリケーションです。
国立国会図書館のAPIを活用し、本のタイトルや作者、NDC（日本十進分類法）を自動で取得して記録できます。

## 🚀 主な機能

- **インクリメンタルサーチ**: 本のタイトルを入力すると、リアルタイムで候補を表示（Debounce対応）。
- **書誌情報の自動取得**: 国立国会図書館API（NDL Search）から、タイトル・作者名・NDC分類を自動取得。
- **読書記録の投稿**: 感想やメモを本と紐付けて保存。
- **レスポンシブデザイン**: スマホ・PCどちらでも見やすいUI（Tailwind CSS）。
- **ページルーティング**: Next.js App Routerによる高速なページ遷移（Home / About）。

## 🛠 使用技術 (Tech Stack)

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Component**: React Server Components / Client Components

### Backend / Database
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **API**: Next.js Server Actions
- **External API**: 国立国会図書館サーチ API (OpenSearch)

### Infrastructure
- **Deployment**: Vercel
- **Version Control**: GitHub

## 🏁 ローカルでの起動方法

1. リポジトリをクローンします。
   ```bash
   git clone <リポジトリのURL>

```

2. パッケージをインストールします。
```bash
npm install

```


3. 環境変数を設定します。
ルートディレクトリに `.env` ファイルを作成し、Supabaseの接続情報を記述してください。
```env
DATABASE_URL="your_database_url"
DIRECT_URL="your_direct_url"

```


4. データベースをセットアップします。
```bash
npx prisma generate
npx prisma db push

```


5. 開発サーバーを起動します。
```bash
npm run dev

```


http://localhost:3000 にアクセスして確認できます。

## 📂 ディレクトリ構成

```
src/
├── app/
│   ├── about/      # Aboutページ
│   ├── actions.ts  # Server Actions（API連携・DB操作）
│   ├── layout.tsx  # 共通レイアウト（Navbar含む）
│   └── page.tsx    # トップページ（投稿一覧）
├── components/
│   ├── BookSearch.tsx  # 本の検索コンポーネント（クライアントサイド）
│   └── Navbar.tsx      # ナビゲーションバー
└── utils/
    └── prisma.ts       # Prismaクライアントのインスタンス化

```

## 📝 今後の展望 (Todo)

* [ ] 本ごとの詳細ページ作成（Dynamic Routing）
* [ ] 投稿の編集機能
* [ ] ユーザー認証機能の実装

```

***

### 📝 反映の手順

1. VSCodeで `README.md` ファイルを開きます（なければ新しく作ってください）。
2. 元々書いてあった内容を全部消して、上の内容を貼り付けます。
3. 保存したら、いつものように GitHub へプッシュしましょう！

```bash
git add README.md
git commit -m "READMEの更新"
git push

```
