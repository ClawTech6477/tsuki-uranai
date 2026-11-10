#!/bin/bash
# 12星座の月イラストを順に生成(heavy_gate経由・既存はスキップ)
cd ~/openclaw
S="dreamy watercolor illustration, deep indigo and navy night sky, soft golden moonlight, elegant Japanese editorial fortune-telling style, painterly soft gradients, centered composition, serene and mystical"
gen(){ [ -s ~/tsuki-uranai/_build/img/$1.jpg ] && return; /usr/bin/python3 scripts/ops/heavy_gate.py 26 -- ~/openclaw/venv/bin/python3 scripts/tools/local_image.py "$2, $S" ~/tsuki-uranai/_build/img/$1.jpg --w 768 --h 768 2>&1 | tail -1; }
gen aries "a graceful ram with curled horns standing on a hill under a crescent moon, warm red ember accents"
gen taurus "a gentle white bull resting in a field of flowers under a full moon, soft green and rose accents"
gen gemini "two small birds flying together around a crescent moon, airy pale yellow accents"
gen cancer "a silver crab on a moonlit beach with gentle waves and a full moon, pearl and silver accents"
gen leo "a majestic lion lying on a rock looking up at a golden full moon, warm gold accents"
gen virgo "a young woman holding a sheaf of wheat in a quiet meadow under the moon, seen from behind, soft wheat accents"
gen libra "a golden balance scale floating among stars beside a full moon, soft pink accents"
gen scorpio "a deep red rose and a scorpion silhouette under a dark crescent moon, deep crimson accents"
gen sagittarius "a galloping horse and a flying arrow across a starry sky toward the moon, violet accents"
gen capricorn "a mountain goat standing on a high snowy peak under a full moon, cool slate accents"
gen aquarius "full-bleed edge-to-edge painting with no border and no frame, water pouring from a glowing jar into a starry river under the moon, turquoise accents"
gen pisces "two koi fish swimming in a circle in moonlit water with a full moon reflection, lavender accents"
echo ALLDONE
