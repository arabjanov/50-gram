export function initLogo(scope = "body") {
    const logos = document.querySelectorAll(`${scope} .logo`);

    // Logo effektlarini yangilash funksiyasi
    function updateLogoEffects() {
        const logos = document.querySelectorAll('.logo');
        logos.forEach(logo => {
            const logo2 = logo.querySelector('.logo2');
            if (logo2) {
                if (document.body.classList.contains('darkmode')) {
                    logo2.style.textShadow = '0 0 15px gold';
                } else {
                    logo2.style.textShadow = 'none';
                }
            }
        });
    }

    // Sahifa yuklanganda localStorage'dan dark mode holatini olish
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('darkmode');
    }
    updateLogoEffects();

    logos.forEach((logo) => {
        const logo2 = logo.querySelector(".logo2");
        const logo3 = logo.querySelector(".logo3");

        if (logo2) {
            logo2.addEventListener("click", () => {
                logo2.classList.toggle("rotated");
                document.body.classList.toggle("darkmode");

                // Holatni localStorage'ga saqlash
                localStorage.setItem("darkMode", document.body.classList.contains("darkmode"));

                // Logo effektlarini yangilash
                updateLogoEffects();
            });
        }

        if (logo3) {
            logo3.addEventListener("click", async () => {
                try {
                    const res = await fetch("https://api.gold-api.com/price/XAU");
                    const data = await res.json();

                    if (data && data.price) {
                        const pricePerOunce = data.price;
                        const pricePerGram = pricePerOunce / 31.1035;
                        const price50g = (pricePerGram * 50).toFixed(2);
                        logo3.classList.toggle("clicked");
                        logo3.setAttribute("data-price", `Oltin narxi: $${price50g}`);
                    }
                } catch (err) {
                    logo3.setAttribute("data-price", "Narxni olishda xatolik");
                }
            });
        }
    });
}
