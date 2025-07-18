def role_required(required_roles):
    def decorator(fn):
        @jwt_required()
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            user_roles = claims.get('roles', [])
            if any(role in user_roles for role in required_roles):
                return fn(*args, **kwargs)
            return jsonify({"msg": "Accès refusé : rôle requis"}), 403
        wrapper.__name__ = fn.__name__
        return wrapper
    return decorator


from flask import Flask, request, jsonify, g, url_for
from flask_swagger_ui import get_swaggerui_blueprint
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
import os
import inspect

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'dev_secret_key')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///genseqdid.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
jwt = JWTManager(app)
bcrypt = Bcrypt(app)
db = SQLAlchemy(app)

# --- Génération dynamique OpenAPI ---
def generate_openapi_spec():
    paths = {}
    for rule in app.url_map.iter_rules():
        if rule.endpoint == 'static':
            continue
        methods = [m for m in rule.methods if m in ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']]
        if not methods:
            continue
        doc = app.view_functions[rule.endpoint].__doc__ or ''
        path = str(rule)
        if path not in paths:
            paths[path] = {}
        for method in methods:
            # Ajout d'un tag basé sur le préfixe du chemin
            tag = path.split('/')[2] if len(path.split('/')) > 2 else 'default'
            paths[path][method.lower()] = {
                "tags": [tag],
                "summary": doc.strip().split('\n')[0] if doc else rule.endpoint,
                "description": doc,
                "responses": {"200": {"description": "Success"}}
            }
    return {
        "openapi": "3.0.0",
        "info": {
            "title": "API Genseqdid",
            "version": "1.0.0"
        },
        "paths": paths
    }

# Endpoint pour fournir le schéma OpenAPI dynamique
@app.route('/openapi.json')
def openapi_spec():
    return jsonify(generate_openapi_spec())



# Swagger UI dynamique (forcé sur /openapi.json, suppression de toute référence à /static/swagger.json)
SWAGGER_URL = '/docs'
API_URL = '/openapi.json'
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "API Genseqdid dynamique (source: /openapi.json)",
        'url': API_URL,
        'docExpansion': 'list',
        'defaultModelsExpandDepth': -1
    }
)
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

# Message d'aide sur la page d'accueil Swagger
@app.route('/docs/help')
def swagger_help():
    return '''<h2>Swagger UI utilise <code>/openapi.json</code> comme source.<br>
Si vous voyez encore l'ancien schéma, videz le cache du navigateur (Ctrl+F5) ou ouvrez dans une fenêtre privée.<br>
Si le problème persiste, vérifiez que Swagger UI ne pointe plus sur <code>/static/swagger.json</code>.</h2>''', 200, {'Content-Type': 'text/html'}

# Endpoint de test pour vérifier la génération dynamique
@app.route('/api/test-dynamic-doc', methods=['GET'])
def test_dynamic_doc():
    """Test endpoint pour vérifier la doc dynamique"""
    return jsonify({"message": "Doc dynamique OK"})

# Endpoint admin : injecter des exemples multilingues (maya, fr, en, es, it)
@app.route('/api/admin/generate-multilang-examples', methods=['POST'])
@role_required(['admin'])
def generate_multilang_examples():
    global sequences, next_sequence_id, internet_resources
    exemples = [
        # Maya
        {"titulo": "U yookotil k'iimil", "modalidad": "en ligne", "niveau": "A1", "theme": "salutations", "langue": "maya", "dialecte": "yucatèque", "contexte_culturel": "communautaire", "support_audio": None, "support_video": None},
        # Français
        {"titulo": "Séquence de présentation", "modalidad": "présentiel", "niveau": "A2", "theme": "présentation", "langue": "fr", "dialecte": "", "contexte_culturel": "scolaire", "support_audio": None, "support_video": None},
        # Anglais
        {"titulo": "Greetings sequence", "modalidad": "online", "niveau": "B1", "theme": "greetings", "langue": "en", "dialecte": "", "contexte_culturel": "international", "support_audio": None, "support_video": None},
        # Espagnol
        {"titulo": "Secuencia de saludos", "modalidad": "presencial", "niveau": "A1", "theme": "saludos", "langue": "es", "dialecte": "", "contexte_culturel": "escolar", "support_audio": None, "support_video": None},
        # Italien
        {"titulo": "Sequenza di saluti", "modalidad": "presenziale", "niveau": "A2", "theme": "saluti", "langue": "it", "dialecte": "", "contexte_culturel": "scolastico", "support_audio": None, "support_video": None}
    ]
    for ex in exemples:
        ex["id"] = next_sequence_id
        sequences.append(ex)
        next_sequence_id += 1
    # Exemples ressources
    res_ex = [
        {"id": str(len(internet_resources) + 1), "title": "Audio maya", "description": "Enregistrement natif maya", "url": "http://example.com/maya-audio", "date": "2025-07-16", "content": "Audio maya", "type": "audio", "theme": "salutations", "niveau": "A1", "langue": "maya", "dialecte": "yucatèque", "contexte_culturel": "communautaire", "support_audio": "http://example.com/maya-audio.mp3", "support_video": None},
        {"id": str(len(internet_resources) + 2), "title": "Vidéo présentation FR", "description": "Vidéo de présentation en français", "url": "http://example.com/fr-video", "date": "2025-07-16", "content": "Vidéo FR", "type": "video", "theme": "présentation", "niveau": "A2", "langue": "fr", "dialecte": "", "contexte_culturel": "scolaire", "support_audio": None, "support_video": "http://example.com/fr-video.mp4"}
    ]
    internet_resources.extend(res_ex)
    return jsonify({"message": "Exemples multilingues injectés."})
# --- Support multilingue API ---
from flask import g

