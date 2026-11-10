#!/bin/bash
# _build/img の生成元JPG → 公開用WebP(サイズ別)
cd ~/tsuki-uranai
S=_build/img
[ -s $S/hero.jpg ] || cp $S/hero_test.jpg $S/hero.jpg
cwebp -quiet -q 72 -resize 1280 0 $S/hero.jpg -o img/hero-1280.webp
cwebp -quiet -q 72 -resize 720 0 $S/hero.jpg -o img/hero-720.webp
sips -s format jpeg -s formatOptions 78 -z 630 1120 $S/hero.jpg --out img/og.jpg >/dev/null
for h in hero_tsuki hero_aisho hero_suuhi; do
  [ -s $S/$h.jpg ] || continue
  cwebp -quiet -q 72 -resize 1280 0 $S/$h.jpg -o img/$h-1280.webp
  cwebp -quiet -q 72 -resize 720 0 $S/$h.jpg -o img/$h-720.webp
done
for k in aries taurus gemini cancer leo virgo libra scorpio sagittarius capricorn aquarius pisces; do
  [ -s $S/$k.jpg ] || continue
  cwebp -quiet -q 74 -resize 480 0 $S/$k.jpg -o img/signs/$k.webp
  cwebp -quiet -q 70 -resize 160 0 $S/$k.jpg -o img/signs/$k-s.webp
done
ls -la img img/signs | awk '{print $5, $9}'
for n in tsuki aisho suuhi; do cwebp -quiet -q 72 -resize 320 0 _build/img/hero_$n.jpg -o img/hero_$n-320.webp; done
