# 📚 Book Catalog API

A secure **Node.js + Express + MongoDB** API for managing books and users.  
Includes authentication, authorization, duplicate prevention, and account lockout for brute-force protection.

---

## 🚀 Features

### 🔒 Security & Authentication
- **Password Hashing** → User passwords are stored securely using hashing (no plain text).
- **JWT Authorization** → JSON Web Tokens are used for user authentication and protected routes.
- **Authorization Rules** → Only the creator of a book can **edit** or **delete** it.
- **Login Attempt Limit** → If a user fails login **3 times**, their account is **blocked for 5 minutes** to prevent brute force attacks.
- **Consistent Response Format** → Every API response includes:
  ```json
  {
    "success": true/false,
    "message": "Description of what happened"
  }

backend-module-test/
│── Controllers/
│   ├── BookControllers.js   # Book CRUD logic
│   ├── UserControllers.js   # User auth & login logic
│── models/
│   ├── BookModel.js         # Book schema
│   ├── UserModel.js         # User schema (with hashed password)
│── routes/
│   ├── bookRoutes.js
│   ├── userRoutes.js
│── middleware/
│   ├── authMiddleware.js    # Protect routes using JWT
│── server.js
│── package.json


⚡ Getting Started

1️⃣ Clone the repo
git clone https://github.com/Gouravsharma20/Book-Catalog-API.git
cd Book-Catalog-API


2️⃣ Install dependencies
npm install

3️⃣ Setup environment variables

Create a .env file in the root with:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key


4️⃣ Start the server

npm run dev   # if using nodemon
# or
npm start


📖 API Endpoints
Books

GET /api/books → Get all books

GET /api/books/:id → Get single book

POST /api/books (Protected) → Add new book

PUT /api/books/:id (Protected) → Update book (only if user is creator)

DELETE /api/books/:id (Protected) → Delete book (only if user is creator)

Users

POST /api/users/register → Register user

POST /api/users/login → Login user (returns JWT token)

3 failed attempts → account locked for 5 mins


🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss.

📜 License

This project is licensed under the MIT License.

---

⚡ Now your `README.md` reflects:
- **JWT auth**
- **Hashed passwords**
- **User-specific authorization**
- **Login attempt lockout**
- **Unified success/failure JSON response**

👉 Do you also want me to add a **“Usage with Postman examples” section** (with screenshots of signup/login requests), so devs testing your API can easily replicate?
