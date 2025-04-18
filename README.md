# Tibani Link
千葉工業大学生のための短縮URLサービス。

- **高自由度** 千葉工業大学生しか使えないので、使えるカスタムリンクが豊富
- **アクセス制限** 千葉工業大学生専用の短縮URLを作成可能
- **アクセス記録** アクセスの数やユーザーを記録可能

## 技術スタック
- Hono
- Tailwind CSS
- Drizzle ORM
- htmx
- Cloudflare Workers
- Cloudflare D1

## セットアップ
依存関係を以下でまずインストールする。
```shell
pnpm i
```

もし既にCloudflare D1のデータベースが存在する場合、
`wrangler.template.toml`ファイルを基に`wrangler.toml`を作成する。  
まだデータベースがない場合、`pnpm exec wrangler d1 create <name>`か何かでデータベースを作成する。

ローカルのデータベースにマイグレーションを適用してテーブルなどを用意する。
```shell
pnpm exec wrangler d1 migrations apply tibani-link --local
```
※もしCloudflareの本番環境のデータベースに対して適用したい場合、`--local`を`--remote`にする。

`.env.template`ファイルを基に、`.env`ファイルを作成する。
このファイルにTibani Linkのログイン設定などを書き込む。

以下のコマンドでTibani Linkを起動する。
```shell
pnpm dev
```

## 開発方法
Drizzle ORMを使っているので、データベースのスキーマを更新した時は、以下のコマンドでマイグレーションを作成できる。
```shell
drizzle-kit generate
```
デプロイは`pnpm deploy`でできる。
