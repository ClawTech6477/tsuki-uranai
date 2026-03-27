/* =============================================
   月星座 (Moon Sign) Calculator
   ============================================= */

const MOON_SIGNS = {
  aries: {
    ja: "牡羊座",
    en: "Aries",
    symbol: "♈",
    emoji: "🔥",
    element: "火",
    ruler: "火星",
    dates: "3/21〜4/19",
    description: "月が牡羊座にある方は、感情表現が率直で行動的。直感に従って素早く動き、情熱的に生きます。新しい挑戦に胸を躍らせ、エネルギッシュに前進します。",
    love: "恋愛では積極的で情熱的。好きになったら一直線！ただし飽きやすい面もあるため、相手との新鮮さを保つことが大切です。",
    innerself: "内なる子どものような純粋さと勇気を持っています。傷ついても素早く立ち直る回復力があります。",
    need: "自由と自己表現の場が必要。競争や新しいチャレンジがあるとエネルギーが輝きます。",
    traits: ["情熱的", "直感的", "行動力", "率直", "勇気"],
    lucky_stone: "ダイヤモンド・カーネリアン"
  },
  taurus: {
    ja: "牡牛座",
    en: "Taurus",
    symbol: "♉",
    emoji: "🌿",
    element: "地",
    ruler: "金星",
    dates: "4/20〜5/20",
    description: "月が牡牛座にある方は、感情が安定していて穏やか。美しいもの、おいしいもの、心地よい環境に深い喜びを感じます。変化を好まず、安心感の中で輝きます。",
    love: "恋愛では忠実で安定志向。じっくりと信頼を築き、長続きする関係を大切にします。スキンシップと物質的な安心感が愛情表現の基本です。",
    innerself: "深い安心感と現実的な判断力があります。感情をゆっくり処理し、じっくりと信頼を育みます。",
    need: "安定した環境と美しさ、快適さが必要。自然や芸術に触れることで心が満たされます。",
    traits: ["安定", "忠実", "感覚的", "粘り強さ", "美意識"],
    lucky_stone: "エメラルド・ローズクォーツ"
  },
  gemini: {
    ja: "双子座",
    en: "Gemini",
    symbol: "♊",
    emoji: "💨",
    element: "風",
    ruler: "水星",
    dates: "5/21〜6/21",
    description: "月が双子座にある方は、感情と知性が密接に結びついています。コミュニケーションを通じて心を満たし、多様な刺激を求めます。気分が変わりやすく、適応力も抜群です。",
    love: "恋愛では会話と知的な刺激を重視。マンネリを嫌い、常に新鮮さを求めます。軽やかな雰囲気のある関係が長続きします。",
    innerself: "多面的な感情世界を持ち、同時にさまざまな感情を感じることができます。情報処理で心を落ち着かせます。",
    need: "コミュニケーションと学びの機会が必要。多様な人との交流があると感情が安定します。",
    traits: ["知的好奇心", "適応力", "コミュニケーション", "軽やかさ", "多才"],
    lucky_stone: "アゲート・シトリン"
  },
  cancer: {
    ja: "蟹座",
    en: "Cancer",
    symbol: "♋",
    emoji: "🌊",
    element: "水",
    ruler: "月",
    dates: "6/22〜7/22",
    description: "月が蟹座にある方は、月の支配を受ける最も感受性豊かな月星座。深い感情と直感、強い母性・父性本能を持ちます。家族や家庭への愛着が非常に強いです。",
    love: "恋愛では深い感情移入と献身的な愛情。家庭的で相手を包み込むように愛します。感情の波に乗って変化しやすい面もあります。",
    innerself: "内なる子どもと母なる存在が共存。過去の記憶と感情をずっと大切に持ち続けます。",
    need: "安全な家族的な空間と、感情を受け入れてもらえる環境が必要です。",
    traits: ["感受性", "母性", "直感", "家庭的", "保護本能"],
    lucky_stone: "ムーンストーン・パール"
  },
  leo: {
    ja: "獅子座",
    en: "Leo",
    symbol: "♌",
    emoji: "☀️",
    element: "火",
    ruler: "太陽",
    dates: "7/23〜8/22",
    description: "月が獅子座にある方は、感情が豊かでドラマティック。愛されること、認められることで輝きます。創造的な表現を通じて感情を解放し、人々に喜びを与えます。",
    love: "恋愛では大きな愛情と情熱。称賛し称賛されることが喜び。プライドが高く、パートナーには尊重と特別扱いを求めます。",
    innerself: "王者のような内なる子どもがいます。舞台の中心に立ちたいという欲求と、純粋に愛を分かち合いたい心が共存。",
    need: "認められること、愛されること、創造的な表現の場が必要です。",
    traits: ["情熱", "創造性", "寛大", "プライド", "エンタメ性"],
    lucky_stone: "サンストーン・ゴールドトパーズ"
  },
  virgo: {
    ja: "乙女座",
    en: "Virgo",
    symbol: "♍",
    emoji: "🌾",
    element: "地",
    ruler: "水星",
    dates: "8/23〜9/22",
    description: "月が乙女座にある方は、感情を分析する傾向があります。秩序と清潔さの中で心の平和を得ます。細部への注意と実用的な助けを通じて愛情を表現します。",
    love: "恋愛では献身的なサポート役。相手の役に立つことで愛情を示します。完璧主義が強く出ると批判的になることも。",
    innerself: "感情を言語化・分析することで処理するタイプ。内なる批評家の声が大きいですが、それは成長への向上心です。",
    need: "秩序と実用性、体を動かすルーティンがあると心が安定します。",
    traits: ["分析力", "几帳面", "実用性", "健康意識", "謙虚"],
    lucky_stone: "サファイア・ペリドット"
  },
  libra: {
    ja: "天秤座",
    en: "Libra",
    symbol: "♎",
    emoji: "⚖️",
    element: "風",
    ruler: "金星",
    dates: "9/23〜10/23",
    description: "月が天秤座にある方は、調和と美の中で感情が安定します。公平さと美意識が感情の核。対話を通じて心のバランスを保ち、人間関係の調和を大切にします。",
    love: "恋愛では美しいロマンスを理想とします。パートナーシップを最も大切にし、二人で一つの世界を作ることに喜びを感じます。",
    innerself: "内なる平和と公正さを常に求めています。一人でいることへの不安から、他者との関係に安心を求めることも。",
    need: "美しい環境と公平な対話、パートナーシップが必要です。",
    traits: ["調和", "美意識", "外交性", "公平", "社交的"],
    lucky_stone: "オパール・ローズクォーツ"
  },
  scorpio: {
    ja: "蠍座",
    en: "Scorpio",
    symbol: "♏",
    emoji: "🔮",
    element: "水",
    ruler: "冥王星",
    dates: "10/24〜11/22",
    description: "月が蠍座にある方は、感情が深く強烈。表面には見せませんが、内側では激しい感情の嵐が渦巻いています。変容と再生のエネルギーを持ち、深い人間関係を求めます。",
    love: "恋愛では全か無かの強烈な愛情。嫉妬深く独占欲がありますが、それは深い愛の裏返し。魂の融合を望みます。",
    innerself: "感情を深く隠す傾向がありますが、内側では強烈な感情体験をしています。癒しと変容のプロセスを繰り返す魂です。",
    need: "深い信頼関係と変容の機会が必要。秘密や神秘への探求で魂が満たされます。",
    traits: ["強烈さ", "直感", "変容力", "神秘性", "深さ"],
    lucky_stone: "オブシディアン・ガーネット"
  },
  sagittarius: {
    ja: "射手座",
    en: "Sagittarius",
    symbol: "♐",
    emoji: "🏹",
    element: "火",
    ruler: "木星",
    dates: "11/23〜12/21",
    description: "月が射手座にある方は、自由と冒険の中で感情が輝きます。楽観的で哲学的な視点を持ち、人生を大きな冒険として楽しみます。遠い場所や異文化への憧れが強い。",
    love: "恋愛では自由を愛し、束縛を嫌います。旅や学びを共有できるパートナーと最も輝きます。精神的な繋がりを重視します。",
    innerself: "永遠の旅人・探求者としての内なる自己があります。答えを求めて哲学と冒険を続けます。",
    need: "自由、旅、学び、哲学的な対話が必要。広い空間と可能性がある環境で輝きます。",
    traits: ["楽観性", "自由", "哲学的", "探求心", "豪快"],
    lucky_stone: "ターコイズ・ラピスラズリ"
  },
  capricorn: {
    ja: "山羊座",
    en: "Capricorn",
    symbol: "♑",
    emoji: "🏔️",
    element: "地",
    ruler: "土星",
    dates: "12/22〜1/19",
    description: "月が山羊座にある方は、感情を抑制しながら目標に向かって着実に進みます。責任感と自立心が感情の核。達成と成功を通じて安心感を得ます。",
    love: "恋愛では時間をかけて信頼を築きます。感情表現は控えめですが、行動で愛情を示す誠実なタイプ。長期的なコミットメントを大切にします。",
    innerself: "強い内なる批評家と責任感を持ちます。感情に溺れることを恐れ、コントロールしようとする傾向があります。",
    need: "目標と達成感、社会的な認知が必要です。計画と秩序のある環境で安心できます。",
    traits: ["責任感", "自制心", "野心", "実用性", "忍耐"],
    lucky_stone: "オニキス・ガーネット"
  },
  aquarius: {
    ja: "水瓶座",
    en: "Aquarius",
    symbol: "♒",
    emoji: "⚡",
    element: "風",
    ruler: "天王星",
    dates: "1/20〜2/18",
    description: "月が水瓶座にある方は、感情よりも知性でものごとを処理する傾向があります。人類への愛と独自の価値観を持ち、群れから外れた独自の道を歩みます。",
    love: "恋愛では友情から発展するスタイルが多い。知的パートナーシップと自由を重視。感情的な束縛を嫌い、精神的な繋がりを大切にします。",
    innerself: "革命家と博愛主義者の内なる自己。感情が不安定になると理性で切り離そうとしますが、その感情も大切に受け入れて。",
    need: "自由、独自性、社会貢献の場が必要。志を同じくするコミュニティで輝きます。",
    traits: ["独自性", "博愛", "革新的", "論理的", "自由"],
    lucky_stone: "アメジスト・ラピスラズリ"
  },
  pisces: {
    ja: "魚座",
    en: "Pisces",
    symbol: "♓",
    emoji: "🌊",
    element: "水",
    ruler: "海王星",
    dates: "2/19〜3/20",
    description: "月が魚座にある方は、最も感受性豊かで霊的な月星座。境界線が薄く、周囲の感情やエネルギーを吸収しやすい。夢と直感の世界に生き、深い共感力を持ちます。",
    love: "恋愛では無限の愛と共感を与えます。理想を追い求めるロマンティストで、魂の繋がりを求めます。現実と夢の狭間で迷うことも。",
    innerself: "深い海のように広大で神秘的な内面世界。過去世の記憶や集合的無意識に繋がる感受性があります。",
    need: "創造的表現と精神的な逃げ場、スピリチュアルな実践が必要です。",
    traits: ["共感力", "霊感", "創造性", "優しさ", "神秘"],
    lucky_stone: "アクアマリン・パール"
  }
};

