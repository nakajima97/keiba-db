# ビジネスルール — 購入馬券登録

## BR-01: 馬券登録バリデーション

| ルール | 条件 | エラーメッセージ |
|---|---|---|
| venue_id 必須 | exists:venues,id | レース場を選択してください |
| date 必須 | date format, not future | 開催日を入力してください |
| race_number 必須 | integer, 1〜12 | レース番号は1〜12で入力してください |
| bet_type 必須 | enum in list | 馬券種別を選択してください |
| horse_numbers 必須 | string, max:30 | 馬番を入力してください |
| amount 必須 | integer, min:100, max:9_999_900 | 購入金額は100円以上で入力してください |

## BR-02: find-or-create ロジック

### Meeting の find-or-create
- `Meeting::firstOrCreate(['venue_id' => $venueId, 'date' => $date])`
- 同一 venue_id + date の Meeting が存在すれば再利用、なければ作成
- **冪等性保証**: 同じ入力で何度呼んでも同一レコードを返す

### Race の find-or-create
- `Race::firstOrCreate(['meeting_id' => $meetingId, 'race_number' => $raceNumber])`
- 同一 meeting_id + race_number の Race が存在すれば再利用、なければ作成
- class・surface_condition は省略可能（NULL許容）

### トランザクション境界
- Meeting find-or-create → Race find-or-create → Ticket create を単一トランザクション内で実行
- いずれかが失敗した場合、全操作をロールバック

## BR-03: 連続登録（フロントエンド）

- Ticket 登録成功後（HTTP 201 または redirect）にフォームの race_number を +1 する
- venue_id・date は直前の値を保持する
- 他フィールド（bet_type・horse_numbers・amount）はリセット

## BR-04: IDOR 対策（SECURITY-08）

- PayoutController で Route Model Binding された Ticket が認証ユーザー所有か確認する
- `$ticket->user_id !== Auth::id()` の場合 403 Forbidden を返す
- Policy クラスで実装する: `TicketPolicy::update(User $user, Ticket $ticket)`

## BR-05: 払い戻しバリデーション

| ルール | 条件 | エラーメッセージ |
|---|---|---|
| amount 必須 | integer, min:0, max:99_999_999 | 払い戻し金額を入力してください |

## BR-06: Payout の一意性

- 1 Ticket につき Payout は 1 件のみ（`tickets.id` に UNIQUE 制約）
- `updateOrCreate` パターンで登録・更新を統一処理

---

## PBT-01: テスト可能プロパティの特定

| コンポーネント | プロパティ種別 | 内容 |
|---|---|---|
| `TicketRegistrationService::register` | **冪等性** | 同じ venue_id + date + race_number で2回呼び出しても Meeting/Race は重複作成されない |
| `TicketRegistrationService::register` | **不変条件** | 返却される Ticket の race.race_number は入力の race_number と一致する |
| `PayoutService::createOrUpdate` | **冪等性** | 同じ Ticket + amount で2回呼び出しても Payout レコードは1件のみ |
| 馬券バリデーション | **不変条件** | 有効な入力は常にバリデーションを通過する（false negative なし） |
| 馬券バリデーション | **不変条件** | 無効な入力（負の金額・存在しない venue_id 等）は常にバリデーションエラー |
