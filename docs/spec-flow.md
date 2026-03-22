# 設計ドキュメント構成

仕様をCRUDベースのタスクから画面遷移図まで段階的に整理するためのドキュメント群と、その関係を示す。

## ドキュメント一覧

| ファイル | 目的 |
|---|---|
| `docs/braindump.md` | 要件定義前のアイデアメモ |
| `docs/specs/tasks.yaml` | CRUDベースのタスク一覧 |
| `docs/specs/entities.md` | エンティティ一覧と関係 |
| `docs/specs/views.yaml` | ビュー一覧（タスクのまとまり） |
| `docs/specs/screens.yaml` | 画面一覧（ビューの配置先） |
| `docs/specs/transitions.md` | 画面遷移図 |

## 設計フロー

```
braindump.md
  └─ やりたいこと・制約・優先順位を自由記述
        ↓
tasks.yaml
  └─ 必要な機能をCRUD単位で列挙
     各タスクに id(t_x)・ユーザー視点・システム処理・CRUD種別を記載
        ↓
entities.md
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

## 各ドキュメントの粒度

### tasks.yaml
```yaml
- id: t_1
  user: ユーザーが何をするか
  system: システムが何をするか
  crud: C | R | U | D
```

### views.yaml（作成予定）
```yaml
- id: v_1
  name: ビュー名
  tasks: [t_1, t_2]   # このビューが担うタスク
```

### screens.yaml（作成予定）
```yaml
- id: s_1
  name: 画面名
  views: [v_1, v_2]   # この画面に配置するビュー
```

### transitions.md（作成予定）
画面遷移図（Mermaid等で記述）
