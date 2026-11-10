#!/bin/bash
cd ~/openclaw
S="dreamy watercolor illustration, deep indigo and navy night sky, soft golden moonlight, elegant Japanese editorial fortune-telling style, painterly soft gradients, serene and mystical, no text"
gen(){ [ -s ~/tsuki-uranai/_build/img/$1.jpg ] && return; /usr/bin/python3 scripts/ops/heavy_gate.py 26 -- ~/openclaw/venv/bin/python3 scripts/tools/local_image.py "$2, $S" ~/tsuki-uranai/_build/img/$1.jpg --w 1280 --h 720 2>&1 | tail -1; }
gen hero_tsuki "a large golden crescent moon surrounded by a circle of twelve faint glowing zodiac constellations, wide panorama"
gen hero_aisho "two silhouettes of a couple sitting together on a hill looking up at a big full moon, fireflies, wide panorama"
gen hero_suuhi "nine small glowing golden orbs arranged in a gentle arc like a string of pearls of light above a full moon reflected on a still lake, sacred geometry faint circles, absolutely no numbers no digits no letters, wide panorama"
echo PAGESDONE
