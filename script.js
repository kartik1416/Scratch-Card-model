const canvas = document.getElementById("scratchCanvas");
const ctx = canvas.getContext("2d");
const couponText = document.getElementById("couponText");
const copyBtn = document.getElementById("copyBtn");

// Scratch mask image in /public
const img = new Image();
img.src = "gold-mask.png";

// Prize options without emojis
const prizes = [
  { text: "Congratulations! 5% Off on orders above ₹399\nCode: SPSCRATCH5", weight: 40 },
  { text: "Better luck next time.\nOur perfumes still love you.", weight: 40 },
  { text: "10% Off on orders above ₹399\nCode: SPSCRATCH10", weight: 10 },
  { text: "Free 15 ml Tester on orders above ₹399\nCode: SPTEST15", weight: 10 },
  { text: "₹100 Off on orders above ₹399\nCode: SPSCRATCH100", weight: 5 }
];

function getRandomPrize() {
  const total = prizes.reduce((a,b) => a + b.weight, 0);
  let r = Math.random() * total;
  for (let p of prizes) {
    if (r < p.weight) return p.text;
    r -= p.weight;
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
    couponText.innerText = localStorage.getItem("lastPrize") 
      || "You already scratched today.";
    autoReveal();
  } else {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const prize = getRandomPrize();
    couponText.innerText = prize;
    localStorage.setItem("lastPrize", prize);
  }

  let isScratching = false, scratched = 0;

  canvas.addEventListener("mousedown", () => isScratching = true);
  canvas.addEventListener("mouseup", () => isScratching = false);
  canvas.addEventListener("mouseleave", () => isScratching = false);
  canvas.addEventListener("mousemove", (e) => {
    if (!isScratching || alreadyScratchedToday()) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    const data = ctx.getImageData(0,0,canvas.width,canvas.height).data;
    scratched = data.filter((_,i) => (i+1)%4===0 && data[i]===0).length;

    if (scratched / totalPixels > 0.3) {
      autoReveal();
      localStorage.setItem("lastScratchDate", new Date().toDateString());
    }
  });
};

copyBtn.addEventListener("click", () => {
  const text = localStorage.getItem("lastPrize") || couponText.innerText;
  const m = text.match(/SPSCRATCH\d+|SPTEST15/);
  if (m) {
    navigator.clipboard.writeText(m[0]).then(() => {
      copyBtn.innerText = "Copied!";
      copyBtn.classList.add("copied");
      setTimeout(() => {
        copyBtn.innerText = "Copy Code";
        copyBtn.classList.remove("copied");
      }, 1500);
    });
  }
});
