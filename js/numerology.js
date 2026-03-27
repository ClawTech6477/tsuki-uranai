/* =============================================
   数秘術 (Numerology) - Life Path Calculator
   ============================================= */

const NUMEROLOGY_DATA = {
  1: {
    name: "リーダー",
    symbol: "☀️",
    element: "火",
    keyword: "独立・開拓・創造",
    description: "あなたは生まれながらのリーダー。強い意志と独立心を持ち、新しい道を切り開く力があります。自分の直感を信じ、独自の道を歩むことで最大の力を発揮します。",
    love: "恋愛では情熱的で積極的。自分がリードするスタイルを好みますが、相手の意見も尊重することで長続きする関係が築けます。",
    work: "起業家・管理職・クリエイターに向いています。人の上に立つポジションで真価を発揮します。",
    lucky_color: "赤・金",
    lucky_stone: "ルビー・ガーネット",
    traits: ["行動力", "独立心", "創造性", "カリスマ", "情熱"],
    caution: "独りよがりになりやすい面があります。協調性を意識することで人間関係が豊かになります。"
  },
  2: {
    name: "協調者",
    symbol: "🌙",
    element: "水",
    keyword: "調和・感受性・協力",
    description: "あなたは繊細で思いやりにあふれた魂。人の感情を敏感に察知し、周囲と調和する天才です。縁の下の力持ちとして、チームを支える大切な存在。",
    love: "恋愛では献身的で相手を深く愛します。感受性が豊かなため傷つきやすい面もありますが、その繊細さが深い絆を生みます。",
    work: "カウンセラー・教師・看護師・外交官に適性があります。人をサポートする仕事で輝きます。",
    lucky_color: "ピンク・クリーム",
    lucky_stone: "ムーンストーン・ローズクォーツ",
    traits: ["共感力", "調和", "忍耐", "直感", "優しさ"],
    caution: "他人の感情に影響されすぎることがあります。自分の軸を大切にしましょう。"
  },
  3: {
    name: "表現者",
    symbol: "⭐",
    element: "風",
    keyword: "創造・喜び・表現",
    description: "あなたは喜びと創造のエネルギーを持つ魂。明るく社交的で、言葉・芸術・音楽などあらゆる表現を通じて人々を楽しませます。",
    love: "恋愛は楽しく明るく！ユーモアと会話で相手の心を掴みます。マンネリを避け、常に新鮮さを大切にしましょう。",
    work: "アーティスト・作家・俳優・コメディアン・デザイナーに向いています。自己表現できる仕事が天職です。",
    lucky_color: "黄色・オレンジ",
    lucky_stone: "シトリン・アンバー",
    traits: ["創造力", "表現力", "社交性", "楽観性", "ユーモア"],
    caution: "集中力が続かないことがあります。一つのことを深掘りする習慣をつけましょう。"
  },
  4: {
    name: "建設者",
    symbol: "🏔️",
    element: "地",
    keyword: "安定・勤勉・実直",
    description: "あなたは堅実で信頼できる魂。コツコツと積み上げ、揺るぎない基盤を築く力があります。計画性と忍耐力で、着実に夢を現実にします。",
    love: "恋愛では誠実で長期的な関係を好みます。安定した愛情表現で相手に安心感を与えますが、ロマンティックな演出も取り入れてみて。",
    work: "エンジニア・会計士・建築家・管理職に向いています。システムと秩序を作る仕事で力を発揮します。",
    lucky_color: "グリーン・ブラウン",
    lucky_stone: "ヒスイ・エメラルド",
    traits: ["堅実性", "勤勉", "誠実", "計画性", "忍耐"],
    caution: "頑固になりすぎることがあります。変化を恐れず柔軟性を持ちましょう。"
  },
  5: {
    name: "冒険者",
    symbol: "🌟",
    element: "風",
    keyword: "自由・変化・冒険",
    description: "あなたは自由と変化を愛する魂。好奇心旺盛で適応力が高く、どんな状況でも軽やかに対処します。多様な経験があなたを豊かにします。",
    love: "恋愛は刺激的で変化に富んでいます。束縛を嫌うため、相手の自由も尊重できるパートナーが理想です。",
    work: "旅行業・ジャーナリスト・マーケター・フリーランスに向いています。変化の多い環境で輝きます。",
    lucky_color: "ターコイズ・シルバー",
    lucky_stone: "アクアマリン・トルコ石",
    traits: ["適応力", "好奇心", "自由奔放", "コミュニケーション力", "多才"],
    caution: "飽き性になりやすいです。大切なものは手放さない意識を持ちましょう。"
  },
  6: {
    name: "養育者",
    symbol: "💫",
    element: "地",
    keyword: "愛・奉仕・責任",
    description: "あなたは愛と調和の魂。家族・友人・コミュニティのために尽くす温かい心の持ち主です。美しいものを愛し、平和な環境を作り出します。",
    love: "恋愛では献身的で家庭的。深い愛情と安定した関係を求めます。完璧主義が出ると窮屈になることも。",
    work: "教師・医療・福祉・インテリアデザイン・料理人に向いています。人の世話をする仕事が向いています。",
    lucky_color: "ネイビー・ローズ",
    lucky_stone: "ラピスラズリ・ローズクォーツ",
    traits: ["愛情深さ", "責任感", "奉仕精神", "美的センス", "家庭的"],
    caution: "自己犠牲しすぎる傾向があります。自分自身のケアも忘れずに。"
  },
  7: {
    name: "探求者",
    symbol: "🔮",
    element: "水",
    keyword: "知恵・神秘・直感",
    description: "あなたは深い内省と知的探求の魂。物事の本質を見抜く洞察力と、精神的な知恵を持っています。孤独を愛し、深く考えることで真理に近づきます。",
    love: "恋愛では知的な繋がりを重視します。心から信頼できる相手との深い関係を求めますが、心を開くのに時間がかかることも。",
    work: "研究者・哲学者・占い師・IT専門家・分析家に向いています。専門性を深める仕事で真価を発揮します。",
    lucky_color: "バイオレット・ディープブルー",
    lucky_stone: "アメジスト・ラブラドライト",
    traits: ["分析力", "直感", "独自性", "神秘性", "内省"],
    caution: "孤立しやすいです。時には外の世界に出て人と交流することが大切です。"
  },
  8: {
    name: "達成者",
    symbol: "💎",
    element: "地",
    keyword: "力・豊かさ・実現",
    description: "あなたは物質的・精神的豊かさを実現する魂。強い意志と実行力で、大きな目標を達成します。権力とお金に関する才能があり、成功を引き寄せます。",
    love: "恋愛では相手を強くサポートし、物質的な豊かさを提供します。仕事に熱心なあまり家族との時間が少なくなることも。",
    work: "経営者・金融・不動産・政治家に向いています。ビジネスと権力の世界で能力を発揮します。",
    lucky_color: "ブラック・ゴールド",
    lucky_stone: "オニキス・タイガーアイ",
    traits: ["実行力", "リーダーシップ", "野心", "現実性", "強さ"],
    caution: "お金と権力への執着に注意。精神的な豊かさも大切にしましょう。"
  },
  9: {
    name: "完成者",
    symbol: "🌈",
    element: "火",
    keyword: "完成・博愛・智慧",
    description: "あなたは最も成熟した魂の一つ。普遍的な愛と智慧を持ち、人類全体への奉仕に喜びを見出します。芸術的才能と深い洞察力であらゆる人に感動を与えます。",
    love: "恋愛では理想主義的。深い精神的繋がりを求めますが、特定の人より人類愛が強いため、身近な人を軽視しがちに。",
    work: "芸術家・人道支援・精神的リーダー・教育者に向いています。大きなビジョンで社会に貢献する仕事が向いています。",
    lucky_color: "ゴールド・ホワイト",
    lucky_stone: "クリスタル・ムーンストーン",
    traits: ["博愛", "智慧", "寛大さ", "芸術性", "完成"],
    caution: "感情的になりやすく、過去を手放せないことがあります。手放しを学びましょう。"
  },
  11: {
    name: "霊的な直感者",
    symbol: "✨",
    element: "光",
    keyword: "啓示・直感・霊性",
    description: "11はマスターナンバー。あなたは高い霊的感受性と直感を持つ使命の魂。周囲を照らし、インスピレーションを与える光の存在です。",
    love: "恋愛は霊的な繋がりを重視。魂のレベルで繋がれるツインソウルとの出会いを求めています。",
    work: "スピリチュアルヒーラー・占い師・芸術家・カウンセラーが天職。精神世界と現実をつなぐ仕事で輝きます。",
    lucky_color: "シルバー・ホワイト",
    lucky_stone: "クリアクォーツ・ムーンストーン",
    traits: ["霊感", "直感", "感受性", "カリスマ", "使命感"],
    caution: "エネルギーの過負荷に注意。定期的にエネルギーをデトックスしてください。"
  },
  22: {
    name: "マスタービルダー",
    symbol: "🌍",
    element: "全元素",
    keyword: "偉大な建設・変革・遺産",
    description: "22はマスターナンバー。あなたは現実世界に偉大な遺産を残すために生まれた魂。夢を形にする力は誰よりも強く、歴史を変えるプロジェクトを実現できます。",
    love: "恋愛でも建設的な関係を求めます。共に何かを作り上げるパートナーと最も輝きます。",
    work: "起業家・建築家・国際的リーダー・発明家が天職。世界規模のプロジェクトで真価を発揮します。",
    lucky_color: "ゴールド・ディープブルー",
    lucky_stone: "ダイヤモンド・サファイア",
    traits: ["ビジョン", "実現力", "リーダーシップ", "体系化", "偉大さ"],
    caution: "完璧主義と過労に注意。休息もプロジェクトの一部と認識しましょう。"
  },
  33: {
    name: "マスターティーチャー",
    symbol: "💜",
    element: "愛",
    keyword: "純粋な愛・癒し・奉仕",
    description: "33はマスターナンバー。純粋な愛と無条件の奉仕を体現するために生まれた稀有な魂。あなたの存在自体が癒しです。",
    love: "恋愛も奉仕精神と愛情が混在。見返りなく愛しますが、その深さ故に傷つくこともあります。",
    work: "霊的教師・ヒーラー・アーティスト・人道支援者が天職。愛を表現するすべての仕事で輝きます。",
    lucky_color: "バイオレット・ゴールド",
    lucky_stone: "アメジスト・ローズクォーツ",
    traits: ["無条件の愛", "癒し", "創造性", "自己犠牲", "純粋さ"],
    caution: "自己犠牲が過ぎると燃え尽きます。自愛の実践が何より大切です。"
  }
};

