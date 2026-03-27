/* =============================================
   相性診断 (Compatibility) Calculator
   ============================================= */

// Compatibility matrix for life path numbers [a][b] = score (0-100)
function getCompatibilityScore(a, b) {
  const matrix = {
    1: { 1:70, 2:65, 3:85, 4:60, 5:80, 6:55, 7:75, 8:70, 9:65, 11:80, 22:75, 33:70 },
    2: { 1:65, 2:80, 3:70, 4:85, 5:60, 6:90, 7:75, 8:65, 9:80, 11:95, 22:80, 33:90 },
    3: { 1:85, 2:70, 3:75, 4:60, 5:90, 6:75, 7:65, 8:70, 9:85, 11:75, 22:70, 33:80 },
    4: { 1:60, 2:85, 3:60, 4:80, 5:65, 6:90, 7:80, 8:85, 9:65, 11:70, 22:95, 33:75 },
    5: { 1:80, 2:60, 3:90, 4:65, 5:75, 6:60, 7:70, 8:65, 9:80, 11:75, 22:70, 33:70 },
    6: { 1:55, 2:90, 3:75, 4:90, 5:60, 6:85, 7:65, 8:70, 9:90, 11:85, 22:90, 33:95 },
    7: { 1:75, 2:75, 3:65, 4:80, 5:70, 6:65, 7:90, 8:70, 9:80, 11:95, 22:80, 33:85 },
    8: { 1:70, 2:65, 3:70, 4:85, 5:65, 6:70, 7:70, 8:80, 9:70, 11:70, 22:90, 33:75 },
    9: { 1:65, 2:80, 3:85, 4:65, 5:80, 6:90, 7:80, 8:70, 9:85, 11:80, 22:75, 33:95 },
    11: { 1:80, 2:95, 3:75, 4:70, 5:75, 6:85, 7:95, 8:70, 9:80, 11:90, 22:85, 33:95 },
    22: { 1:75, 2:80, 3:70, 4:95, 5:70, 6:90, 7:80, 8:90, 9:75, 11:85, 22:90, 33:85 },
    33: { 1:70, 2:90, 3:80, 4:75, 5:70, 6:95, 7:85, 8:75, 9:95, 11:95, 22:85, 33:90 }
  };
  const row = matrix[a] || matrix[Math.min(a,9)];
  return row ? (row[b] || row[Math.min(b,9)] || 70) : 70;
}

function getCompatibilityMessage(score, numA, numB) {
  const messages = [
    {
      min: 90,
      title: "ソウルメイトの相性 💜",
      summary: "魂レベルで繋がった運命の出会い。互いを深く理解し、共に成長できる最高のパートナーシップです。",
      detail: `数秘${numA}と数秘${numB}の組み合わせは、宇宙が認めた最高クラスの相性。価値観の一致と深い感情的な繋がりがあり、長期的な関係でも愛が深まります。`,
      advice: "この関係を大切にしてください。お互いの成長を応援し合うことで、さらに素晴らしい未来が開けます。"
    },
    {
      min: 80,
      title: "理想的な相性 💛",
      summary: "自然体で居られる心地よい関係。お互いの良さを引き出し合える素晴らしいペアです。",
      detail: `数秘${numA}と数秘${numB}は、価値観に多くの共通点があります。違いがあっても補い合える関係で、一緒にいると自然体になれます。`,
      advice: "お互いの違いを尊重し、共通の夢を描くと関係がより豊かになります。"
    },
    {
      min: 70,
      title: "バランスの良い相性 💚",
      summary: "刺激し合える良い関係。努力次第でさらに深い絆が築けます。",
      detail: `数秘${numA}と数秘${numB}は、似ている点と異なる点がバランスよく存在します。違いが刺激になり、互いを成長させます。`,
      advice: "コミュニケーションを大切に。違いを欠点ではなく個性として受け入れると関係が深まります。"
    },
    {
      min: 60,
      title: "学び合いの相性 💙",
      summary: "乗り越えるべき課題もありますが、それが魂の成長につながります。",
      detail: `数秘${numA}と数秘${numB}は、価値観に違いがあります。最初は摩擦を感じることもありますが、お互いを理解していくことで深い絆が生まれます。`,
      advice: "焦らず時間をかけて相手を理解しましょう。話し合いと歩み寄りで関係は変わります。"
    },
    {
      min: 0,
      title: "チャレンジの相性 🌟",
      summary: "難しい相性ですが、だからこそ大きな学びと成長があります。",
      detail: `数秘${numA}と数秘${numB}は、多くの点で異なります。しかし、宇宙は成長のためにこの関係をもたらしているかもしれません。`,
      advice: "お互いの違いを受け入れ、尊重することから始めましょう。この関係があなたを大きく成長させます。"
    }
  ];

  return messages.find(m => score >= m.min) || messages[messages.length - 1];
}

