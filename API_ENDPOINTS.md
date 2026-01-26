# API Endpoints - Système de Coaching IA (Atomic Habits)

## 📋 Vue d'ensemble

L'API est construite avec **ORPC** (type-safe RPC) et expose des procédures organisées par domaines fonctionnels. Chaque procédure est protégée par des permissions et des guards.

### Base URL
- Development: `http://localhost:3000/api/rpc`
- Production: Définie dans `VITE_API_BASE_URL`

### Authentication
- Méthode: Session-based (Better Auth)
- Header: `Authorization: Bearer <session_token>` (automatique via cookies)
- Permissions: Vérifiées via `protectedProcedure` avec `permission` middleware

---

## 🗂️ Structure des Routers

```
src/server/routers/
├── habits.ts       # Gestion des habitudes (CRUD)
├── entries.ts      # Tracking des entrées quotidiennes
├── insights.ts     # Coaching IA et insights
├── stats.ts        # Statistiques et analytics
├── reminders.ts    # Gestion des rappels
└── export.ts       # Export des données utilisateur
```

---

## 🎯 Router: Habits (`/habits`)

### 1. `habits.getAll`
**Récupérer toutes les habitudes de l'utilisateur**

```typescript
GET /api/rpc/habits/getAll
```

**Permission**: `habits: ['read']`

**Request**: Aucun body (authentifié)

**Response**:
```typescript
Habit[]
interface Habit {
  id: string
  name: string
  description: string | null
  identity: string
  identityReason: string | null
  triggerType: TriggerType | null
  triggerHabitId: string | null
  triggerHabit: Habit | null
  stackedHabits: Habit[]
  environment: Environment | null
  location: string | null
  cue: string | null
  makeObvious: string | null
  makeAttractive: string | null
  makeEasy: string | null
  makeSatisfying: string | null
  frequency: Frequency
  days: Days[]
  scheduledTime: string | null
  difficulty: Difficulty
  minimumMinutes: number | null
  targetMinutes: number | null
  quantity: string | null
  unit: string | null
  status: HabitStatus
  archivedAt: DateTime | null
  createdAt: DateTime
  updatedAt: DateTime
  userId: string
  user: User

  // Stats en temps réel (calculés)
  _stats?: {
    currentStreak: number
    bestStreak: number
    completionRate: number
    todayCompleted: boolean
  }
}
```

**Exemple de code client**:
```typescript
const { data: habits } = orpc.habits.getAll.useQuery();
```

---

### 2. `habits.getById`
**Récupérer une habitude spécifique**

```typescript
GET /api/rpc/habits/getById
```

**Permission**: `habits: ['read']`

**Request**:
```typescript
{
  id: string
}
```

**Response**: `Habit` (voir ci-dessus)

**Exemple de code client**:
```typescript
const { data: habit } = orpc.habits.getById.useQuery({ id: 'clx...' });
```

---

### 3. `habits.create`
**Créer une nouvelle habitude**

```typescript
POST /api/rpc/habits/create
```

**Permission**: `habits: ['create']`

**Request**:
```typescript
{
  name: string                    // requis, max 100
  description?: string             // max 500
  identity: string                 // requis, max 200
  identityReason?: string         // max 500
  triggerType?: TriggerType        // "after_habit", "before_habit", "time_based", etc.
  triggerHabitId?: string
  environment?: Environment        // "home", "work", "gym", etc.
  location?: string                // max 100
  cue?: string                     // max 500
  makeObvious?: string             // max 500
  makeAttractive?: string          // max 500
  makeEasy?: string                // max 500
  makeSatisfying?: string          // max 500
  frequency: Frequency             // "daily", "weekly", "custom"
  days?: Days[]                    // requis si frequency: "custom"
  scheduledTime?: string           // "07:00", "after_breakfast"
  difficulty: Difficulty          // "beginner", "intermediate", "advanced"
  minimumMinutes?: number          // 1-480
  targetMinutes?: number           // 1-480
  quantity?: string                // max 100
  unit?: string                    // max 50
}
```

**Response**: `Habit`

**Exemple de code client**:
```typescript
const createMutation = orpc.habits.create.useMutation({
  onSuccess: () => {
    toast.success('Habitude créée avec succès !');
    orpc.habits.getAll.invalidate();
  },
});

await createMutation.mutateAsync({
  name: 'Courir',
  identity: 'Je suis quelqu\'un qui court tous les matins',
  frequency: 'daily',
  difficulty: 'beginner',
  environment: 'outdoor',
  makeObvious: 'Pose tes chaussures de course près du lit',
  makeEasy: 'Commence par seulement 5 minutes',
  makeSatisfying: 'Coche sur ton calendrier après chaque course',
});
```

