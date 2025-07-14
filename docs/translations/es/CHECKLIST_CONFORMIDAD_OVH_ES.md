# Lista de verificación de conformidad – Arquitectura OVH MayaVoiceTranslator

Esta checklist permite verificar la conformidad de la instalación y configuración según las recomendaciones de DeepSeek y las mejores prácticas de soberanía, seguridad y gobernanza comunitaria.

## Seguridad y Soberanía
- [ ] Cifrado de columnas sensibles en PostgreSQL (`pgcrypto`)
- [ ] RLS (Row Level Security) activado en todas las tablas sensibles
- [ ] RBAC (control de acceso por roles) configurado
- [ ] Secrets y claves API fuera del repositorio Git (`.env` no versionado)
- [ ] Firewall activado, puertos abiertos estrictamente necesarios (22, 3000, etc.)
- [ ] Snapshots OVH activados
- [ ] Backups regulares de PostgreSQL (rclone/borg/Backblaze)
- [ ] Auditoría de seguridad semanal (`npm audit`, `trivy`, `pgAudit`)

## Gobernanza y Consentimiento
- [ ] Protocolos Mukurtu activos (acceso granular, etiquetas TK)
- [ ] Registro de consentimientos FPIC (Hyperledger o equivalente)
- [ ] Comité comunitario constituido e informado
- [ ] Herramientas Loomio o equivalente para decisiones colaborativas

## Documentación y Accesibilidad
- [ ] Documentación técnica actualizada (francés, español, maya)
- [ ] Checklist OWASP adaptada y traducida
- [ ] Guías de onboarding y uso accesibles

---

*Completar en cada despliegue o evolución mayor del proyecto.*
