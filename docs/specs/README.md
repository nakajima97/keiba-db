# specs

実装に向けた要件定義資料。CRUDベースのタスク一覧から画面遷移図まで段階的に整理する。

## ファイル一覧

| ファイル | 概要 |
|---|---|
| [tasks.yaml](tasks.yaml) | CRUDベースのタスク一覧 |
| [entities.yaml](entities.yaml) | エンティティ・属性の構造定義（ID付き） |
| [entities.md](entities.md) | エンティティ間の関係（ER図） |
| [views.yaml](views.yaml) | ビュー一覧（タスクのまとまり）|
| [screens.yaml](screens.yaml) | 画面一覧（ビューの配置先） |
| [transitions.md](transitions.md) | 画面遷移図 |

## 設計フロー

`tasks.yaml` → `entities.md` → `views.yaml` → `screens.yaml` → `transitions.md` の順に作成する。
詳細は [spec-flow.md](../spec-flow.md) を参照。
