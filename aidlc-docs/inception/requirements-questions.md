# 購入馬券登録画面 - 要件確認

仕様書（docs/specs/）の内容を元に、実装に必要な点を確認します。
各質問の `[Answer]:` の後に回答の記号（A, B, C...）を入力してください。

---

## Question 1
今回作成する画面の範囲を教えてください。

A) 登録（Create）のみ。フォームで入力して保存する画面。
B) 登録・編集・削除をすべて実装する（v_15: 購入馬券フォームの完全実装）
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2
レース情報（レースID）のフォームへの渡し方を教えてください。
specs/transitions.md では「レース情報詳細画面 → 購入馬券詳細画面」という遷移が定義されています。

A) URLパラメータ（例: /races/{race}/tickets/create）でレースIDを受け取る
B) 別の方法で渡す（フォーム内でレースを選択できるUIを持つ）
C) Other (please describe after [Answer]: tag below)

[Answer]: C
詳細なレース情報は無しでも入力できるようにしたい
続けて購入馬券を登録できるようにしたい
例）
東京1R の購入馬券を登録→自動で東京2Rが入った状態で購入馬券を登録できる

---

## Question 3
払い戻し（v_16）もこの画面に含めますか？
screens.yaml では s_7（購入馬券詳細画面）に v_15（フォーム）と v_16（払い戻しフォーム）が定義されています。

A) 今回は購入馬券の登録フォーム（v_15）のみ。払い戻しは別途対応する。
B) 購入馬券フォームと払い戻しフォームの両方を今回実装する。
C) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 4
アプリ全体のレイアウト（ヘッダー・サイドバー等）はありますか？
現状、認証ページ用の AuthLayout のみ実装されています。

A) まだない。今回は購入馬券フォームのコンテンツ部分のみ実装する（レイアウトは後回し）。
B) シンプルなメインレイアウト（ヘッダーのみ）も一緒に作る。
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5
セキュリティ拡張ルールを適用しますか？

A) Yes — すべてのセキュリティルールをブロッキング制約として適用する（本番グレードのアプリ向け）
B) No — セキュリティルールをスキップする（PoC・プロトタイプ向け）
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 6
プロパティベーステスト（PBT）拡張ルールを適用しますか？

A) Yes — すべてのPBTルールをブロッキング制約として適用する
B) No — PBTルールをスキップする（シンプルなCRUDアプリ向け）
C) Other (please describe after [Answer]: tag below)

[Answer]: A
