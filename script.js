const canvas = document.getElementById("scratchCanvas");
const ctx = canvas.getContext("2d");
const couponText = document.getElementById("couponText");
const copyBtn = document.getElementById("copyBtn");

const img = new Image();
img.src = "gold-mask.png";

// Weighted prize list
const prizes = [
  { text: "🎉 You get 5% Off on orders above ₹399\nCoupon Code - SPSCRATCH5", weight: 40 },
  { text: "😢 Better luck next time.\nBut our perfumes never fail!", weight: 40 },
  { text: "🔥 10% Off on orders above ₹399\nCoupon Code - SPSCRATCH10", weight: 10 },
  { text: "🎁 Free 15ml Tester worth ₹499\nCoupon Code - SPTEST15", weight: 10 },
  { text: "💻 Hacker or What!\n₹100 Off on orders above ₹399\nCoupon Code - SPSCRATCH100", weight: 5 }
];

function getRandomPrize() {
  const totalWeight = prizes.reduce((sum, p) => sum + p.weight, 0);
  let rand = Math.random() * totalWeight;
  for (const prize of prizes) {
    if (rand < prize.weight) return prize.text;
    rand -= prize.weight;
  }
  return prizes[0].text;
}

function alreadyScratchedToday() {
  return localStorage.getItem("lastScratchDate") === new Date().toDateString();
}

function autoReveal() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.style.pointerEvents = "none";
  canvas.style.opacity = 0.5;
}

img.onload = () => {
  canvas.width = 300;
  canvas.height = 150;
  const totalPixels = canvas.width * canvas.height;

  if (alreadyScratchedToday()) {
    couponText.innerText = localStorage.getItem("lastPrize") || "Already scratched today!";
    autoReveal();
  } else {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const prize = getRandomPrize();
    couponText.innerText = prize;
    localStorage.setItem("lastPrize", prize);
  }

  let isScratching = false;
  let scratchedPixels = 0;

  canvas.addEventListener("mousedown", () => isScratching = true);
  canvas.addEventListener("mouseup", () => isScratching = false);
  canvas.addEventListener("mouseleave", () => isScratching = false);

  canvas.addEventListener("mousemove", (e) => {
    if (!isScratching || alreadyScratchedToday()) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    scratchedPixels = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) scratchedPixels++;
    }

    if (scratchedPixels / totalPixels > 0.3) {
      autoReveal();
      localStorage.setItem("lastScratchDate", new Date().toDateString());
    }
  });
};

// Copy Code functionality
copyBtn.addEventListener("click", () => {
  const text = localStorage.getItem("lastPrize") || couponText.innerText;
  const match = text.match(/SPSCRATCH\d+|SPTEST\d+|SPSCRATCH100/);

  if (match) {
    navigator.clipboard.writeText(match[0])
      .then(() => {
        copyBtn.innerText = "✅ Copied!";
        copyBtn.classList.add("copied");
        setTimeout(() => {
          copyBtn.innerText = "📋 Copy Code";
          copyBtn.classList.remove("copied");
        }, 2000);
      })
      .catch(() => alert("Copy failed"));
  } else {
    alert("No coupon code found.");
  }
});
