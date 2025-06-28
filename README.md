# 📦 Backend Mini Project – TechUp Bootcamp

ระบบจัดการผู้ใช้งานเบื้องต้น (User Management API) พัฒนาโดยใช้ Node.js + Express.js และฐานข้อมูล PostgreSQL มีฟีเจอร์สมัครสมาชิก, ล็อกอิน และการยืนยันตัวตนด้วย JWT

---

## 🚀 ฟีเจอร์หลัก (Main Features)

- สมัครสมาชิก (Register)
- เข้าสู่ระบบ (Login)
- เข้าถึงข้อมูลผู้ใช้ (Protected Route)
- ยืนยันตัวตนด้วย JWT Token
- จัดเก็บข้อมูลใน PostgreSQL
- เข้ารหัสรหัสผ่านด้วย bcrypt

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

| เครื่องมือ        | รายละเอียด                          |
|------------------|--------------------------------------|
| **Node.js**      | JavaScript Runtime                   |
| **Express.js**   | Web Framework                        |
| **PostgreSQL**   | Relational Database (ผ่าน `pg` lib) |
| **JWT**          | Authentication ด้วย JSON Web Token  |
| **bcrypt**       | เข้ารหัสรหัสผ่าน                     |
| **dotenv**       | จัดการ Environment Variables         |
| **Postman**      | ใช้ทดสอบ REST API                   |

---

## 📂 โครงสร้างโปรเจกต์ (Project Structure)

```
Backend-Mini-Project/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── db/
│   └── index.js       # เชื่อมต่อ PostgreSQL
├── .env.example
├── server.js
```

---

## ⚙️ การติดตั้งและใช้งาน (Getting Started)

### 1. Clone โปรเจกต์

```bash
git clone https://github.com/aof03/Backend-Mini-Project.git
cd Backend-Mini-Project
```

### 2. ติดตั้ง Dependencies

```bash
npm install
```

### 3. สร้างไฟล์ `.env` และตั้งค่า

```env
JWT_SECRET=your_jwt_secret_key
```

### 4. สร้างฐานข้อมูลและเทเบิล (หากยังไม่ได้สร้าง)

```sql
-- ตัวอย่าง
CREATE DATABASE your_db_name;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password TEXT NOT NULL
);
```

### 5. เริ่มรันเซิร์ฟเวอร์

```bash
npm start
```

> Server ทำงานที่ http://localhost:4000

---

## 🔐 ตัวอย่าง Endpoint

| Method | Endpoint        | Description          |
|--------|------------------|----------------------|
| POST   | /api/register   | สมัครสมาชิก         |
| POST   | /api/login      | เข้าสู่ระบบ         |
| GET    | /api/profile    | ข้อมูลผู้ใช้ (JWT)  |

---

## ✅ สิ่งที่สามารถพัฒนาเพิ่มเติม

- ระบบ Refresh Token
- Role-based Access Control (Admin/User)
- Validation ด้วย Joi หรือ Zod
- Error Handling แบบแยกเฉพาะ
- เขียน Unit Test ด้วย Jest หรือ Supertest

---

## 🧑‍💻 ผู้พัฒนา (Author)

- 👨‍💻 ชื่อ: kaweephat
- 🎓 Bootcamp: TechUp – Back-End Developer
- 🔗 GitHub: [https://github.com/aof03](https://github.com/aof03)

---

> โปรเจกต์นี้เป็นส่วนหนึ่งของการฝึกอบรมจาก TechUp Bootcamp พัฒนาเพื่อฝึกทักษะ Back-End และการสร้าง RESTful API ด้วย Node.js + PostgreSQL