---

### 4. `habits.update`
**Mettre à jour une habitude**

```typescript
PATCH /api/rpc/habits/update
```

**Permission**: `habits: ['update']`

**Request**:
```typescript
{
  id: string
  // Tous les champs de habits.create sont optionnels (PATCH)
}
```

**Response**: `Habit`

**Exemple de code client**:
```typescript
const updateMutation = orpc.habits.update.useMutation();

await updateMutation.mutateAsync({
  id: 'clx...',
  targetMinutes: 15,
  difficulty: 'intermediate',
});
```

---

### 5. `habits.delete`
**Supprimer (archiver) une habitude**

```typescript
DELETE /api/rpc/habits/delete
```

**Permission**: `habits: ['delete']`

**Request**:
```typescript
{
  id: string
  hardDelete?: boolean  // false = soft delete (archivé), true = supprimé
}
```

**Response**:
```typescript
{
  success: boolean
  message: string
}
```

**Exemple de code client**:
```typescript
const deleteMutation = orpc.habits.delete.useMutation();

await deleteMutation.mutateAsync({ id: 'clx...' });
```

---

### 6. `habits.archive`
**Archiver une habitude (soft delete)**

```typescript
POST /api/rpc/habits/archive
```

**Permission**: `habits: ['delete']`

**Request**:
```typescript
{
  id: string
}
```

**Response**: `Habit` (avec `status: 'ARCHIVED'`)

**Exemple de code client**:
```typescript
await orpc.habits.archive.mutate({ id: 'clx...' });
```

---

### 7. `habits.restore`
**Restaurer une habitude archivée**

```typescript
POST /api/rpc/habits/restore
```

**Permission**: `habits: ['update']`

**Request**:
```typescript
{
  id: string
}
```

**Response**: `Habit` (avec `status: 'ACTIVE'`)

---

### 8. `habits.getArchived`
**Récupérer les habitudes archivées**

```typescript
GET /api/rpc/habits/getArchived
```

**Permission**: `habits: ['read']`

**Request**: Aucun

**Response**: `Habit[]`

---

## 📝 Router: Entries (`/entries`)

### 1. `entries.getForDate`
**Récupérer les entrées pour une date spécifique**

```typescript
GET /api/rpc/entries/getForDate
```

**Permission**: `habits: ['read']`

**Request**:
```typescript
{
  date: Date  // ISO date string, ex: "2026-01-26"
}
```

**Response**:
```typescript
HabitEntry[]
interface HabitEntry {
  id: string
  habitId: string
  habit: Habit
  completed: boolean
  completedAt: DateTime | null
  actualQuantity: number | null
  actualUnit: string | null
  notes: string | null
  mood: Mood | null
  skipped: boolean
  skipReason: string | null
  date: DateTime
  createdAt: DateTime
  updatedAt: DateTime
}
```

**Exemple de code client**:
```typescript
const { data: entries } = orpc.entries.getForDate.useQuery({
  date: new Date('2026-01-26')
});
```

---

### 2. `entries.getForDateRange`
**Récupérer les entrées sur une période**

```typescript
GET /api/rpc/entries/getForDateRange
```

**Permission**: `habits: ['read']`

**Request**:
```typescript
{
  startDate: Date
  endDate: Date
  habitId?: string  // optionnel, filtrer par habitude
}
```

**Response**: `HabitEntry[]`

**Exemple de code client**:
```typescript
const { data: entries } = orpc.entries.getForDateRange.useQuery({
  startDate: new Date('2026-01-01'),
  endDate: new Date('2026-01-31'),
  habitId: 'clx...'
});
```

---

### 3. `entries.toggle`
**Toggle la complétion d'une habitude pour un jour**

```typescript
POST /api/rpc/entries/toggle
```

**Permission**: `habits: ['update']`

**Request**:
```typescript
{
  habitId: string
  date?: Date    // défaut: aujourd'hui
  completed?: boolean  // optionnel, force le statut
}
```

**Response**:
```typescript
{
  entry: HabitEntry
  stats: {
    currentStreak: number
    bestStreak: number
    completionRate: number
  }
}
```

**Exemple de code client**:
```typescript
const toggleMutation = orpc.entries.toggle.useMutation({
  onSuccess: () => {
    orpc.entries.getForDate.invalidate();
    orpc.habits.getAll.invalidate();
  },
});

await toggleMutation.mutateAsync({
  habitId: 'clx...'
});
```

