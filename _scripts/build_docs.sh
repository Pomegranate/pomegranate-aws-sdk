#!/usr/bin/env bash

cat <(cat docs/readme_base.md) <(documentation build --shallow index.js ./lib/loader.js -f md) > README.md