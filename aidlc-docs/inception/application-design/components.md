# コンポーネント定義

## アーキテクチャ方針（Q1 への回答）

このスケール・拡張性要件に対して **Service + Thin Controller** パターンを採用する。

```
┌──────────────────────────────────────────────┐
│  HTTP Layer (Controller + FormRequest)        │
│  ・入力受け取り・バリデーション委譲・レスポンス返却  │
│  ・ビジネスロジックを持たない                     │
└──────────────┬───────────────────────────────┘
               │
┌──────────────▼───────────────────────────────┐
│  Service Layer                                │
│  ・ユースケース単位のクラス                       │
│  ・トランザクション管理                           │
│  ・find-or-create 等のビジネスロジック             │
└──────────────┬───────────────────────────────┘
               │
┌──────────────▼───────────────────────────────┐
│  Model Layer (Eloquent)                       │
│  ・リレーション定義                              │
│  ・スコープ・アクセサ                             │
│  ・ビジネスロジックを持たない（Anemic Model）       │
└──────────────────────────────────────────────┘
```

将来の拡張性:
- Service クラスはインターフェース化によって差し替え可能にできる
- Eloquent モデルは Repository パターンへの移行が容易
- 現時点では YAGNI 原則に従いシンプルに保つ

---

## バックエンドコンポーネント

### Model コンポーネント

| コンポーネント | クラス名 | 責務 |
|---|---|---|
| レース場モデル | `App\Models\Venue` | レース場エンティティ、Meeting とのリレーション |
| 開催モデル | `App\Models\Meeting` | Venue + date の組み合わせ、Race とのリレーション |
| レース情報モデル | `App\Models\Race` | Meeting + race_number、Ticket とのリレーション |
| 購入馬券モデル | `App\Models\Ticket` | 馬券種別・金額・馬番、Payout とのリレーション |
| 払い戻しモデル | `App\Models\Payout` | 払い戻し金額、Ticket へのリレーション |

### Service コンポーネント

| コンポーネント | クラス名 | 責務 |
|---|---|---|
| 馬券登録サービス | `App\Services\TicketRegistrationService` | Venue→Meeting→Race の find-or-create + Ticket 作成をトランザクション内で実行 |
| 払い戻しサービス | `App\Services\PayoutService` | Ticket に対する Payout の作成・更新 |

### HTTP コンポーネント

| コンポーネント | クラス名 | 責務 |
|---|---|---|
| レース場コントローラー | `App\Http\Controllers\VenueController` | GET /venues（ドロップダウン用一覧） |
| 馬券コントローラー | `App\Http\Controllers\TicketController` | POST /tickets（登録） |
| 払い戻しコントローラー | `App\Http\Controllers\PayoutController` | POST/PUT /tickets/{ticket}/payout |
| 馬券バリデーション | `App\Http\Requests\StoreTicketRequest` | 馬券登録の入力バリデーション |
| 払い戻しバリデーション | `App\Http\Requests\StorePayoutRequest` | 払い戻し登録・更新のバリデーション |

---

## フロントエンドコンポーネント（FSD）

| レイヤー | スライス/コンポーネント | 責務 |
|---|---|---|
| pages | `pages/tickets/create.tsx` | Inertia ページ（薄く、Widget に委譲） |
| features | `features/add-ticket/` | 馬券入力フォーム + 連続登録ロジック |
| features | `features/record-payout/` | 払い戻し金額入力フォーム |
| entities | `entities/ticket/` | Ticket 型定義・表示コンポーネント |
| entities | `entities/venue/` | Venue 型定義・VenueSelect コンポーネント |
| entities | `entities/race/` | Race 型定義（表示用） |
