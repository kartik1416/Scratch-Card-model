const rewards = [
  { text: "🎉 Congratulations! You get 5% Off\nCoupon: SPSCRATCH5", weight: 40 },
  { text: "🎁 Better luck next time.\nBut our perfumes never disappoint!", weight: 40 },
  { text: "🔥 10% Off on orders above ₹399\nCoupon: SPSCRATCH10", weight: 10 },
  { text: "🧴 Free 15ml Tester worth ₹499!\nCoupon: SPTEST15", weight: 10 },
  { text: "👨‍💻 Hacker or What! ₹100 Off\nCoupon: SPSCRATCH100", weight: 5 }
];

function pickReward() {
  const totalWeight = rewards.reduce((acc, r) => acc + r.weight, 0);
  let rand = Math.random() * totalWeight;
  for (const reward of rewards) {
    if (rand < reward.weight) return reward.text;
    rand -= reward.weight;
  }
  return rewards[0].text;
}

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("scratchCanvas");
  const ctx = canvas.getContext("2d");
  const rewardText = document.getElementById("rewardText");

  rewardText.innerText = pickReward();

  const img = new Image();
  img.src = 'gold-mask.png';  // <-- Place this image in `public/`
  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  let isDrawing = false;

  canvas.addEventListener("mousedown", () => isDrawing = true);
  canvas.addEventListener("mouseup", () => isDrawing = false);
  canvas.addEventListener("mousemove", scratch);
  canvas.addEventListener("touchmove", scratchTouch);

  function scratch(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(e.clientX - rect.left, e.clientY - rect.top, 15, 0, Math.PI * 2);
    ctx.fill();
  }

  function scratchTouch(e) {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(touch.clientX - rect.left, touch.clientY - rect.top, 15, 0, Math.PI * 2);
    ctx.fill();
  }
});
