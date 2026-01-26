# Modèle de Données - Système de Coaching IA (Atomic Habits)

## 📊 Schéma Prisma Complet

### 1. Models Habitudes (Habit)

```prisma
model Habit {
  id          String   @id @default(cuid())
  name        String
  description String?  // Description plus détaillée de l'habitude

  // === ATOMIC HABITS PRINCIPLES ===

  // Identity-Based Habits
  identity    String   // "Je suis quelqu'un qui..." - ex: "Je suis quelqu'un qui s'entraîne"
  identityReason String? // Pourquoi cette identité est importante

  // Habit Stacking
  triggerType TriggerType? // "after_habit", "before_habit", "time", "location"
  triggerHabitId String?   // ID de l'habitude déclencheur (pour stacking)
  triggerHabit   Habit?    @relation("HabitStacking", fields: [triggerHabitId], references: [id])
  stackedHabits Habit[]    @relation("HabitStacking")

  // Environment Design
  environment  Environment? // "home", "work", "gym", "outdoor", "mobile"
  location     String?      // Lieu spécifique - ex: "salon", "bureau", "salle de sport"
  cue          String?      // Déclencheur visuel/auditif - ex: "voir mes chaussures de course"

  // The 4 Laws of Behavior Change
  makeObvious  String?      // Comment rendre évident - ex: "poser le livre sur l'oreiller"
  makeAttractive String?    // Comment rendre attrayant - ex: "écouter du jazz pendant"
  makeEasy     String?      // Comment rendre facile - ex: "commencer par 5 min"
  makeSatisfying String?   // Comment rendre satisfaisant - ex: "cocher sur mon calendrier"

  // === CONFIGURATION ===

  // Fréquence
  frequency    Frequency // "daily", "weekly", "custom"
  days         Days[]    // Jours de la semaine (pour custom)
  scheduledTime String?   // Heure programmée - ex: "07:00", "after_breakfast"

  // Difficulté
  difficulty   Difficulty // "beginner", "intermediate", "advanced"
  minimumMinutes Int?     // Durée minimum recommandée
  targetMinutes Int?      // Durée cible

  // Quantité
  quantity     String?   // Quantité mesurable - ex: "30 min", "5km", "10 pages"
  unit         String?   // Unité - ex: "min", "km", "pages", "times"

  // === STATUT & MÉTADONNÉES ===

  status       HabitStatus @default(ACTIVE)
  archivedAt   DateTime?
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  // Relations
  userId       String
  user         User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  entries      HabitEntry[]
  reminders    HabitReminder[]

  // Indexes
  @@index([userId, status])
  @@index([triggerHabitId])
  @@map("habit")
}
```

### 2. Model Entrées de Suivi (HabitEntry)

```prisma
model HabitEntry {
  id          String         @id @default(cuid())
  habitId     String
  habit       Habit          @relation(fields: [habitId], references: [id], onDelete: Cascade)

  // Complétion
  completed   Boolean        @default(false)
  completedAt DateTime?      // Quand marqué comme complété

  // Quantité réelle (si applicable)
  actualQuantity Float?     // Quantité réelle effectuée
  actualUnit   String?      // Unité réelle utilisée

  // Notes
  notes       String?       // Notes sur cette entrée
  mood        Mood?         // Comment l'utilisateur s'est senti après

  // Contexte
  skipped     Boolean        @default(false)
  skipReason  String?       // Pourquoi sauté

  // Metadata
  date        DateTime      @default(now()) // Date de l'entrée (pour queries par jour)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  // Indexes pour queries rapides
  @@index([habitId, date])
  @@index([userId, date])
  @@unique([habitId, date])
  @@map("habit_entry")
}
```

### 3. Model Rappels (HabitReminder)

