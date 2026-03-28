# サービス定義

## サービスレイヤーの役割

```
Controller → Service → Model
```

- **Controller**: HTTP の関心事（リクエスト受け取り、レスポンス返却）のみ
- **Service**: ユースケース単位のビジネスロジック（トランザクション、find-or-create）
- **Model**: データ構造とリレーション定義のみ

---

## TicketRegistrationService

**責務**: 購入馬券の登録に必要なエンティティチェーンを管理する

### find-or-create チェーン

```
入力: { venue_id, date, race_number, bet_type, amount, horse_numbers }
         │
         ▼
    Meeting::firstOrCreate
    { venue_id, date }
         │
         ▼
    Race::firstOrCreate
    { meeting_id, race_number }
         │
         ▼
    Ticket::create
    { race_id, bet_type, amount, horse_numbers }
         │
         ▼
    return Ticket
```

### トランザクション境界

Meeting の find-or-create から Ticket の create まで、単一の DB トランザクション内で実行する。

```php
DB::transaction(function () use ($data) {
    $meeting = Meeting::firstOrCreate([...]);
    $race    = Race::firstOrCreate([...]);
    return Ticket::create([...]);
});
```

### 冪等性の考慮

同じ Venue + Date + RaceNumber の組み合わせで複数回呼ばれても Meeting/Race は重複作成しない（firstOrCreate による保証）。

---

## PayoutService

**責務**: 購入馬券に対する払い戻しの登録・更新を管理する

### updateOrCreate パターン

```
入力: Ticket $ticket, int $amount
         │
         ▼
    Payout::updateOrCreate
    [ticket_id => $ticket->id], [amount => $amount]
         │
         ▼
    return Payout
```

- Payout は Ticket に対して 0 または 1 の関係（HasOne）
- 既存の Payout があれば更新、なければ作成（PUT/POST を同一メソッドで処理可能）

---

## サービス間の依存関係

```
TicketRegistrationService
  └── uses: Meeting::firstOrCreate, Race::firstOrCreate, Ticket::create

PayoutService
  └── uses: Payout::updateOrCreate
```

サービス間の直接依存はなし（疎結合）。

---

## 将来の拡張ポイント

| 機能 | 拡張方法 |
|---|---|
| 馬券の一括インポート | `BulkTicketImportService` を追加（`TicketRegistrationService` を内部利用） |
| 収支集計 | `BalanceSummaryService` を追加（Ticket + Payout のクエリを集約） |
| 通知（レース結果連携） | `RaceResultService` → `PayoutService` の呼び出しで自動払い戻し登録 |
