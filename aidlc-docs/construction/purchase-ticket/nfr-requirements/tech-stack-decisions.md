# 技術スタック決定 — 購入馬券登録

## バックエンド

| 技術 | 採用理由 |
|---|---|
| Laravel 13 + Eloquent | 既存スタック（composer.json: laravel/framework ^13.0） |
| Laravel FormRequest | SECURITY-05 準拠のバリデーション層 |
| Laravel Policy | SECURITY-08 準拠の認可層（TicketPolicy） |
| DB::transaction | トランザクション管理 |

## フロントエンド

| 技術 | 採用理由 |
|---|---|
| React 19 + TypeScript | 既存スタック |
| Inertia.js v3 + useForm | フォーム送信・状態管理 |
| Valibot | クライアントサイドバリデーションスキーマ |
| Tailwind CSS v4 | 既存スタック |
| fast-check | PBT-09: TypeScript 対応、Vitest 統合、自動シュリンキング対応 |

## テスト

| 技術 | 用途 |
|---|---|
| Pest v4 + pest-plugin-laravel v4 | バックエンド unit / feature テスト（composer.json 確認済み） |
| Vitest | フロントエンド unit テスト |
| fast-check | フロントエンド PBT（バリデーション不変条件・冪等性） |
