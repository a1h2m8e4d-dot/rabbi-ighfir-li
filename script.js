document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     الورد اليومي
  ========================= */

  const cards = document.querySelectorAll(".card");
  let finished = 0;
  let wardCompletedThisSession = false;

  cards.forEach(card => {
    let count = 0;
    const max = Number(card.dataset.max);
    const btn = card.querySelector("button");
    const counter = card.querySelector(".count");

    btn.addEventListener("click", () => {
      if (count < max) {
        count++;
        counter.textContent = `${count} / ${max}`;
      }

      if (count === max) {
        btn.textContent = "تم ✔";
        btn.disabled = true;
        finished++;
      }

      if (finished === cards.length && !wardCompletedThisSession) {
        document.getElementById("finalMessage").classList.remove("hidden");
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

        wardCount++;
        localStorage.setItem("wardCount", wardCount);
        wardCompletedThisSession = true;

        if (wardCountEl) wardCountEl.textContent = wardCount;
      }
    });
  });

  /* =========================
     زر تثبيت التطبيق
  ========================= */

  let deferredPrompt;
  const installBox = document.getElementById("installBox");
  const installBtn = document.getElementById("installBtn");

  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    deferredPrompt = e;
    installBox.classList.remove("hidden");
  });

  if (installBtn) {
    installBtn.addEventListener("click", async () => {
      if (!deferredPrompt) return;

      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;

      if (result.outcome === "accepted") {
        installBox.classList.add("hidden");
        deferredPrompt = null;
      }
    });
  }

  /* =========================
     دعم التطبيق (نسخ الرقم)
  ========================= */

  const copyBtn = document.getElementById("copyCashBtn");
  const cashNumber = document.getElementById("cashNumber");
  const copyMsg = document.getElementById("copyMsg");

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(cashNumber.textContent).then(() => {
        copyMsg.classList.remove("hidden");
        setTimeout(() => copyMsg.classList.add("hidden"), 2000);
      });
    });
  }

  /* =========================
     الإنجازات
  ========================= */

  const wardCountEl = document.getElementById("wardCount");
  const daysCountEl = document.getElementById("daysCount");
  const quranKhatmEl = document.getElementById("quranKhatm");
  const addKhatmBtn = document.getElementById("addKhatmBtn");

  let wardCount = Number(localStorage.getItem("wardCount")) || 0;
  let daysCount = Number(localStorage.getItem("daysCount")) || 0;
  let quranKhatm = Number(localStorage.getItem("quranKhatm")) || 0;

  if (wardCountEl) wardCountEl.textContent = wardCount;
  if (daysCountEl) daysCountEl.textContent = daysCount;
  if (quranKhatmEl) quranKhatmEl.textContent = quranKhatm;

  const lastVisit = localStorage.getItem("lastVisit");
  const today = new Date().toDateString();

  if (lastVisit !== today) {
    daysCount++;
    localStorage.setItem("daysCount", daysCount);
    localStorage.setItem("lastVisit", today);
    if (daysCountEl) daysCountEl.textContent = daysCount;
  }

  if (addKhatmBtn) {
    addKhatmBtn.addEventListener("click", () => {
      quranKhatm++;
      localStorage.setItem("quranKhatm", quranKhatm);
      quranKhatmEl.textContent = quranKhatm;
    });
  }

  /* =========================
     التنقل (القائمة السفلية)
  ========================= */

  const navButtons = document.querySelectorAll(".bottom-nav button");
  const pages = document.querySelectorAll(".page");

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      navButtons.forEach(b => b.classList.remove("active"));
      pages.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(btn.dataset.target).classList.add("active");
    });
  });

  /* =========================
   عداد رمضان
========================= */
// ===== منطق رمضان =====
const ramadanDate = new Date("2026-02-17T00:00:00").getTime();

const ramadanCard = document.querySelector(".ramadan-card");
const ramadanDuaCard = document.getElementById("ramadanDuaCard");