```prisma
model HabitReminder {
  id          String    @id @default(cuid())
  habitId     String
  habit       Habit     @relation(fields: [habitId], references: [id], onDelete: Cascade)

  // Configuration du rappel
  reminderTime String   // Heure du rappel - ex: "07:00"
  reminderType ReminderType // "push", "email", "both"
  message     String?   // Message personnalisé du rappel

  // Fréquence des rappels
  days        Days[]    // Jours où envoyer le rappel

  // Statut
  active      Boolean   @default(true)
  lastSentAt  DateTime?
  nextSendAt  DateTime?

  // Metadata
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Indexes
  @@index([habitId])
  @@index([nextSendAt])
  @@map("habit_reminder")
}
```

### 4. Model Coaching AI (HabitInsight)

```prisma
model HabitInsight {
  id          String        @id @default(cuid())
  userId      String
  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Type d'insight
  insightType InsightType  // "pattern", "recommendation", "achievement", "warning"

  // Contenu de l'insight
  title       String        // Titre court de l'insight
  description String        // Description détaillée
  actionText  String?       // Texte du bouton d'action (si applicable)
  actionUrl   String?       // URL de l'action (si applicable)

  // Données analysées
  habitId     String?       // Habitude concernée (si applicable)
  habit       Habit?        @relation(fields: [habitId], references: [id])
  dataJson    Json?         // Données brutes de l'analyse

  // Catégorie Atomic Habits
  category    InsightCategory // "identity", "stacking", "environment", "four_laws", "tracking"

  // Statut
  viewed      Boolean       @default(false)
  dismissed   Boolean       @default(false)
  actedUpon   Boolean       @default(false)

  // Metadata
  createdAt   DateTime      @default(now())
  expiresAt   DateTime?     // Quand l'insight n'est plus pertinent

  // Indexes
  @@index([userId, viewed])
  @@index([userId, createdAt])
  @@map("habit_insight")
}
```

### 5. Model Statistiques (HabitStats)

```prisma
model HabitStats {
  id          String   @id @default(cuid())
  habitId     String
  habit       Habit    @relation(fields: [habitId], references: [id], onDelete: Cascade)

  // Période de la statistique
  period      StatsPeriod // "day", "week", "month", "all_time"
  startDate   DateTime
  endDate     DateTime

  // Métriques de base
  totalDays   Int      @default(0)      // Nombre total de jours dans la période
  completedDays Int    @default(0)      // Jours complétés
  completionRate Float @default(0)     // Taux de complétion (0-100)

  // Streaks
  currentStreak Int    @default(0)      // Streak actuel (au moment du calcul)
  bestStreak    Int    @default(0)      // Meilleur streak sur la période

  // Tendances
  trend        TrendDirection @default(STABLE) // "up", "down", "stable"

  // Données supplémentaires
  dataJson     Json?    // Données spécifiques à la période

  // Metadata
  calculatedAt DateTime @default(now())
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Indexes
  @@unique([habitId, period, startDate, endDate])
  @@index([habitId, period])
  @@map("habit_stats")
}
```

---

## 🎯 Enums

### Frequency (Fréquence d'habitude)
```prisma
enum Frequency {
  DAILY      // Tous les jours
  WEEKLY     // Une fois par semaine
  CUSTOM     // Jours personnalisés (lundi, mercredi, etc.)
}
```

### Difficulty (Difficulté de l'habitude)
```prisma
enum Difficulty {
  BEGINNER       // Habitude facile, 2-5 min/jour
  INTERMEDIATE   // Habitude modérée, 5-15 min/jour
  ADVANCED       // Habitude difficile, 15+ min/jour
}
```

### HabitStatus (Statut de l'habitude)
```prisma
enum HabitStatus {
  ACTIVE         // Habitude active
  PAUSED         // Habitude temporairement suspendue
  ARCHIVED       // Habitude archivée (supprimée soft delete)
}
```

### TriggerType (Type de déclencheur)
```prisma
enum TriggerType {
  AFTER_HABIT    // Après une autre habitude (stacking)
  BEFORE_HABIT   // Avant une autre habitude (stacking)
  TIME_BASED     // À une heure spécifique
  LOCATION_BASED // À un lieu spécifique
  EVENT_BASED    // Après un événement spécifique
}
```

