# コンポーネント依存関係

## 依存マトリクス

### バックエンド

```
VenueController
  └── depends on: Venue (Model)

TicketController
  ├── depends on: StoreTicketRequest
  ├── depends on: TicketRegistrationService
  └── depends on: Venue (Model) ─ create アクションで一覧取得

PayoutController
  ├── depends on: StorePayoutRequest
  ├── depends on: PayoutService
  └── depends on: Ticket (Model) ─ route model binding

TicketRegistrationService
  ├── depends on: Meeting (Model)
  ├── depends on: Race (Model)
  └── depends on: Ticket (Model)

PayoutService
  └── depends on: Payout (Model)
```

### フロントエンド（FSD 依存方向ルール準拠）

```
pages/tickets/create.tsx
  └── (Inertia が自動解決、FSD ルール適用外)

features/add-ticket/ui/AddTicketForm.tsx
  ├── depends on: entities/venue/ui/VenueSelect
  └── depends on: shared/ui/button, input, label ...

features/add-ticket/api/submitTicket.ts
  └── depends on: @inertiajs/react (Form)

features/record-payout/ui/PayoutForm.tsx
  └── depends on: shared/ui/button, input ...

entities/ticket/model/types.ts
  └── depends on: (no external)

entities/venue/model/types.ts
  └── depends on: (no external)
```

---

## データフロー図

### 馬券登録フロー

```
[ブラウザ]
  │  POST /tickets
  │  { venue_id, date, race_number, bet_type, amount, horse_numbers }
  ▼
[TicketController::store]
  │  StoreTicketRequest でバリデーション
  ▼
[TicketRegistrationService::register]
  │  DB::transaction {
  │    Meeting::firstOrCreate(venue_id, date)
  │    Race::firstOrCreate(meeting_id, race_number)
  │    Ticket::create(race_id, ...)
  │  }
  ▼
[redirect back] ← 登録完了
```

### 払い戻し登録フロー

```
[ブラウザ]
  │  POST /tickets/{ticket}/payout
  │  { amount }
  ▼
[PayoutController::store]
  │  StorePayoutRequest でバリデーション
  │  Ticket (route model binding) の所有者確認
  ▼
[PayoutService::createOrUpdate]
  │  Payout::updateOrCreate(ticket_id, amount)
  ▼
[redirect back] ← 登録完了
```

---

## ルート定義（概要）

```php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/venues', [VenueController::class, 'index']);
    Route::get('/tickets/create', [TicketController::class, 'create']);
    Route::post('/tickets', [TicketController::class, 'store']);
    Route::post('/tickets/{ticket}/payout', [PayoutController::class, 'store']);
    Route::put('/tickets/{ticket}/payout', [PayoutController::class, 'update']);
});
```
