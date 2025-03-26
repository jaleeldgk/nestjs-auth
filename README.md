
# 🚀 NestJS Authentication Boilerplate (Starter Kit)

This is a **production-ready authentication starter kit** built with **NestJS, Prisma, JWT, and Nodemailer**. It includes **user authentication, email verification, password reset, logging, throttling, and security best practices**.

### 🔗 **GitHub Repository:**  
[https://github.com/jaleeldgk/nestjs-auth](https://github.com/jaleeldgk/nestjs-auth)

---

## 📌 **Features**
- ✅ **JWT Authentication** (Login, Signup, Logout)
- ✅ **Email Verification** (via OTP)
- ✅ **Password Reset** (via OTP)
- ✅ **Role-Based Access Control (RBAC)**
- ✅ **Rate Limiting (Throttle)**
- ✅ **Security Headers using Helmet**
- ✅ **Prisma ORM** with MySQL
- ✅ **Swagger API Documentation**
- ✅ **Scalable Code Structure**

---

## 📦 **Tech Stack**
- **Backend:** NestJS (TypeScript)
- **Database:** MySQL (via Prisma ORM)
- **Authentication:** JWT, Passport.js
- **Email Service:** Nodemailer (SMTP)
- **Security:** Helmet, CORS, Rate Limiting

---

## 🚀 **Getting Started**
### 1️⃣ **Clone the Repository**
```bash
git clone https://github.com/jaleeldgk/nestjs-auth.git
cd nestjs-auth
```

### 2️⃣ **Install Dependencies**
```bash
npm install
```

### 3️⃣ **Configure Environment Variables**
Rename `.env.example` to `.env` and update values:
```env
DATABASE_URL="mysql://user:password@localhost:3306/nest_auth"
JWT_SECRET="your_jwt_secret"
EMAIL_USER="your_smtp_email"
EMAIL_PASS="your_smtp_password"
```

### 4️⃣ **Set Up the Database**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5️⃣ **Run the Server**
```bash
npm run start:dev
```
> The API will be available at `http://localhost:3000`

---

## 📖 **API Documentation**
Swagger API Docs are available at:
📌 **`http://localhost:3000/api/docs`**

---

## 🛠 **Folder Structure**
```
nestjs-auth/
│── src/
│   ├── auth/         # Authentication Module
│   ├── user/         # User Module
│   ├── common/       # Common Utilities
│   ├── prisma/       # Prisma Service
│── prisma/
│   ├── schema.prisma # Database Schema
│── .env.example      # Environment Variables Example
│── README.md         # Project Documentation
│── package.json      # Dependencies
```

---

## 🚧 **Routes & Endpoints**
### 🔹 **Authentication**
| Method | Endpoint | Description |
|--------|---------|------------|
| `POST` | `/auth/signup` | Register a new user |
| `POST` | `/auth/signin` | Login and get JWT token |
| `POST` | `/auth/verify-email` | Verify email with OTP |
| `POST` | `/auth/forgot-password` | Request password reset OTP |
| `POST` | `/auth/reset-password` | Reset password using OTP |
| `GET` | `/auth/me` | Get authenticated user |

---

## 🔒 **Security Enhancements**
✅ **Rate Limiting (Throttle)**  
✅ **Helmet for Security Headers**  
✅ **Strong Validation & Error Handling**  

---

## 🛠 **TODO & Future Upgrades**
- [ ] **Add Winston Logging** for request logs and authentication events  
- [ ] **Improve Role-Based Access Control (RBAC)** with better role management  
- [ ] **Add Docker Support** for easier deployment  
- [ ] **Implement Two-Factor Authentication (2FA)** for extra security  
- [ ] **Add Session-based Authentication** (Optional)  
- [ ] **Add Multi-tenant Support** for SaaS applications  
- [ ] **Improve Error Handling & Response Standardization**  
- [ ] **Enhance Email Templates** for better user experience  

---

## 🤝 **Contributing**
1. Fork the repo
2. Create a new branch (`feature/your-feature`)
3. Commit your changes
4. Push to your branch
5. Create a pull request

---

## 🌟 **Support & Community**
If you like this project, don't forget to **⭐ star** the repo! 🚀  
For issues or feature requests, open a GitHub **issue**.

---

## 📜 **License**
This project is **open-source** under the **MIT License**.