LANGUAGES = ['fr', 'es', 'en', 'it', 'maya']
TRANSLATIONS = {
    'fr': {
        'not_found': "Non trouvé",
        'bad_request': "Requête invalide",
        'unauthorized': "Non autorisé",
        'forbidden': "Accès refusé",
        'created': "Créé avec succès",
        'updated': "Mis à jour avec succès",
        'deleted': "Supprimé avec succès",
        'sequence_not_found': "Séquence non trouvée",
        'resource_not_found': "Ressource non trouvée",
        'document_not_found': "Document non trouvé"
    },
    'es': {
        'not_found': "No encontrado",
        'bad_request': "Solicitud inválida",
        'unauthorized': "No autorizado",
        'forbidden': "Acceso denegado",
        'created': "Creado exitosamente",
        'updated': "Actualizado exitosamente",
        'deleted': "Eliminado exitosamente",
        'sequence_not_found': "Secuencia no encontrada",
        'resource_not_found': "Recurso no encontrado",
        'document_not_found': "Documento no encontrado"
    },
    'en': {
        'not_found': "Not found",
        'bad_request': "Bad request",
        'unauthorized': "Unauthorized",
        'forbidden': "Access denied",
        'created': "Created successfully",
        'updated': "Updated successfully",
        'deleted': "Deleted successfully",
        'sequence_not_found': "Sequence not found",
        'resource_not_found': "Resource not found",
        'document_not_found': "Document not found"
    },
    'it': {
        'not_found': "Non trovato",
        'bad_request': "Richiesta non valida",
        'unauthorized': "Non autorizzato",
        'forbidden': "Accesso negato",
        'created': "Creato con successo",
        'updated': "Aggiornato con successo",
        'deleted': "Eliminato con successo",
        'sequence_not_found': "Sequenza non trovata",
        'resource_not_found': "Risorsa non trovata",
        'document_not_found': "Documento non trovato"
    },
    'maya': {
        'not_found': "Ma' uts",
        'bad_request': "Ma' uts k'áat",
        'unauthorized': "Ma' utsilil",
        'forbidden': "Ma' utsilil k'áat",
        'created': "Tuméen u ts'áaj",
        'updated': "Tuméen u k'áat",
        'deleted': "Tuméen u páaj",
        'sequence_not_found': "Ma' utsilil séquence",
        'resource_not_found': "Ma' utsilil recurso",
        'document_not_found': "Ma' utsilil documento"
    }
}

def get_lang():
    lang = request.args.get('lang') or request.headers.get('Accept-Language', 'fr').split(',')[0]
    if lang not in LANGUAGES:
        lang = 'fr'
    g.lang = lang
    return lang

def t(key):
    lang = getattr(g, 'lang', 'fr')
    return TRANSLATIONS.get(lang, TRANSLATIONS['fr']).get(key, key)

# Middleware pour définir la langue courante
@app.before_request
def set_language():
    get_lang()
# Audit/logging avancé (historique, traçabilité, sécurité, mock)
audit_log = []

@app.before_request

def log_request():
    from datetime import datetime
    user = 'public'
    try:
        # N'essaie de lire le JWT que si ce n'est pas un endpoint public
        if request.endpoint not in ['status', 'api_version', 'openapi_spec', 'list_endpoints', 'demo_token', 'static', 'swaggerui.blueprint', 'swaggerui.static']:
            from flask_jwt_extended import verify_jwt_in_request, get_jwt
            verify_jwt_in_request(optional=True)
            claims = get_jwt()
            user = claims.get('username', 'anonyme') if claims else 'public'
    except Exception:
        user = 'public'
    audit_log.append({
        "time": datetime.utcnow().isoformat(),
        "endpoint": request.path,
        "method": request.method,
        "user": user
    })

@app.route('/api/admin/audit-log', methods=['GET'])
@role_required(['admin'])
def get_audit_log():
    return jsonify(audit_log[-100:])  # Derniers 100 événements
# Sessions de travail collaboratives (multi-utilisateurs, chat, mock)
sessions = {}

@app.route('/api/session', methods=['POST'])
@jwt_required()
def create_session():
    data = request.get_json() or {}
    session_id = str(len(sessions) + 1)
    sessions[session_id] = {"users": [get_jwt().get('username', 'anonyme')], "messages": []}
    return jsonify({"session_id": session_id})

@app.route('/api/session/<session_id>/join', methods=['POST'])
@jwt_required()
def join_session(session_id):
    user = get_jwt().get('username', 'anonyme')
    if session_id in sessions:
        if user not in sessions[session_id]["users"]:
            sessions[session_id]["users"].append(user)
        return jsonify({"session_id": session_id, "users": sessions[session_id]["users"]})
    return jsonify({"error": "Session inconnue."}), 404

@app.route('/api/session/<session_id>/message', methods=['POST'])
@jwt_required()
def send_message(session_id):
    user = get_jwt().get('username', 'anonyme')
    msg = request.get_json().get('message')
    if session_id in sessions:
        sessions[session_id]["messages"].append({"user": user, "message": msg})
        return jsonify({"session_id": session_id, "messages": sessions[session_id]["messages"]})
    return jsonify({"error": "Session inconnue."}), 404

@app.route('/api/session/<session_id>', methods=['GET'])
@jwt_required()
def get_session(session_id):
    if session_id in sessions:
        return jsonify(sessions[session_id])
    return jsonify({"error": "Session inconnue."}), 404
# API webhook (notifications externes, intégration LMS, mock)
@app.route('/api/webhook', methods=['POST'])
def webhook():
    event = request.get_json().get('event', 'unknown')
    # Mock : log l'événement
    print(f"Webhook reçu : {event}")
    return jsonify({"message": f"Webhook '{event}' reçu."})
# Gestion collaborative avancée (édition, validation, workflow, mock)
collab_status = {}

@app.route('/api/sequences/<int:id>/validate', methods=['POST'])
@role_required(['admin', 'enseignant'])
def validate_sequence(id):
    collab_status[id] = 'validée'
    return jsonify({"id": id, "status": "validée"})

@app.route('/api/sequences/<int:id>/edit', methods=['POST'])
@role_required(['admin', 'enseignant'])
def edit_sequence(id):
    collab_status[id] = 'en édition'
    return jsonify({"id": id, "status": "en édition"})

@app.route('/api/sequences/<int:id>/workflow', methods=['GET'])
@jwt_required()
def get_sequence_workflow(id):
    status = collab_status.get(id, 'brouillon')
    return jsonify({"id": id, "workflow_status": status})
# Génération de synthèses/export PDF multi-séquences (mock)
@app.route('/api/export-pdf', methods=['POST'])
@jwt_required()
def export_pdf():
    ids = request.get_json().get('ids', [])
    selected = [seq for seq in sequences if seq.get('id') in ids]
    # Mock : retourne une synthèse texte
    content = '\n\n'.join([f"Séquence {seq.get('id')}: {seq.get('titulo')} ({seq.get('modalidad')})" for seq in selected])
    return content, 200, {'Content-Type': 'text/plain'}
