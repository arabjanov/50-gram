import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;
const USERS_FILE = "users.json";

app.use(express.json());
app.use(cors());

// Agar users.json mavjud bo‘lmasa — avtomatik yaratamiz
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, "[]", "utf8");
}

// 📌 Barcha userlarni olish
app.get("/users", (req, res) => {
    fs.readFile(USERS_FILE, "utf8", (err, data) => {
        if (err) return res.status(500).json({ message: "Faylni o‘qishda xatolik!" });
        res.json(JSON.parse(data));
    });
});

// 📌 Emailni tekshirish (signup paytida)
app.get("/users/check", (req, res) => {
    const { email } = req.query;

    fs.readFile(USERS_FILE, "utf8", (err, data) => {
        if (err) return res.status(500).json({ message: "Faylni o‘qishda xatolik!" });

        const users = data ? JSON.parse(data) : [];
        const userExists = users.find(u => u.email === email);

        if (userExists) {
            return res.status(400).json({ message: "❌ Bunday email allaqachon mavjud!" });
        }

        res.json({ message: "✅ Email bo‘sh" });
    });
});

// 📌 Ro‘yxatdan o‘tish (signup)
app.post("/users", (req, res) => {
    const newUser = req.body;

    fs.readFile(USERS_FILE, "utf8", (err, data) => {
        if (err) return res.status(500).json({ message: "Faylni o‘qishda xatolik!" });

        const users = data ? JSON.parse(data) : [];

        const userExists = users.find(u => u.email === newUser.email);
        if (userExists) {
            return res.status(400).json({ message: "❌ Bunday user mavjud!" });
        }

        users.push(newUser);

        fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), (err) => {
            if (err) return res.status(500).json({ message: "Faylni yozishda xatolik!" });
            res.status(201).json({ message: "✅ User muvaffaqiyatli qo‘shildi", user: newUser });
        });
    });
});

// 📌 Login qilish
app.post("/users/login", (req, res) => {
    const { email, parol } = req.body;

    fs.readFile(USERS_FILE, "utf8", (err, data) => {
        if (err) return res.status(500).json({ message: "Faylni o‘qishda xatolik!" });

        const users = data ? JSON.parse(data) : [];
        const user = users.find(u => u.email === email && u.parol === parol);

        if (!user) {
            return res.status(401).json({ message: "❌ Email yoki parol noto‘g‘ri!" });
        }

        res.json({ message: "✅ Tizimga kirdingiz!", user });
    });
});

// 📌 Serverni ishga tushirish
app.listen(PORT, () => {
    console.log(`🚀 Server http://127.0.0.1:${PORT} da ishga tushdi`);
});
