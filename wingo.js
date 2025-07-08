let predictionInterval = null;
let currentOffset = 0;

function extractDrawNumberFromSequence(seq, offset = 0) {
  const number = parseInt(seq);
  if (isNaN(number)) return Math.floor(Math.random() * 10);
  return (number + offset) % 2880;
}

function generateResultNumber(seed, drawOffset) {
  const digits = seed.toString().split('').map(Number);
  const sum = digits.reduce((a, b) => a + b, 0);
  const variation = (seed * drawOffset + sum) % 17;
  const combined = sum + variation + drawOffset * 3;
  return combined % 10; // final result stays 0–9
}

function getColor(draw) {
  const isRed = [0, 2, 4, 6, 8].includes(draw);
  const isGreen = [1, 3, 5, 7, 9].includes(draw);
  const isPurple = [0, 5].includes(draw);

  if (isPurple) return "Purple";
  if (isRed) return "Red";
  if (isGreen) return "Green";
  return "Unknown";
}

function predictSingle(offset) {
  const seq = document.getElementById("sequenceNumber").value.trim();
  if (!seq || isNaN(seq)) {
    document.getElementById("result").innerHTML = "<p>Please enter a valid 4-digit sequence number.</p>";
    stopAutoPrediction();
    return;
  }

  const baseDraw = parseInt(seq);
  const resultDiv = document.getElementById("result");

  const currentDrawNumber = (baseDraw + offset) % 2880;
  const seed = extractDrawNumberFromSequence(seq, offset);
  const predictedNumber = generateResultNumber(seed, offset);
  const bigSmall = predictedNumber >= 5 ? "Big" : "Small";
  const color = getColor(predictedNumber);

  const entry = document.createElement("p");
  entry.innerHTML = `<strong>Draw #${currentDrawNumber}:</strong> Number: ${predictedNumber}, ${bigSmall}, Color: ${color}`;
  resultDiv.appendChild(entry);
}

function startAutoPrediction() {
  stopAutoPrediction();
  document.getElementById("result").innerHTML = "";
  currentOffset = 0;
  predictSingle(currentOffset);
  currentOffset++;
  predictionInterval = setInterval(() => {
    predictSingle(currentOffset);
    currentOffset++;
  }, 10000); // every 10 seconds
}

function stopAutoPrediction() {
  if (predictionInterval) clearInterval(predictionInterval);
  predictionInterval = null;
}
