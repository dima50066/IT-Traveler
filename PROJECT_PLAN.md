# 🚀 Покроковий, детальний план розробки IT Traveler 2.0

## 🔐 0. Після логіну: Головна сторінка

### UI:

- Панель користувача:

  - Аватар, нікнейм, повідомлення
  - Сповіщення (нові запрошення, нові повідомлення у подорожах)

- Інтерактивна карта:

  - Показ поточних активних подорожей
  - Візуалізація точок та маршрутів

- Кнопка «Створити подорож»
- Випадаюче меню:

  - 📚 Мої подорожі
  - 💡 Обрані місця
  - 📝 To-do
  - 🧾 Бюджет
  - 💬 Чати (по подорожах)
  - ⚙️ Налаштування акаунту
  - 🚪 Вийти

---

## 🧳 1. Створення та управління подорожами

### Backend Модель Trip:

```ts
{
  _id,
  title,
  description,
  startDate,
  endDate,
  status, // Enum: planned | in_progress | completed
  userId,
  collaborators: [userId], // всі учасники
  chatId: string,          // 🆕 ← зв'язок з чатом
  budget: {
    transport,
    accommodation,
    food,
    other
  },
  todoList: [String],
  createdAt,
  updatedAt
}
```

### API:

- POST /trips
- GET /trips
- PATCH /trips/\:id
- DELETE /trips/\:id
- PATCH /trips/\:id/invite
- GET /trips/\:id/summary

---

## 🗺 2. Точки та маршрути

### Backend Модель Point:

```ts
{
  _id,
  tripId,
  userId,
  coords: { lat, lng },
  title,
  notes,
  dayNumber,
  orderIndex, // Optional
  transportMode, // Enum: car | walk | public | plane
  category, // Enum: food | history | nature | other
  distance, // Auto-calculated
  duration, // Auto-calculated
  createdAt,
  updatedAt
}
```

### API:

- POST /trips/\:id/points
- PATCH /points/\:id
- DELETE /points/\:id
- GET /points?category=

---

## ✈️ 3. Логіка навігації

- Використання Mapbox Directions API
- Розрахунок та збереження дистанції й часу
- Автоматичний апдейт маршрутів при зміні точок

---

## 📋 4. Управління To-do та нотатками

- Інтеграція `todoList` у Trip
- Додавання нотаток для точок
- Оновлення списку в реальному часі

---

## 💰 5. Управління бюджетом

- Окремий компонент для внесення та перегляду витрат
- Автоматичний підрахунок бюджету
- Категоризація витрат

---

## 👥 6. Колаборативна робота

- Система запрошень та підтвердження
- Права доступу (owner, collaborator)
- Відстеження дій кожного користувача
- 🆕 **Коли користувача додають до Trip → він автоматично додається до чату цієї подорожі**

---

## 💬 7. Чати прив’язані до подорожей (`Trip`)

> **Ключова ідея:** один чат = одна подорож. Усі учасники `Trip.collaborators` автоматично приєднані.

### Backend:

- Модель повідомлень (Redis або Mongo):

```ts
{
  messageId: string,
  tripId: string,         // ✅ ключове поле
  senderId: string,
  senderName: string,
  message: string,
  timestamp: string
}
```

- Socket.IO:

  - `chat:join:trip:{tripId}` — приєднання до чату подорожі
  - `chat:message` — надсилання
  - `chat:leave` — вихід з каналу

- Redis key pattern: `tripChat:{tripId}`

- API:

  - `POST /trips/:id/chat/messages` — відправити
  - `GET /trips/:id/chat/messages` — історія
  - (опціонально) `GET /trips/:id/chat/unread-count`

### Frontend:

- Компонент `ChatView.vue`:

  - Підключення через `socket.join('trip:' + tripId)`
  - Відображення історії
  - Надсилання повідомлень
  - Автопрокрутка, маркування нових
  - У шапці чату — назва подорожі

- У `TripSidebar.vue` — посилання на чат

- 🔐 Доступ тільки для тих, хто є у `trip.collaborators`

---

## ❤️ 8. Обране: wishlist / visited

### Backend:

- Модель UserPointStatus:

```ts
{
  _id,
    userId,
    pointId,
    status, // Enum: wishlist | visited
    createdAt,
    updatedAt;
}
```

### API:

- PATCH /points/\:id/status
- GET /user/points?status=

---

## 📊 9. Аналітика подорожей

- Окрема статистика по подорожах, бюджетам, категоріям та транспорту

---

## 🛠 Архітектура компонентів Frontend

```txt
📁 components/
├── Trip/
│   ├── TripModal.vue
│   ├── TripCard.vue
│   ├── TripSidebar.vue
│   ├── TripTodo.vue
│   ├── TripBudget.vue
│   └── ChatView.vue ← прив'язаний до tripId
├── Map/
│   ├── MapView.vue
│   ├── PointMarker.vue
│   └── RouteLine.vue
├── UI/
│   ├── Dropdown.vue
│   └── Modal.vue
└── Shared/
    └── UserAvatar.vue
```

