# How to Run: Product Hunt (Obsidian Neon Revamp)

This project consists of two separate systems working together: a **Python/Flask Backend** (connected to MongoDB) and a **React/Vite Frontend** (featuring the new Obsidian Neon UI). 

To launch the full application, you need to open **two separate terminal windows** and run both servers simultaneously.

---

## 1. Start the Backend Server (Terminal 1)

The backend handles all the data (Products, Users, Authentication) and connects to MongoDB.

1. Open your first terminal and navigate to the `backend` folder:
   ```bash
   cd c:\Users\Administrator\Desktop\dbms\Product-Hunt\backend
   ```
2. *(Optional but recommended)* Activate your Python virtual environment if you use one.
3. Install the required Python packages (only required the first time):
   ```bash
   pip install -r requirements.txt
   ```
4. Start the Flask application:
   ```bash
   python app.py
   ```
> **Note:** The console should explicitly state it is running, usually on `http://127.0.0.1:5000`. Keep this terminal window open!

---

## 2. Start the Frontend Server (Terminal 2)

The frontend serves the new React/Vite user interface.

1. Open a **brand new** terminal window and navigate to the `frontend` folder:
   ```bash
   cd c:\Users\Administrator\Desktop\dbms\Product-Hunt\frontend
   ```
2. Install the necessary Node modules (only required the first time):
   ```bash
   npm install
   ```
3. Boot the Vite development server:
   ```bash
   npm run dev
   ```

---

## 3. Launch the Application

1. Look closely at Terminal 2 containing the frontend output. It will give you a local web address.
2. Typically, it looks like `http://localhost:5173/`. 
3. Hold down `Ctrl` and click that link, or paste it directly into your web browser. 

You should now seamlessly arrive at the new dark glassmorphic homepage of your Product Hunt clone! 

### Troubleshooting 
* **"Network Error. Is the backend running?"**: This means your frontend is unable to ping the Flask server. Ensure your `vite.config.js` proxy settings map `/api` to the correct backend port (such as `5000`) and that Terminal 1 hasn't crashed.
* **Component Not Found Error**: If React fails to compile, stop the frontend terminal (`Ctrl+C`), run `npm install` again, and restart with `npm run dev`.