---

### 4. `entries.update`
**Mettre à jour une entrée (notes, quantité, humeur)**

```typescript
PATCH /api/rpc/entries/update
```

**Permission**: `habits: ['update']`

**Request**:
```typescript
{
  id: string
  notes?: string
  actualQuantity?: number
  actualUnit?: string
  mood?: Mood
  skipped?: boolean
  skipReason?: string
}
```

**Response**: `HabitEntry`

---

### 5. `entries.batchToggle`
**Toggle plusieurs habitudes en une fois**

```typescript
POST /api/rpc/entries/batchToggle
```

**Permission**: `habits: ['update']`

**Request**:
```typescript
{
  habitIds: string[]
  date?: Date    // défaut: aujourd'hui
  completed?: boolean
}
```

**Response**:
```typescript
{
  entries: HabitEntry[]
  stats: {
    totalCompleted: number
    currentStreak: number
    bestStreak: number
  }
}
```

---

## 🧠 Router: Insights (`/insights`)

### 1. `insights.getAll`
**Récupérer tous les insights de l'utilisateur**

```typescript
GET /api/rpc/insights/getAll
```

**Permission**: `habits: ['read']`

**Request**:
```typescript
{
  viewed?: boolean    // filtrer par statut de lecture
  category?: InsightCategory  // filtrer par catégorie
}
```

**Response**:
```typescript
HabitInsight[]
interface HabitInsight {
  id: string
  userId: string
  insightType: InsightType    // "pattern", "recommendation", "achievement", "warning"
  title: string
  description: string
  actionText: string | null
  actionUrl: string | null
  habitId: string | null
  habit: Habit | null
  dataJson: Json | null
  category: InsightCategory    // "identity", "stacking", "environment", etc.
  viewed: boolean
  dismissed: boolean
  actedUpon: boolean
  createdAt: DateTime
  expiresAt: DateTime | null
}
```

**Exemple de code client**:
```typescript
const { data: insights } = orpc.insights.getAll.useQuery({
  viewed: false  // Seulement les insights non lus
});
```

---

### 2. `insights.markViewed`
**Marquer un insight comme vu**

```typescript
POST /api/rpc/insights/markViewed
```

**Permission**: `habits: ['read']`

**Request**:
```typescript
{
  id: string
}
```

**Response**: `HabitInsight`

---

### 3. `insights.dismiss`
**Ignorer un insight**

```typescript
POST /api/rpc/insights/dismiss
```

**Permission**: `habits: ['read']`

**Request**:
```typescript
{
  id: string
}
```

**Response**: `HabitInsight`

---

### 4. `insights.markActedUpon`
**Marquer qu'une action a été prise sur un insight**

```typescript
POST /api/rpc/insights/markActedUpon
```

**Permission**: `habits: ['update']`

**Request**:
```typescript
{
  id: string
}
```

**Response**: `HabitInsight`

---

### 5. `insights.generate`
**Générer manuellement de nouveaux insights (admin/trigger)**

```typescript
POST /api/rpc/insights/generate
```

**Permission**: `habits: ['create']` (ou admin)

**Request**:
```typescript
{
  category?: InsightCategory    // optionnel, générer pour une catégorie spécifique
}
```

**Response**:
```typescript
{
  insights: HabitInsight[]
  count: number
}
```

---

## 📊 Router: Stats (`/stats`)

### 1. `stats.getHabitStats`
**Récupérer les statistiques d'une habitude**

```typescript
GET /api/rpc/stats/getHabitStats
```

**Permission**: `habits: ['read']`

**Request**:
```typescript
{
  habitId: string
  period: StatsPeriod    // "day", "week", "month", "all_time"
}
```

**Response**:
```typescript
HabitStats
interface HabitStats {
  id: string
  habitId: string
  period: StatsPeriod
  startDate: DateTime
  endDate: DateTime
  totalDays: number
  completedDays: number
  completionRate: number
  currentStreak: number
  bestStreak: number
  trend: TrendDirection
  dataJson: Json | null
  calculatedAt: DateTime
}
```

**Exemple de code client**:
```typescript
const { data: stats } = orpc.stats.getHabitStats.useQuery({
  habitId: 'clx...',
  period: 'month'
});
```

---

### 2. `stats.getOverallStats`
**Récupérer les statistiques globales de l'utilisateur**

```typescript
GET /api/rpc/stats/getOverallStats
```

