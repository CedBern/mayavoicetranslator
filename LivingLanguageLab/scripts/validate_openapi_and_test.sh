#!/bin/bash
# Validation OpenAPI et tests LivingLanguageLab
set -e

# Validation de la spec OpenAPI
npx swagger-cli validate LivingLanguageLab/openapi.yaml

# Lancement des tests Jest
npx jest LivingLanguageLab/tests --runInBand
