# Application Design プラン — 購入馬券登録画面

## 設計対象コンポーネント

本画面で必要なバックエンドコンポーネント:

```
Backend (Laravel)
├── [ ] Venue (レース場) Model + Migration
├── [ ] Meeting (開催) Model + Migration
├── [ ] Race (レース情報) Model + Migration
├── [ ] Ticket (購入馬券) Model + Migration
├── [ ] Payout (払い戻し) Model + Migration
├── [ ] TicketController (購入馬券 登録)
├── [ ] PayoutController (払い戻し 登録・更新)
├── [ ] VenueController (レース場一覧 取得用)
├── [ ] StoreTicketRequest (入力バリデーション)
├── [ ] StorePayoutRequest (入力バリデーション)
└── [ ] サービスレイヤー（要設計 → Q1, Q2）
```

Frontend (FSD) ※ 構造は docs/architecture/frontend.md 準拠のため設計不要:
```
resources/js/
├── pages/tickets/create.tsx
├── features/add-ticket/
├── features/record-payout/
├── entities/ticket/
├── entities/venue/
└── entities/race/
```

---

## 設計上の質問

### Q1: バックエンドのサービスレイヤー構成
購入馬券登録時に「Venue → Meeting → Race の find-or-create チェーン」が必要です。
このロジックをどこに置きますか？

A) 専用サービスクラスを作成する（例: `TicketRegistrationService`）
   - Controller は薄く保ち、ビジネスロジックをサービスに分離
   - テストしやすい
B) Controller 内に直接書く（シンプル・小規模向け）
   - 追加ファイルなしで実装できる
   - ロジックが Controller に混在する
C) Other (please describe after [Answer]: tag below)

[Answer]: C
既存のディレクトリ構成はリファクタリングする前提でこの規模のサービスで最適なアーキテクチャを提案して
拡張性を管理して

---

### Q2: Venue（レース場）データの管理方法
レース場（東京・阪神・中山など）はどのように管理しますか？

A) シーダーで事前登録する（固定マスターデータ）
   - JRA/NAR の競馬場を Seeder でDB投入
   - ユーザーは登録不要、選択のみ
B) ユーザーが画面から登録・管理する（今回は一覧APIのみ実装）
   - 今回の画面では選択のみ、マスター管理画面は別途
C) Other (please describe after [Answer]: tag below)

[Answer]: C
Bだけど初期データの追加はシーだーで行ってください

---

### Q3: 払い戻し登録のエンドポイント設計
払い戻し（Payout）の登録・更新はどのエンドポイントにしますか？

A) 購入馬券にネストした RESTful ルート
   - `POST /tickets/{ticket}/payout`（登録）
   - `PUT  /tickets/{ticket}/payout`（更新）
B) フラットな RESTful ルート
   - `POST /payouts`（登録）
   - `PUT  /payouts/{payout}`（更新）
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## 成果物チェックリスト（回答後に生成）

- [x] `aidlc-docs/inception/application-design/components.md`
- [x] `aidlc-docs/inception/application-design/component-methods.md`
- [x] `aidlc-docs/inception/application-design/services.md`
- [x] `aidlc-docs/inception/application-design/component-dependency.md`
- [x] `aidlc-docs/inception/application-design/application-design.md`（統合版）
