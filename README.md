# Product Hunt 🚀

An elite, full-stack digital product discovery platform built with a high-performance React/Vite frontend and a secure Flask/PyMongo backend architecture. Featuring cinematic framer-motion transitions, dynamic glassmorphic state-loaders, and complete seller-consumer ecosystem isolation.

## ✨ Features

- **Dual-Ecosystem Authentication**: Fully segmented routing and registry logic for `Consumers` vs `Sellers`.
- **Global Module Registry**: A beautifully rendered public directory of dynamic technological assets, software protocols, and system capabilities.
- **Cinematic Route Transitions**: Every navigation path effortlessly fades and pulls into the next layout using `<AnimatePresence>` by `framer-motion`.
- **Advanced State Mechanics**: Data-fetching from the database utilizes meticulously timed shimmering skeleton-loader animations mapped identically to item geometry—no generic spinning wheels.
- **Glassmorphic Notification Bridges**: Leveraging `sonner` Toasts to broadcast network status, dynamic route exceptions, and server conflict errors smoothly into the graphical view.
- **Realtime Database**: Direct local bridge to PyMongo parsing schema-less nested documents rapidly across ports.

## 🛠 Tech Stack 

- **Frontend**: React.js / Vite / `framer-motion` / `sonner` / `lucide-react`
- **Backend API**: Python / Flask / `werkzeug.security` (Password Hashing)
- **Database Architecture**: MongoDB (`PyMongo`)

---

## ⚡ Getting Started (Local Development)

Because this repository strictly enforces Git-ignore mechanisms, the 800MB MongoDB local binaries were structurally excluded. **To run this on a cloned machine, you must install MongoDB locally or connect to the Cloud.**

### 1. Database Configuration
1. Install [MongoDB Community Server](https://www.mongodb.com/try/download/community) globally via standard configuration.
2. Inside the `/backend` folder, duplicate `.env.example` and rename it to `.env`.
3. Link your fresh database inside the `.env` file!
   ```env
   MONGO_URI="mongodb://localhost:27017/product_hunt"
   ```
   *(Alternatively, replace the localhost string with a MongoDB Atlas Cloud string!)*

### 2. Ignite Backend Logic (Flask)
```bash
# Move into Backend
cd backend

# Initialize Virtual Env (if you use one) and install dependencies
pip install -r requirements.txt

# Run Server (Port 5000)
python app.py
```

### 3. Ignite Frontend Architecture (Vite)
```bash
# Open a secondary terminal, move into Frontend
cd frontend

# Install Node Dependencies (React, Framer Motion, Toaster, Lucide)
npm install

# Build & Run Fast-Refresh Server (Port 5173)
npm run dev
```

### 4. Experience The Horizon
Navigate to exactly **`http://localhost:5173`** inside your web browser. 

*Try registering a 'Seller' account to unlock the Dashboard grid and broadcast a product. Then, log out and browse as a 'Consumer' to utilize the Global Registry and Stack Analysis functionalities.*
