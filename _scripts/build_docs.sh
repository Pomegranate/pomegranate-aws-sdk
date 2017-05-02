#!/usr/bin/env bash

cat <(cat docs/readme_base.md) <(documentation build --shallow index.js -f md) > README.md