import React from 'react';
import Link from 'next/link';

export default function Over18Page() {
  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">18禁注意</h1>
      
      <div className="space-y-6 text-sm text-neutral-800 leading-relaxed">
        <p>
          このサービスには、18歳以上を対象とする内容や、成人向け要素を含む投稿・外部リンクが含まれる場合があります。
        </p>

        <p>
          これは注意表示であり、年齢認証ではありません。<br />
          18歳未満の方は、閲覧および投稿をしないでください。
        </p>

        <section>
          <p>
            運営は、利用条件、画像投稿ルール、掲載基準、運営方針に照らして問題があると判断した投稿について、<br />
            非表示、停止、削除等の対応を行う場合があります。
          </p>
        </section>

        <section>
          <p>
            本ページは、MVP段階の暫定運用における注意表示です。<br />
            今後の運用状況に応じて更新される場合があります。
          </p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-neutral-200">
        <Link href="/post" className="text-blue-600 hover:underline">
          ← 投稿ページに戻る
        </Link>
      </div>
    </main>
  );
}
