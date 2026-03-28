# フロントエンドアーキテクチャ

採用方針の意思決定経緯は [ADR-2](../adr/ADR-2.md) を参照。

## ディレクトリ構成

Feature-Sliced Design（FSD）を採用する。

```
resources/js/
├── app/          # Inertia 初期化・グローバルプロバイダー・グローバルスタイル
├── pages/        # Inertia ページコンポーネント（薄く保つ）
├── widgets/      # ページを構成する独立した大きな UI ブロック
├── features/     # ユーザー操作単位のスライス（馬券入力・払い戻し記録など）
├── entities/     # ドメインモデル単位のスライス（race, ticket, payout など）
└── shared/       # 全レイヤーから利用可能な汎用コード
```

## 各レイヤーの責務

### app
Inertia の初期化・レイアウト解決・グローバルプロバイダーを担う。

```
app/
├── app.tsx          # createInertiaApp・レイアウト解決
├── providers/       # グローバルプロバイダー（React Query 等を追加する場合）
└── styles/          # グローバル CSS
```

### pages
Inertia のルーティング規則（ファイルパス = ルート）に対応するコンポーネントを置く。
ロジックや UI の実態は widgets・features に委譲し、ページ自体は薄く保つ。

### widgets
複数の features・entities を組み合わせた、ページを構成する独立した大きな UI ブロック。
特定のページにしか登場しないが、単一の feature に収まらない粒度のものを置く。

例：`BettingHistoryTable`（レース一覧 + 馬券一覧 + 集計サマリーを束ねるブロック）

### features
ユーザー操作（ユースケース）単位のスライス。UI・ロジック・API 呼び出しをセットで持つ。

例：`add-ticket`（馬券入力）、`record-payout`（払い戻し記録）、`filter-races`（レース絞り込み）

### entities
ドメインモデル単位のスライス。型定義・モデルの表示コンポーネント・API スキーマを持つ。

例：`race`、`ticket`、`payout`

### shared
レイヤーに依存しない汎用コード。

```
shared/
├── ui/       # 汎用 UI コンポーネント（shadcn/ui コンポーネントをそのまま配置）
├── lib/      # ユーティリティ関数
├── types/    # 共通型定義
└── hooks/    # どのスライスにも属さない汎用カスタムフック
```

## スライスの内部構成（セグメント）

`features/` と `entities/` の各スライスは以下のセグメントで構成する。すべて必須ではなく、必要なものだけ作る。

```
{slice}/
├── ui/        # このスライスの React コンポーネント
├── model/     # ビジネスロジック（状態・バリデーション・ドメインルール・hooks）
├── api/       # サーバーとの通信（Inertia フォーム送信・HTTP リクエスト）
├── config/    # 定数・設定値（フォームの初期値・選択肢のマスタデータ等）
└── lib/       # このスライス固有のユーティリティ
```

### `model/` と `api/` の分担

| セグメント | 役割 |
|---|---|
| `model/` | **ビジネスロジック**：状態・バリデーション・ドメインルール・それらを扱う hooks |
| `api/` | **サーバーとの通信**：Inertia の useForm・POST 送信・データ取得 |

`model/` が「データをどう扱うか・どんなルールがあるか」、`api/` が「どうやってサーバーと話すか」を担う。

FSD では `usecase/` や `service/` という名前のセグメントは登場しない。**feature スライス自体がユースケースに相当**し、そのビジネスロジックは `model/` に収まる。

### hooks の置き場所

FSD にはスライスレベルの `hooks/` セグメントは存在しない。hooks は何をするかでセグメントに振り分ける。

| hooks の種類 | 置き場所 |
|---|---|
| ビジネスロジック・状態管理 | `model/` |
| API 呼び出しのラッパー | `api/` |
| UI 状態の制御（モーダル開閉など） | `ui/` |
| どのスライスにも属さない汎用フック | `shared/hooks/` |

### 例：`features/add-ticket/`

