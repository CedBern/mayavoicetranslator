#!/bin/bash
# Génère la documentation HTML statique à partir de la spec OpenAPI
set -e
mkdir -p LivingLanguageLab/docs
npx redoc-cli bundle LivingLanguageLab/openapi.yaml -o LivingLanguageLab/docs/index.html
