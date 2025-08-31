export function initLogo(scope = "body") {
    const logos = document.querySelectorAll(`${scope} .logo`);

    logos.forEach((logo) => {
        const logo2 = logo.querySelector(".logo2");
        const logo3 = logo.querySelector(".logo3");

        if (logo2) {
            logo2.addEventListener("click", () => {
                logo2.classList.toggle("rotated");
                document.body.classList.toggle("darkmode");
            });
        };

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
                };
            });
        };

    });
};

