# Squelette de Projet - Système de Coaching IA (Atomic Habits)

## 📁 Structure du Projet

Ce document présente la structure complète des fichiers et répertoires à créer pour initialiser le système de coaching IA.

---

## 🗂️ Structure des Répertoires

```
francis-habits/
├── src/
│   ├── components/              # Composants UI réutilisables
│   │   ├── habit/              # Composants spécifiques aux habitudes
│   │   │   ├── habit-card.tsx
│   │   │   ├── habit-list.tsx
│   │   │   ├── habit-drawer.tsx
│   │   │   ├── habit-form.tsx
│   │   │   ├── habit-calendar.tsx
│   │   │   ├── entry-toggle.tsx
│   │   │   └── streak-badge.tsx
│   │   ├── stats/              # Composants de statistiques
│   │   │   ├── stats-dashboard.tsx
│   │   │   ├── completion-rate-chart.tsx
│   │   │   ├── streak-chart.tsx
│   │   │   └── weekly-report.tsx
│   │   ├── coaching/           # Composants de coaching IA
│   │   │   ├── coaching-insight.tsx
│   │   │   ├── insights-list.tsx
│   │   │   ├── insight-action.tsx
│   │   │   └── compliance-score.tsx
│   │   ├── reminder/           # Composants de rappels
│   │   │   ├── reminder-form.tsx
│   │   │   ├── reminder-list.tsx
│   │   │   └── reminder-card.tsx
│   │   └── export/             # Composants d'export
│   │       ├── export-button.tsx
│   │       └── export-dialog.tsx
│   │
│   ├── features/               # Fonctionnalités métier
│   │   ├── habits/             # Module habitudes
│   │   │   ├── schema.ts       # Zod schemas
│   │   │   ├── types.ts        # TypeScript types
│   │   │   └── utils.ts        # Utilitaires
│   │   ├── entries/            # Module entrées
│   │   │   ├── schema.ts
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   ├── stats/              # Module statistiques
│   │   │   ├── schema.ts
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   ├── insights/           # Module insights/IA
│   │   │   ├── schema.ts
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   ├── reminders/          # Module rappels
│   │   │   ├── schema.ts
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   └── export/             # Module export
│   │       ├── schema.ts
│   │       ├── types.ts
│   │       └── utils.ts
│   │
│   ├── hooks/                  # Hooks personnalisés
│   │   ├── use-habit.ts
│   │   ├── use-habits.ts
│   │   ├── use-habit-entries.ts
│   │   ├── use-habit-stats.ts
│   │   ├── use-habit-insights.ts
│   │   ├── use-habit-reminders.ts
│   │   └── use-export.ts
│   │
│   ├── server/                 # Backend code
│   │   ├── routers/            # ORPC routers
│   │   │   ├── habits.ts       # À mettre à jour
│   │   │   ├── entries.ts      # À créer
│   │   │   ├── insights.ts     # À créer
│   │   │   ├── stats.ts        # À créer
│   │   │   ├── reminders.ts    # À créer
│   │   │   └── export.ts       # À créer
│   │   ├── analytics/          # Moteur d'analyse
│   │   │   ├── pattern-recognizer.ts
│   │   │   ├── atomic-habits-matcher.ts
│   │   │   ├── recommendation-engine.ts
│   │   │   └── streak-calculator.ts
│   │   └── db/                 # Prisma client
│   │       └── generated/      # Generated client
│   │
│   ├── routes/                 # TanStack Router
│   │   ├── app/
│   │   │   ├── habits/
│   │   │   │   ├── index.tsx                 # Liste des habitudes
│   │   │   │   ├── create.tsx                # Création (ou drawer)
│   │   │   │   ├── [id]/index.tsx            # Détail d'une habitude
│   │   │   │   ├── [id]/edit.tsx             # Édition d'une habitude
│   │   │   │   ├── [id]/stats.tsx            # Stats d'une habitude
│   │   │   │   └── calendar.tsx              # Calendrier
│   │   │   ├── coaching/
│   │   │   │   └── index.tsx                 # Page de coaching
│   │   │   ├── stats/
│   │   │   │   └── index.tsx                 # Stats globales
│   │   │   └── settings/
│   │   │       ├── index.tsx                 # Paramètres généraux
│   │   │       └── export.tsx                # Export des données
│   │   └── __root.tsx                         # Root layout
│   │
│   └── locales/               # Fichiers de traduction
│       ├── en/
│       │   ├── habits.json
│       │   ├── entries.json
│       │   ├── stats.json
│       │   ├── insights.json
│       │   ├── reminders.json
│       │   └── export.json
│       ├── ar/
│       │   ├── habits.json
│       │   ├── entries.json
│       │   ├── stats.json
│       │   ├── insights.json
│       │   ├── reminders.json
│       │   └── export.json
│       ├── fr/
│       │   ├── habits.json
│       │   ├── entries.json
│       │   ├── stats.json
│       │   ├── insights.json
│       │   ├── reminders.json
│       │   └── export.json
│       └── sw/
│           ├── habits.json
│           ├── entries.json
│           ├── stats.json
│           ├── insights.json
│           ├── reminders.json
│           └── export.json
│
├── prisma/
│   └── schema.prisma          # À mettre à jour avec les nouveaux modèles
│
├── ARCHITECTURE.md            # ✅ Créé
├── DATA_MODEL.md              # ✅ Créé
├── API_ENDPOINTS.md            # ✅ Créé
├── DEVELOPMENT_PLAN.md         # ✅ Créé
└── PROJECT_SKELETON.md         # ✅ Ce fichier
```

