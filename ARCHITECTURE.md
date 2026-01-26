# Architecture du Système de Coaching IA - Atomic Habits

## 📋 Vue d'ensemble

Le système de coaching IA pour habitudes est une application full-stack moderne qui traduit les principes du livre *Atomic Habits* de James Clear en une structure technique concrète et mesurable.

### Technologies Clés
- **Frontend**: React 19, TypeScript, TanStack Router, TanStack Query
- **Backend**: Node.js, Prisma ORM, Better Auth, ORPC
- **Base de données**: PostgreSQL
- **Styling**: Tailwind CSS
- **Testing**: Vitest, Playwright

---

## 🏗️ Architecture Générale

### Frontend Layer
```
src/
├── components/          # Composants UI réutilisables
├── features/           # Fonctionnalités métier
│   ├── habits/         # Module habitudes
│   ├── coaching/       # Module IA coaching
│   └── analytics/      # Module statistiques
├── hooks/              # Hooks personnalisés
├── lib/                # Utilitaires
└── routes/             # Routes TanStack Router
```

### Backend Layer
```
src/server/
├── auth/               # Authentication (Better Auth)
├── routers/            # ORPC API procedures
│   ├── habits.ts       # CRUD habitudes
│   ├── entries.ts      # Suivi des entrées
│   ├── coaching.ts     # IA & recommandations
│   └── analytics.ts    # Statistiques
├── db/                 # Prisma client
└── middleware/         # Guards & permissions
```

### Data Layer
```
prisma/
└── schema.prisma       # Modèles de données
```

---

## 🔐 Sécurité & Authentification

### Système d'Authentification
- **Better Auth** avec sessions sécurisées
- Rôles: `user`, `admin`
- Permissions granulaires par ressource

### Règles d'Accès
```
User:
  - Lire ses propres habitudes
  - Créer ses habitudes
  - Mettre à jour ses habitudes
  - Supprimer ses habitudes
  - Accéder à son coaching IA

Admin:
  - Toutes les permissions utilisateur
  - Lire/Modifier toutes les habitudes
  - Accès aux statistiques globales
```

---

## 🔄 Flux de Données

### Création d'habitude
```
1. Formulaire UI → Zod Validation
2. ORPC procedure → Permission check
3. Prisma → Database insertion
4. TanStack Query cache invalidation
5. UI update
```

### Tracking quotidien
```
1. User action → Toggle habit completion
2. ORPC procedure → Update HabitEntry
3. Recalculate streaks & statistics
4. Cache invalidation
5. Visual feedback
```

### Coaching IA
```
1. Analyze user data (entries, patterns, streaks)
2. Apply Atomic Habits principles
3. Generate personalized recommendations
4. Present actionable insights
```

---

## 🎯 Principe d'Atomic Habits → Implémentation Technique

### 1. 1% Improvement (Amélioration quotidienne)
- **Implémentation**: Tracking journalier précis des habitudes
- **Données**: `HabitEntry` avec date + statut de complétion
- **Métriques**: Streaks, taux de réussite, tendances

### 2. Identity-Based Habits (Habitudes basées sur l'identité)
- **Implémentation**: Champ `identity` sur le modèle `Habit`
- **Validation**: Zod schema avec valeurs pré-définies ("Je suis quelqu'un qui...", "Mon identité est...")
- **UI**: Questionnaire d'onboarding pour identifier l'identité cible

### 3. Habit Stacking (Empilement d'habitudes)
- **Implémentation**: Champs `triggerTime` et `triggerHabitId` sur `Habit`
- **Données**: Lien vers une autre habitude existante
- **UI**: Suggestion automatique basée sur les habitudes existantes

### 4. Environment Design (Conception de l'environnement)
- **Implémentation**: Champs `environment` et `cues` sur `Habit`
- **Validation**: Listes pré-définies (Home, Work, Gym, etc.)
- **UI**: Tags visuels et filtres par environnement

### 5. The 4 Laws of Behavior Change (Les 4 lois du changement)
- **Implémentation**:
  - **Make it obvious**: Champ `cue` (déclencheur) sur `Habit`
  - **Make it attractive**: Champ `motivation` sur `Habit`
  - **Make it easy**: Champ `difficulty` sur `Habit` (easy, medium, hard)
  - **Make it satisfying**: System de récompense immédiate (checkmark, streak visual)

### 6. Habit Tracking (Suivi des habitudes)
- **Implémentation**: Modèle `HabitEntry` avec date, status, notes
- **UI**: Calendrier mensuel avec indicateurs de succès
- **Métriques**: Streak actuel, meilleur streak, taux de complétion

### 7. Never Miss Twice (Ne jamais manquer deux fois)
- **Implémentation**: Alertes IA sur patterns de déclin
- **Données**: Analyse des 7 derniers jours
- **UI**: Notifications contextuelles "Tu as manqué hier, aujourd'hui c'est important !"

---

## 📊 Moteur d'Analyse & IA Coaching

### Composants du Coaching