# 🚀 Step-by-Step Development Plan for IT Traveler 2.0

## 🔐 0. After Login: Main Dashboard

### UI:

- **User Panel:**

  - Avatar, nickname, messages
  - Notifications (new invites, new messages per trip)

- **Interactive Map:**

  - Display current active trips
  - Visualization of points and routes

- **Create Trip** button

- **Dropdown Menu:**
  - 📚 My Trips
  - 💡 Favorite Places
  - 📝 To-do
  - 🧾 Budget
  - 💬 Trip Chats (per trip)
  - ⚙️ Account Settings
  - 🚪 Logout

---

## 🧳 1. Creating & Managing Trips

### Backend `Trip` Model:

```ts
{
  _id,
  title,
  description,
  startDate,
  endDate,
  status, // Enum: planned | in_progress | completed
  userId,
  collaborators: [userId], // all members
  chatId: string,          // 🆕 link to chat
  budget: {
    transport,
    accommodation,
    food,
    other
  },
  todoList: [String],
  createdAt,
  updatedAt
}
```

### API Endpoints:

- POST /trips
- GET /trips
- PATCH /trips/\:id
- DELETE /trips/\:id
- PATCH /trips/\:id/invite
- GET /trips/\:id/summary

---

## 🗺 2. Points & Routes

### Backend `Point` Model:

```ts
{
  _id,
  tripId,
  userId,
  coords: { lat, lng },
  title,
  notes,
  dayNumber,
  orderIndex, // Optional
  transportMode: "car" | "walk" | "public" | "plane",
  category: "food" | "history" | "nature" | "other",
  distance, // Auto-calculated
  duration, // Auto-calculated
  createdAt,
  updatedAt
}
```

### API:

- POST /trips/\:id/points
- PATCH /points/\:id
- DELETE /points/\:id
- GET /points?category=

---

## ✈️ 3. Navigation Logic

- Use Mapbox Directions API
- Auto-calculate distance & duration
- Auto-update routes when points are changed

---

## 📋 4. To-do List & Notes

- Integrate `todoList` directly in `Trip`
- Add notes to points
- Realtime updates of checklists

---

## 💰 5. Budget Management

- Separate component for expenses
- Auto-calculated budget summary
- Categorized expenses: transport, food, etc.

---

## 👥 6. Collaborative Features

- Invite system with confirmation
- Access roles: `owner`, `collaborator`
- Activity tracking for each user
- 🆕 When a user is added to a trip → they automatically join the trip's chat

---

## 💬 7. Private Trip-Based Chats (Redis)

> **Key idea:** one chat = one trip. Only collaborators of the trip have access.

### Backend:

- **Chat message structure (Redis or Mongo):**

```ts
{
  messageId: string,
  tripId: string,         // ✅ critical link
  senderId: string,
  senderName: string,
  message: string,
  timestamp: string
}
```

- **Socket.IO Events:**

  - `chat:join:trip:{tripId}` — join chat room
  - `chat:message` — send a message
  - `chat:leave` — leave chat

- **Redis key pattern:** `tripChat:{tripId}`

- **API Endpoints:**

  - POST /trips/\:id/chat/messages — send
  - GET /trips/\:id/chat/messages — load history
  - (optional) GET /trips/\:id/chat/unread-count

### Frontend:

- `ChatView.vue` component:

  - Connects via `socket.join('trip:' + tripId)`
  - Displays full history
  - Sends messages
  - Auto-scroll + new message marker
  - Shows trip title in header

- `TripSidebar.vue` — contains a link to the trip chat

- 🔐 **Access control:** only `trip.collaborators` can use the chat

---

## ❤️ 8. Wishlist & Visited Points

### Backend `UserPointStatus` Model:

```ts
{
  _id,
    userId,
    pointId,
    status, // Enum: wishlist | visited
    createdAt,
    updatedAt;
}
```

### API:

- PATCH /points/\:id/status
- GET /user/points?status=

---

## 📊 9. Trip Analytics

- Statistics on trips, budgets, categories, and transport modes

---

## 🛠 Frontend Component Architecture

```txt
📁 components/
├── Trip/
│   ├── TripModal.vue
│   ├── TripCard.vue
│   ├── TripSidebar.vue
│   ├── TripTodo.vue
│   ├── TripBudget.vue
│   └── ChatView.vue ← tied to tripId
├── Map/
│   ├── MapView.vue
│   ├── PointMarker.vue
│   └── RouteLine.vue
├── UI/
│   ├── Dropdown.vue
│   └── Modal.vue
└── Shared/
    └── UserAvatar.vue
```