// Moon sign calculation (approximation using Julian Date)
function julianDate(year, month, day) {
  if (month <= 2) { year--; month += 12; }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) +
         Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

function calcMoonSign(year, month, day) {
  // Moon moves ~13.176 degrees per day, completes cycle in ~27.3217 days
  const jd = julianDate(year, month, day);
  // Approximate moon longitude (degrees)
  // Reference: new moon near Aries on JD 2451550.1 (Jan 6, 2000)
  const refJD = 2451550.1;
  const synodicMonth = 29.53058867;
  const phase = ((jd - refJD) % synodicMonth + synodicMonth) % synodicMonth;
  // Sidereal positioning (rough approximation)
  const daysSinceRef = jd - refJD;
  const moonLong = ((daysSinceRef * 13.17635) + 318.35) % 360;
  const signIndex = Math.floor(moonLong / 30);
  const signs = ['aries','taurus','gemini','cancer','leo','virgo',
                 'libra','scorpio','sagittarius','capricorn','aquarius','pisces'];
  return signs[((signIndex % 12) + 12) % 12];
}

function renderMoonResult(signKey, birthdate) {
  const sign = MOON_SIGNS[signKey];
  if (!sign) return;

  const result = document.getElementById('moon-result');
  result.innerHTML = `
    <div style="text-align:center;margin-bottom:28px;">
      <span class="result-sign">${sign.emoji}</span>
      <div class="result-label">月星座</div>
      <div class="result-title">${sign.symbol} ${sign.ja}（${sign.en}）</div>
      <p style="color:var(--text-muted);font-size:0.88rem;">
        元素：${sign.element} ／ 支配星：${sign.ruler} ／ ${sign.dates}
      </p>
      <div class="trait-list" style="justify-content:center;margin-top:12px;">
        ${sign.traits.map(t => `<span class="trait-tag">${t}</span>`).join('')}
      </div>
    </div>

    <div class="result-section">
      <h3>🌙 月星座の本質</h3>
      <p>${sign.description}</p>
    </div>

    <div class="result-section">
      <h3>💕 恋愛と感情のパターン</h3>
      <p>${sign.love}</p>
    </div>

    <div class="result-section">
      <h3>🔮 内なる自己</h3>
      <p>${sign.innerself}</p>
    </div>

    <div class="result-section">
      <h3>✨ あなたが必要としているもの</h3>
      <p>${sign.need}</p>
    </div>

    <div class="result-section">
      <h3>💎 パワーストーン</h3>
      <p><strong style="color:var(--gold)">${sign.lucky_stone}</strong></p>
    </div>

    <div class="asp-banner" style="margin-top:32px;">
      <h3>🌙 月のリズムに合わせた本格占いへ</h3>
      <p>月星座のプロ鑑定士が、あなたの感情パターンと運命を深読みします。</p>
      <a href="https://px.a8.net/svt/ejp?a8mat=XXXXX" rel="nofollow sponsored" target="_blank" class="btn-asp">
        ピュアリで月星座鑑定を受ける →
      </a>
    </div>
  `;
  result.classList.add('show');
  result.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('moon-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const birthdate = document.getElementById('moon-birthdate').value;
    if (!birthdate) return;

    const [year, month, day] = birthdate.split('-').map(Number);

    const loading = document.getElementById('moon-loading');
    if (loading) loading.classList.add('show');

    setTimeout(() => {
      if (loading) loading.classList.remove('show');
      const signKey = calcMoonSign(year, month, day);
      renderMoonResult(signKey, birthdate);
    }, 800);
  });
});