# Analyse de corpus (statistiques linguistiques avancées, mock)
@app.route('/api/corpus-analysis', methods=['GET'])
@jwt_required()
def corpus_analysis():
    from collections import Counter
    # Concatène tous les contenus
    texts = []
    for seq in sequences:
        if 'description' in seq:
            texts.append(seq['description'])
    for res in internet_resources:
        if 'content' in res:
            texts.append(res['content'])
    words = ' '.join(texts).lower().split()
    word_counts = Counter(words)
    most_common = word_counts.most_common(10)
    return jsonify({
        "total_words": len(words),
        "unique_words": len(word_counts),
        "most_common": most_common
    })
# Génération de plans de progression personnalisés selon le profil utilisateur (mock)
@app.route('/api/progression-plan', methods=['GET'])
@jwt_required()
def progression_plan():
    claims = get_jwt()
    username = claims.get('username', 'anonyme')
    # Mock : plan simple basé sur le nombre de séquences
    plan = {
        "user": username,
        "objectifs": [
            "Découvrir la grammaire maya",
            "Pratiquer l'oral",
            "Lire un texte authentique",
            "Créer une séquence didactique"
        ],
        "prochaines_etapes": [
            f"Compléter {min(3, len(sequences))} séquences recommandées",
            "Participer à une activité collaborative"
        ]
    }
    return jsonify(plan)
# Recherche sémantique (plein texte, fuzzy, IA mock)
@app.route('/api/semantic-search', methods=['POST'])
@jwt_required()
def semantic_search():
    data = request.get_json() or {}
    query = data.get('query', '').lower()
    results = []
    # Recherche fuzzy sur séquences
    for seq in sequences:
        if query in str(seq).lower():
            results.append({"type": "sequence", "item": seq})
    # Recherche fuzzy sur ressources
    for res in internet_resources:
        if query in str(res).lower():
            results.append({"type": "resource", "item": res})
    return jsonify(results)
# Génération de feedback automatique sur une séquence ou ressource (mock)
@app.route('/api/sequences/<int:id>/feedback', methods=['GET'])
@jwt_required()
def sequence_feedback(id):
    for seq in sequences:
        if seq.get('id') == id:
            feedback = f"Séquence '{seq.get('titulo')}' : niveau {seq.get('niveau', 'inconnu')}, thème {seq.get('theme', 'inconnu')}. Bonne structuration."
            return jsonify({"feedback": feedback})
    return jsonify({"message": "Secuencia no encontrada"}), 404

@app.route('/api/internet/resources/<string:id>/feedback', methods=['GET'])
@jwt_required()
def resource_feedback(id):
    for res in internet_resources:
        if res.get('id') == id:
            feedback = f"Ressource '{res.get('title')}' : type {res.get('type', 'inconnu')}, thème {res.get('theme', 'inconnu')}. Utile pour l'apprentissage."
            return jsonify({"feedback": feedback})
    return jsonify({"message": "Resource not found"}), 404
# Génération de quiz/activités à partir d’un texte libre (mock)
@app.route('/api/quiz-from-text', methods=['POST'])
@jwt_required()
def quiz_from_text():
    data = request.get_json() or {}
    text = data.get('text', '')
    if not text:
        return jsonify({"error": "Texte requis."}), 400
    # Mock : génère 3 questions sur le texte
    quiz = {
        "questions": [
            {"q": f"Quel est le thème principal du texte ?", "type": "ouverte"},
            {"q": f"Combien de mots contient le texte ?", "type": "ouverte", "answer": len(text.split())},
            {"q": f"Citez un mot du texte de plus de 6 lettres.", "type": "ouverte"}
        ]
    }
    return jsonify(quiz)
# Extraction automatique de mots-clés/thèmes d’un texte (mock)
@app.route('/api/keywords', methods=['POST'])
@jwt_required()
def extract_keywords():
    data = request.get_json() or {}
    text = data.get('text', '')
    if not text:
        return jsonify({"error": "Texte requis."}), 400
    # Mock : mots de plus de 6 lettres, uniques
    words = set(w for w in text.split() if len(w) > 6)
    return jsonify({"keywords": list(words)})
# Analyse de similarité entre séquences ou ressources (mock)
@app.route('/api/similarity', methods=['POST'])
@jwt_required()
def similarity():
    data = request.get_json() or {}
    text1 = data.get('text1', '')
    text2 = data.get('text2', '')
    if not text1 or not text2:
        return jsonify({"error": "Deux textes requis."}), 400
    # Mock : similarité = proportion de mots communs
    set1 = set(text1.lower().split())
    set2 = set(text2.lower().split())
    if not set1 or not set2:
        score = 0.0
    else:
        score = len(set1 & set2) / len(set1 | set2)
    return jsonify({"similarity": round(score, 3)})
# Traduction automatique (français ↔ espagnol ↔ maya, mock)
@app.route('/api/translate', methods=['POST'])
@jwt_required()
def translate():
    data = request.get_json() or {}
    text = data.get('text', '')
    source = data.get('source', 'fr')
    target = data.get('target', 'es')
    if not text:
        return jsonify({"error": "Texte à traduire requis."}), 400
    # Simulation de traduction
    translation = f"[{source}->{target}] {text[::-1]}"
    return jsonify({"translation": translation})
# Résumé automatique de documents ou ressources (NLP, mock)
@app.route('/api/library/documents/<string:id>/summary', methods=['GET'])
@jwt_required()
def summarize_document(id):
    for doc in library_documents:
        if doc['id'] == id:
            content = doc.get('content', '')
            summary = content[:100] + ('...' if len(content) > 100 else '')
            return jsonify({"summary": summary})
    return jsonify({"message": "Document not found"}), 404

@app.route('/api/internet/resources/<string:id>/summary', methods=['GET'])
@jwt_required()
def summarize_resource(id):
    for res in internet_resources:
        if res['id'] == id:
            content = res.get('content', '')
            summary = content[:100] + ('...' if len(content) > 100 else '')
            return jsonify({"summary": summary})
    return jsonify({"message": "Resource not found"}), 404
