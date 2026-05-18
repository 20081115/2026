const PROBLEMS = [
  { symbol: "+", fn: (a, b) => a + b },
  { symbol: "-", fn: (a, b) => a - b },
  { symbol: "*", fn: (a, b) => a * b },
  { symbol: "/", fn: (a, b) => a / b },
];

const LEVELS = {
  1: [1, 5],
  2: [1, 10],
  3: [1, 20],
  4: [1, 50],
  5: [1, 100],
  6: [1, 200],
  7: [1, 500],
  8: [1, 1000],
  9: [1, 2000],
  10: [1, 5000],
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
const progressDisplay = document.getElementById("progress");

const QUIZ_LENGTH = 10;

let score = 0;
let currentQuestion = 0;
let currentAnswer = null;
let currentTheme = "1";
let currentRange = LEVELS[1];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chooseOps(theme) {
  if (theme === "1") return PROBLEMS.slice(0, 1);
  if (theme === "2") return PROBLEMS.slice(1, 2);
  if (theme === "3") return PROBLEMS.slice(2, 3);
  if (theme === "4") return PROBLEMS.slice(3, 4);
  if (theme === "5") return PROBLEMS;
  return [{ symbol: "*", fn: (a, b) => a * b }];
}

function generateProblem() {
  const [min, max] = currentRange;
  const ops = chooseOps(currentTheme);

  let symbol, fn, a, b;

  if (currentTheme === "6") {
    symbol = "*";
    fn = (x, y) => x * y;
    a = randomInt(1, Math.min(12, max));
    b = randomInt(1, Math.min(12, max));
  } else {
    ({ symbol, fn } = ops[Math.floor(Math.random() * ops.length)]);
    a = randomInt(min, max);
    b = randomInt(min, max);

    if (symbol === "/") {
      b = randomInt(1, Math.max(1, max));
      const factor = randomInt(min, Math.max(1, Math.floor(max / b)));
      a = b * factor;
    }
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
  const themeSelect = document.getElementById("themeSelect");
  currentRange = LEVELS[levelSelect.value];
  currentTheme = themeSelect.value;
  score = 0;
  currentQuestion = 0;
  updateStatus();
  setupPanel.classList.add("hidden");
  gamePanel.classList.remove("hidden");
  nextQuestion();
}

function updateStatus() {
  scoreDisplay.textContent = score;
  progressDisplay.textContent = currentQuestion;
}

function checkAnswer() {
  const raw = answerInput.value.trim();
  if (!raw) {
    feedback.textContent = "請輸入答案。";
    feedback.style.color = "#ffffff";
    return;
  }

  const answer = parseFloat(raw);
  const isCorrect = currentAnswer === parseFloat(answer.toFixed(2));

  if (isCorrect) {
    score += 1;
    feedback.textContent = "答對了！";
    feedback.style.color = "#b9f6ca";
  } else {
    feedback.textContent = `答案錯誤。正確答案：${currentAnswer}`;
    feedback.style.color = "#ff8a80";
  }

  submitBtn.disabled = true;

  if (currentQuestion >= QUIZ_LENGTH) {
    endGame();
  } else {
    nextBtn.textContent = "下一題";
    nextBtn.classList.remove("hidden");
  }
}

function nextQuestion() {
  if (currentQuestion >= QUIZ_LENGTH) {
    resetGame();
    return;
  }

  currentQuestion += 1;
  updateStatus();
  generateProblem();
}

function endGame() {
  feedback.textContent = `測驗結束！你答對 ${score} / ${QUIZ_LENGTH} 題。`;
  feedback.style.color = "#ffd966";
  nextBtn.classList.add("hidden");
  submitBtn.disabled = true;
}

function resetGame() {
  setupPanel.classList.remove("hidden");
  gamePanel.classList.add("hidden");
  score = 0;
  currentQuestion = 0;
  updateStatus();
  feedback.textContent = "";
  questionText.textContent = "按「開始 10 題測驗」出題";
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
