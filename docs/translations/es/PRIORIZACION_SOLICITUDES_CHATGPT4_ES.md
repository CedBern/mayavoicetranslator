# Priorización de solicitudes técnicas a ChatGPT 4.1 – MayaVoiceTranslator

Este documento propone un orden de prioridad para las solicitudes a ChatGPT 4.1, con el fin de optimizar la seguridad, la automatización y la documentación del proyecto.

## Orden de prioridad recomendado

1. **Configuración completa de RLS y RBAC en PostgreSQL por comunidad**
2. **Script de respaldo cifrado de PostgreSQL a Backblaze B2 o IPFS (bash o Node.js)**
3. **Auditoría de seguridad automatizada en VPS Ubuntu (npm audit, trivy, pgaudit)**
4. **docker-compose con Mukurtu e IPFS + persistencia/logs**
5. **.env seguro para Node.js (helmet, CORS, etc.)**
6. **GitHub Actions para despliegue de Node.js en VPS OVH**
7. **Pruebas post-despliegue (puertos, firewall, backups)**
8. **Herramientas open source de monitoreo para VPS OVH**
9. **Limitación de subida de audio (Node.js + nginx)**
10. **Política PostgreSQL anti-acceso no autenticado**
11. **Plantilla de checklist OWASP**
12. **README multilingüe FR/ES/EN**
13. **Traducción de una guía técnica (a proporcionar)**

---

*Este plan puede adaptarse según el avance del proyecto o necesidades urgentes. Para transmitir a ChatGPT para tratamiento secuencial o por lotes.*