setInterval(() => {
  const now = new Date().getTime();
  const diff = ramadanDate - now;

  // بعد دخول رمضان
  if (diff <= 0) {
    ramadanCard.classList.add("hidden");
    ramadanDuaCard.classList.remove("hidden");
    return;
  }

  // قبل رمضان
  document.getElementById("ramadanDays").textContent =
    Math.floor(diff / (1000 * 60 * 60 * 24));
  document.getElementById("ramadanHours").textContent =
    Math.floor((diff / (1000 * 60 * 60)) % 24);
  document.getElementById("ramadanMinutes").textContent =
    Math.floor((diff / (1000 * 60)) % 60);
}, 1000);


/* =========================
   مواقيت الصلاة
========================= */
async function fetchPrayerTimes() {
  const city = "Qena";
  const country = "Egypt";
  const apiUrl = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=5`;

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    const t = data.data.timings;

    const prayers = [
      { name: "الفجر", time: t.Fajr },
      { name: "الظهر", time: t.Dhuhr },
      { name: "العصر", time: t.Asr },
      { name: "المغرب", time: t.Maghrib },
      { name: "العشاء", time: t.Isha }
    ];

    const now = new Date();
    let nextPrayer = null;

    const list = prayers.map(p => {
      const [h, m] = p.time.split(":");
      const prayerTime = new Date();
      prayerTime.setHours(h, m, 0);

      if (!nextPrayer && prayerTime > now) {
        nextPrayer = { ...p, date: prayerTime };
      }

      return { ...p, date: prayerTime };
    });

    if (!nextPrayer) {
      nextPrayer = list[0];
      nextPrayer.date.setDate(nextPrayer.date.getDate() + 1);
    }

    document.getElementById("nextPrayerName").innerText = nextPrayer.name;

    setInterval(() => {
      const diff = nextPrayer.date - new Date();
      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      document.getElementById("nextPrayerCountdown").innerText =
        `${hrs} س ${mins} د`;
    }, 1000);

    document.getElementById("prayer-list").innerHTML = list.map(p => `
      <div class="prayer-card ${p.name === nextPrayer.name ? "active" : ""}">
        <span class="prayer-name">${p.name}</span>
        <span class="prayer-time">${p.time}</span>
      </div>
    `).join("");

  } catch {
    document.getElementById("prayer-list").innerText =
      "تعذر تحميل المواقيت";
  }
}

fetchPrayerTimes();

});






// ===== عداد رمضان =====
const ramadanDate = new Date("2026-02-17T00:00:00").getTime();

setInterval(() => {
  const now = new Date().getTime();
  const diff = ramadanDate - now;

  if (diff <= 0) return;

  document.getElementById("ramadanDays").textContent =
    Math.floor(diff / (1000 * 60 * 60 * 24));
  document.getElementById("ramadanHours").textContent =
    Math.floor((diff / (1000 * 60 * 60)) % 24);
  document.getElementById("ramadanMinutes").textContent =
    Math.floor((diff / (1000 * 60)) % 60);
}, 1000);

// ===== مواقيت الصلاة (قنا) =====
async function loadPrayers() {
  const res = await fetch(
    "https://api.aladhan.com/v1/timingsByCity?city=Qena&country=Egypt&method=5"
  );
  const data = await res.json();
  const t = data.data.timings;

  const prayers = [
    ["الفجر", t.Fajr],
    ["الظهر", t.Dhuhr],
    ["العصر", t.Asr],
    ["المغرب", t.Maghrib],
    ["العشاء", t.Isha]
  ];

  const now = new Date();
  let nextPrayer = null;

  const list = document.getElementById("prayerList");
  list.innerHTML = "";

  prayers.forEach(([name, time]) => {
    const [h, m] = time.split(":");
    const prayerTime = new Date();
    prayerTime.setHours(h, m, 0);

    const row = document.createElement("div");
    row.className = "prayer-row";
    row.innerHTML = `<span>${name}</span><span>${time}</span>`;

    if (!nextPrayer && prayerTime > now) {
      nextPrayer = { name, time, prayerTime };
      row.classList.add("active");
    }

    list.appendChild(row);
  });

  if (nextPrayer) {
    const diff = nextPrayer.prayerTime - now;
    const mins = Math.floor(diff / 60000);

    document.getElementById("nextPrayerName").textContent =
      nextPrayer.name;
    document.getElementById("nextPrayerTime").textContent =
      `${mins} دقيقة`;
  }
}

loadPrayers();

