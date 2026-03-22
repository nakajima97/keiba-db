# 設計ドキュメント構成

仕様をCRUDベースのタスクから画面遷移図まで段階的に整理するためのドキュメント群と、その関係を示す。

## ドキュメント一覧

| ファイル | 目的 | 状態 |
|---|---|---|
| `docs/braindump.md` | 要件定義前のアイデアメモ | 作成済み |
| `docs/specs/tasks.yaml` | CRUDベースのタスク一覧 | 作成済み |
| `docs/specs/entities.yaml` | エンティティ・属性の構造定義（ID付き） | 作成済み |
| `docs/specs/conceptual-er.md` | エンティティ間の関係（概念ER図） | 作成済み |
| `docs/specs/views.yaml` | ビュー一覧（タスクのまとまり） | 作成済み |
| `docs/specs/screens.yaml` | 画面一覧（ビューの配置先） | 未着手 |
| `docs/specs/transitions.md` | 画面遷移図 | 未着手 |

## 設計フロー

```
braindump.md
  └─ やりたいこと・制約・優先順位を自由記述
        ↓
tasks.yaml
  └─ 必要な機能をCRUD単位で列挙
     各タスクに id(t_x)・ユーザー視点・システム処理・CRUD種別を記載
        ↓
conceptual-er.md
  └─ タスクからエンティティを抽出し関係を整理
     ビュー設計の前提となるデータ構造を把握する
        ↓
views.yaml
  └─ タスクをまとめてビュー（機能の塊）を定義
     1ビュー = 複数タスクの集合
        ↓
screens.yaml
  └─ ビューを配置する画面を定義
     1画面 = 複数ビューを含む可能性あり
        ↓
transitions.md
  └─ 画面間の遷移ルートを可視化
```
