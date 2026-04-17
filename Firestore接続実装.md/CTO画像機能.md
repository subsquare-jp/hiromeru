現在のプロジェクトは Next.js（App Router）+ Firebase Auth + Firestore + Firebase Hosting で動いています。
すでに Googleログイン、投稿機能、一覧表示機能はあります。
Firestore には `ads` コレクションがあります。

今回やりたいのは、MVP向けの最小構成で「画像投稿機能」を追加することです。

# 目的
- 投稿画面 `/post` で画像を1枚アップロードできるようにする
- 画像がある場合は Firebase Storage に保存する
- 保存した画像URLを Firestore `ads` に保存する
- 画像がない場合も投稿できるようにする
- 今回は運営広告のランダム差し込みは実装しない

# 必須要件
- 画像は1枚のみ
- 3MB以下のみ許可
- jpg / jpeg / png のみ許可
- 画像なし投稿は許可
- Firestore保存時に以下を持たせる
  - `imageUrl` : string（画像なしなら空文字または未設定でも可）
  - `hasImage` : boolean
- 処理順は必ず以下にする
  1. 画像があれば Storage にアップロード
  2. URL取得
  3. Firestore `ads` に保存
- 画像アップロード失敗時は Firestore に保存しない
- 既存機能を壊さないことを最優先にする

# 実装方針
- 投稿フォームに file input を追加
- クライアント側で以下をチェック
  - ファイルサイズ 3MB以下
  - 拡張子または MIME type が jpg/jpeg/png
- Firebase Storage の保存先はわかりやすくしてほしい
  - 例: `ads/{uid}/{timestamp}-{filename}`
- 投稿データは既存の `ads` ドキュメントに追加保存する
- 一覧表示側では `imageUrl` があるときだけ画像表示
- `imageUrl` がない場合でも落ちないようにする
- 今回は見た目の作り込みは不要
- `No image` の文言を強く出さなくてよい
- まずは壊れず保存できる状態を優先

# やってほしいこと
1. `/post` のフォーム修正
2. Firebase Storage アップロード処理追加
3. Firestore 保存項目追加（`imageUrl`, `hasImage`）
4. 一覧表示側で `imageUrl` がある場合のみ画像表示
5. エラー時の最低限の表示追加
6. 必要なら Firebase Storage 用の設定コードも追加

# 出力してほしいもの
- 変更対象ファイルごとの差分が分かる形
- コピペしやすい完成コード
- 追加で必要な Firebase Storage ルール
- 最後に確認手順
  - 画像あり投稿
  - 画像なし投稿
  - 3MB超過時
  - 非対応形式時

# 注意
- 過剰なリファクタリングはしない
- 状態管理の全面変更はしない
- 今回はMVPなので最小変更で実装する
- 将来の複雑な拡張は考えすぎない
- 既存の Googleログイン・投稿・一覧機能を壊さないことを最優先にする