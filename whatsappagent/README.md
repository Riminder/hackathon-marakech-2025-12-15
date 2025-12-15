# WhatsApp HR Agent

Un agent WhatsApp intelligent qui reçoit des messages (texte ou audio), les transcrit, parse les jobs avec HrFlow, et recherche des profils correspondants avec scoring, grading, tagging et explications IA.

## Installation

```bash
npm install
```

## Configuration

Copiez `.env` et remplissez vos credentials :

- **Twilio** : Account SID, Auth Token, et numéro WhatsApp Sandbox
- **OpenAI** : API Key pour la transcription audio
- **HrFlow** : 
  - API Key, User Email, Source Keys
  - Board Key (obligatoire)
  - Algorithm Keys (optionnels, valeurs par défaut fournies)

## Variables d'environnement

```env
PORT=3000

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# OpenAI (transcription)
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx

# HrFlow
HRFLOW_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
HRFLOW_USER_EMAIL=you@company.com
HRFLOW_SOURCE_KEYS=YOUR_SOURCE_KEY_1,YOUR_SOURCE_KEY_2
HRFLOW_BOARD_KEY=YOUR_BOARD_KEY

# HrFlow Algorithms (optionnels)
HRFLOW_SCORING_ALGORITHM_KEY=scorer-hrflow-profiles-titan
HRFLOW_GRADING_ALGORITHM_KEY=grader-hrflow-profiles-titan
HRFLOW_TAGGING_ALGORITHM_KEY=tagger-hrflow-dynamic

# Paramètres de recherche (optionnels)
NUMBER_OF_PROFILES_TO_SCORE=10
NUMBER_OF_PROFILES_TO_GRADE=3
LOCATION_DISTANCE_RADIUS=30
```

## Démarrage

```bash
npm run dev
```

## Configuration Twilio Sandbox

1. Allez dans Twilio Console → Messaging → Try it out → WhatsApp → Sandbox settings
2. Configurez le webhook : `https://<TON_NGROK>/twilio/whatsapp` (Method POST)
3. Exposez votre serveur local avec ngrok : `ngrok http 3000`

## Workflow

Le workflow complet suit ces étapes :

1. **Transcription** : Si audio, transcription avec OpenAI Whisper
2. **Parsing Job** : Extraction des informations du job avec HrFlow Text Parsing (modèle Atlas)
3. **Enrichissement Location** : Géocodage de la localisation
4. **Stockage Job** : Sauvegarde du job dans le board HrFlow
5. **Asking** : Extraction du titre et des filtres (date, radius, seniority) via HrFlow Asking
6. **Scoring** : Recherche et scoring des profils avec l'algorithme de scoring
7. **Grading** : Affinage des scores des top profils avec l'algorithme de grading
8. **Enrichissement Profils** : Pour chaque profil final :
   - Résumé IA (20 mots)
   - Explications (forces/faiblesses)
   - Tags de séniorité
   - Tags de diplôme
9. **Réponse WhatsApp** : Envoi des résultats formatés

## Test

- Envoyez un texte : "je cherche un dev React senior à Paris"
- Envoyez un audio WhatsApp (voice note) : vous recevrez :
  - Un ack immédiat ✅
  - Un message de confirmation 🔍
  - Les top profils avec scores, tags, résumés et explications

## Structure du projet

```
whatsapp-copilot/
├── server.js                    # Serveur Express principal
├── services/
│   ├── hrflowService.js         # Service HrFlow avec toutes les méthodes
│   └── taggingLabels.js         # Labels et contextes pour le tagging
├── package.json
├── .env                         # Configuration (à créer)
└── README.md
```

## Endpoints

- `POST /twilio/whatsapp` : Webhook Twilio pour recevoir les messages WhatsApp
- `GET /health` : Health check

## Services HrFlow disponibles

Le service `hrflowService.js` expose les méthodes suivantes :

- `parseJob()` - Parse un texte en objet job
- `enrichLocation()` - Géocode une localisation
- `storeJob()` - Stocke un job dans un board
- `putJob()` - Met à jour un job
- `getJobInfoFromAsking()` - Extrait des infos via asking
- `fetchScoredProfiles()` - Recherche et score des profils
- `gradeProfilesBatch()` - Grade des profils pour scores précis
- `tagText()` - Tag un texte (séniorité, diplôme, etc.)
- `summaryProfile()` - Génère un résumé IA d'un profil
- `explainProfile()` - Explique les forces/faiblesses d'un profil