### Environment (Environnement de l'habitude)
```prisma
enum Environment {
  HOME           // Maison
  WORK           // Travail
  GYM            // Salle de sport
  OUTDOOR        // Extérieur
  MOBILE         // En déplacement
  CUSTOM         // Autre
}
```

### Mood (Humeur après l'habitude)
```prisma
enum Mood {
  GREAT          // Excellent
  GOOD           // Bien
  NEUTRAL        // Neutre
  BAD            // Mauvais
  TERRIBLE       // Terrible
}
```

### ReminderType (Type de rappel)
```prisma
enum ReminderType {
  PUSH           // Notification push
  EMAIL          // Email
  BOTH           // Les deux
}
```

### InsightType (Type d'insight IA)
```prisma
enum InsightType {
  PATTERN        // Analyse de pattern
  RECOMMENDATION // Recommandation d'amélioration
  ACHIEVEMENT    // Accomplissement à célébrer
  WARNING        // Avertissement (ex: déclin)
}
```

### InsightCategory (Catégorie de l'insight selon Atomic Habits)
```prisma
enum InsightCategory {
  IDENTITY       // Alignement avec l'identité
  STACKING       // Empilement d'habitudes
  ENVIRONMENT    // Optimisation de l'environnement
  FOUR_LAWS      // Respect des 4 lois du changement
  TRACKING       // Suivi et tracking
}
```

### StatsPeriod (Période de statistiques)
```prisma
enum StatsPeriod {
  DAY            // Un jour
  WEEK           // Une semaine
  MONTH          // Un mois
  ALL_TIME       // Tout le temps
}
```

### TrendDirection (Direction de la tendance)
```prisma
enum TrendDirection {
  UP             // En amélioration
  DOWN           // En déclin
  STABLE         // Stable
}
```

---

## 🔗 Relations

### User Relations
```prisma
model User {
  // ... existing fields ...

  habits       Habit[]
  habitEntries HabitEntry[] // Via habit relation
  insights     HabitInsight[]
}
```

---

## 📊 Indexes pour Performance

### Queries Principales et Indexes Correspondants

1. **Récupérer toutes les habitudes actives d'un utilisateur**
   ```typescript
   // Query
   db.habit.findMany({
     where: { userId, status: 'ACTIVE' }
   })
   ```
   Index: `@@index([userId, status])`

2. **Récupérer les entrées d'une habitude sur une période**
   ```typescript
   // Query
   db.habitEntry.findMany({
     where: {
       habitId,
       date: { gte: startDate, lte: endDate }
     },
     orderBy: { date: 'asc' }
   })
   ```
   Index: `@@index([habitId, date])`

3. **Récupérer les entrées d'un utilisateur pour un jour**
   ```typescript
   // Query
   db.habitEntry.findMany({
     where: {
       habit: { userId },
       date: todayDate
     }
   })
   ```
   Index: `@@index([userId, date])`

4. **Récupérer les insights non vus d'un utilisateur**
   ```typescript
   // Query
   db.habitInsight.findMany({
     where: { userId, viewed: false },
     orderBy: { createdAt: 'desc' }
   })
   ```
   Index: `@@index([userId, viewed])`

5. **Récupérer les habitudes empilées sur une habitude**
   ```typescript
   // Query
   db.habit.findMany({
     where: { triggerHabitId }
   })
   ```
   Index: `@@index([triggerHabitId])`

---

## 🔄 Transitions d'État

### Workflow de Création d'Habitude
```
1. Formulaire → Validation Zod
2. Création Habit (status: ACTIVE)
3. (Optionnel) Création HabitReminder
4. Première entrée automatique si aujourd'hui dans days[]
```

### Workflow de Tracking
```
1. User toggle completion
2. Check si HabitEntry existe pour ce jour
   - Non → Créer nouvelle entrée
   - Oui → Toggle completed
3. Recalculer streaks
4. Générer insight si nécessaire
5. Invalider cache
```

