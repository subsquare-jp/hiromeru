import React from 'react';
import Link from 'next/link';

export default function ImageRulePage() {
  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">画像投稿ルール</h1>
      
      <div className="space-y-6 text-sm text-neutral-800 leading-relaxed">
        <p>
          本ページは、ヒロメルに投稿できる画像の最低限の基準を示すものです。
        </p>

        <section>
          <h2 className="text-lg font-bold mb-2">1. 基本方針</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>投稿できるのは、投稿者本人が権利を持つ画像、または利用条件上問題のない画像のみです</li>
            <li>権利関係が不明な画像は掲載しません</li>
            <li>不明点がある場合は、掲載前に確認、差し戻し、非表示、停止を行う場合があります</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">2. 投稿できる画像</h2>
          <p>以下に当てはまる画像は投稿可能です。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>投稿者本人が作成した画像</li>
            <li>投稿者本人が使用権限を持つ画像</li>
            <li>商用利用可能な素材を、利用条件の範囲内で使った画像</li>
            <li>AI生成画像のうち、本ページの禁止事項に当たらないもの</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">3. AI生成画像について</h2>
          <p>AI生成画像は条件付きで投稿可能です。ただし、以下に当てはまる場合は掲載できません。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>既存作品、既存キャラクター、特定作家への強い依拠や酷似があるもの</li>
            <li>実在人物に強く似せたもの</li>
            <li>元画像や参照素材の権利関係が不明なもの</li>
            <li>誤認を招くもの</li>
            <li>未成年を想起させるセンシティブなもの</li>
          </ul>
          <p className="mt-2">
            必要に応じて、運営は生成有無、使用素材、作成方法等の確認を求める場合があります。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">4. 投稿できない画像</h2>
          <p>以下に該当する画像は掲載できません。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>無断転載画像</li>
            <li>出どころ不明の画像</li>
            <li>他人の顔写真や他人作品の無断使用</li>
            <li>他社ロゴ、ブランド素材、公式画像の無断使用</li>
            <li>実在人物本人であるかのように誤認させる画像</li>
            <li>既存作品や既存キャラクターへの強い酷似がある画像</li>
            <li>未成年を想起させるセンシティブな画像</li>
            <li>年齢、属性、実績、効果等を誤認させる画像</li>
            <li>危険性または違法性が疑われる外部リンクと組み合わされた画像</li>
            <li>現在の初期方針である「本人投稿のみ」に反する画像投稿</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">5. 投稿者の責任</h2>
          <p>投稿者は、以下について自ら責任を持つものとします。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>投稿画像の権利確認</li>
            <li>元素材や生成手段の確認</li>
            <li>第三者の権利を侵害しないこと</li>
            <li>必要に応じて運営からの確認に対応すること</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">6. 運営の対応</h2>
          <p>
            運営は、問題があると判断した画像について、差し戻し、非表示、停止、削除等の対応を行う場合があります。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">7. 補足</h2>
          <p>
            本ページは、MVP段階の暫定運用における最低限の画像投稿ルールです。<br />
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
