# 🎯 Guía de Uso Completo - Talk Kin

## 🚀 Inicio Rápido

### Opción 1: Script Automático (Recomendado)
```bash
# Windows PowerShell
./start-complete.ps1

# Linux/Mac
chmod +x start-complete.sh
./start-complete.sh
```

### Opción 2: Inicio Manual
```bash
# Terminal 1: Servidor API
node api-server-simple.js

# Terminal 2: Aplicación Expo
npx expo start --web
```

---

## 📱 Navegación en la Aplicación

### 🏠 Página de Inicio
**URL**: `http://localhost:8081`

**Funcionalidades disponibles**:
- **🗣️ Traductor** - Traducción con reconocimiento de voz
- **🎵 Voces Ancestrales** - Síntesis de voz de las lenguas
- **🚀 IA Avanzada** - Modelos neuronales y corpus
- **🎯 Funcionalidades Avanzadas** - Extensiones lingüísticas
- **⚡ Activación Global** - Gestión completa de las funcionalidades
- **⚙️ Ajustes** - Configuración y pruebas

---

## 🔧 Funcionalidades Principales

### 1. 🗣️ Traductor (TranslatorPage)
**Acceso**: Página de inicio → "Traductor"

**Funcionalidades**:
- ✅ **Traducción multidireccional**
  - Francés ↔ Maya Yucateco
  - Francés ↔ Quechua, Guaraní, Náhuatl, Aymara
  - Español/Inglés ↔ Lenguas indígenas

- ✅ **Reconocimiento de voz nativo** 🎤
  - Botón de micrófono en el área de texto
  - Detección automática del idioma
  - Traducción automática después del reconocimiento

- ✅ **Síntesis de voz** 🔊
  - Botón de altavoz para cada texto
  - Voces nativas para lenguas indígenas
  - Control de reproducción/pausa

**Uso**:
1. Seleccione los idiomas de origen y destino
2. Escriba el texto O haga clic en 🎤 para hablar
3. Haga clic en "Traducir"
4. Escuche con 🔊

### 2. 🎵 Voces Ancestrales (VoicesPage)
**Acceso**: Página de inicio → "Voces Ancestrales"

**Funcionalidades**:
- ✅ **Galería de frases auténticas**
- ✅ **Síntesis de voz de alta calidad**
- ✅ **Frases por categoría** (saludos, familia, naturaleza)
- ✅ **Aprendizaje fonético**

### 3. 🚀 IA Avanzada (AIFeaturesPage)
**Acceso**: Página de inicio → "IA Avanzada"

**Funcionalidades Prioridad 2**:
- ✅ **Entrenamiento de modelos Maya personalizados**
- ✅ **Búsqueda vectorial FAISS ultrarrápida**
- ✅ **Corpus de audio avanzado**
- ✅ **TTS neuronales nativos**
- ✅ **Orquestador de IA centralizado**
- ✅ **CI/CD automático para modelos**

### 4. 🎯 Funcionalidades Avanzadas (Priority3Page)
**Acceso**: Página de inicio → "Funcionalidades Avanzadas"

**Funcionalidades Prioridad 3**:
- ✅ **Extensiones Náhuatl** (6 variantes)
- ✅ **Extensiones Aymara** (3 variantes)
- ✅ **Búsqueda semántica interlingüística**
- ✅ **Corpus de audio comunitario**
- ✅ **Modelos de IA personalizados**
- ✅ **Despliegue en Kubernetes**
- ✅ **Analíticas avanzadas**

### 5. ⚡ Activación Global (GlobalActivationPage) - ¡NUEVO!
**Acceso**: Página de inicio → "Activación Global"

**Funcionalidades**:
- ✅ **Vista general de todas las funcionalidades**
- ✅ **Activación por categoría** (Núcleo/Avanzado/Experimental)
- ✅ **Progreso en tiempo real**
- ✅ **Estado de salud de cada servicio**
- ✅ **Activación global con un solo clic**

**Uso**:
1. Consulte el panel de control de funcionalidades
2. Active individualmente o globalmente
3. Supervise los indicadores de salud
4. Pruebe cada funcionalidad activada

