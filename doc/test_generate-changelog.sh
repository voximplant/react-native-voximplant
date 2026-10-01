#!/usr/bin/env bash

echo "[]" > ./reactnative-v2.changelog.ad.json
./changelog-generator.py \
      --in ./CHANGELOG.md \
      --fqdn "references.reactnative-v2.changelog" \
      --title "Changelog" \
      --output ./reactnative-v2.changelog.ad.json
