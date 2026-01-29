# 🔮 Palantír Server

> Backend API for Palantír - Real-time communication platform inspired by Lord of the Rings

## 📖 Glossary

| Theme | Technical | Description |
|-------|-----------|-------------|
| Palantír | App | The communication platform |
| Realm | Server | Community space |
| Hall | Channel | Chat room |
| Scroll | Message | Chat message |
| Traveler | User | Registered user |
| Warden | Admin | Realm administrator |
| Gandalf | AI | AI assistant |
| Gate Password | Invite Code | Code to join realm |

## 🛠 Tech Stack

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **Socket.io** (real-time)
- **JWT** (authentication)
- **OpenAI** (AI integration)

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/ArthurSJz/palantir-server.git
cd palantir-server
npm install
```

### 2. Configure Environment

Create `.env` file:
```env
PORT=5005
MONGODB_URI=mongodb+srv://your-connection-string
TOKEN_SECRET=your-secret-key
ORIGIN=http://localhost:5173
OPENAI_API_KEY=sk-your-key (optional)
```

### 3. Run
```bash
npm run dev
```

Server runs at `http://localhost:5005`

## 📚 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register traveler |
| POST | `/auth/login` | Login traveler |
| GET | `/auth/verify` | Verify JWT token |

### Realms
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/realms` | Get user's realms |
| POST | `/api/realms` | Create realm |
| GET | `/api/realms/:id` | Get realm details |
| PUT | `/api/realms/:id` | Update realm |
| DELETE | `/api/realms/:id` | Delete realm |
| POST | `/api/realms/join` | Join with gate password |
| POST | `/api/realms/:id/leave` | Leave realm |

### Halls
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/halls/realm/:realmId` | Get halls in realm |
| POST | `/api/halls` | Create hall |
| PUT | `/api/halls/:id` | Update hall |
| DELETE | `/api/halls/:id` | Delete hall |

### Scrolls
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/scrolls/hall/:hallId` | Get scrolls in hall |
| POST | `/api/scrolls` | Create scroll |
| PUT | `/api/scrolls/:id` | Edit scroll |
| DELETE | `/api/scrolls/:id` | Delete scroll |

### Gandalf (AI)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/gandalf/ask` | Ask Gandalf |
| POST | `/api/gandalf/summarize/:hallId` | Summarize conversation |

## 🔌 Socket.io Events

| Event | Description |
|-------|-------------|
| `join-hall` | Join a hall room |
| `leave-hall` | Leave a hall room |
| `send-scroll` | Send message |
| `receive-scroll` | Receive message |

## 📁 Project Structure
```
palantir-server/
├── config/
├── db/
├── middleware/
│   └── jwt.middleware.js
├── models/
│   ├── Traveler.model.js
│   ├── Realm.model.js
│   ├── Hall.model.js
│   └── Scroll.model.js
├── routes/
│   ├── auth.routes.js
│   ├── realm.routes.js
│   ├── hall.routes.js
│   ├── scroll.routes.js
│   └── gandalf.routes.js
├── services/
│   └── gandalf.service.js
├── app.js
├── server.js
└── .env
```

## 👤 Author

**Arthur SJ** - [GitHub](https://github.com/ArthurSJz)

