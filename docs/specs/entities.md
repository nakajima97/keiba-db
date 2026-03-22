# ER図

エンティティ間の関係を示す。属性の詳細は [entities.yaml](entities.yaml) を参照。

```mermaid
erDiagram
    レース場 ||--o{ レース情報 : "開催"
    レース場 ||--o{ レース場メモ : "メモ"
    レース情報 ||--o{ レース結果 : "結果"
    レース情報 ||--o{ 購入馬券 : "対象"
    馬 ||--o{ レース結果 : "出走"
    馬 ||--o{ 馬メモ : "メモ"
    騎手 ||--o{ レース結果 : "騎乗"
    騎手 ||--o{ 騎手メモ : "メモ"
    購入馬券 ||--o| 払い戻し : "払い戻し"

    レース場 {
        string 名称
        string 略称
    }
    レース情報 {
        string レース名
        date 開催日
        integer レース番号
        integer 距離
        enum クラス
        enum 馬場状態
    }
    レース結果 {
        integer 着順
        integer 馬番
    }
    馬 {
        string 馬名
    }
    騎手 {
        string 騎手名
    }
    購入馬券 {
        enum 馬券種別
        money 購入金額
        string 馬番
    }
    払い戻し {
        money 払い戻し金額
    }
```
