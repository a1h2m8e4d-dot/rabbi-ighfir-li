const cards = document.querySelectorAll(".card");
let finished = 0;

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

   if (finished === cards.length) {
  document.getElementById("finalMessage").classList.remove("hidden");
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

  // تسجيل إنجاز إكمال الورد
  wardCount++;
  localStorage.setItem("wardCount", wardCount);

  // تحديث الرقم لو صفحة إنجازاتي مفتوحة
  if (wardCountEl) {
    wardCountEl.textContent = wardCount;
  }
}

let deferredPrompt;
const installBox = document.getElementById("installBox");
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  deferredPrompt = e;
  installBox.classList.remove("hidden");
});

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();
  const result = await deferredPrompt.userChoice;

  if (result.outcome === "accepted") {
    installBox.classList.add("hidden");
    deferredPrompt = null;
  }
});

const copyBtn = document.getElementById("copyCashBtn");
const cashNumber = document.getElementById("cashNumber");
const copyMsg = document.getElementById("copyMsg");

if (copyBtn) {
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(cashNumber.textContent).then(() => {
      copyMsg.classList.remove("hidden");
      setTimeout(() => {
        copyMsg.classList.add("hidden");
      }, 2000);
    });
  });
}

// عناصر الإنجازات
const wardCountEl = document.getElementById("wardCount");
const daysCountEl = document.getElementById("daysCount");
const quranKhatmEl = document.getElementById("quranKhatm");
const addKhatmBtn = document.getElementById("addKhatmBtn");

// تحميل القيم
let wardCount = Number(localStorage.getItem("wardCount")) || 0;
let daysCount = Number(localStorage.getItem("daysCount")) || 0;
let quranKhatm = Number(localStorage.getItem("quranKhatm")) || 0;

// عرض القيم
if (wardCountEl) wardCountEl.textContent = wardCount;
if (daysCountEl) daysCountEl.textContent = daysCount;
if (quranKhatmEl) quranKhatmEl.textContent = quranKhatm;

// حساب أيام الاستخدام (مرة واحدة في اليوم)
const lastVisit = localStorage.getItem("lastVisit");
const today = new Date().toDateString();

if (lastVisit !== today) {
  daysCount++;
  localStorage.setItem("daysCount", daysCount);
  localStorage.setItem("lastVisit", today);
  if (daysCountEl) daysCountEl.textContent = daysCount;
}

// زر ختم القرآن
if (addKhatmBtn) {
  addKhatmBtn.addEventListener("click", () => {
    quranKhatm++;
    localStorage.setItem("quranKhatm", quranKhatm);
    quranKhatmEl.textContent = quranKhatm;
  });
}