function getAspectAnalysis(numA, numB) {
  const aspects = [];

  // Communication aspect
  const commScore = ([3,5,1].includes(numA) && [3,5,1].includes(numB)) ? "抜群" :
                    ([2,6,9].includes(numA) && [2,6,9].includes(numB)) ? "優しい" :
                    ([4,8,22].includes(numA) && [4,8,22].includes(numB)) ? "現実的" : "要努力";
  aspects.push({ label: "コミュニケーション", value: commScore,
    icon: commScore === "抜群" ? "⭐⭐⭐" : commScore === "要努力" ? "⭐" : "⭐⭐" });

  // Values aspect
  const valueScore = (numA === numB) ? "完全一致" :
                     (Math.abs(numA - numB) <= 2) ? "近い" : "個性的";
  aspects.push({ label: "価値観", value: valueScore,
    icon: valueScore === "完全一致" ? "⭐⭐⭐" : valueScore === "近い" ? "⭐⭐" : "⭐" });

  // Growth aspect
  const growthScore = ([7,9,11].includes(numA) || [7,9,11].includes(numB)) ? "深い" :
                      ([1,8,22].includes(numA) || [1,8,22].includes(numB)) ? "力強い" : "温かい";
  aspects.push({ label: "成長サポート", value: growthScore,
    icon: "⭐⭐" });

  return aspects;
}

function reduceToSingleDigit(n) {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((a, b) => a + parseInt(b), 0);
  }
  return n;
}

function calcLifePath(birthdate) {
  const digits = birthdate.replace(/-/g, '').split('').map(Number);
  let total = digits.reduce((a, b) => a + b, 0);
  return reduceToSingleDigit(total);
}

function renderCompatibilityResult(numA, numB, nameA, nameB) {
  const score = getCompatibilityScore(numA, numB);
  const msg = getCompatibilityMessage(score, numA, numB);
  const aspects = getAspectAnalysis(numA, numB);

  const result = document.getElementById('compat-result');
  result.innerHTML = `
    <div class="compatibility-score">
      <div class="score-circle">
        <span class="score-num">${score}</span>
        <span class="score-pct">点</span>
      </div>
      <div class="result-title">${msg.title}</div>
      <p style="color:var(--text-muted);font-size:0.95rem;">${msg.summary}</p>
    </div>

    <div style="margin-bottom:24px;">
      <div class="score-bar-wrap">
        <div class="score-bar" style="width:0%" id="compat-bar"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:0.78rem;color:var(--text-muted);margin-top:4px;">
        <span>${nameA || "あなた"}（数秘${numA}）</span>
        <span>${nameB || "お相手"}（数秘${numB}）</span>
      </div>
    </div>

    <div class="result-section">
      <h3>✨ 二人の関係の特徴</h3>
      <p>${msg.detail}</p>
    </div>

    <div class="result-section">
      <h3>📊 相性の各側面</h3>
      <div style="display:grid;gap:12px;margin-top:12px;">
        ${aspects.map(a => `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(107,53,200,0.1);border-radius:8px;border:1px solid var(--border);">
            <span style="color:var(--silver);font-size:0.9rem;">${a.label}</span>
            <span style="color:var(--gold);">${a.icon} ${a.value}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="result-section">
      <h3>💌 二人へのアドバイス</h3>
      <p>${msg.advice}</p>
    </div>

    <div class="asp-banner" style="margin-top:32px;">
      <h3>🔮 二人の未来をもっと詳しく知りたい方へ</h3>
      <p>本格電話占いで、縁・相性・結婚・復縁など深く鑑定できます。<br>初回最大10分無料！</p>
      <a href="https://px.a8.net/svt/ejp?a8mat=XXXXX" rel="nofollow sponsored" target="_blank" class="btn-asp">
        ピュアリで相性鑑定を受ける →
      </a>
    </div>
  `;
  result.classList.add('show');

  // Animate bar
  setTimeout(() => {
    const bar = document.getElementById('compat-bar');
    if (bar) bar.style.width = score + '%';
  }, 100);

  result.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('compat-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const bdA = document.getElementById('compat-bd-a').value;
    const bdB = document.getElementById('compat-bd-b').value;
    const nameA = (document.getElementById('compat-name-a') || {}).value || '';
    const nameB = (document.getElementById('compat-name-b') || {}).value || '';

    if (!bdA || !bdB) return;

    const loading = document.getElementById('compat-loading');
    if (loading) loading.classList.add('show');

    setTimeout(() => {
      if (loading) loading.classList.remove('show');
      const numA = calcLifePath(bdA);
      const numB = calcLifePath(bdB);
      renderCompatibilityResult(numA, numB, nameA, nameB);
    }, 1000);
  });
});