# Génération automatique de séquences/ressources à partir d'un prompt IA (mock)
@app.route('/api/admin/generate-from-prompt', methods=['POST'])
@role_required(['admin'])
def generate_from_prompt():
    global sequences, next_sequence_id, internet_resources
    data = request.get_json() or {}
    prompt = data.get('prompt', '').strip()
    if not prompt:
        return jsonify({"error": "Prompt requis."}), 400
    # Simulation IA : génère une séquence et une ressource à partir du prompt
    seq = {
        "id": next_sequence_id,
        "titulo": f"Séquence IA : {prompt[:30]}",
        "modalidad": "en ligne",
        "niveau": "A2",
        "theme": "auto-ia",
        "description": f"Généré à partir du prompt : {prompt}",
        "dialecte": "yucatèque",
        "contexte_culturel": "scolaire",
        "support_audio": None,
        "support_video": None
    }
    sequences.append(seq)
    next_sequence_id += 1
    res = {
        "id": str(len(internet_resources) + 1),
        "title": f"Ressource IA : {prompt[:30]}",
        "description": f"Ressource générée à partir du prompt : {prompt}",
        "url": f"http://example.com/ia-resource-{len(internet_resources) + 1}",
        "date": "2025-07-16",
        "content": f"Contenu IA pour : {prompt}",
        "type": "ia",
        "theme": "auto-ia",
        "niveau": "A2",
        "dialecte": "yucatèque",
        "contexte_culturel": "communautaire",
        "support_audio": None,
        "support_video": None
    }
    internet_resources.append(res)
    return jsonify({"sequence": seq, "resource": res})
# Statistiques sur la langue maya (simulation sur les séquences)
@app.route('/api/stats', methods=['GET'])
@jwt_required()
def get_stats():
    from collections import Counter
    niveaux = [seq.get('niveau') for seq in sequences if 'niveau' in seq]
    themes = [seq.get('theme') for seq in sequences if 'theme' in seq]
    modalites = [seq.get('modalidad') for seq in sequences if 'modalidad' in seq]
    return jsonify({
        "niveaux": dict(Counter(niveaux)),
        "themes": dict(Counter(themes)),
        "modalites": dict(Counter(modalites)),
        "total_sequences": len(sequences)
    })
# Génération de plans de cours à partir de séquences sélectionnées
@app.route('/api/lesson-plan', methods=['POST'])
@jwt_required()
def generate_lesson_plan():
    ids = request.get_json().get('ids', [])
    selected = [seq for seq in sequences if seq.get('id') in ids]
    plan = {
        "titre": "Plan de cours généré",
        "sequences": selected,
        "objectifs": [f"Maîtriser le thème {seq.get('theme', 'inconnu')} (niveau {seq.get('niveau', 'inconnu')})" for seq in selected],
        "modalites": list(set(seq.get('modalidad') for seq in selected))
    }
    return jsonify(plan)
# Génération de quiz/activités à partir d’une séquence (simulation)
@app.route('/api/sequences/<int:id>/quiz', methods=['GET'])
@jwt_required()
def generate_quiz(id):
    for seq in sequences:
        if seq.get('id') == id:
            quiz = {
                "sequence_id": id,
                "questions": [
                    {"q": f"Expliquez le thème de la séquence '{seq.get('theme', 'inconnu')}'.", "type": "ouverte"},
                    {"q": f"Quel est le niveau de cette séquence ?", "type": "choix", "options": ["A1", "A2", "B1", "B2"]},
                    {"q": f"La modalité est-elle présentielle ou en ligne ?", "type": "choix", "options": ["présentiel", "en ligne"]}
                ]
            }
            return jsonify(quiz)
    return jsonify({"message": "Secuencia no encontrada"}), 404
# Endpoint admin : import de séquences/ressources au format CSV
@app.route('/api/admin/import-csv', methods=['POST'])
@role_required(['admin'])
def import_csv():
    global sequences, internet_resources, next_sequence_id
    what = request.args.get('what', 'sequences')
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "Aucun fichier fourni."}), 400
    import csv
    import io
    reader = csv.DictReader(io.StringIO(file.read().decode('utf-8')))
    items = list(reader)
    if what == 'sequences':
        for item in items:
            item['id'] = int(item.get('id', next_sequence_id))
        sequences.extend(items)
        if items:
            next_sequence_id = max(int(item['id']) for item in sequences) + 1
        return jsonify({"message": f"{len(items)} séquences importées."})
    elif what == 'resources':
        for item in items:
            item['id'] = str(item.get('id', len(internet_resources) + 1))
        internet_resources.extend(items)
        return jsonify({"message": f"{len(items)} ressources importées."})
    else:
        return jsonify({"error": "Paramètre 'what' inconnu."}), 400
# Recherche avancée sur les séquences (filtres multiples, recherche plein texte)
@app.route('/api/sequences/advanced-search', methods=['GET'])
@jwt_required()
def advanced_search_sequences():
    query = request.args.get('query', '').lower()
    niveau = request.args.get('niveau')
    theme = request.args.get('theme')
    modalidad = request.args.get('modalidad')
    results = []
    for seq in sequences:
        if query and query not in str(seq).lower():
            continue
        if niveau and seq.get('niveau') != niveau:
            continue
        if theme and seq.get('theme') != theme:
            continue
        if modalidad and seq.get('modalidad') != modalidad:
            continue
        results.append(seq)
    return jsonify(results)
# Notifications simulées par utilisateur (en mémoire)
user_notifications = {}

