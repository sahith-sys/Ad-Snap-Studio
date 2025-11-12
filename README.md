# Ad-Snap Studio

Ad-Snap Studio is a full-stack web application designed to transform your ideas into stunning visuals using the power of generative AI. It provides a suite of tools for image generation, product photography, and creative editing, all within a user-friendly interface.

This project features a complete frontend built with React and Tailwind CSS, a backend powered by Node.js and Express, and integrates with the Bria AI API for its generative capabilities.

## ✨ Features

-   **User Authentication:** Secure user registration and login system using JWT (JSON Web Tokens).
-   **Credit System:** Users receive a default number of credits upon signing up, which are consumed as they use AI features.
-   **HD Image Generation:** Generate high-quality images from text prompts, with options for aspect ratio and style (photography or art).
-   **Background Generation:** Upload an image and generate a new background for it based on a text prompt.
-   **Generative Fill:** Upload an image, mask an area, and use a text prompt to fill in the masked region with AI-generated content.
-   **Vector Graphics:** Generate SVG vector graphics from text prompts.
-   **Product Editing Suite:**
    -   **Product Packshot:** Create professional product photos with a custom solid-color background.
    -   **Generate Shadow:** Automatically add realistic shadows (regular or float) to product images.
    -   **Lifestyle Shot:** Place your product into a new scene described by a text prompt, with advanced placement and aspect ratio controls.
-   **Prompt Enhancer:** Uses AI to automatically enhance and add detail to user prompts for better image results.

---

## 🛠 Tech Stack

-   **Frontend:**
    -   React (v19)
    -   Vite
    -   React Router (v7)
    -   Tailwind CSS
    -   shadcn/ui & Radix UI (for UI components)
    -   Axios (for API requests)
-   **Backend:**
    -   Node.js
    -   Express
    -   MongoDB (with Mongoose)
    -   JSON Web Token (JWT) for authentication
    -   `dotenv` for environment variables
-   **APIs:**
    -   Bria AI API (for all generative AI features)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

-   Node.js (v18 or later recommended)
-   npm or yarn
-   MongoDB (a local instance or a connection string from MongoDB Atlas)
-   A Bria AI API Key

### 1. Backend Setup (`server`)

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create an environment file:**
    Create a `.env` file in the `server` directory and add the following variables:

    ```env
    # Server configuration
    PORT=5000
    FRONTEND_URL=http://localhost:5173

    # Database
    MONGODB_URI=<YOUR_MONGODB_CONNECTION_STRING>

    # Authentication
    JWT_SECRET=<YOUR_JWT_SECRET_KEY>

    # External APIs
    BRIA_API_KEY=<YOUR_BRIA_AI_API_KEY>
    ```

4.  **Run the backend server:**
    ```bash
    npm run server
    ```
    The server will start (usually on `http://localhost:5000`).

### 2. Frontend Setup (`client/adsnap`)

1.  **Navigate to the client directory:**
    ```bash
    cd client/adsnap
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create an environment file:**
    Create a `.env` file in the `client/adsnap` directory and add your backend URL:

    ```env
    # URL of your running backend server
    VITE_REACT_APP_BACKEND_URL=http://localhost:5000
    ```
    *[Note: `VITE_CLERK_PUBLISHABLE_KEY` is mentioned in `main.jsx` but does not appear to be used by the primary authentication flow.]*

4.  **Run the frontend app:**
    ```bash
    npm run dev
    ```
    The development server will start (usually on `http://localhost:5173`).

---

## 📁 Project Structure

The repository is organized into two main parts: `client/adsnap` (the frontend) and `server` (the backend).
```bash
Ad-Snap-Studio/
├── client/adsnap/
│   ├── public/
│   ├── src/
│   │   ├── assets/       # Static images and mockups
│   │   ├── components/   # All React components (Features, UI, Auth)
│   │   ├── lib/          # Utility functions (e.g., cn for Tailwind)
│   │   ├── App.jsx       # Main app component with routing
│   │   ├── main.jsx      # Entry point for the React app
│   │   └── index.css     # Global styles
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── server/
    ├── config/
    │   └── monogodb.js   # MongoDB connection logic
    ├── controllers/
    │   ├── features/     # Logic for all AI features
    │   └── userControllers/ # Logic for user auth
    ├── middlewares/
    │   └── creditsAuth.js # Middleware to protect routes & check credits
    ├── models/
    │   └── user.js       # Mongoose user schema
    ├── Routes/
    │   ├── featureRoutes.js # API routes for AI features
    │   └── userRoutes.js    # API routes for user auth
    ├── server.js         # Main Express server entry point
    └── package.json
```
---

## 🔌 API Endpoints

All feature routes are protected and require a valid JWT token.

### User Routes (`/user`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/user/signup` | Register a new user. |
| `POST` | `/user/login` | Log in an existing user. |
| `POST` | `/user/credits` | Fetch the current user's remaining credits. |

### Feature Routes (`/features`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/features/prompt-enhance` | Enhance a user-provided text prompt. |
| `POST` | `/features/img-generation` | Generate an image from text. |
| `POST` | `/features/bg-generation` | Generate a new background for an image. |
| `POST` | `/features/product-packshot`| Create a product packshot with a solid background. |
| `POST` | `/features/generative-fill`| Inpaint a masked area of an image. |
| `POST` | `/features/vector-graphics`| Generate vector graphics from text. |
| `POST` | `/features/lifestyle-shot-by-text`| Place a product in a new scene. |
| `POST` | `/features/generate-shadow` | Add a shadow to a product image. |

---

## 🔗 Connect with me

-   **GitHub:** [github.com/sahith-sys](https://github.com/sahith-sys/Ad-Snap-Studio)
-   **LinkedIn:** [linkedin.com/in/sahith07](https://www.linkedin.com/in/sahith07/)
-   **Email:** sahithkothuru@gmail.com
