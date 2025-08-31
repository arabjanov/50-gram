import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

//barcha userlar
app.get("/users", (req, res) => {
    fs.readFile("users.json", "utf8", (err, data) => {
        if (err) return res.status(500).send("Xatolik!");
        res.json(JSON.parse(data));
    });
});

app.get("/users/check", (req, res) => {
    const { email } = req.query;

    fs.readFile("users.json", "utf8", (err, data) => {
        if (err) return res.status(500).send("Xatolik!");

        let users = [];

        if (data) {
            users = JSON.parse(data);
        }

        const userExists = users.find(u => u.email === email);

        if (userExists) {
            return res.status(400).json({ message: "Afsuski bunday email bor!" });
        }

        res.json({ message: "OK" });
    });
});

app.post("/users", (req, res) => {
    const newUser = req.body;

    fs.readFile("users.json", "utf8", (err, data) => {
        if (err) return res.status(500).json({ message: "Xatolik!" });

        let users = [];
        if (data) {
            users = JSON.parse(data);
        }

        const userExists = users.find(u => u.email === newUser.email);

        if (userExists) {
            return res.status(400).json({ message: "Bunday user allaqachon mavjud!" });
        }

        users.push(newUser);

        fs.writeFile("users.json", JSON.stringify(users, null, 2), (err) => {
            if (err) return res.status(500).send("Yozishda xatolik!");
            res.status(201).json(newUser);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Port http://127.0.0.1:${PORT} da ishga tushdi!`);
});


