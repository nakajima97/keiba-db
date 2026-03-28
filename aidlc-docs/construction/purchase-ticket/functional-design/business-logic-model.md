# ビジネスロジックモデル — 購入馬券登録

## ユースケース 1: 購入馬券登録

```
入力: { venue_id, date, race_number, bet_type, amount, horse_numbers }

1. StoreTicketRequest でバリデーション
   └─ 失敗 → 422 + バリデーションエラーを返す

2. TicketRegistrationService::register($data) ─ DB::transaction
   ├─ Meeting::firstOrCreate(venue_id, date)
   ├─ Race::firstOrCreate(meeting_id, race_number)
   └─ Ticket::create(race_id, user_id, bet_type, amount, horse_numbers)

3. 成功 → redirect back (Inertia) + フラッシュメッセージ
   └─ フロントエンド: race_number + 1 にして フォームリセット
```

## ユースケース 2: 払い戻し登録・更新

```
入力: { Ticket (route model binding), amount }

1. 認可確認: TicketPolicy::update($user, $ticket)
   └─ 失敗 → 403 Forbidden

2. StorePayoutRequest でバリデーション
   └─ 失敗 → 422 + バリデーションエラーを返す

3. PayoutService::createOrUpdate($ticket, $amount)
   └─ Payout::updateOrCreate(['ticket_id' => $ticket->id], ['amount' => $amount])

4. 成功 → redirect back + フラッシュメッセージ
```

## ユースケース 3: 馬券登録フォーム表示

```
GET /tickets/create

1. auth + verified ミドルウェア確認

2. Venue::all() → フォームの選択肢として props に渡す

3. Inertia::render('tickets/create', [
     'venues' => VenueResource::collection($venues)
   ])
```

## ページ導線（ナビゲーション）

```
[ダッシュボード (/dashboard)]
  └─ リンク "馬券を登録" → GET /tickets/create

[馬券登録ページ (/tickets/create)]
  ├─ フォーム送信 → POST /tickets → redirect back（同ページ）
  └─ 各馬券に払い戻し入力 → POST /tickets/{id}/payout → redirect back
```

**実装方針（「ページの導線だけ確保」への対応）**:
- ダッシュボード (`/dashboard`) にシンプルな「馬券を登録する」リンクを追加する
- これにより URL を知らなくてもページに到達できる導線を確保する
