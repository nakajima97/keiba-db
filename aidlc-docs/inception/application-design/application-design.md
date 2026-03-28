# Application Design — 統合版

## アーキテクチャ決定サマリー

| 決定項目 | 採用方針 | 根拠 |
|---|---|---|
| バックエンド構造 | Service + Thin Controller | テスタビリティ・拡張性・Laravel 慣習 |
| find-or-create | TicketRegistrationService に集約 | トランザクション管理の明確化 |
| Venue 管理 | ユーザー管理 + 初期データは Seeder | 柔軟性と運用コストのバランス |
| 払い戻しルート | /tickets/{ticket}/payout ネスト | Ticket との関連が明確 |

---

## コンポーネント一覧

### バックエンド（Laravel）

```
app/
├── Models/
│   ├── Venue.php              ← レース場（HasMany: meetings）
│   ├── Meeting.php            ← 開催（BelongsTo: venue, HasMany: races）
│   ├── Race.php               ← レース情報（BelongsTo: meeting, HasMany: tickets）
│   ├── Ticket.php             ← 購入馬券（BelongsTo: race, HasOne: payout）
│   └── Payout.php             ← 払い戻し（BelongsTo: ticket）
├── Services/
│   ├── TicketRegistrationService.php   ← find-or-create チェーン + Ticket 作成
│   └── PayoutService.php              ← Payout updateOrCreate
├── Http/
│   ├── Controllers/
│   │   ├── VenueController.php        ← GET /venues
│   │   ├── TicketController.php       ← GET /tickets/create, POST /tickets
│   │   └── PayoutController.php       ← POST/PUT /tickets/{ticket}/payout
│   └── Requests/
│       ├── StoreTicketRequest.php     ← 馬券バリデーション
│       └── StorePayoutRequest.php     ← 払い戻しバリデーション
database/
├── migrations/
│   ├── xxxx_create_venues_table.php
│   ├── xxxx_create_meetings_table.php
│   ├── xxxx_create_races_table.php
│   ├── xxxx_create_tickets_table.php
│   └── xxxx_create_payouts_table.php
└── seeders/
    └── VenueSeeder.php                ← JRA/NAR 競馬場の初期データ
```

### フロントエンド（FSD）

```
resources/js/
├── pages/
│   └── tickets/
│       └── create.tsx                 ← Inertia ページ（薄く）
├── features/
│   ├── add-ticket/
│   │   ├── ui/AddTicketForm.tsx        ← フォーム UI
│   │   ├── model/types.ts             ← AddTicketFormData 型
│   │   ├── model/schema.ts            ← Zod スキーマ
│   │   ├── api/submitTicket.ts        ← Inertia POST 送信
│   │   └── config/constants.ts        ← 馬券種別リスト等
│   └── record-payout/
│       ├── ui/PayoutForm.tsx           ← 払い戻し入力フォーム
│       ├── model/types.ts
│       └── api/submitPayout.ts
├── entities/
│   ├── ticket/
│   │   ├── ui/TicketCard.tsx           ← 登録済み馬券表示
│   │   └── model/types.ts             ← Ticket 型
│   ├── venue/
│   │   ├── ui/VenueSelect.tsx          ← レース場選択UI
│   │   └── model/types.ts             ← Venue 型
│   └── race/
│       └── model/types.ts             ← Race 型
└── shared/
    └── types/
        └── index.ts                   ← PageProps 等（既存）
```

---

## キーとなるビジネスルール（Functional Design で詳細化）

1. **find-or-create 冪等性**: 同一 Venue + Date + RaceNumber は重複作成しない
2. **連続登録**: 登録成功後、race_number + 1 の状態でフォームリセット（フロントエンド側の状態管理）
3. **IDOR 対策**: PayoutController で Ticket の owner（ユーザー）確認（認証ユーザーが所有する Ticket のみ操作可）
4. **払い戻し重複**: 1 Ticket につき Payout は 1 件のみ（updateOrCreate で管理）

---

## 詳細ドキュメント

| ファイル | 内容 |
|---|---|
| [components.md](components.md) | コンポーネント責務定義 |
| [component-methods.md](component-methods.md) | メソッドシグネチャ |
| [services.md](services.md) | サービス層設計 |
| [component-dependency.md](component-dependency.md) | 依存関係・データフロー |
