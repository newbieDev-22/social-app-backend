# Simple Social Media App

This repository provides a backend for a basic social media application with user registration, login with secure tokens, post creation, and commenting functionalities.

### Key Features

- User registration and login with secure JWT tokens
- Simple post creation by users
- Commenting on existing posts

## Live demo

```
https://social-app-frontend-six.vercel.app/
```

## Installation and Setup

This application consists of separate backend and frontend components.

### Backend

**_Clone the Repository_**

```
git clone https://github.com/newbieDev-22/social-app-backend
```

**_Create .env File_**

In the project root directory, create a file named .env (make sure it starts with a dot). This file will store sensitive environment variables that should not be committed to version control. Add the following lines to .env, replacing placeholders with your actual values:

```
DATABASE_URL="mysql://username:password@localhost:3306/small-social-app"
PORT=8888
JWT_SECRET=SecreTKeyNaKrubDontTellEveryone (Replace with a strong, unique secret)
```

**Important Notes**

DATABASE_URL: Replace username and password with your MySQL database credentials.

PORT: The port on which the backend server will listen for requests (default: 8888). Adjust this if necessary.

JWT_SECRET: A strong, unique secret string used for generating JSON Web Tokens (JWTs) to secure user authentication. Never share this value publicly.

**_Install Dependencies_**

```
npm install
```

**_Run the Backend Server_**

```
npm run dev
```

This will start the backend server in development mode, typically listening on port 8888 (as specified in .env).

### Frontend

**_Clone the Repository_**

```
git clone https://github.com/newbieDev-22/social-app-frontend
```

**_Create .env File_**

If the frontend requires environment variables (e.g., the API URL), create a .env file similar to the backend and add the following line:

```
VITE_API_URL=http://localhost:8888 (Replace with your backend server address)
```

**Important Notes**

VITE_API_URL: The base URL of your backend API.

**_Install Dependencies_**

```
npm install
```

**_Run the Frontend Development Server_**

```
npm run dev
```

This will start the frontend development server, typically accessible in your browser at http://localhost:3000 or a different port depending on your project setup.

**_Run Tests_**

From the project root directory (backend)

```
npm run test / npm run test-coverage
```

This will execute the project's unit tests to ensure code functionality.

## Additional Notes

Replace placeholders like SecreTKeyNaKrubDontTellEveryone with strong, unique secrets for production environments.

Ensure you have a MySQL database set up and configured with the appropriate schema for your application. Refer to your MySQL documentation for creating the database and tables.
