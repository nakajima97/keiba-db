# NFR要件 — 購入馬券登録

## セキュリティ要件（SECURITY拡張より）

| ルールID | 要件 | 実装方針 |
|---|---|---|
| SECURITY-05 | 全APIパラメータのバリデーション | StoreTicketRequest / StorePayoutRequest で実装 |
| SECURITY-08 | アクセス制御（認証・IDOR防止） | auth+verified MW + TicketPolicy |
| SECURITY-09 | エラーレスポンスに内部情報を含めない | Laravel の production error handler 設定 |
| SECURITY-15 | 外部呼び出しの明示的エラーハンドリング | DB::transaction + try/catch |
| SECURITY-01 | 転送中暗号化 | TLS（デプロイ設定、Laravel 側は設定のみ） |
| SECURITY-03 | 構造化ログ | Laravel ログ設定（PII をログしない） |
| SECURITY-04 | HTTPセキュリティヘッダー | Laravel ミドルウェアで設定 |
| SECURITY-10 | 依存関係固定 | composer.lock / package-lock.json コミット済み |
| SECURITY-02,06,07,11,12,13,14 | N/A | ロードバランサー・CDN・MFAは本スコープ外 |

## パフォーマンス要件

| 要件 | 目標値 | 理由 |
|---|---|---|
| フォーム送信レスポンス | 2秒以内 | 連続登録UXの快適性（requirements FR-02） |
| 馬券一覧表示 | 1秒以内 | ページ初期表示 |

## テスト要件（PBT拡張より）

| ルールID | 要件 |
|---|---|
| PBT-09 | TypeScript: **fast-check** を採用（Vitest 統合） |
| PBT-01 | 特定済み（business-rules.md の PBT-01 セクション参照） |
| PBT-03 | バリデーション不変条件を PBT でカバー |
| PBT-04 | find-or-create の冪等性を PBT でカバー |
| PBT-02,05,06 | N/A（シリアライズなし・オラクルなし・ステートマシンなし） |
