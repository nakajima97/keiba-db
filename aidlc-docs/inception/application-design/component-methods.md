# コンポーネントメソッド定義

詳細なビジネスロジックは Functional Design（Construction Phase）で定義する。
ここではシグネチャと高レベルの目的のみ定義する。

---

## Models

### `App\Models\Venue`

| メソッド | 種別 | 目的 |
|---|---|---|
| `meetings(): HasMany` | リレーション | Venue → Meeting |

### `App\Models\Meeting`

| メソッド | 種別 | 目的 |
|---|---|---|
| `venue(): BelongsTo` | リレーション | Meeting → Venue |
| `races(): HasMany` | リレーション | Meeting → Race |

### `App\Models\Race`

| メソッド | 種別 | 目的 |
|---|---|---|
| `meeting(): BelongsTo` | リレーション | Race → Meeting |
| `tickets(): HasMany` | リレーション | Race → Ticket |

### `App\Models\Ticket`

| メソッド | 種別 | 目的 |
|---|---|---|
| `race(): BelongsTo` | リレーション | Ticket → Race |
| `payout(): HasOne` | リレーション | Ticket → Payout（0 or 1） |

### `App\Models\Payout`

| メソッド | 種別 | 目的 |
|---|---|---|
| `ticket(): BelongsTo` | リレーション | Payout → Ticket |

---

## Services

### `App\Services\TicketRegistrationService`

```php
public function register(array $data): Ticket
```
- **入力**: バリデーション済みの配列（venue_id, date, race_number, bet_type, amount, horse_numbers）
- **出力**: 作成した Ticket モデル
- **処理概要**:
  1. Meeting を find-or-create（venue_id + date）
  2. Race を find-or-create（meeting_id + race_number）
  3. Ticket を create（race_id + 馬券情報）
  4. 上記をトランザクション内で実行
- **詳細**: Functional Design で定義

---

### `App\Services\PayoutService`

```php
public function createOrUpdate(Ticket $ticket, int $amount): Payout
```
- **入力**: Ticket モデル、払い戻し金額（円）
- **出力**: 作成または更新した Payout モデル
- **処理概要**: Ticket に対して Payout を updateOrCreate
- **詳細**: Functional Design で定義

---

## Controllers

### `App\Http\Controllers\VenueController`

```php
public function index(): InertiaResponse|JsonResponse
```
- **目的**: レース場一覧をフォームのドロップダウン用に返す
- **認証**: auth + verified ミドルウェア必須

---

### `App\Http\Controllers\TicketController`

```php
public function create(): InertiaResponse
public function store(StoreTicketRequest $request): RedirectResponse
```
- **create**: 馬券登録フォームページを表示（Venue一覧を props として渡す）
- **store**: バリデーション済みデータを TicketRegistrationService に委譲
- **認証**: auth + verified ミドルウェア必須

---

### `App\Http\Controllers\PayoutController`

```php
public function store(StorePayoutRequest $request, Ticket $ticket): RedirectResponse
public function update(StorePayoutRequest $request, Ticket $ticket): RedirectResponse
```
- **store**: 払い戻し登録（Ticket に対して新規作成）
- **update**: 払い戻し更新
- **認証**: auth + verified ミドルウェア必須
- **SECURITY-08**: Ticket の所有者確認が必要（IDOR対策）→ Functional Design で詳細設計

---

## FormRequests

### `App\Http\Requests\StoreTicketRequest`

- **認証**: `authorize()` → true（auth ミドルウェアで保証済み）
- **バリデーションルール**（高レベル）:
  - `venue_id`: required, exists:venues,id
  - `date`: required, date
  - `race_number`: required, integer, min:1, max:12
  - `bet_type`: required, in:[単勝, 複勝, 馬連, 馬単, ワイド, 三連複, 三連単]
  - `horse_numbers`: required, string, max:20
  - `amount`: required, integer, min:100

### `App\Http\Requests\StorePayoutRequest`

- **バリデーションルール**（高レベル）:
  - `amount`: required, integer, min:0

詳細なバリデーションルール（エラーメッセージ・条件分岐）は Functional Design で定義。
