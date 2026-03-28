# ドメインエンティティ — 購入馬券登録

## エンティティ関係図

```
Venue (レース場)
  id, name, short_name, organizer_type (中央/地方/海外)
    │
    └─ HasMany ──► Meeting (開催)
                    id, venue_id, date
                      │
                      └─ HasMany ──► Race (レース情報)
                                      id, meeting_id, race_number
                                      class (nullable), surface_condition (nullable)
                                        │
                                        └─ HasMany ──► Ticket (購入馬券)
                                                        id, race_id, user_id
                                                        bet_type, amount, horse_numbers
                                                          │
                                                          └─ HasOne ──► Payout (払い戻し)
                                                                          id, ticket_id
                                                                          amount
```

## エンティティ詳細

### Venue（レース場）
| カラム | 型 | 制約 | 備考 |
|---|---|---|---|
| id | bigint | PK | |
| name | string(50) | NOT NULL, UNIQUE | 例: 東京競馬場 |
| short_name | string(10) | NOT NULL | 例: 東京 |
| organizer_type | enum | NOT NULL | 中央/地方/海外 |
| timestamps | | | |

### Meeting（開催）
| カラム | 型 | 制約 | 備考 |
|---|---|---|---|
| id | bigint | PK | |
| venue_id | bigint | FK → venues.id | |
| date | date | NOT NULL | |
| timestamps | | | |
| | | UNIQUE(venue_id, date) | 同日同会場の重複防止 |

### Race（レース情報）
| カラム | 型 | 制約 | 備考 |
|---|---|---|---|
| id | bigint | PK | |
| meeting_id | bigint | FK → meetings.id | |
| race_number | tinyint | NOT NULL, 1〜12 | |
| class | enum | NULLABLE | 新馬/未勝利/.../G1 |
| surface_condition | enum | NULLABLE | 良/稍重/重/不良 |
| timestamps | | | |
| | | UNIQUE(meeting_id, race_number) | 同開催内の重複防止 |

### Ticket（購入馬券）
| カラム | 型 | 制約 | 備考 |
|---|---|---|---|
| id | bigint | PK | |
| race_id | bigint | FK → races.id | |
| user_id | bigint | FK → users.id | SECURITY-08: 所有者管理 |
| bet_type | enum | NOT NULL | 単勝/複勝/馬連/馬単/ワイド/三連複/三連単 |
| amount | integer | NOT NULL, min:100 | 円単位 |
| horse_numbers | string(30) | NOT NULL | 例: "1"、"1-3"、"1-3-5" |
| timestamps | | | |

### Payout（払い戻し）
| カラム | 型 | 制約 | 備考 |
|---|---|---|---|
| id | bigint | PK | |
| ticket_id | bigint | FK → tickets.id, UNIQUE | 1 Ticket に対して 1 Payout のみ |
| amount | integer | NOT NULL, min:0 | 0 = ハズレ |
| timestamps | | | |
