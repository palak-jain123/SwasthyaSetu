# SwasthyaSetu – Digital Health Record Management System

SwasthyaSetu is a web-based healthcare management system designed to help manage digital health records and improve access to healthcare services.

## Features

- User registration and login
- Role-based access for different users
- Worker and patient profile management
- Doctor registration and profile management
- QR code generation and scanning
- Digital prescription management
- Appointment management
- Government dashboard and healthcare scheme information
- Hospital management
- Feedback and enquiry management

## Technologies Used

**Frontend**
- React.js
- JavaScript
- HTML
- CSS
- Axios
- React Router

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## Project Structure

```text
SwasthyaSetu/
├── backend3/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.js
│   └── package.json
│
├── react3/
│   └── BasicReact/
│       └── healthReg/
│           ├── public/
│           ├── src/
│           └── package.json
│
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd SwasthyaSetu
```

### 2. Setup Backend

```bash
cd backend3
npm install
```

Create a `.env` file inside the `backend3` folder:

```env
CONNECTION_STRING=your_mongodb_connection_string
PORT=7001
```

Start the backend:

```bash
npm run dev
```

### 3. Setup Frontend

Open another terminal:

```bash
cd react3/BasicReact/healthReg
npm install
npm start
```

The frontend will run at:

`http://localhost:3000`

## Database

The project uses MongoDB for storing application data. A valid MongoDB connection string and database access are required to run database-dependent features.

## Note

- Keep database credentials and secret keys private.
- Never upload your `.env` file to GitHub.
- Install dependencies using `npm install` before running the application.

## Project

**SwasthyaSetu – Digital Health Record Management System**