---

## 📝 Fichiers à Créer (Liste Détaillée)

### Composants UI (`src/components/habit/`)

#### 1. `habit-card.tsx`
Composant pour afficher une habitude avec ses stats de base.

**Props**:
- `habit: Habit`
- `onEdit?: () => void`
- `onDelete?: () => void`
- `showStats?: boolean`

**Fonctionnalités**:
- Afficher le nom et l'identité de l'habitude
- Afficher la streak actuelle et le taux de complétion
- Boutons pour éditer/supprimer
- Indicateur de statut (active/paused/archived)

#### 2. `habit-list.tsx`
Liste des habitudes avec filtres et recherche.

**Props**:
- `habits: Habit[]`
- `onCreate?: () => void`
- `onEdit?: (id: string) => void`
- `onDelete?: (id: string) => void`
- `filter?: { status?: HabitStatus, difficulty?: Difficulty }`

**Fonctionnalités**:
- Liste paginée des habitudes
- Filtres par statut/difficulté
- Recherche par nom
- Bouton pour créer une nouvelle habitude

#### 3. `habit-drawer.tsx`
Drawer (ResponsiveDrawer) pour créer/éditer une habitude.

**Props**:
- `open: boolean`
- `onClose: () => void`
- `habit?: Habit` (si présent, mode édition)
- `onSave: (habit: Partial<Habit>) => void`

**Fonctionnalités**:
- Formulaire complet avec tous les champs Atomic Habits
- Validation avec Zod
- Prévisualisation de l'habitude
- Sauvegarde en local (draft) si fermé sans sauvegarder

#### 4. `habit-form.tsx`
Formulaire de création/édition d'habitude.

**Props**:
- `form: UseFormReturn<HabitFormData>`
- `onSubmit: (data: HabitFormData) => void`
- `isLoading?: boolean`

**Fonctionnalités**:
- Champs organisés par sections (Base, Identity, Trigger, Environment, 4 Laws, Configuration)
- Validation en temps réel
- Aide contextuelle pour chaque champ (explication des principes Atomic Habits)

#### 5. `habit-calendar.tsx`
Calendrier mensuel avec heatmap des réussites.

**Props**:
- `habits: Habit[]`
- `entries: HabitEntry[]`
- `selectedDate: Date`
- `onDateSelect: (date: Date) => void`
- `onNavigate: (direction: 'prev' | 'next') => void`