### Workflow d'Archivage
```
1. Soft delete: status → ARCHIVED
2. archivedAt ← now()
3. Garder toutes les entrées et stats
4. Invalider cache
```

---

## 🧮 Calculs Automatiques

### Streaks
- **Current Streak**: Nombre de jours consécutifs complétés jusqu'à aujourd'hui
- **Best Streak**: Plus longue séquence de jours complétés
- **Calcul**: Query les entrées triées par date, compter les séquences continues

### Completion Rate
- **Formule**: `(completedDays / totalDays) * 100`
- **Periodes**: Jour, Semaine, Mois, All-time

### Trend
- **Calcul**: Comparer taux de complétion des 7 derniers jours vs. 7 jours précédents
- **UP**: +10% ou plus
- **DOWN**: -10% ou plus
- **STABLE**: Entre -10% et +10%

---

## 📋 Validation Zod (Exemples)

### Habit Creation Schema
```typescript
const habitCreateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  identity: z.string().min(1).max(200),
  identityReason: z.string().max(500).optional(),
  triggerType: z.nativeEnum(TriggerType).optional(),
  triggerHabitId: z.string().optional(),
  environment: z.nativeEnum(Environment).optional(),
  location: z.string().max(100).optional(),
  cue: z.string().max(500).optional(),
  makeObvious: z.string().max(500).optional(),
  makeAttractive: z.string().max(500).optional(),
  makeEasy: z.string().max(500).optional(),
  makeSatisfying: z.string().max(500).optional(),
  frequency: z.nativeEnum(Frequency),
  days: z.array(z.nativeEnum(Days)).optional(),
  scheduledTime: z.string().max(50).optional(),
  difficulty: z.nativeEnum(Difficulty),
  minimumMinutes: z.number().int().min(1).max(480).optional(),
  targetMinutes: z.number().int().min(1).max(480).optional(),
  quantity: z.string().max(100).optional(),
  unit: z.string().max(50).optional(),
});
```

---

## 🚀 Migration Strategy

### Étapes de Migration
1. **Backup**: Sauvegarder la base de données existante
2. **Create new models**: Créer Habit, HabitEntry, etc.
3. **Migrate existing habits**:
   - Convertir `Habits` → `Habit`
   - Mapper les champs existants vers les nouveaux
   - Définir des valeurs par défaut pour les nouveaux champs
4. **Create initial entries**:
   - Si des entrées existent, les migrer vers `HabitEntry`
5. **Remove old model**: Supprimer l'ancien modèle `Habits`
6. **Test**: Vérifier toutes les fonctionnalités

### Données par Défaut pour la Migration
```typescript
const defaults = {
  status: 'ACTIVE' as HabitStatus,
  difficulty: 'BEGINNER' as Difficulty,
  frequency: 'CUSTOM' as Frequency,
  // Autres champs avec valeurs par défaut
};
```

---

## 📚 Documentation des Champs

### Champs Obligatoires
- `name`: Nom de l'habitude (ex: "Lire", "Courir", "Méditer")
- `identity`: Déclaration d'identité (ex: "Je suis quelqu'un qui lit tous les jours")
- `frequency`: Fréquence de l'habitude
- `difficulty`: Niveau de difficulté

### Champs Recommandés
- `description`: Pour clarifier l'habitude
- `triggerType`: Pour l'empilement ou le timing
- `environment`: Pour optimiser l'environnement
- `makeObvious`, `makeAttractive`, `makeEasy`, `makeSatisfying`: Pour les 4 lois

### Champs Optionnels
- `location`, `cue`, `quantity`, `unit`: Pour les détails spécifiques
- `reminderTime`, `reminderType`: Pour les rappels

---

## 🎯 Bonnes Pratiques

1. **Toujours valider** avec Zod avant de créer/mettre à jour
2. **Utiliser les transactions** pour les opérations multiples
3. **Recalculer les stats** après chaque mutation importante
4. **Générer des insights** de manière asynchrone
5. **Archiver au lieu de supprimer** pour garder l'historique
6. **Invalider le cache** TanStack Query après les mutations
