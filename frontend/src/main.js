// main.js

const API_BASE = "https://five0-gram-1.onrender.com"; // 🔥 Renderdagi backend URL

const emailInt = document.getElementById("account");
const parolInt = document.getElementById("parol");
const errorMessage = document.getElementById("error");
const nextBtn = document.getElementById("next");
const nameInt = document.getElementById("name");
const surnameInt = document.getElementById("surname");
const dayInt = document.getElementById("day");
const monthInt = document.getElementById("month");
const yearInt = document.getElementById("year");
const genderSel = document.getElementById("gender");
const errorMessage2 = document.getElementById("error2");
const sendBtn = document.getElementById("done");

const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");

const signupForm = document.getElementById("signupForm");
const signinForm = document.getElementById("signinForm");

// 🔥 Formlarni almashtirish
document.querySelectorAll(".showSignup").forEach(btn => {
    btn.addEventListener("click", () => toggleForms("signup"));
});
document.querySelectorAll(".showSignin").forEach(btn => {
    btn.addEventListener("click", () => toggleForms("signin"));
});

function toggleForms(target) {
    if (target === "signup") {
        signupForm.style.display = "block";
        signinForm.style.display = "none";
    } else {
        signupForm.style.display = "none";
        signinForm.style.display = "block";
    }
}

emailInt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleNext();
});
parolInt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleNext();
});
nextBtn.addEventListener("click", handleNext);

async function handleNext() {
    const passwordRegex = /^[A-Za-z0-9]{5,}$/;
    const email = emailInt.value.trim();
    const parol = parolInt.value.trim();

    if (!email || !parol) {
        errorMessage.textContent = "Email yoki parol noto‘g‘ri!";
        errorMessage.classList.add("show");
        return;
    } else if (!email.endsWith("@gmail.com")) {
        errorMessage.textContent = "Email oxiri @gmail.com bo‘lishi kerak!";
        return;
    } else if (email.length < 15) {
        errorMessage.textContent = "Email kamida 15 ta belgidan iborat bo‘lishi kerak!";
        return;
    } else if (!passwordRegex.test(parol)) {
        errorMessage.textContent = "Parol kamida 5 ta belgidan iborat bo‘lishi kerak!";
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/users/check?email=${encodeURIComponent(email)}`);
        if (!res.ok) {
            const data = await res.json();
            errorMessage.textContent = data.message || "Xatolik yuz berdi!";
            return;
        }
    } catch (err) {
        errorMessage.textContent = `Serverga ulanishda xatolik: ${err.message}`;
        return;
    }

    errorMessage.textContent = "";
    step1.style.display = "none";
    step2.style.display = "block";
    nextBtn.style.display = "none";
    sendBtn.style.display = "block";
}

// Ism va familiya bosh harfini katta qilish
nameInt.addEventListener("blur", () => {
    let value = nameInt.value.trim();
    if (value.length > 0) {
        nameInt.value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }
});
surnameInt.addEventListener("blur", () => {
    let value = surnameInt.value.trim();
    if (value.length > 0) {
        surnameInt.value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }
});

const inputs = document.querySelectorAll("#step1 input, #step2 input, #step2 select");
inputs.forEach((input) => {
    input.addEventListener("input", () => {
        errorMessage.textContent = "";
        errorMessage2.textContent = "";
    });
});

// Enter bosilganda yuborish
[nameInt, surnameInt, dayInt, monthInt, yearInt, genderSel].forEach(el => {
    el.addEventListener("keydown", (e) => {
        if (e.key === "Enter") send();
    });
});

sendBtn.addEventListener("click", send);

async function send() {
    const currentYear = new Date().getFullYear();
    const day = parseInt(dayInt.value);
    const month = parseInt(monthInt.value);
    const year = parseInt(yearInt.value);
    const maxDay = new Date(year, month, 0).getDate();

    const user = {
        email: emailInt.value.trim(),
        parol: parolInt.value.trim(),
        name: nameInt.value.trim(),
        surname: surnameInt.value.trim() || "Kiritilmagan!",
        day: dayInt.value.trim(),
        month: monthInt.value.trim(),
        year: yearInt.value.trim(),
        gender: genderSel.value.trim() || "Kiritilmagan!",
    };

    if (day <= 0 || day > maxDay) {
        errorMessage2.textContent = `${day}-kun ${month}-oyda mavjud emas!`;
        return;
    } else if (month <= 0 || month > 12) {
        errorMessage2.textContent = `Oy ${month} to‘g‘ri kelmaydi!`;
        return;
    } else if (year <= 1850 || year > currentYear) {
        errorMessage2.textContent = `Yil ${year} to‘g‘ri kelmaydi!`;
        return;
    } else if (!user.name || !user.day || !user.month || !user.year) {
        errorMessage2.textContent = `Barcha maydonlarni to‘ldirish kerak!`;
        return;
    } else if (user.name.length < 5) {
        errorMessage2.textContent = "Ism kamida 5 ta belgidan iborat bo‘lishi kerak!";
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });

        const data = await res.json();

        if (res.ok) {
            errorMessage2.textContent = "✅ Ro‘yxatdan o‘tish muvaffaqiyatli!";
            errorMessage2.classList.add("success-box");

            step1.classList.add("success");
            step2.classList.add("success");

            document.querySelectorAll("#step1 input, #step2 input, #step2 select")
                .forEach(el => el.classList.add("success"));

            sendBtn.textContent = "✅ Ro‘yxatdan o‘tildi";
            sendBtn.classList.add("success");

            setTimeout(() => location.reload(), 2000);
        } else {
            errorMessage2.textContent = data.message || "❌ Xatolik yuz berdi!";
            errorMessage2.classList.add("error-box");
        }
    } catch (err) {
        errorMessage2.textContent = `❌ Serverga ulanishda xatolik: ${err.message}`;
    }
}
