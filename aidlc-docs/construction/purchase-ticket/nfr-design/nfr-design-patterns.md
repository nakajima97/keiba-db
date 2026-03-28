# NFR設計パターン — 購入馬券登録

## セキュリティパターン

### パターン 1: 認証ガード（SECURITY-08）
```php
// routes/web.php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/tickets/create', [TicketController::class, 'create']);
    Route::post('/tickets', [TicketController::class, 'store']);
    Route::post('/tickets/{ticket}/payout', [PayoutController::class, 'store']);
    Route::put('/tickets/{ticket}/payout',  [PayoutController::class, 'update']);
});
```

### パターン 2: Policy による IDOR 防止（SECURITY-08）
```php
// app/Policies/TicketPolicy.php
class TicketPolicy {
    public function createPayout(User $user, Ticket $ticket): bool {
        return $user->id === $ticket->user_id;
    }
}

// PayoutController
$this->authorize('createPayout', $ticket); // 403 if not owner
```

### パターン 3: FormRequest バリデーション（SECURITY-05）
- `StoreTicketRequest::rules()` でサーバーサイドバリデーション
- クライアント側 Zod スキーマとルールを対応させる（二重防衛）

### パターン 4: エラーハンドリング（SECURITY-09, SECURITY-15）
```php
// TicketRegistrationService
public function register(array $data): Ticket {
    return DB::transaction(function () use ($data) {
        // ... find-or-create chain
    });
    // DB::transaction が例外を throw した場合、
    // Laravel の例外ハンドラーが処理し、スタックトレースはログのみに記録
}
```
- `APP_DEBUG=false` in production で詳細エラーを非表示

### パターン 5: HTTPセキュリティヘッダー（SECURITY-04）
```php
// app/Http/Middleware/SecurityHeaders.php（新規作成）
// または bootstrap/app.php の withMiddleware に追加
// Content-Security-Policy, HSTS, X-Content-Type-Options など
```

## パフォーマンスパターン

### find-or-create の N+1 防止
- `TicketController::create` で Ticket 一覧を with(['race.meeting.venue', 'payout']) でイーガーロード

## PBT パターン

### fast-check 統合（PBT-09）
```ts
// Vitest + fast-check
import * as fc from 'fast-check'

// ジェネレーター定義（PBT-07: ドメイン固有）
const validAmount = fc.integer({ min: 100, max: 9_999_900 }).filter(n => n % 100 === 0)
const validRaceNumber = fc.integer({ min: 1, max: 12 })
const validBetType = fc.constantFrom('単勝','複勝','馬連','馬単','ワイド','三連複','三連単')
```