function reduceToSingleDigit(n) {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((a, b) => a + parseInt(b), 0);
  }
  return n;
}

function calcLifePath(birthdate) {
  // birthdate: YYYY-MM-DD
  const digits = birthdate.replace(/-/g, '').split('').map(Number);
  let total = digits.reduce((a, b) => a + b, 0);
  return reduceToSingleDigit(total);
}

function calcDestiny(name) {
  // Simple western numerology for name (optional)
  const values = { a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,
                   j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,
                   s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8 };
  let total = name.toLowerCase().replace(/[^a-z]/g,'').split('')
    .reduce((a, c) => a + (values[c] || 0), 0);
  return reduceToSingleDigit(total);
}

function renderNumerologyResult(lifePath, birthdateStr, nameStr) {
  const data = NUMEROLOGY_DATA[lifePath];
  if (!data) return;

  const result = document.getElementById('result');
  result.innerHTML = `
    <div class="result-section" style="text-align:center;margin-bottom:28px;">
      <span class="result-number">${lifePath}</span>
      <div class="result-label">ライフパスナンバー</div>
      <div class="result-title">${data.symbol} 数秘 ${lifePath}：${data.name}</div>
      <div class="trait-list" style="justify-content:center;">
        ${data.traits.map(t => `<span class="trait-tag">${t}</span>`).join('')}
      </div>
    </div>

    <div class="result-section">
      <h3>🌙 あなたの本質</h3>
      <p>${data.description}</p>
    </div>

    <div class="result-section">
      <h3>💕 恋愛・パートナーシップ</h3>
      <p>${data.love}</p>
    </div>

    <div class="result-section">
      <h3>💼 仕事・才能</h3>
      <p>${data.work}</p>
    </div>

    <div class="result-section">
      <h3>⚠️ 注意ポイント</h3>
      <p>${data.caution}</p>
    </div>

    <div class="result-section">
      <h3>✨ ラッキーアイテム</h3>
      <p>ラッキーカラー：<strong style="color:var(--gold)">${data.lucky_color}</strong><br>
      パワーストーン：<strong style="color:var(--gold)">${data.lucky_stone}</strong></p>
    </div>

    <div class="asp-banner" style="margin-top:32px;">
      <h3>🔮 さらに深い占いを体験したい方へ</h3>
      <p>本格的な電話占いでプロの鑑定士があなたの悩みに答えます。<br>初回無料で体験できます。</p>
      <a href="https://px.a8.net/svt/ejp?a8mat=XXXXX" rel="nofollow sponsored" target="_blank" class="btn-asp">
        ピュアリで無料鑑定を受ける →
      </a>
    </div>
  `;
  result.classList.add('show');
  result.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('numerology-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const birthdate = document.getElementById('birthdate').value;
    const nameVal = (document.getElementById('yourname') || {}).value || '';
    if (!birthdate) return;

    const loading = document.getElementById('loading');
    if (loading) { loading.classList.add('show'); }

    setTimeout(() => {
      if (loading) loading.classList.remove('show');
      const lifePath = calcLifePath(birthdate);
      renderNumerologyResult(lifePath, birthdate, nameVal);
    }, 800);
  });
});