**Fonctionnalités**:
- Vue mensuelle
- Heatmap par jour (couleur selon le nombre d'habitudes complétées)
- Indicateur de streak
- Navigation entre les mois
- Clic sur un jour pour voir les détails

#### 6. `entry-toggle.tsx`
Bouton toggle pour marquer une habitude comme complétée.

**Props**:
- `habitId: string`
- `date?: Date` (défaut: aujourd'hui)
- `completed?: boolean`
- `onToggle: (completed: boolean) => void`
- `disabled?: boolean`

**Fonctionnalités**:
- Animation de toggle
- Indicateur visuel de complétion
- Confirmer l'action si marquer comme non-complété
- Afficher la streak actuelle

#### 7. `streak-badge.tsx`
Badge visuel pour afficher une streak.

**Props**:
- `streak: number`
- `size?: 'small' | 'medium' | 'large'`
- `showLabel?: boolean`

**Fonctionnalités**:
- Afficher le nombre de jours
- Animation si la streak augmente
- Couleur selon la longueur (bronze, argent, or, diamant)

---

### Composants Stats (`src/components/stats/`)

#### 1. `stats-dashboard.tsx`
Dashboard de statistiques globales.

**Props**:
- `stats: OverallStats`
- `onNavigate?: (page: string) => void`

**Fonctionnalités**:
- Taux de complétion global
- Meilleures/pires habitudes
- Tendances
- Score de conformité Atomic Habits
- Liens vers les pages détaillées

#### 2. `completion-rate-chart.tsx`
Graphique du taux de complétion.

**Props**:
- `data: Array<{ date: Date, rate: number }>`
- `period: StatsPeriod`

**Fonctionnalités**:
- Graphique linéaire ou barres
- Vue par jour/semaine/mois
- Hover pour voir les détails
- Légende

#### 3. `streak-chart.tsx`
Graphique des streaks.

**Props**:
- `habitId: string`
- `data: Array<{ date: Date, streak: number }>`

**Fonctionnalités**:
- Graphique linéaire
- Indicateur de meilleure streak
- Marqueurs pour les milestones (7, 30, 100 jours)

#### 4. `weekly-report.tsx`
Rapport hebdomadaire.

**Props**:
- `report: WeeklyReport`

**Fonctionnalités**:
- Taux de complétion hebdomadaire
- Meilleur/pire jour
- Comparaison avec la semaine précédente
- Accomplissements

---

### Composants Coaching (`src/components/coaching/`)

#### 1. `coaching-insight.tsx`
Carte d'un insight.

**Props**:
- `insight: HabitInsight`
- `onView: () => void`
- `onDismiss: () => void`
- `onAct: () => void`

**Fonctionnalités**:
- Titre et description
- Catégorie et type
- Bouton d'action (si applicable)
- Boutons pour marquer vu/ignorer
- Animation d'apparition

#### 2. `insights-list.tsx`
Liste des insights.

**Props**:
- `insights: HabitInsight[]`
- `onInsightView: (id: string) => void`
- `onInsightDismiss: (id: string) => void`
- `onInsightAct: (id: string) => void`
- `filter?: { viewed?: boolean, category?: InsightCategory }`

**Fonctionnalités**:
- Liste groupée par catégorie
- Filtres
- Indicateur de nouveaux insights
- Pagination

#### 3. `insight-action.tsx`
Bouton d'action sur un insight.

**Props**:
- `insight: HabitInsight`
- `onClick: () => void`

**Fonctionnalités**:
- Texte personnalisé
- Navigation vers l'URL d'action (si applicable)
- Confirmation de l'action

#### 4. `compliance-score.tsx`
Score de conformité aux principes Atomic Habits.

**Props**:
- `score: number` (0-100)
- `breakdown: {
    identity: number,
    stacking: number,
    environment: number,
    fourLaws: number,
    tracking: number
  }`

**Fonctionnalités**:
- Graphique circulaire
- Breakdown par catégorie
- Recommandations pour améliorer

---

### Composants Reminders (`src/components/reminder/`)

#### 1. `reminder-form.tsx`
Formulaire de création de rappel.

**Props**:
- `form: UseFormReturn<ReminderFormData>`
- `onSubmit: (data: ReminderFormData) => void`
- `habitId: string`

**Fonctionnalités**:
- Sélection de l'heure
- Sélection des jours
- Type de rappel (push/email)
- Message personnalisé

#### 2. `reminder-list.tsx`
Liste des rappels d'une habitude.

**Props**:
- `reminders: HabitReminder[]`
- `onEdit: (id: string) => void`
- `onDelete: (id: string) => void`
- `onToggleActive: (id: string) => void`

**Fonctionnalités**:
- Liste des rappels
- Toggle actif/inactif
- Boutons éditer/supprimer

#### 3. `reminder-card.tsx`
Carte d'un rappel.

**Props**:
- `reminder: HabitReminder`
- `onEdit: () => void`
- `onDelete: () => void`
- `onToggleActive: () => void`

**Fonctionnalités**:
- Affichage de l'heure et des jours
- Type de rappel
- Boutons d'action

---

### Composants Export (`src/components/export/`)

#### 1. `export-button.tsx`
Bouton pour exporter les données.

**Props**:
- `onExport: (format: 'json' | 'csv') => void`
- `isLoading?: boolean`

**Fonctionnalités**:
- Dropdown pour sélectionner le format
- Indicateur de chargement
- Animation de succès après l'export

#### 2. `export-dialog.tsx`
Dialogue pour configurer l'export.

**Props**:
- `open: boolean`
- `onClose: () => void`
- `onExport: (config: ExportConfig) => void`

**Fonctionnalités**:
- Sélection du format (JSON/CSV)
- Sélection de la période
- Prévisualisation des données à exporter
- Historique des exports

---

### Features Modules (`src/features/`)

#### `habits/schema.ts`
Zod schemas pour les habitudes.

**Schemas**:
- `habitCreateSchema`
- `habitUpdateSchema`
- `habitFilterSchema`

#### `habits/types.ts`
TypeScript types pour les habitudes.

**Types**:
- `Habit`
- `HabitFormData`
- `HabitFilter`
- Les types Prisma générés

#### `habits/utils.ts`
Utilitaires pour les habitudes.

**Fonctions**:
- `calculateCompletionRate(habit, entries)`
- `formatStreak(streak)`
- `getHabitIcon(habit)`
- `isHabitDueToday(habit)`
- `getHabitStatusColor(status)`

---

#### `entries/schema.ts`, `entries/types.ts`, `entries/utils.ts`
Similaire pour les entrées.

---

#### `stats/schema.ts`, `stats/types.ts`, `stats/utils.ts`
Similaire pour les statistiques.

---

#### `insights/schema.ts`, `insights/types.ts`, `insights/utils.ts`
Similaire pour les insights.

---

#### `reminders/schema.ts`, `reminders/types.ts`, `reminders/utils.ts`
Similaire pour les rappels.

---

#### `export/schema.ts`, `export/types.ts`, `export/utils.ts`
Similaire pour l'export.

---

### Hooks (`src/hooks/`)

#### `use-habit.ts`
Hook pour manipuler une habitude.

**Retour**:
```typescript
{
  habit: Habit | undefined
  isLoading: boolean
  error: Error | null
  update: (data: Partial<Habit>) => void
  delete: () => void
  archive: () => void
}
```

#### `use-habits.ts`
Hook pour manipuler toutes les habitudes.

**Retour**:
```typescript
{
  habits: Habit[]
  isLoading: boolean
  error: Error | null
  create: (data: HabitFormData) => void
  refetch: () => void
}
```

#### `use-habit-entries.ts`
Hook pour manipuler les entrées.

**Retour**:
```typescript
{
  entries: HabitEntry[]
  isLoading: boolean
  error: Error | null
  toggle: (habitId: string, date?: Date) => void
  update: (id: string, data: Partial<HabitEntry>) => void
  refetch: () => void
}
```

#### `use-habit-stats.ts`
Hook pour récupérer les statistiques.

**Retour**:
```typescript
{
  stats: HabitStats | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => void
}
```

#### `use-habit-insights.ts`
Hook pour manipuler les insights.

**Retour**:
```typescript
{
  insights: HabitInsight[]
  isLoading: boolean
  error: Error | null
  generate: () => void
  markViewed: (id: string) => void
  dismiss: (id: string) => void
  markActedUpon: (id: string) => void
}
```

#### `use-habit-reminders.ts`
Hook pour manipuler les rappels.

**Retour**:
```typescript
{
  reminders: HabitReminder[]
  isLoading: boolean
  error: Error | null
  create: (data: ReminderFormData) => void
  update: (id: string, data: Partial<ReminderFormData>) => void
  delete: (id: string) => void
}
```

#### `use-export.ts`
Hook pour exporter les données.

**Retour**:
```typescript
{
  export: (config: ExportConfig) => Promise<Blob>
  isExporting: boolean
  error: Error | null
}
```

---

### Routes (`src/routes/`)

#### `/app/habits/index.tsx`
Page principale des habitudes.

**Composants**:
- `HabitList`
- `HabitDrawer` (pour création)
- Filtres et recherche

**Fonctionnalités**:
- Liste des habitudes actives
- Toggle rapide pour aujourd'hui
- Filtres par statut/difficulté
- Bouton pour créer une habitude

---

#### `/app/habits/create.tsx`
Page de création d'habitude (ou redirection vers drawer).

---

#### `/app/habits/[id]/index.tsx`
Page détail d'une habitude.

**Composants**:
- `HabitCard`
- `EntryToggle` (pour aujourd'hui)
- Liste des entrées récentes
- Boutons éditer/archiver

**Fonctionnalités**:
- Informations complètes de l'habitude
- Historique des entrées
- Stats de base
- Navigation vers stats, calendar

---

#### `/app/habits/[id]/edit.tsx`
Page d'édition d'une habitude (ou drawer).

---

#### `/app/habits/[id]/stats.tsx`
Page de statistiques d'une habitude.

**Composants**:
- `StatsDashboard`
- `CompletionRateChart`
- `StreakChart`

**Fonctionnalités**:
- Graphiques détaillés
- Analyse de patterns
- Historique des streaks

---

#### `/app/habits/calendar.tsx`
Page du calendrier.

**Composants**:
- `HabitCalendar`
- Liste des habitudes pour la date sélectionnée

**Fonctionnalités**:
- Vue mensuelle avec heatmap
- Navigation entre les mois
- Clic sur un jour pour voir les détails

---

#### `/app/coaching/index.tsx`
Page de coaching.

**Composants**:
- `InsightsList`
- `ComplianceScore`
- `StatsDashboard` (global)

**Fonctionnalités**:
- Insights du jour
- Recommandations actionnables
- Score de conformité Atomic Habits

---

#### `/app/stats/index.tsx`
Page de statistiques globales.

**Composants**:
- `StatsDashboard`
- `WeeklyReport`
- Top/Bottom habitudes

**Fonctionnalités**:
- Taux de complétion global
- Meilleures/pires habitudes
- Tendances
- Rapport hebdomadaire

---

#### `/app/settings/index.tsx`
Page de paramètres généraux.

**Composants**:
- Formulaire de préférences
- Notifications settings
- Thème settings
- Langue settings

**Fonctionnalités**:
- Préférences de rappels (push/email)
- Fréquence des notifications
- Thème (dark mode)
- Langue

---

#### `/app/settings/export.tsx`
Page d'export.

**Composants**:
- `ExportDialog`
- Historique des exports

**Fonctionnalités**:
- Configuration de l'export (format, date range)
- Téléchargement des fichiers exportés
- Historique des exports

---

### Server Routers (`src/server/routers/`)

#### `entries.ts`
Router pour les entrées.

**Procédures**:
- `getForDate`
- `getForDateRange`
- `toggle`
- `update`
- `batchToggle`

---

#### `insights.ts`
Router pour les insights.

**Procédures**:
- `getAll`
- `markViewed`
- `dismiss`
- `markActedUpon`
- `generate`

---

#### `stats.ts`
Router pour les statistiques.

**Procédures**:
- `getHabitStats`
- `getOverallStats`
- `getWeeklyReport`
- `recalculate`

---

#### `reminders.ts`
Router pour les rappels.

**Procédures**:
- `getForHabit`
- `create`
- `update`
- `delete`

---

#### `export.ts`
Router pour l'export.

**Procédures**:
- `getUserData`
- `getHabitData`

---

### Server Analytics (`src/server/analytics/`)

#### `pattern-recognizer.ts`
Module pour analyser les patterns.

**Fonctions**:
- `analyzeBestDayOfWeek(entries)`
- `analyzeBestTimeOfDay(entries)`
- `analyzeCorrelatedHabits(entries)`
- `analyzeFrictionPoints(entries)`

---

#### `atomic-habits-matcher.ts`
Module pour mapper les principes Atomic Habits.

**Fonctions**:
- `calculateIdentityAlignment(habit)`
- `calculateStackingScore(habit)`
- `calculateEnvironmentOptimization(habit)`
- `calculateFourLawsCompliance(habit)`

---

#### `recommendation-engine.ts`
Module pour générer des recommandations.

**Fonctions**:
- `generateRecommendations(patterns, scores)`
- `prioritizeRecommendations(recommendations)`
- `formatRecommendations(recommendations)`

---

#### `streak-calculator.ts`
Module pour calculer les streaks.

**Fonctions**:
- `calculateCurrentStreak(entries)`
- `calculateBestStreak(entries)`
- `calculateCompletionRate(entries)`

---

### Locales (`src/locales/`)

Pour chaque langue (en, ar, fr, sw), créer les fichiers suivants:

#### `habits.json`
```json
{
  "habits": "Habits",
  "create": {
    "title": "Create a new habit",
    "description": "Build a new habit based on Atomic Habits principles"
  },
  "identity": {
    "label": "Your identity",
    "placeholder": "I am someone who...",
    "help": "Who do you want to become?"
  },
  "trigger": {
    "label": "Trigger",
    "after_habit": "After this habit",
    "before_habit": "Before this habit",
    "time_based": "At this time",
    "location_based": "In this location"
  },
  "environment": {
    "label": "Environment",
    "help": "Where will you do this habit?"
  },
  "four_laws": {
    "make_obvious": "Make it obvious",
    "make_attractive": "Make it attractive",
    "make_easy": "Make it easy",
    "make_satisfying": "Make it satisfying"
  },
  "stats": {
    "current_streak": "Current streak",
    "best_streak": "Best streak",
    "completion_rate": "Completion rate"
  }
}
```

#### `entries.json`
```json
{
  "entries": "Entries",
  "completed": "Completed",
  "not_completed": "Not completed",
  "toggle": "Toggle completion",
  "notes": "Notes",
  "mood": "How did you feel?",
  "skip_reason": "Why did you skip?"
}
```

#### `stats.json`
```json
{
  "stats": "Statistics",
  "overall": "Overall statistics",
  "completion_rate": "Completion rate",
  "best_day": "Best day",
  "worst_day": "Worst day",
  "improvement": "Improvement",
  "top_habits": "Top habits",
  "weak_habits": "Habits to improve"
}
```

#### `insights.json`
```json
{
  "insights": "Insights",
  "new_insights": "New insights",
  "view_all": "View all",
  "mark_viewed": "Mark as viewed",
  "dismiss": "Dismiss",
  "act": "Take action",
  "categories": {
    "identity": "Identity",
    "stacking": "Habit Stacking",
    "environment": "Environment",
    "four_laws": "The 4 Laws",
    "tracking": "Tracking"
  },
  "types": {
    "pattern": "Pattern detected",
    "recommendation": "Recommendation",
    "achievement": "Achievement",
    "warning": "Warning"
  }
}
```

#### `reminders.json`
```json
{
  "reminders": "Reminders",
  "create": "Create a reminder",
  "reminder_time": "Reminder time",
  "days": "Days",
  "reminder_type": "Type",
  "push": "Push notification",
  "email": "Email",
  "both": "Both",
  "active": "Active",
  "inactive": "Inactive"
}
```

#### `export.json`
```json
{
  "export": "Export",
  "title": "Export your data",
  "format": "Format",
  "json": "JSON",
  "csv": "CSV",
  "date_range": "Date range",
  "start_date": "Start date",
  "end_date": "End date",
  "export": "Export",
  "download": "Download",
  "history": "Export history"
}
```

---

## 🚀 Commandes pour Initialiser le Squelette

### 1. Créer les répertoires
```bash
mkdir -p src/components/{habit,stats,coaching,reminder,export}
mkdir -p src/features/{habits,entries,stats,insights,reminders,export}
mkdir -p src/server/{routers,analytics}
mkdir -p src/routes/app/{habits,coaching,stats,settings}
mkdir -p src/locales/{en,ar,fr,sw}
```

### 2. Créer les fichiers vides
```bash
# Composants
touch src/components/habit/{habit-card,habit-list,habit-drawer,habit-form,habit-calendar,entry-toggle,streak-badge}.tsx
touch src/components/stats/{stats-dashboard,completion-rate-chart,streak-chart,weekly-report}.tsx
touch src/components/coaching/{coaching-insight,insights-list,insight-action,compliance-score}.tsx
touch src/components/reminder/{reminder-form,reminder-list,reminder-card}.tsx
touch src/components/export/{export-button,export-dialog}.tsx

# Features
touch src/features/habits/{schema,types,utils}.ts
touch src/features/entries/{schema,types,utils}.ts
touch src/features/stats/{schema,types,utils}.ts
touch src/features/insights/{schema,types,utils}.ts
touch src/features/reminders/{schema,types,utils}.ts
touch src/features/export/{schema,types,utils}.ts

# Hooks
touch src/hooks/{use-habit,use-habits,use-habit-entries,use-habit-stats,use-habit-insights,use-habit-reminders,use-export}.ts

# Routers
touch src/server/routers/{entries,insights,stats,reminders,export}.ts

# Analytics
touch src/server/analytics/{pattern-recognizer,atomic-habits-matcher,recommendation-engine,streak-calculator}.ts

# Routes
touch src/routes/app/habits/{create,[id]/{index,edit,stats}}.tsx
touch src/routes/app/habits/calendar.tsx
touch src/routes/app/coaching/index.tsx
touch src/routes/app/stats/index.tsx
touch src/routes/app/settings/{index,export}.tsx

# Locales
for lang in en ar fr sw; do
  touch src/locales/$lang/{habits,entries,stats,insights,reminders,export}.json
done
```

### 3. Initialiser les fichiers de traduction
Pour chaque fichier JSON, ajouter le contenu de base (voir les exemples ci-dessus).

---

## ✅ Checklist d'Initialisation

### Phase 1: Structure des Répertoires
- [ ] Créer tous les répertoires
- [ ] Créer tous les fichiers vides

### Phase 2: Composants UI
- [ ] Créer les composants habit de base
- [ ] Créer les composants stats
- [ ] Créer les composants coaching
- [ ] Créer les composants reminders
- [ ] Créer les composants export

### Phase 3: Features
- [ ] Créer les schemas Zod pour chaque feature
- [ ] Créer les types TypeScript
- [ ] Créer les utilitaires

### Phase 4: Hooks
- [ ] Créer tous les hooks personnalisés

### Phase 5: Backend
- [ ] Créer les routers ORPC
- [ ] Créer les modules d'analyse
- [ ] Migrer le modèle Prisma

### Phase 6: Routes
- [ ] Créer toutes les routes TanStack Router
- [ ] Créer les layouts nécessaires

### Phase 7: Locales
- [ ] Créer les fichiers de traduction pour chaque langue
- [ ] Remplir les traductions de base

### Phase 8: Tests
- [ ] Créer les tests unitaires pour les modules
- [ ] Créer les tests browser pour les composants
- [ ] Créer les tests E2E pour les flux principaux

---

## 🎯 Prochaines Étapes

1. **Valider le squelette**: Vérifier que tous les fichiers et répertoires sont créés
2. **Commencer par le backend**: Migrer le modèle Prisma (Phase 1.1)
3. **Implémenter les routers**: Créer les API endpoints (Phase 1.2)
4. **Créer les composants de base**: HabitCard, HabitList, HabitForm (Phase 1.3)
5. **Créer les pages**: `/app/habits`, `/app/habits/calendar` (Phase 1.4)
6. **Tester**: Tester toutes les fonctionnalités MVP

---

## 📚 Références

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture du système
- [DATA_MODEL.md](./DATA_MODEL.md) - Modèle de données complet
- [API_ENDPOINTS.md](./API_ENDPOINTS.md) - Endpoints API
- [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) - Plan de développement

---

## 🚀 Notes Importantes

1. **Ne pas créer de gamification lourde**: Pas de badges, niveaux, points au MVP
2. **Focaliser sur la mesurabilité**: Chaque fonctionnalité doit être mesurable
3. **Respecter les principes Atomic Habits**: Chaque champ doit correspondre à un principe
4. **Tester tôt et souvent**: Écrire les tests en parallèle du code
5. **Documenter pendant le développement**: Mettre à jour les docs à chaque étape
