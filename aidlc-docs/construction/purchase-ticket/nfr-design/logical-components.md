# 論理コンポーネント — 購入馬券登録

## 追加コンポーネント

### SecurityHeaders ミドルウェア（SECURITY-04）
- **目的**: 全レスポンスに HTTP セキュリティヘッダーを付与
- **場所**: `app/Http/Middleware/SecurityHeaders.php`
- **設定**: `bootstrap/app.php` の `withMiddleware` に追加

### TicketPolicy（SECURITY-08）
- **目的**: Ticket リソースへのアクセス制御
- **場所**: `app/Policies/TicketPolicy.php`
- **メソッド**: `createPayout(User, Ticket): bool`

## 論理フロー（NFR 統合後）

```
HTTP Request
    │
    ▼
[auth + verified MW] ── 未認証 → 401 redirect
    │
    ▼
[SecurityHeaders MW] ── ヘッダー付与
    │
    ▼
[FormRequest バリデーション] ── 失敗 → 422 + errors
    │
    ▼
[Policy 認可確認] ── 失敗 → 403（PayoutController のみ）
    │
    ▼
[Service（DB::transaction）] ── DB エラー → 500（詳細非表示）
    │
    ▼
[Inertia redirect back] ── 成功
```

## データ保護

- `user_id` を Ticket に必ず紐付けることで、他ユーザーのデータへのアクセスを防止
- ログに PII（馬番等は含まない）を出力しない
