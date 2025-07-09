
let predictionInterval = null;
let currentOffset = 0;
const maxPredictions = 15;

let winCount = 0;
let loseCount = 0;

function generateResultNumber(seed, drawOffset) {
  const digits = seed.toString().split('').map(Number);
  const sum = digits.reduce((a, b) => a + b, 0);
  const variation = (seed * drawOffset + sum) % 17;
  const combined = sum + variation + drawOffset * 3;
  return combined % 10;
}

function getColorCategory(draw) {
  const isRed = [0, 2, 4, 6, 8].includes(draw);
  const isGreen = [1, 3, 5, 7, 9].includes(draw);
  const isPurple = [0, 5].includes(draw);

  if (isGreen && isPurple) return "Green & Purple";
  if (isRed && isPurple) return "Red & Purple";
  if (isGreen) return "Green";
  if (isRed) return "Red";
  if (isPurple) return "Purple";
  return "Unknown";
}

function predictSingle(offset) {
  const seq = document.getElementById("sequenceNumber").value.trim();
  if (!seq || isNaN(seq)) {
    document.getElementById("result").innerHTML = "<p>Please enter a valid 6-digit sequence.</p>";
    stopAutoPrediction();
    return;
  }

  const seed = parseInt(seq);
  const sequenceNumber = seed + offset;
  const resultDiv = document.getElementById("result");

  const predicted = generateResultNumber(seed, offset);
  const color = getColorCategory(predicted);

  const entry = document.createElement("div");
  entry.className = "prediction-entry fade-in";

  entry.innerHTML = `
    <strong>#${sequenceNumber}</strong>
    <div class="color-circle animated-circle ${color.toLowerCase().replace(/ & /g, '-')}"></div>
    <span class="color-label">${color}</span>
    <button onclick="markResult(this, true)">Win</button>
    <button onclick="markResult(this, false)">Lose</button>`;

  resultDiv.appendChild(entry);
}

function markResult(button, isWin) {
  const entry = button.parentElement;
  entry.classList.remove("win", "lose");
  entry.classList.add(isWin ? "win" : "lose");

  if (isWin) winCount++;
  else loseCount++;

  updateStats();
}

function updateStats() {
  const statsDiv = document.getElementById("stats");
  const total = winCount + loseCount;
  const winRate = total > 0 ? ((winCount / total) * 100).toFixed(1) : 0;
  statsDiv.innerText = `✅ Wins: ${winCount} | ❌ Losses: ${loseCount} | 🏆 Win Rate: ${winRate}%`;
}

function startAutoPrediction() {
  stopAutoPrediction();
  document.getElementById("result").innerHTML = "";
  document.getElementById("stats").innerText = "";
  winCount = 0;
  loseCount = 0;
  currentOffset = 0;
  predictSingle(currentOffset);
  currentOffset++;
  predictionInterval = setInterval(() => {
    if (currentOffset >= maxPredictions) {
      stopAutoPrediction();
      return;
    }
    predictSingle(currentOffset);
    currentOffset++;
  }, 5000);
}

function stopAutoPrediction() {
  if (predictionInterval) clearInterval(predictionInterval);
  predictionInterval = null;
}
