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
    }
  });
});
