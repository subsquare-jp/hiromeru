目的:
今日の変更でログインが壊れた可能性が高いので、Firebase / Google Cloud は触らず、
Auth を 4/16 に動作確認できていた版へ戻したうえで、
HomeButton だけ安全に再適用したい。

前提:
- Firebase Console / Google Cloud 側の設定は昨日の対策で通っている
- imageUrl の誤記はログイン不具合の原因ではない
- 今の HomeButton.tsx は fixed top-4 left-4 z-50 だが、pointer-events 対策が未実装
- 今の AuthProvider.tsx は簡略化されており、4/16の動作確認済み版から後退している可能性がある

やってほしいこと:
1. Auth関連を 4/16 に動作確認できていた版に戻す
   - lib/firebase.ts
   - AuthProvider.tsx
   - AuthButtons.tsx
2. browserLocalPersistence を使う構成を維持する
3. signInWithRedirect / getRedirectResult / onAuthStateChanged の動作確認済み構成へ戻す
4. HomeButton.tsx は以下の安全版にする
   - 外側に pointer-events-none
   - ボタン本体に pointer-events-auto
   - w-fit を追加
5. layout.tsx 側の AuthProvider / AuthButtons / HomeButton の配置は壊さない
6. build を通す
7. hosting を再デプロイする

やらないこと:
- Firebase Console 設定変更
- Google Cloud 設定変更
- キーパス
- 画像投稿
- UI大改修

最後に報告してほしいこと:
- 戻したファイル
- HomeButton の安全化内容
- 実行した build / deploy コマンド
- Aki が最後に確認すること 2つ