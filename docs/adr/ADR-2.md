# ADR-2: フロントエンドのディレクトリ設計に Feature-Sliced Design を採用する

## Status
Accepted

## Context
Laravel React スターターキットを導入した結果、`resources/js/` 配下はスターターキットのデフォルト構成（`pages/`, `components/`, `layouts/` 等のレイヤー分け）になっている。

今後、馬券入力・払い戻し記録・収支集計などのアプリ固有機能を追加していくにあたり、機能間の依存が複雑になることが予想される。明示的なアーキテクチャ指針がないままコードを追加すると、機能をまたいだ密結合が生まれやすくなる。

## Decision
フロントエンドのディレクトリ設計として **Feature-Sliced Design（FSD）** を採用する。

### ディレクトリ構成

```
resources/js/
├── app/          # Inertia 初期化・グローバルプロバイダー・グローバルスタイル
├── pages/        # Inertia ページコンポーネント（薄く保つ）
├── widgets/      # ページを構成する独立した大きな UI ブロック
├── features/     # ユーザー操作単位のスライス（馬券入力・払い戻し記録など）
├── entities/     # ドメインモデル単位のスライス（race, ticket, payout など）
└── shared/       # 全レイヤーから利用可能な汎用コード（ui/, lib/, types/, hooks/）
```

### 厳守するルール

1. **Public API の原則**：各スライスは `index.ts` のみを公開 API とし、スライス内部のファイルを直接 import しない
2. **依存方向の原則**：上位レイヤーから下位レイヤーへの依存のみ許可する
   - 許可：`pages` → `widgets` → `features` → `entities` → `shared`
   - 禁止：`features` が `widgets` を import する など
3. **同一レイヤー内のスライス間依存は禁止**

### Inertia.js との共存方針

- `pages/` は Inertia のルーティング規則（ファイルパスがルートに対応）に縛られるため、FSD の規則より Inertia の規則を優先する
- ページコンポーネントは薄く保ち、実態は `widgets` または `features` に置く
- `app/` は Inertia 初期化（`createInertiaApp`）・レイアウト解決・グローバルプロバイダーを担う

## Consequences
### メリット
- 機能間の依存方向が明確になり、意図しない密結合を防げる
- 新機能追加時にどのレイヤーに置くかの判断基準が明確になる
- FSD を実践的に学習できる

### デメリット
- `index.ts` による Public API の管理など、小規模機能でも一定のボイラープレートが生じる
- FSD に不慣れな場合、レイヤー分類の判断に迷うことがある