**Permission**: `habits: ['read']`

**Request**:
```typescript
{
  period: StatsPeriod
}
```

**Response**:
```typescript
{
  totalHabits: number
  activeHabits: number
  totalEntries: number
  completedEntries: number
  overallCompletionRate: number
  averageStreak: number
  bestStreak: number
  habitsByDifficulty: {
    beginner: number
    intermediate: number
    advanced: number
  }
  topHabits: Array<{
    habitId: string
    habitName: string
    completionRate: number
    currentStreak: number
  }>
  weakHabits: Array<{
    habitId: string
    habitName: string
    completionRate: number
    lastCompleted: DateTime
  }>
  insightsCount: {
    total: number
    unread: number
    actionable: number
  }
}
```

---

### 3. `stats.getWeeklyReport`
**Récupérer un rapport hebdomadaire**

```typescript
GET /api/rpc/stats/getWeeklyReport
```

**Permission**: `habits: ['read']`

**Request**:
```typescript
{
  weekStart: Date    // date de début de la semaine
}
```

**Response**:
```typescript
{
  weekStart: DateTime
  weekEnd: DateTime
  totalHabits: number
  completedDays: Array<{
    date: DateTime
    completed: number
    total: number
  }>
  bestDay: {
    day: string    // "Monday", "Tuesday", etc.
    completionRate: number
  }
  worstDay: {
    day: string
    completionRate: number
  }
  improvement: {
    previousWeekRate: number
    currentWeekRate: number
    change: number    // en %
  }
  achievements: string[]    // "7-day streak", "Perfect week", etc.
}
```

---

### 4. `stats.recalculate`
**Recalculer toutes les statistiques (admin/trigger)**

```typescript
POST /api/rpc/stats/recalculate
```

**Permission**: `habits: ['update']` (ou admin)

**Request**:
```typescript
{
  habitId?: string    // optionnel, recalculer tout si non spécifié
}
```

**Response**:
```typescript
{
  recalculated: number
  message: string
}
```

---

## ⏰ Router: Reminders (`/reminders`)

### 1. `reminders.getForHabit`
**Récupérer les rappels d'une habitude**

```typescript
GET /api/rpc/reminders/getForHabit
```

**Permission**: `habits: ['read']`

**Request**:
```typescript
{
  habitId: string
}
```

**Response**:
```typescript
HabitReminder[]
interface HabitReminder {
  id: string
  habitId: string
  reminderTime: string    // "07:00"
  reminderType: ReminderType  // "push", "email", "both"
  message: string | null
  days: Days[]
  active: boolean
  lastSentAt: DateTime | null
  nextSendAt: DateTime | null
  createdAt: DateTime
  updatedAt: DateTime
}
```

---

### 2. `reminders.create`
**Créer un rappel**

```typescript
POST /api/rpc/reminders/create
```

**Permission**: `habits: ['create']`

**Request**:
```typescript
{
  habitId: string
  reminderTime: string
  reminderType: ReminderType
  message?: string
  days: Days[]
}
```

**Response**: `HabitReminder`

---

### 3. `reminders.update`
**Mettre à jour un rappel**

```typescript
PATCH /api/rpc/reminders/update
```

**Permission**: `habits: ['update']`

**Request**:
```typescript
{
  id: string
  // Tous les champs de reminders.create sont optionnels
}
```

**Response**: `HabitReminder`

---

### 4. `reminders.delete`
**Supprimer un rappel**

```typescript
DELETE /api/rpc/reminders/delete
```

**Permission**: `habits: ['delete']`

**Request**:
```typescript
{
  id: string
}
```

**Response**:
```typescript
{
  success: boolean
  message: string
}
```

---

## 📤 Router: Export (`/export`)

### 1. `export.getUserData`
**Exporter toutes les données de l'utilisateur**

```typescript
GET /api/rpc/export/getUserData
```

**Permission**: `habits: ['read']`

**Request**:
```typescript
{
  format?: 'json' | 'csv'    // défaut: json
  startDate?: Date          // optionnel
  endDate?: Date            // optionnel
}
```

**Response**:
```typescript
// Si format: json
{
  user: {
    id: string
    name: string
    email: string
    createdAt: DateTime
  }
  habits: Habit[]
  entries: HabitEntry[]
  stats: HabitStats[]
  insights: HabitInsight[]
  exportedAt: DateTime
}

// Si format: csv
// Texte CSV avec tous les habits et entries
```