#### 1. Pattern Recognition
```
Input: 30-90 days of habit data
Analysis:
  - Meilleur jour de la semaine
  - Meilleure période de la journée
  - Habitudes corrélées (réussites ensemble)
  - Points de friction (échecs fréquents)
Output: Insights personnalisés
```

#### 2. Atomic Habits Principle Matcher
```
Map des principes → Données utilisateur:
  - Identity alignment: % d'habitudes alignées avec l'identité
  - Habit stacking: % d'habitudes empilées vs. isolées
  - Environment optimization: Habitudes par environnement
  - 4 Laws compliance: Score de conformité aux 4 lois
```

#### 3. Recommendation Engine
```
Règles basées sur Atomic Habits:
  - Si streak < 3 → Suggestion de réduire la difficulté
  - Si identité non alignée → Suggestion de reformulation
  - Si pas de trigger → Suggestion d'ajouter un déclencheur
  - Si taux de réussite < 60% → Suggestion de repenser l'environnement
```

### Types de Recommandations
1. **Optimisation**: Améliorer une habitude existante
2. **Empilement**: Lier deux habitudes compatibles
3. **Environnement**: Modifier le contexte d'exécution
4. **Identité**: Reformuler pour mieux correspondre à l'identité
5. **Fréquence**: Ajuster la fréquence ou le timing

---

## 🎨 UI/UX Architecture

### Pages Principales

#### 1. Dashboard Habitudes (`/app/habits`)
- Liste des habitudes avec indicateurs en temps réel
- Vue quotidienne avec cases à cocher
- Indicateurs de streak et de réussite
- Boutons rapides: Ajouter, Modifier, Archiver

#### 2. Calendrier des Habitudes (`/app/habits/calendar`)
- Vue mensuelle avec heatmap des réussites
- Navigation entre les mois
- Filtres par habitude

#### 3. Coaching IA (`/app/coaching`)
- Insights personnalisés du jour
- Recommandations actionnables
- Analyses de patterns
- Suivi de progression vers l'identité cible

#### 4. Statistiques (`/app/habits/stats`)
- Graphiques de progression
- Métriques clés (streaks, taux de réussite)
- Comparaison semaine/mois
- Habitudes les plus/les moins réussies

### Composants Clés
- `HabitCard` - Affichage d'une habitude avec stats
- `HabitDrawer` - Formulaire de création/édition
- `HabitCalendar` - Calendrier interactif
- `HabitStats` - Dashboard de statistiques
- `CoachingInsight` - Carte d'insight IA
- `StreakBadge` - Badge de streak visuel

---

## 🗄️ Stratégie de Persistance

### Cache Layer
- **TanStack Query**: Cache côté client
- **Stale time**: 5 minutes pour les données d'habitudes
- **Invalidate**: Sur mutations (création, modification, complétion)

### Database Layer
- **Prisma ORM**: Abstraction type-safe
- **Indexes**: Sur userId, date, habitId pour les requêtes fréquentes
- **Transactions**: Pour les opérations multiples (ex: multiple entrées en une fois)

---

## 🧪 Stratégie de Test

### Unit Tests
- Procédures ORPC (mutations/queries)
- Fonctions d'analyse de patterns
- Calculs de streaks et statistiques

### Browser Tests
- Composants d'habitudes (création, édition, toggle)
- Navigation entre les pages
- Formulaires et validation

### E2E Tests
- Flux utilisateur complet (créer habit → tracker → voir stats)
- Authentification + habitudes
- Coaching IA workflow

---

## 🚀 Performance & Scalabilité

### Optimisations
- **Lazy loading**: Composants lourds (calendrier, statistiques)
- **Virtual scrolling**: Pour les listes longues
- **Code splitting**: Par route TanStack Router
- **Debouncing**: Recherche et filtres

### Scalabilité
- **Pagination**: Pour les listes et historiques
- **Rate limiting**: Sur les API endpoints sensibles
- **Background jobs**: Pour l'analyse de patterns (si nécessaire)

---

## 📝 Convention de Code

### Nommage
- **Composants**: PascalCase (ex: `HabitCard`)
- **Fichiers**: kebab-case (ex: `habit-card.tsx`)
- **Hooks**: camelCase avec `use-` (ex: `use-habit-stats`)
- **Zod Schemas**: `*Schema` suffix (ex: `habitCreateSchema`)

### Structure de Fichier
```typescript
// 1. Imports
// 2. Type definitions
// 3. Constants
// 4. Component/Hook definition
// 5. Exports
```

---

## 🔮 Architecture Évolutive

### v1 (MVP)
- CRUD basique des habitudes
- Tracking quotidien
- Statistiques simples

### v2
- Coaching IA basique
- Empilement d'habitudes
- Alertes intelligentes

### v3
- IA avancée avec ML
- Recommandations prédictives
- Export des données

---

## 📚 Documentation

### Pour les Développeurs
- [AGENTS.md](./AGENTS.md) - Guide de développement
- [README.md](./README.md) - Documentation générale
- API Documentation: `/api/openapi`

### Pour les Utilisateurs
- Onboarding interactif
- Aide contextuelle
- FAQ dynamique basée sur l'utilisation
