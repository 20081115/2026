const PROBLEMS = [
  { symbol: "+", fn: (a, b) => a + b },
  { symbol: "-", fn: (a, b) => a - b },
  { symbol: "*", fn: (a, b) => a * b },
  { symbol: "/", fn: (a, b) => a / b },
];

const LEVELS = {
  1: [1, 10],
  2: [1, 50],
  3: [1, 100],
  4: [1, 500],
};

const startBtn = document.getElementById("startBtn");
const submitBtn = document.getElementById("submitBtn");
const nextBtn = document.getElementById("nextBtn");
const resetBtn = document.getElementById("resetBtn");
const setupPanel = document.getElementById("setupPanel");
const gamePanel = document.getElementById("gamePanel");
const questionText = document.getElementById("questionText");
const answerInput = document.getElementById("answerInput");
const feedback = document.getElementById("feedback");
const scoreDisplay = document.getElementById("score");
const roundsDisplay = document.getElementById("rounds");

let score = 0;
let rounds = 0;
let currentAnswer = null;
let currentMode = "1";
let currentRange = LEVELS[1];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chooseOps(mode) {
  if (mode === "1") return PROBLEMS.slice(0, 2);
  if (mode === "2") return PROBLEMS.slice(2);
  return PROBLEMS;
}

function generateProblem() {
  const [min, max] = currentRange;
  const ops = chooseOps(currentMode);
  const { symbol, fn } = ops[Math.floor(Math.random() * ops.length)];
  let a = randomInt(min, max);
  let b = randomInt(min, max);

  if (symbol === "/") {
    b = randomInt(1, Math.max(1, max));
    const factor = randomInt(min, Math.max(1, Math.floor(max / b)));
    a = b * factor;
  }

  const answer = fn(a, b);
  currentAnswer = symbol === "/" ? parseFloat(answer.toFixed(2)) : answer;
  questionText.textContent = `${a} ${symbol} ${b} = ?`;
  answerInput.value = "";
  answerInput.focus();
  feedback.textContent = "";
  submitBtn.disabled = false;
  nextBtn.classList.add("hidden");
}

function startGame() {
  const levelSelect = document.getElementById("levelSelect");
  const modeSelect = document.getElementById("modeSelect");
  currentRange = LEVELS[levelSelect.value];
  currentMode = modeSelect.value;
  score = 0;
  rounds = 0;
  updateStatus();
  setupPanel.classList.add("hidden");
  gamePanel.classList.remove("hidden");
  generateProblem();
}

function updateStatus() {
  scoreDisplay.textContent = score;
  roundsDisplay.textContent = rounds;
}

function checkAnswer() {
  const raw = answerInput.value.trim();
  if (!raw) {
    feedback.textContent = "請輸入答案。";
    return;
  }

  const answer = parseFloat(raw);
  const isCorrect = currentAnswer === parseFloat(answer.toFixed(2));

  rounds += 1;
  updateStatus();

  if (isCorrect) {
    score += 1;
    feedback.textContent = "答對了！按下一題繼續。";
    feedback.style.color = "#b9f6ca";
  } else {
    feedback.textContent = `答案錯誤。正確答案：${currentAnswer}`;
    feedback.style.color = "#ff8a80";
  }

  submitBtn.disabled = true;
  nextBtn.classList.remove("hidden");
}

function nextQuestion() {
  generateProblem();
}

function resetGame() {
  setupPanel.classList.remove("hidden");
  gamePanel.classList.add("hidden");
  score = 0;
  rounds = 0;
  updateStatus();
  feedback.textContent = "";
  questionText.textContent = "按「開始練習」出題";
}

startBtn.addEventListener("click", startGame);
submitBtn.addEventListener("click", checkAnswer);
nextBtn.addEventListener("click", nextQuestion);
resetBtn.addEventListener("click", resetGame);
answerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (!submitBtn.disabled) {
      checkAnswer();
    } else if (!nextBtn.classList.contains("hidden")) {
      nextQuestion();
    }
  }
});
