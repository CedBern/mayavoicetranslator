# Hoja de ruta del pipeline y almacenamiento – MayaVoiceTranslator/Cortex

## Objetivo
Implementar una arquitectura robusta, económica y soberana para el procesamiento, reducción de volumen y almacenamiento de los datos de audio/texto del proyecto, siguiendo las recomendaciones del consultor IA (julio 2025).

---

## Fases de implementación

### Fase 1 (Meses 1-3): Fundación
- Adquisición y configuración de equipo de grabación básico
- Establecimiento de alianzas comunitarias
- Documentación inicial (10-20h de material)
- Implementación de deduplicación (jdupes) y compresión FLAC
- Almacenamiento local SSD NVMe (2TB)

### Fase 2 (Meses 4-9): Escalado
- Despliegue de un clúster Garage (almacenamiento tibio autoalojado)
- Implementación de una red IPFS comunitaria (distribución y caché)
- Formación de miembros en flujos de trabajo digitales
- Integración de Backblaze B2 para archivo en la nube

### Fase 3 (Meses 10-12): Optimización
- Migración automática a almacenamiento frío (Backblaze B2)
- Creación de flujos de ingresos (licencias educativas, subvenciones)
- Optimización del pipeline con openSMILE (extracción de características)

---

## Pipeline técnico recomendado

### Preprocesamiento y reducción de volumen
- Compresión de audio: FLAC (archivo), Opus (copias de trabajo)
- Deduplicación: jdupes (exacta), NeMo Curator (difusa)
- Extracción de características: openSMILE, librosa (MFCC, mel-espectrogramas)
- Limpieza de audio: SoX, FFmpeg
- Orquestación: Luigi (simple), Prefect (media), Airflow (compleja)

### Almacenamiento híbrido
- Caliente: SSD local (datos activos)
- Tibio: Garage (autoalojado, 3 nodos)
- Frío: Backblaze B2 (nube)
- Distribución: BunnyCDN, IPFS

### Sincronización y transferencia
- rsync --sparse, bdsync, compresión (gzip/zstd), planificación fuera de horas pico

---

## Gobernanza y soberanía
- Respeto de los principios CARE (beneficio colectivo, autoridad, responsabilidad, ética)
- Gestión de metadatos culturales (anonimización, restricciones de acceso, protocolos)
- Cumplimiento FPIC (consentimiento, seudonimización, control comunitario)

---

## Herramientas open source recomendadas
- FFmpeg, SoX, jdupes, NeMo Curator, openSMILE, librosa, Luigi, Prefect, Airflow, webrtcvad, auditok, pydub
- Almacenamiento: Garage, Backblaze B2, IPFS, BunnyCDN

---

## Ejemplos inspiradores
- Te Hiku Media (Maorí)
- FirstVoices (Columbia Británica)

---

## Próximas acciones
- [ ] Proporcionar una muestra de datos de audio/texto a DeepSeek para benchmark
- [ ] Validar las herramientas y la hoja de ruta con la comunidad
- [ ] Priorizar el desarrollo de un POC: módulo de compresión diferencial + conector Prefect↔Garage
- [ ] Colaborar en la documentación técnica multilingüe (español/francés/maya/italiano/coreano/chino/alemán)
- [ ] Organizar una reunión técnica DeepSeek/equipo/comunidad

---

*Documento basado en la respuesta del consultor IA (julio 2025) y la propuesta DeepSeek (julio 2025), a adaptar según los comentarios de la comunidad y los socios.*