---

## 🔬 Pruebas y Validación

### Prueba Automática Completa
```bash
node test-activation-complete.js
```

**Resultados esperados**:
- ✅ Importación de servicios
- ✅ Endpoints de API funcionales
- ✅ Servicio de activación operativo
- ✅ Reconocimiento de voz disponible

### Pruebas Manuales Recomendadas

#### 1. Prueba de Traducción
1. Ir a Traductor
2. Ingresar "hola" (ES → Maya)
3. Verificar el resultado: "ba'ax ka wa'alik"
4. Probar la síntesis de voz

#### 2. Prueba de Reconocimiento de Voz
1. Ir a Traductor
2. Hacer clic en 🎤
3. Decir "hola" claramente
4. Verificar la transcripción automática
5. Verificar la traducción automática

#### 3. Prueba de Funcionalidades Avanzadas
1. Ir a Activación Global
2. Verificar que todas las funcionalidades estén activas
3. Probar la activación/desactivación
4. Consultar las métricas de salud

---

## 🌐 Endpoints de API

### Traducción
```bash
POST http://localhost:3000/api/translate
{
  "text": "hola",
  "from": "es",
  "to": "yua"
}
```

### Activación Global
```bash
# Estado de todas las funcionalidades
GET http://localhost:3000/api/activation/status

# Activación global
POST http://localhost:3000/api/activation/global
{
  "action": "activate_all"
}

# Activación de una funcionalidad
POST http://localhost:3000/api/activation/feature
{
  "featureName": "speech-recognition",
  "action": "activate"
}
```

### Extensiones Lingüísticas
```bash
POST http://localhost:3000/api/languages/extend
{
  "language": "nahuatl",
  "variants": ["nhn", "azz", "npl"],
  "features": ["diccionario", "fonetica"]
}
```

---

## 🎯 Idiomas Soportados

### Idiomas Modernos (Completos)
- 🇫🇷 **Français** - Soporte completo
- 🇪🇸 **Español** - Soporte completo  
- 🇺🇸 **English** - Soporte completo

### Lenguas Indígenas (Activas)
- 🇲🇽 **Maya Yucateco** (yua) - Diccionario rico
- 🇵🇪 **Quechua** (qu) - Soporte extendido
- 🇵🇾 **Guaraní** (gn) - Soporte básico
- 🇲🇽 **Náhuatl** (nah) - 6 variantes activadas
- 🇧🇴 **Aymara** (ay) - 3 variantes activadas

---

## 🔧 Solución de Problemas

### Problemas Comunes

#### ❌ "Servidor API no accesible"
**Solución**:
```bash
# Verificar si el puerto 3000 está libre
netstat -an | grep 3000

# Reiniciar el servidor
node api-server-simple.js
```

#### ❌ "Reconocimiento de voz no disponible"
**Solución**:
- Usar Chrome/Edge (Safari y Firefox limitan la Web Speech API)
- Permitir el acceso al micrófono
- Probar en HTTPS si es posible

#### ❌ "Funcionalidad no activada"
**Solución**:
1. Ir a Activación Global
2. Verificar el estado de la funcionalidad
3. Hacer clic en "Activar Todas las Funcionalidades"
4. Esperar a que finalice la activación

### Logs de Depuración
```bash
# Consola del navegador (F12)
# Buscar los mensajes:
# ✅ Servicios inicializados
# 🎤 Reconocimiento iniciado
# 🔊 Síntesis de voz lista
```

---

## 🎉 ¡Felicidades!

Ahora tienes acceso a **Talk Kin**, la aplicación completa para la preservación de las lenguas indígenas con:

- ✨ **12 funcionalidades premium** activadas
- 🎤 **Reconocimiento de voz nativo**
- 🗣️ **Síntesis de voz auténtica**
- 🌍 **Traducción multi-idioma**
- 🚀 **Inteligencia artificial avanzada**
- 👥 **Funcionalidades colaborativas**

**¡La aplicación está lista para las comunidades indígenas de todo el mundo!**

---

*Guía actualizada el 24 de junio de 2025 - Talk Kin v3.0 Advanced Edition*
