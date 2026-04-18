import React from 'react';
import Link from 'next/link';

export default function KiyakuPage() {
  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">利用条件</h1>
      
      <div className="space-y-6 text-sm text-neutral-800 leading-relaxed">
        <p>
          ヒロメルは、クリエイター向け広告投稿サービスです。<br />
          本サービスは現在、MVP段階の暫定公開版として運用しています。
        </p>

        <section>
          <h2 className="text-lg font-bold mb-2">1. 基本方針</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>本サービスは、現時点では本人による投稿を前提としています</li>
            <li>投稿内容および投稿画像について、投稿者自身が必要な権利を確認してください</li>
            <li>テスト運用中のため、内容や運用ルールは予告なく変更される場合があります</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">2. 禁止事項</h2>
          <p>以下に該当する内容は投稿できません。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>他人になりすます投稿</li>
            <li>無断転載や権利不明のコンテンツ</li>
            <li>誤認を招く内容</li>
            <li>危険性または違法性が疑われる外部リンク</li>
            <li>未成年に関する懸念がある内容</li>
            <li>運営が不適切と判断した内容</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">3. 投稿の非公開・停止・削除</h2>
          <p>
            運営は、利用条件、画像投稿ルール、18禁注意、掲載基準、運営方針に照らして問題があると判断した場合、<br />
            投稿を非公開、停止、削除することがあります。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">4. 外部リンクについて</h2>
          <p>
            投稿には外部サイトへのリンクが含まれる場合があります。<br />
            外部リンク先の内容、取引、安全性、正確性について、運営は保証しません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">5. 免責</h2>
          <p>
            運営は、本サービス上の投稿内容、外部リンク先、利用結果について、完全性・正確性・成果・安全性を保証しません。<br />
            本サービスの利用に関連して発生した損害について、運営は必要な範囲で対応しますが、すべての結果を保証するものではありません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">6. ルール違反への対応</h2>
          <p>
            権利侵害の疑い、問題申告、運営上の必要がある場合、運営は確認のうえ必要な対応を行います。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">7. 補足</h2>
          <p>
            本ページは、MVP段階の暫定運用における最低限の利用条件です。<br />
            今後の運用状況に応じて更新される場合があります。
          </p>
        </section>
      </div>

    </main>
  );
}
