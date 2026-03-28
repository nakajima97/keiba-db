# フロントエンドコンポーネント — 購入馬券登録

## コンポーネント階層

```
pages/tickets/create.tsx
  ├── props: { venues: Venue[], tickets: Ticket[] }
  ├── features/add-ticket/ui/AddTicketForm
  │     ├── entities/venue/ui/VenueSelect      ← レース場選択
  │     ├── shared/ui/input                    ← 開催日・レース番号・馬番・金額
  │     ├── shared/ui/select (or radio)        ← 馬券種別
  │     └── shared/ui/button                  ← 送信
  └── (登録済み馬券リスト)
        └── entities/ticket/ui/TicketCard
              └── features/record-payout/ui/PayoutForm
```

## 各コンポーネントの Props / State

### `pages/tickets/create.tsx`
```ts
type Props = {
  venues: Venue[]
  tickets: Ticket[]  // 本日の登録済み馬券一覧（サーバーから渡す）
}
```
- ロジックなし。AddTicketForm と TicketCard 群に委譲するだけ。

### `features/add-ticket/ui/AddTicketForm.tsx`
```ts
type FormState = {
  venue_id: number | ''
  date: string        // YYYY-MM-DD
  race_number: number // 1〜12
  bet_type: BetType | ''
  horse_numbers: string
  amount: number | ''
}
```
- 送信成功後: `race_number += 1`、その他フィールドはリセット
- venue_id・date は保持

### `features/record-payout/ui/PayoutForm.tsx`
```ts
type Props = {
  ticket: Ticket
  existingPayout?: Payout
}
type FormState = {
  amount: number | ''
}
```

### `entities/ticket/ui/TicketCard.tsx`
```ts
type Props = {
  ticket: Ticket & { payout?: Payout }
}
```
- 馬券情報表示 + PayoutForm をインラインで持つ

### `entities/venue/ui/VenueSelect.tsx`
```ts
type Props = {
  venues: Venue[]
  value: number | ''
  onChange: (id: number) => void
}
```

## API 連携

| コンポーネント | エンドポイント | メソッド |
|---|---|---|
| AddTicketForm | POST /tickets | Inertia Form |
| PayoutForm | POST /tickets/{id}/payout | Inertia Form |
| create.tsx (初期表示) | GET /tickets/create | Inertia::render |

## フォームバリデーション（クライアント側）

Valibot スキーマ（`features/add-ticket/model/schema.ts`）:
```ts
import * as v from 'valibot'

const AddTicketSchema = v.object({
  venue_id:      v.pipe(v.number(), v.integer(), v.minValue(1)),
  date:          v.pipe(v.string(), v.regex(/^\d{4}-\d{2}-\d{2}$/)),
  race_number:   v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(12)),
  bet_type:      v.picklist(['単勝','複勝','馬連','馬単','ワイド','三連複','三連単']),
  horse_numbers: v.pipe(v.string(), v.minLength(1), v.maxLength(30)),
  amount:        v.pipe(v.number(), v.integer(), v.minValue(100), v.maxValue(9_999_900)),
})
```

## 状態管理

- Inertia の `useForm` を使用（`features/add-ticket/api/submitTicket.ts`）
- React コンポーネントのローカル state で race_number の連続インクリメント管理
- グローバル状態管理ライブラリは不要