@app.route('/api/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    user = get_jwt().get('username', 'anonyme')
    notes = user_notifications.get(user, [])
    return jsonify(notes)

@app.route('/api/notifications', methods=['POST'])
@jwt_required()
def add_notification():
    user = get_jwt().get('username', 'anonyme')
    notif = request.get_json().get('notification')
    if notif:
        user_notifications.setdefault(user, []).append(notif)
    return jsonify(user_notifications.get(user, []))
# Partage de séquences/ressources entre utilisateurs (simulation)
shared_items = {}

@app.route('/api/sequences/<int:id>/share', methods=['POST'])
@jwt_required()
def share_sequence(id):
    data = request.get_json() or {}
    to_user = data.get('to_user')
    if not to_user:
        return jsonify({"error": "Champ 'to_user' requis."}), 400
    shared_items.setdefault(to_user, {'sequences': set(), 'resources': set()})
    shared_items[to_user]['sequences'].add(id)
    return jsonify({"message": f"Séquence {id} partagée avec {to_user}."})

@app.route('/api/internet/resources/<string:id>/share', methods=['POST'])
@jwt_required()
def share_resource(id):
    data = request.get_json() or {}
    to_user = data.get('to_user')
    if not to_user:
        return jsonify({"error": "Champ 'to_user' requis."}), 400
    shared_items.setdefault(to_user, {'sequences': set(), 'resources': set()})
    shared_items[to_user]['resources'].add(id)
    return jsonify({"message": f"Ressource {id} partagée avec {to_user}."})

@app.route('/api/shared', methods=['GET'])
@jwt_required()
def get_shared():
    user = get_jwt().get('username', 'anonyme')
    shared = shared_items.get(user, {'sequences': set(), 'resources': set()})
    return jsonify({
        "sequences": list(shared['sequences']),
        "resources": list(shared['resources'])
    })
# Favoris/bookmarks personnels (stockés en mémoire par utilisateur)
user_favorites = {}

@app.route('/api/sequences/<int:id>/favorite', methods=['POST'])
@jwt_required()
def favorite_sequence(id):
    user = get_jwt().get('username', 'anonyme')
    user_favorites.setdefault(user, {'sequences': set(), 'resources': set()})
    user_favorites[user]['sequences'].add(id)
    return jsonify({"favorites": list(user_favorites[user]['sequences'])})

@app.route('/api/internet/resources/<string:id>/favorite', methods=['POST'])
@jwt_required()
def favorite_resource(id):
    user = get_jwt().get('username', 'anonyme')
    user_favorites.setdefault(user, {'sequences': set(), 'resources': set()})
    user_favorites[user]['resources'].add(id)
    return jsonify({"favorites": list(user_favorites[user]['resources'])})

@app.route('/api/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    user = get_jwt().get('username', 'anonyme')
    favs = user_favorites.get(user, {'sequences': set(), 'resources': set()})
    return jsonify({
        "sequences": list(favs['sequences']),
        "resources": list(favs['resources'])
    })
# Endpoint : commentaires/notes sur séquences et ressources
@app.route('/api/sequences/<int:id>/comments', methods=['POST'])
@jwt_required()
def add_sequence_comment(id):
    comment = request.get_json().get('comment')
    user = get_jwt().get('username', 'anonyme')
    for seq in sequences:
        if seq.get('id') == id:
            if 'comments' not in seq:
                seq['comments'] = []
            if comment:
                seq['comments'].append({"user": user, "comment": comment})
            return jsonify(seq)
    return jsonify({"message": "Secuencia no encontrada"}), 404

@app.route('/api/internet/resources/<string:id>/comments', methods=['POST'])
@jwt_required()
def add_resource_comment(id):
    comment = request.get_json().get('comment')
    user = get_jwt().get('username', 'anonyme')
    for res in internet_resources:
        if res.get('id') == id:
            if 'comments' not in res:
                res['comments'] = []
            if comment:
                res['comments'].append({"user": user, "comment": comment})
            return jsonify(res)
    return jsonify({"message": "Resource not found"}), 404
# Endpoint : annotation/catégorisation collaborative (tags sur séquences et ressources)
@app.route('/api/sequences/<int:id>/tags', methods=['POST'])
@jwt_required()
def add_sequence_tag(id):
    tag = request.get_json().get('tag')
    for seq in sequences:
        if seq.get('id') == id:
            if 'tags' not in seq:
                seq['tags'] = []
            if tag and tag not in seq['tags']:
                seq['tags'].append(tag)
            return jsonify(seq)
    return jsonify({"message": "Secuencia no encontrada"}), 404

@app.route('/api/internet/resources/<string:id>/tags', methods=['POST'])
@jwt_required()
def add_resource_tag(id):
    tag = request.get_json().get('tag')
    for res in internet_resources:
        if res.get('id') == id:
            if 'tags' not in res:
                res['tags'] = []
            if tag and tag not in res['tags']:
                res['tags'].append(tag)
            return jsonify(res)
    return jsonify({"message": "Resource not found"}), 404
# Endpoint admin : rapport d'activité simple
@app.route('/api/admin/activity-report', methods=['GET'])
@role_required(['admin'])
def activity_report():
    user_count = User.query.count()
    return jsonify({
        "nb_sequences": len(sequences),
        "nb_library_documents": len(library_documents),
        "nb_internet_resources": len(internet_resources),
        "nb_users": user_count
    })
# Endpoint admin : exporter séquences/ressources au format CSV
import io, csv
@app.route('/api/admin/export-csv', methods=['GET'])
@role_required(['admin'])
def export_csv():
    what = request.args.get('what', 'sequences')
    si = io.StringIO()
    if what == 'sequences':
        if not sequences:
            return ('', 204)
        writer = csv.DictWriter(si, fieldnames=sorted(sequences[0].keys()))
        writer.writeheader()
        writer.writerows(sequences)
        output = si.getvalue()
        return output, 200, {'Content-Type': 'text/csv'}
    elif what == 'resources':
        if not internet_resources:
            return ('', 204)
        writer = csv.DictWriter(si, fieldnames=sorted(internet_resources[0].keys()))
        writer.writeheader()
        writer.writerows(internet_resources)
        output = si.getvalue()
        return output, 200, {'Content-Type': 'text/csv'}
    else:
        return jsonify({"error": "Paramètre 'what' inconnu."}), 400
# Endpoint : suggestions de séquences ou ressources selon le profil utilisateur
@app.route('/api/suggestions', methods=['GET'])
@jwt_required()
def get_suggestions():
    import random
    claims = get_jwt()
    role = claims.get('roles', ['demo'])[0]
    # Pour l'exemple, suggestions aléatoires selon le rôle
    if role == 'enseignant':
        suggestions = random.sample(sequences, min(3, len(sequences))) if sequences else []
    elif role == 'chercheur':
        suggestions = random.sample(library_documents, min(3, len(library_documents))) if library_documents else []
    else:
        suggestions = random.sample(internet_resources, min(3, len(internet_resources))) if internet_resources else []
    return jsonify(suggestions)
# Endpoint admin : génération automatique de ressources pédagogiques
@app.route('/api/admin/generate-resources', methods=['POST'])
@role_required(['admin'])
def generate_resources():
    global internet_resources
    data = request.get_json() or {}
    types = data.get('types', ['document', 'podcast', 'lien'])
    themes = data.get('themes', ['grammaire', 'culture', 'oral', 'écrit'])
    niveaux = data.get('niveaux', ['A1', 'A2', 'B1', 'B2'])
    count = int(data.get('count', 8))
    import random
    for i in range(count):
        res = {
            "id": str(len(internet_resources) + 1),
            "title": f"{random.choice(types).capitalize()} {random.choice(themes)} {random.choice(niveaux)}",
            "description": f"Ressource pédagogique sur {random.choice(themes)} pour le niveau {random.choice(niveaux)}.",
            "url": f"http://example.com/auto-resource-{len(internet_resources) + 1}",
            "date": f"2023-07-{random.randint(10,28)}",
            "content": f"Contenu auto-généré pour {random.choice(themes)}.",
            "type": random.choice(types),
            "theme": random.choice(themes),
            "niveau": random.choice(niveaux)
        }
        internet_resources.append(res)
    return jsonify({"message": f"{count} ressources pédagogiques générées."})
# Endpoint admin : génération automatique de séquences didactiques personnalisées
@app.route('/api/admin/generate-custom-sequences', methods=['POST'])
@role_required(['admin'])
def generate_custom_sequences():
    global sequences, next_sequence_id
    data = request.get_json() or {}
    niveaux = data.get('niveaux', ['A1', 'A2', 'B1', 'B2'])
    themes = data.get('themes', ['salutations', 'famille', 'école', 'nature'])
    modalites = data.get('modalites', ['présentiel', 'en ligne'])
    count = int(data.get('count', 8))
    import random
    for _ in range(count):
        seq = {
            "id": next_sequence_id,
            "titulo": f"Séquence {random.choice(niveaux)} - {random.choice(themes)}",
            "modalidad": random.choice(modalites),
            "niveau": random.choice(niveaux),
            "theme": random.choice(themes)
        }
        sequences.append(seq)
        next_sequence_id += 1
    return jsonify({"message": f"{count} séquences personnalisées générées."})
# Endpoint public : métadonnées de l'API
@app.route('/api/meta', methods=['GET'])
def api_meta():
    return jsonify({
        "name": "API Séquences Didactiques Maya",
        "description": "API pour la gestion de séquences didactiques, ressources et utilisateurs pour la langue maya.",
        "contact": {
            "email": "support@mayavoicetranslator.org",
            "url": "https://mayavoicetranslator.org"
        },
        "documentation": "/docs",
        "version": "1.0.0"
    })
# Endpoint admin : générer automatiquement des séquences de test
@app.route('/api/admin/generate-sequences', methods=['POST'])
@role_required(['admin'])
def generate_sequences():
    global sequences, next_sequence_id
    count = int(request.args.get('count', 5))
    for i in range(count):
        seq = {
            "id": next_sequence_id,
            "titulo": f"Séquence auto {next_sequence_id}",
            "modalidad": "présentiel" if next_sequence_id % 2 == 0 else "en ligne"
        }
        sequences.append(seq)
        next_sequence_id += 1
    return jsonify({"message": f"{count} séquences générées."})

# Endpoint admin : générer automatiquement des utilisateurs de test
@app.route('/api/admin/generate-users', methods=['POST'])
@role_required(['admin'])
def generate_users():
    users_data = [
        {"username": f"testuser{i}", "password": f"test{i}pass", "roles": ["enseignant"]} for i in range(1, 6)
    ]
    created = 0
    for udata in users_data:
        if not User.query.filter_by(username=udata["username"]).first():
            user = User(username=udata["username"], password=bcrypt.generate_password_hash(udata["password"]).decode('utf-8'))
            for rname in udata["roles"]:
                role = Role.query.filter_by(name=rname).first()
                user.roles.append(role)
            db.session.add(user)
            created += 1
    db.session.commit()
    return jsonify({"message": f"{created} utilisateurs de test générés."})
# Endpoint admin : exporter toutes les données mock
@app.route('/api/admin/export-mocks', methods=['GET'])
@role_required(['admin'])
def export_mocks():
    return jsonify({
        "sequences": sequences,
        "library_documents": library_documents,
        "internet_resources": internet_resources
    })

# Endpoint admin : importer des données mock (remplace tout)
@app.route('/api/admin/import-mocks', methods=['POST'])
@role_required(['admin'])
def import_mocks():
    global sequences, next_sequence_id, library_documents, internet_resources
    data = request.get_json() or {}
    sequences = data.get("sequences", [])
    # recalculer next_sequence_id
    if sequences:
        next_sequence_id = max(seq.get("id", 0) for seq in sequences) + 1
    else:
        next_sequence_id = 1
    library_documents = data.get("library_documents", [])
    internet_resources = data.get("internet_resources", [])
    return jsonify({"message": "Mock data importés."})
# Variable globale pour le mode maintenance
maintenance_mode = False

# Endpoint admin : activer/désactiver le mode maintenance
@app.route('/api/admin/maintenance', methods=['POST'])
@role_required(['admin'])
def set_maintenance():
    global maintenance_mode
    data = request.get_json() or {}
    maintenance_mode = bool(data.get("enabled", False))
    return jsonify({"maintenance": maintenance_mode})

# Middleware : bloquer l'API en mode maintenance (sauf admin et endpoints publics)
@app.before_request
def check_maintenance():
    public_endpoints = [
        'status', 'api_version', 'openapi_spec', 'list_endpoints', 'demo_token', 'static',
        'swaggerui.blueprint', 'swaggerui.static'
    ]
    if maintenance_mode:
        # Autoriser admin
        try:
            claims = get_jwt()
            if 'admin' in claims.get('roles', []):
                return
        except Exception:
            pass
        # Autoriser endpoints publics
        if request.endpoint in public_endpoints:
            return
        return jsonify({"error": "API en maintenance"}), 503
# Endpoint public : génération d'un token JWT demo (lecture seule)
@app.route('/api/auth/demo-token', methods=['GET'])
def demo_token():
    access_token = create_access_token(identity="demo", additional_claims={"roles": ["demo"], "username": "demo"})
    return jsonify({"access_token": access_token})
# Endpoint public : liste des endpoints disponibles
@app.route('/api/endpoints', methods=['GET'])
def list_endpoints():
    output = []
    for rule in app.url_map.iter_rules():
        if rule.endpoint != 'static':
            output.append({
                "endpoint": rule.rule,
                "methods": list(rule.methods - {"HEAD", "OPTIONS"})
            })
    return jsonify(sorted(output, key=lambda x: x["endpoint"]))
# Endpoint public : healthcheck/status
@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({"status": "ok", "message": "API en ligne"})

# Endpoint public : version de l'API
@app.route('/api/version', methods=['GET'])
def api_version():
    return jsonify({"version": "1.0.0"})

# Endpoint admin : réinitialiser les mock data
@app.route('/api/admin/reset-mocks', methods=['POST'])
@role_required(['admin'])
def reset_mocks():
    global sequences, next_sequence_id, library_documents, internet_resources
    sequences = []
    next_sequence_id = 1
    library_documents = [
        {"id": "1", "title": "Document 1", "description": "Description du Document 1", "url": "http://example.com/doc1", "date": "2023-01-01", "content": "Contenu du Document 1"},
        {"id": "2", "title": "Document 2", "description": "Description du Document 2", "url": "http://example.com/doc2", "date": "2023-01-02", "content": "Contenu du Document 2"},
        {"id": "3", "title": "Grammaire de la langue maya", "description": "Ouvrage de référence sur la grammaire maya.", "url": "http://example.com/maya-grammaire", "date": "2023-02-01", "content": "Contenu sur la grammaire maya."},
        {"id": "4", "title": "Histoire du peuple maya", "description": "Document historique sur la civilisation maya.", "url": "http://example.com/maya-histoire", "date": "2023-03-01", "content": "Contenu historique maya."}
    ]
    internet_resources = [
        {"id": "1", "title": "Ressource 1", "description": "Description de la Ressource 1", "url": "http://example.com/res1", "date": "2023-01-01", "content": "Contenu de la Ressource 1"},
        {"id": "2", "title": "Ressource 2", "description": "Description de la Ressource 2", "url": "http://example.com/res2", "date": "2023-01-02", "content": "Contenu de la Ressource 2"},
        {"id": "3", "title": "Cours de maya en ligne", "description": "Ressource pédagogique pour apprendre le maya.", "url": "http://example.com/maya-cours", "date": "2023-04-01", "content": "Cours interactif de langue maya."},
        {"id": "4", "title": "Podcast sur la culture maya", "description": "Podcast audio sur la culture et la langue maya.", "url": "http://example.com/maya-podcast", "date": "2023-05-01", "content": "Podcast en langue maya."}
    ]
    return jsonify({"message": "Mock data réinitialisés."})
# Endpoint admin : liste des utilisateurs mock
@app.route('/api/users', methods=['GET'])
@role_required(['admin'])
def get_users():
    users = User.query.all()
    result = []
    for user in users:
        result.append({
            "id": user.id,
            "username": user.username,
            "roles": [role.name for role in user.roles]
        })
    return jsonify(result)

# Endpoint : liste des rôles
@app.route('/api/roles', methods=['GET'])
@jwt_required()
def get_roles():
    roles = Role.query.all()
    return jsonify([role.name for role in roles])

# Endpoint : profil utilisateur courant
@app.route('/api/me', methods=['GET'])
@jwt_required()
def get_me():
    claims = get_jwt()
    return jsonify({
        "username": claims.get("username"),
        "roles": claims.get("roles", [])
    })
# Gestion globale des erreurs 404 et 400 (JSON)
@app.errorhandler(404)
def not_found(error):
    from flask import g
    return jsonify({"error": t('not_found'), "message": str(error)}), 404

@app.errorhandler(400)
def bad_request(error):
    from flask import g
    return jsonify({"error": t('bad_request'), "message": str(error)}), 400


# Modèles SQLAlchemy
user_roles = db.Table('user_roles',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('role_id', db.Integer, db.ForeignKey('role.id'))
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    roles = db.relationship('Role', secondary=user_roles, backref=db.backref('users', lazy='dynamic'))

class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

# Initialisation de la base et création des utilisateurs/rôles mock
def init_db():
    db.create_all()
    # Création des rôles si non existants
    for role_name in ["enseignant", "chercheur", "admin"]:
        if not Role.query.filter_by(name=role_name).first():
            db.session.add(Role(name=role_name))
    db.session.commit()
    # Création des utilisateurs mock
    users_data = [
        {"username": "enseignant", "password": "enseignant123", "roles": ["enseignant"]},
        {"username": "chercheur", "password": "chercheur123", "roles": ["chercheur"]},
        {"username": "admin", "password": "admin123", "roles": ["admin"]}
    ]
    for udata in users_data:
        if not User.query.filter_by(username=udata["username"]).first():
            user = User(username=udata["username"], password=bcrypt.generate_password_hash(udata["password"]).decode('utf-8'))
            for rname in udata["roles"]:
                role = Role.query.filter_by(name=rname).first()
                user.roles.append(role)
            db.session.add(user)
    db.session.commit()


# Décorateur personnalisé pour vérifier le rôle
def role_required(required_roles):
    def decorator(fn):
        @jwt_required()
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            user_roles = claims.get('roles', [])
            if any(role in user_roles for role in required_roles):
                return fn(*args, **kwargs)
            return jsonify({"msg": "Accès refusé : rôle requis"}), 403
        wrapper.__name__ = fn.__name__
        return wrapper
    return decorator




# Mock databases
sequences = []
next_sequence_id = 1
library_documents = [
    {"id": "1", "title": "Document 1", "description": "Description du Document 1", "url": "http://example.com/doc1", "date": "2023-01-01", "content": "Contenu du Document 1"},
    {"id": "2", "title": "Document 2", "description": "Description du Document 2", "url": "http://example.com/doc2", "date": "2023-01-02", "content": "Contenu du Document 2"},
    {"id": "3", "title": "Grammaire de la langue maya", "description": "Ouvrage de référence sur la grammaire maya.", "url": "http://example.com/maya-grammaire", "date": "2023-02-01", "content": "Contenu sur la grammaire maya."},
    {"id": "4", "title": "Histoire du peuple maya", "description": "Document historique sur la civilisation maya.", "url": "http://example.com/maya-histoire", "date": "2023-03-01", "content": "Contenu historique maya."}
]
internet_resources = [
    {"id": "1", "title": "Ressource 1", "description": "Description de la Ressource 1", "url": "http://example.com/res1", "date": "2023-01-01", "content": "Contenu de la Ressource 1"},
    {"id": "2", "title": "Ressource 2", "description": "Description de la Ressource 2", "url": "http://example.com/res2", "date": "2023-01-02", "content": "Contenu de la Ressource 2"},
    {"id": "3", "title": "Cours de maya en ligne", "description": "Ressource pédagogique pour apprendre le maya.", "url": "http://example.com/maya-cours", "date": "2023-04-01", "content": "Cours interactif de langue maya."},
    {"id": "4", "title": "Podcast sur la culture maya", "description": "Podcast audio sur la culture et la langue maya.", "url": "http://example.com/maya-podcast", "date": "2023-05-01", "content": "Podcast en langue maya."}
]

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()
    if user and bcrypt.check_password_hash(user.password, password):
        roles = [role.name for role in user.roles]
        # Force l'identity à être une chaîne pour éviter le bug PyJWT/Flask-JWT-Extended
        access_token = create_access_token(identity=str(user.id), additional_claims={"roles": roles, "username": user.username})
        return jsonify(access_token=access_token), 200
    return jsonify({"msg": "Identifiants invalides"}), 401

# Exemple d'endpoint protégé par JWT et rôle
@app.route('/api/protected', methods=['GET'])
@role_required(['admin'])
def protected():
    claims = get_jwt()
    return jsonify({"msg": f"Bienvenue, {claims.get('username')}! Accès admin autorisé."})





@app.route('/api/sequences', methods=['POST'])
@jwt_required()
def create_sequence():
    global next_sequence_id
    if not request.is_json:
        return jsonify({"msg": "El cuerpo de la solicitud debe ser un objeto JSON."}), 400
    data = request.get_json()
    if not isinstance(data, dict):
        return jsonify({"msg": "El cuerpo de la solicitud debe ser un objeto JSON válido."}), 400
    # Validation stricte des champs obligatoires
    required_fields = ["titulo", "modalidad"]
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"msg": f"El campo obligatorio '{field}' está ausente o vacío."}), 400
    # Champs spécifiques maya
    data.setdefault("dialecte", "yucatèque")
    data.setdefault("contexte_culturel", "scolaire")
    data.setdefault("support_audio", None)
    data.setdefault("support_video", None)
    data["id"] = next_sequence_id
    next_sequence_id += 1
    sequences.append(data)
    return jsonify({"message": t('created'), "data": data}), 201

@app.route('/api/sequences', methods=['GET'])
@jwt_required()
def get_sequences():
    return jsonify(sequences)



@app.route('/api/sequences/<int:id>', methods=['PUT'])
@jwt_required()
def update_sequence(id):
    if not request.is_json:
        return jsonify({"msg": "El cuerpo de la solicitud debe ser un objeto JSON."}), 400
    data = request.get_json()
    if not isinstance(data, dict):
        return jsonify({"msg": "El cuerpo de la solicitud debe ser un objeto JSON válido."}), 400
    for seq in sequences:
        if seq.get("id") == id:
            seq.update(data)
            seq["id"] = id  # On garde l'id inchangé
            return jsonify({"message": t('updated'), "data": seq})
    return jsonify({"message": t('sequence_not_found')}), 404


@app.route('/api/sequences/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_sequence(id):
    for i, seq in enumerate(sequences):
        if seq.get("id") == id:
            sequences.pop(i)
            return jsonify({"message": t('deleted')})
    return jsonify({"message": t('sequence_not_found')}), 404


@app.route('/api/library/search', methods=['GET'])
@jwt_required()
def search_library():
    query = request.args.get('query', '')
    try:
        page = int(request.args.get('page', 1))
        if page < 1:
            page = 1
    except (TypeError, ValueError):
        page = 1
    try:
        page_size = int(request.args.get('page_size', 20))
        if page_size < 1:
            page_size = 20
    except (TypeError, ValueError):
        page_size = 20
    sort_by = request.args.get('sort_by', 'date')
    sort_order = request.args.get('sort_order', 'desc')

    filtered_documents = [doc for doc in library_documents if query.lower() in doc['title'].lower() or query.lower() in doc['description'].lower()]
    # Tri
    if sort_by in ['date', 'title']:
        filtered_documents.sort(key=lambda x: x.get(sort_by, ''), reverse=(sort_order == 'desc'))
    start_index = (page - 1) * page_size
    end_index = start_index + page_size
    paginated_documents = filtered_documents[start_index:end_index]
    return jsonify(paginated_documents)

@app.route('/api/library/documents/<string:id>', methods=['GET'])
@jwt_required()
def get_library_document(id):
    for doc in library_documents:
        if doc['id'] == id:
            return jsonify(doc)
    return jsonify({"message": t('document_not_found')}), 404

@app.route('/api/internet/search', methods=['GET'])
@jwt_required()
def search_internet():
    query = request.args.get('query', '')
    try:
        page = int(request.args.get('page', 1))
        if page < 1:
            page = 1
    except (TypeError, ValueError):
        page = 1
    try:
        page_size = int(request.args.get('page_size', 20))
        if page_size < 1:
            page_size = 20
    except (TypeError, ValueError):
        page_size = 20
    sort_by = request.args.get('sort_by', 'date')
    sort_order = request.args.get('sort_order', 'desc')

    filtered_resources = [res for res in internet_resources if query.lower() in res['title'].lower() or query.lower() in res['description'].lower()]
    # Tri
    if sort_by in ['date', 'title']:
        filtered_resources.sort(key=lambda x: x.get(sort_by, ''), reverse=(sort_order == 'desc'))
    start_index = (page - 1) * page_size
    end_index = start_index + page_size
    paginated_resources = filtered_resources[start_index:end_index]
    return jsonify(paginated_resources)

@app.route('/api/internet/resources/<string:id>', methods=['GET'])
@jwt_required()
def get_internet_resource(id):
    for res in internet_resources:
        if res['id'] == id:
            return jsonify(res)


if __name__ == '__main__':
    with app.app_context():
        init_db()
    app.run(debug=True)