**Exemple de code client**:
```typescript
const { data } = orpc.export.getUserData.useQuery({
  format: 'json',
  startDate: new Date('2026-01-01'),
  endDate: new Date('2026-12-31')
});

// Download as file
const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `habits-export-${new Date().toISOString().split('T')[0]}.json`;
a.click();
```

---

### 2. `export.getHabitData`
**Exporter les données d'une habitude spécifique**

```typescript
GET /api/rpc/export/getHabitData
```

**Permission**: `habits: ['read']`

**Request**:
```typescript
{
  habitId: string
  format?: 'json' | 'csv'
}
```

**Response**:
```typescript
{
  habit: Habit
  entries: HabitEntry[]
  stats: HabitStats[]
  exportedAt: DateTime
}
```

---

## 🔐 Codes d'Erreur

### ORPCError Standards

| Code HTTP | Code ORPC | Description |
|-----------|-----------|-------------|
| 400 | BAD_REQUEST | Requête invalide |
| 401 | UNAUTHORIZED | Non authentifié |
| 403 | FORBIDDEN | Permissions insuffisantes |
| 404 | NOT_FOUND | Ressource non trouvée |
| 409 | CONFLICT | Conflit (ex: entrée existe déjà) |
| 500 | INTERNAL_SERVER_ERROR | Erreur serveur |
| 429 | TOO_MANY_REQUESTS | Trop de requêtes |

### Exemples d'Erreurs

**Erreur de validation**:
```json
{
  "code": "BAD_REQUEST",
  "message": "Validation error",
  "details": {
    "errors": [
      {
        "path": ["name"],
        "message": "Name is required"
      }
    ]
  }
}
```

**Erreur de permission**:
```json
{
  "code": "FORBIDDEN",
  "message": "You don't have permission to update this habit"
}
```

---

## 🧪 Testing les Endpoints

### Via cURL

**Créer une habitude**:
```bash
curl -X POST http://localhost:3000/api/rpc/habits/create \
  -H "Content-Type: application/json" \
  -H "Cookie: session=your_session_token" \
  -d '{
    "name": "Lire",
    "identity": "Je suis quelqu\"un qui lit tous les jours",
    "frequency": "daily",
    "difficulty": "beginner"
  }'
```

**Récupérer toutes les habitudes**:
```bash
curl http://localhost:3000/api/rpc/habits/getAll \
  -H "Cookie: session=your_session_token"
```

**Toggle une entrée**:
```bash
curl -X POST http://localhost:3000/api/rpc/entries/toggle \
  -H "Content-Type: application/json" \
  -H "Cookie: session=your_session_token" \
  -d '{
    "habitId": "clx..."
  }'
```

---

## 📚 Références TypeScript

### Types Complets

```typescript
// Enums
type Frequency = 'daily' | 'weekly' | 'custom';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';
type HabitStatus = 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
type TriggerType = 'after_habit' | 'before_habit' | 'time_based' | 'location_based' | 'event_based';
type Environment = 'home' | 'work' | 'gym' | 'outdoor' | 'mobile' | 'custom';
type Mood = 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
type ReminderType = 'push' | 'email' | 'both';
type InsightType = 'pattern' | 'recommendation' | 'achievement' | 'warning';
type InsightCategory = 'identity' | 'stacking' | 'environment' | 'four_laws' | 'tracking';
type StatsPeriod = 'day' | 'week' | 'month' | 'all_time';
type TrendDirection = 'up' | 'down' | 'stable';

// Days
type Days = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
```

---

## 🚀 Notes d'Implementation

### Performance
- Utiliser les indexes définis dans le modèle Prisma
- Pagination pour les listes longues (entrées, insights)
- Cache TanStack Query avec `staleTime: 5min`

### Sécurité
- Toutes les procédures sont protégées par `protectedProcedure`
- Vérification de `userId` pour s'assurer que l'utilisateur accède seulement à ses données
- Admins peuvent accéder à toutes les données via permissions spéciales

### Logging
- Utiliser `context.logger` pour les logs structurés
- Logger les erreurs avec des détails pertinents
- Logger les actions importantes (création, suppression)

### Validation
- Utiliser Zod schemas pour toutes les inputs
- Validation côté serveur ET côté client
- Messages d'erreur clairs et traduits

---

## 🔄 Versioning

L'API utilise ORPC qui fournit des types TypeScript stricts. Les changements brisants doivent:
1. Créer une nouvelle version du router
2. Garder l'ancienne version pendant une période de transition
3. Documenter les changements dans les notes de version
