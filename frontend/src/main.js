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

// 🔥 endi class bilan ishlatamiz
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
};


let emailIntValue = "";
let parolIntValue = 0;

emailInt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleNext();
});
parolInt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleNext();
});
nextBtn.addEventListener("click", handleNext)

async function handleNext() {
    const passwordRegex = /^[A-Za-z0-9]{5,}$/;
    const email = emailInt.value.trim();
    const parol = parolInt.value.trim();

    const emailIntValue = emailInt.value.trim();
    const parolIntValue = parolInt.value.trim();

    if (!email || !parol) {
        errorMessage.textContent = "Email yki parol notogri terilgan!"
        errorMessage.classList.add("show")
        return;
    }
    else if (!email.endsWith("@gmail.com")) {
        errorMessage.textContent = "Account oxirida @gmail.com bolishi kerak!";
        return;
    }
    else if (email.length < 15) {
        errorMessage.textContent = "Emailni nomida kamida 5ta element bolishi kerak!"
        return;
    }
    else if (!passwordRegex.test(parol)) {
        errorMessage.textContent = "Parolda 5ta belgi bolishi kerak!";
        return;
    }

    try {
        const res = await fetch(`http://127.0.0.1:3000/users/check?email=${encodeURIComponent(email)}`);
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
};

nameInt.addEventListener("blur", function () {
    let value = nameInt.value.trim();
    if (value.length > 0) {
        nameInt.value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }
});
surnameInt.addEventListener("blur", function () {
    let value = surnameInt.value.trim();
    if (value.length > 0) {
        surnameInt.value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }
});

const inputs = document.querySelectorAll("#step1 input, #step2 input, #step2 select");
const error = document.getElementById("error");
const error2 = document.getElementById("error2");

inputs.forEach((input) => {
    input.addEventListener("input", () => {
        if (error) error.textContent = "";
        if (error2) error2.textContent = "";
    });
});

nameInt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
});
surnameInt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
});
dayInt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
});
monthInt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
});
yearInt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
});
genderSel.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
});


sendBtn.addEventListener("click", send)
async function send() {
    const currentYear = new Date().getFullYear();
    const day = parseInt(dayInt.value);
    const month = parseInt(monthInt.value);
    const year = parseInt(yearInt.value);
    const maxDay = new Date(year, month, 0).getDate();

    //defoul nom!:
    const emailIntValue = emailInt.value.trim();
    const parolIntValue = parolInt.value.trim();
    const nameIntValue = nameInt.value.trim();
    const surnameIntValue = surnameInt.value.trim() || "Kiritilmagan!";
    const dayIntValue = dayInt.value.trim();
    const monthIntValue = monthInt.value.trim();
    const yearIntValue = yearInt.value.trim();
    const genderSelValue = genderSel.value.trim() || "Kritilmagan!";

    if (day <= 0 || day > maxDay) {
        if (month === 2 && day === 29) {
            errorMessage2.textContent = `${year}-yilni ${month}-oyida ${day}-kun mavjud emas!`;
            return;
        }
        else {
            errorMessage2.textContent = `${day}-kun ${month}-oyda mavjud emas!`;
            return;
        }
    }
    else if (day <= 0 || day > 31) {
        errorMessage2.textContent = `Kun ${day} to‘g‘ri kelmaydi!`;
        return;
    }
    else if (month <= 0 || month > 12) {
        errorMessage2.textContent = `Oy ${month} to‘g‘ri kelmaydi!`;
        return;
    }
    else if (year <= 1850 || year > currentYear) {
        errorMessage2.textContent = `Yil ${year} to‘g‘ri kelmaydi!`;
        return;
    }
    else if (!nameInt.value.trim() || !dayInt.value.trim() || !monthInt.value.trim() || !yearInt.value.trim()) {
        errorMessage2.textContent = `${nameInt.placeholder}, ${dayInt.placeholder}, ${monthInt.placeholder}, ${yearInt.placeholder} bo‘lishi kerak!`;
        return;
    }
    else if (nameInt.value.length < 5) {
        errorMessage2.textContent = "Ismda kamida 5 ta element bolishi kerak!";
        return;
    }

    const user = {
        email: emailIntValue,
        parol: parolIntValue,
        name: nameIntValue,
        surname: surnameIntValue,
        day: dayIntValue,
        month: monthIntValue,
        year: yearIntValue,
        gender: genderSelValue
    };

    try {
        const res = await fetch("http://127.0.0.1:3000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });

        const data = await res.json();

        if (res.ok) {
            errorMessage2.textContent = "Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi!";
            errorMessage2.classList.remove("error-box");
            errorMessage2.classList.add("success-box");

            step1.classList.add("success");
            step2.classList.add("success");

            document.querySelectorAll("#step1 input, #step2 input, #step2 select")
                .forEach(el => el.classList.add("success"));

            sendBtn.textContent = "Ro‘yxatdan o‘tildi ✅";       // yozuvni ptichkaga almashtiramiz
            sendBtn.classList.add("success"); // yashil effekt beradi

            setTimeout(() => {
                step1.classList.remove("success");
                step2.classList.remove("success");

                document.querySelectorAll("#step1 input, #step2 input, #step2 select")
                    .forEach(el => el.classList.remove("success"));
                sendBtn.textContent = "Send";
                sendBtn.classList.remove("success");
                sendBtn.classList.add("reset"); // animatsiya bilan qaytsin
            }, 2000);
        }
        else {
            errorMessage2.textContent = data.message || "❌ Xatolik yuz berdi!";
            errorMessage2.classList.remove("success-box");
            errorMessage2.classList.add("error-box");
            step1.classList.add("unsuccess");
            step2.classList.add("unsuccess");

            document.querySelectorAll("#step1 input, #step2 input, #step2 select")
                .forEach(el => el.classList.add("unsuccess"));

            sendBtn.classList.add("unsuccess");

            setTimeout(() => {
                step1.classList.remove("unsuccess");
                step2.classList.remove("unsuccess");
                document.querySelectorAll("#step1 input, #step2 input, #step2 select")
                    .forEach(el => el.classList.remove("unsuccess"));
                sendBtn.textContent = "Send";
                sendBtn.classList.remove("unsuccess");
                sendBtn.classList.add("reset"); // animatsiya bilan qaytsin
            }, 2000);
        }
    } catch (err) {
        errorMessage2.textContent = `❌ Serverga ulanishda xatolik: ${err.message}`;
        errorMessage2.style.color = "#dc3545";
    }


};