```
features/add-ticket/
├── ui/
│   └── AddTicketForm.tsx       # フォーム UI
├── model/
│   ├── types.ts                # Ticket 型定義
│   ├── schema.ts               # Zod バリデーションスキーマ
│   └── useTicketForm.ts        # フォーム状態・バリデーション呼び出し
├── api/
│   └── submitTicket.ts         # Inertia useForm・POST 送信
└── config/
    └── constants.ts            # 馬番の選択肢など
```

### 例：`entities/race/`

```
entities/race/
├── ui/
│   └── RaceCard.tsx            # レース情報の表示コンポーネント
└── model/
    └── types.ts                # Race 型定義
```

## ルール

### 1. 依存方向の原則
上位レイヤーから下位レイヤーへの依存のみ許可する。

```
app → pages → widgets → features → entities → shared
```

下位レイヤーが上位レイヤーを import することは禁止。

### 2. 同一レイヤー内のスライス間依存は禁止
同じレイヤー内のスライス同士は互いに import しない。
共通化が必要な場合は下位レイヤー（entities または shared）に切り出す。

### 3. レイヤー境界の原則
バレルファイル（`index.ts` による re-export）はバンドルサイズへの影響を考慮して採用しない。
代わりに linter のインポートルールでレイヤー境界を強制する。

```ts
// OK：スライス内の実装ファイルを直接 import する
import { AddTicketForm } from '@/features/add-ticket/ui/AddTicketForm';

// NG：上位レイヤーが下位レイヤーを飛び越えて import する
import { Race } from '@/entities/race/model/types'; // features から widgets を import するなど
```

linter の具体的なツール選定・設定は別途 ADR で決定する。

## Inertia.js との共存方針

### `pages/` はファイルパスがルートに対応する

Inertia では Laravel コントローラーの `Inertia::render('races/index')` という呼び出しをもとに、`pages/races/index.tsx` を自動解決する。ページコンポーネントを import するのは開発者ではなく Inertia 自身であるため、`pages/` には FSD のレイヤー境界ルールを適用しない。

```
pages/
├── dashboard.tsx        # Inertia::render('dashboard') に対応
├── races/
│   ├── index.tsx        # Inertia::render('races/index') に対応
│   └── show.tsx         # Inertia::render('races/show') に対応
└── auth/
    └── login.tsx        # Inertia::render('auth/login') に対応
```

### `pages/` は薄く保つ

ページコンポーネントはサーバーから受け取った props を widgets に渡すだけにする。ロジックや UI の実態は widgets・features に置く。

```tsx
// OK：props を受け取り widget に委譲するだけ
export default function RacesIndex({ races }: PageProps) {
    return <RaceListWidget races={races} />;
}

// NG：ページにロジックや UI を直接書く
export default function RacesIndex({ races }: PageProps) {
    const filtered = races.filter(...);
    return <table>...</table>;
}
```

### `layouts/` は `shared/ui/layouts/` に置く

レイアウトコンポーネントはビジネスロジックを持たないアプリ全体の外枠であるため `shared/ui/layouts/` に置く。サイドバー・ヘッダーなど構造を持つ UI ブロックは `widgets/` に置く。

```
shared/ui/layouts/
├── AppLayout.tsx        # メインレイアウト（サイドバー・ヘッダーを持つ）
└── AuthLayout.tsx       # 認証ページ用レイアウト

widgets/
├── app-sidebar/         # ナビゲーション構造を持つサイドバー
└── app-header/          # ヘッダー
```

### `PageProps` 型は `shared/types/` に置く

Laravel から渡される共通 props（認証ユーザー情報など）の型定義は全レイヤーから参照されるため `shared/types/` に置く。

```ts
// shared/types/inertia.ts
export interface PageProps {
    auth: {
        user: User;
    };
}
```

### `app/` の責務

`createInertiaApp` の呼び出し・レイアウト解決・グローバルプロバイダーの設定を担う。ルーティングは Laravel が担うため、通常の SPA より `app/` は薄くなる。
