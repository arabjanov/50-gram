const API_BASE = "https://five0-gram-1.onrender.com";

// === ELEMENTLAR ===
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
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginError = document.getElementById("loginError");
const loginBtn = document.getElementById("loginBtn");

// === FORM ALMASHTIRISH ===
document.querySelectorAll(".showSignup").forEach(btn => btn.addEventListener("click", () => toggleForms("signup")));
document.querySelectorAll(".showSignin").forEach(btn => btn.addEventListener("click", () => toggleForms("signin")));

function toggleForms(target) {
    signupForm.style.display = target === "signup" ? "block" : "none";
    signinForm.style.display = target === "signin" ? "block" : "none";
}

// === STEP 1 ===
nextBtn.addEventListener("click", handleNext);
[emailInt, parolInt].forEach(input =>
    input.addEventListener("keydown", e => e.key === "Enter" && handleNext())
);

async function handleNext() {
    const email = emailInt.value.trim();
    const parol = parolInt.value.trim();
    const passwordRegex = /^[A-Za-z0-9]{5,}$/;

    if (!email || !parol) return showError(errorMessage, "Email yoki parol kiritilmadi!");
    if (!email.endsWith("@gmail.com")) return showError(errorMessage, "Email @gmail.com bilan tugashi kerak!");
    if (email.length < 15) return showError(errorMessage, "Email kamida 15 ta belgidan iborat bo‘lsin!");
    if (!passwordRegex.test(parol)) return showError(errorMessage, "Parol kamida 5 belgidan iborat bo‘lsin!");

    try {
        const res = await fetch(`${API_BASE}/users/check?email=${encodeURIComponent(email)}`);
        if (!res.ok) {
            const data = await res.json();
            return showError(errorMessage, data.message || "Bunday email mavjud!");
        }
    } catch (err) {
        return showError(errorMessage, `Server xatosi: ${err.message}`);
    }

    step1.style.display = "none";
    step2.style.display = "block";
}

// === STEP 2 ===
sendBtn.addEventListener("click", send);

async function send() {
    const currentYear = new Date().getFullYear();
    const day = +dayInt.value, month = +monthInt.value, year = +yearInt.value;
    const maxDay = new Date(year, month, 0).getDate();

    if (day <= 0 || day > maxDay) return showError(errorMessage2, `${day}-kun ${month}-oyda mavjud emas!`);
    if (month <= 0 || month > 12) return showError(errorMessage2, `Oy ${month} noto‘g‘ri!`);
    if (year <= 1850 || year > currentYear) return showError(errorMessage2, `Yil ${year} noto‘g‘ri!`);

    const user = {
        email: emailInt.value.trim(),
        parol: parolInt.value.trim(),
        name: nameInt.value.trim(),
        surname: surnameInt.value.trim() || "Kiritilmagan",
        day: dayInt.value.trim(),
        month: monthInt.value.trim(),
        year: yearInt.value.trim(),
        gender: genderSel.value.trim() || "Kiritilmagan"
    };

    try {
        const res = await fetch(`${API_BASE}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });

        const data = await res.json();

        if (res.ok) {
            showSuccess(errorMessage2, "Ro‘yxatdan muvaffaqiyatli o‘tdingiz!");
            resetForm();
        } else {
            showError(errorMessage2, data.message || "Xatolik!");
        }
    } catch (err) {
        showError(errorMessage2, `Server xatosi: ${err.message}`);
    }
}

// === LOGIN ===
loginBtn.addEventListener("click", async () => {
    if (!loginEmail.value.trim() || !loginPassword.value.trim()) return showError(loginError, "Email va parol shart!");
    try {
        const res = await fetch(`${API_BASE}/users`);
        const users = await res.json();
        const found = users.find(u => u.email === loginEmail.value.trim() && u.parol === loginPassword.value.trim());
        if (found) {
            showSuccess(loginError, `Xush kelibsiz, ${found.name}!`);
        } else {
            showError(loginError, "Email yoki parol noto‘g‘ri!");
        }
    } catch (err) {
        showError(loginError, `Server xatosi: ${err.message}`);
    }
});

// === HELPERS ===
function showError(el, msg) {
    el.textContent = msg;
    el.classList.remove("success-box");
    el.classList.add("error-box");
}
function showSuccess(el, msg) {
    el.textContent = msg;
    el.classList.remove("error-box");
    el.classList.add("success-box");
}
function resetForm() {
    [emailInt, parolInt, nameInt, surnameInt, dayInt, monthInt, yearInt].forEach(el => el.value = "");
    genderSel.value = "";
    step1.style.display = "block";
    step2.style.display = "none";
}
