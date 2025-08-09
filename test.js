const getComputerChoice = () =>
  ["rock", "paper", "scissors"][Math.floor(Math.random() * 3)];

// Get the element of the user interface you'll interact with
const ui = {
  target: document.getElementById("targetScore"),
  replay: document.getElementById("replay"),
  youScore: document.getElementById("youScore"),
  cpuScore: document.getElementById("cpuScore"),
  youBar: document.getElementById("youBar"),
  cpuBar: document.getElementById("cpuBar"),
  choices: [...document.querySelectorAll(".choice")],
  roundMsg: document.getElementById("roundMsg"),
  history: document.getElementById("history"),
};

// Initialize the scores
let humanScore = 0,
  computerScore = 0;

function updateUI(message) {
  const goal = Number(ui.target.value);
  ui.youScore.textContent = humanScore;
  ui.cpuScore.textContent = computerScore;
  ui.youBar.style.width = `${(humanScore / goal) * 100}%`;
  ui.cpuBar.style.width = `${(computerScore / goal) * 100}%`;
  if (message) ui.roundMsg.textContent = message;
}

function addHistoryLine(humanChoice, cpuChoice, result) {
  const li = document.createElement("li");
  li.textContent = `You: ${humanChoice} | CPU: ${cpuChoice} → ${result}`;
  ui.history.prepend(li);
  // keep last 5
  // while (ui.history.children.length > 5) ui.history.lastChild.remove();
}

// Function to play a round of the game
function playRound(humanChoice, computerChoice) {
  const h = humanChoice.toLowerCase(),
    c = computerChoice.toLowerCase();
  if (h === c) {
    addHistoryLine(h, c, "Tie");
    return "It's a tie!";
  }
  const youWin =
    (h === "rock" && c === "scissors") ||
    (h === "paper" && c === "rock") ||
    (h === "scissors" && c === "paper");
  if (youWin) {
    humanScore++;
    addHistoryLine(h, c, "You win");
    return `You win! ${h} beats ${c}`;
  }
  computerScore++;
  addHistoryLine(h, c, "Computer wins");
  return `Computer wins! ${c} beats ${h}`;
}

function checkFinal() {
  const goal = Number(ui.target.value);
  if (humanScore >= goal || computerScore >= goal) {
    const youWon = humanScore > computerScore;
    ui.roundMsg.textContent = youWon
      ? `🏆 You win the match ${humanScore}–${computerScore}!`
      : `🖥️ Computer wins the match ${computerScore}–${humanScore}.`;
    setEnabled(false);
  }
}

function setEnabled(enabled) {
  ui.choices.forEach((b) => (b.disabled = !enabled));
  ui.target.disabled = !enabled;
}

function resetGame() {
  humanScore = 0;
  computerScore = 0;
  ui.history.innerHTML = "";
  ui.roundMsg.textContent = "Make your move…";
  setEnabled(true);
  updateUI();
}

// Button clicks
ui.choices.forEach((btn) => {
  btn.addEventListener("click", () => {
    const msg = playRound(btn.dataset.choice, getComputerChoice());
    updateUI(msg);
    checkFinal();
  });
});

// Keyboard support: R / P / S
const keyMap = { r: "rock", p: "paper", s: "scissors" };
window.addEventListener("keydown", (e) => {
  const choice = keyMap[e.key?.toLowerCase()];
  if (!choice || ui.choices[0].disabled) return;
  const msg = playRound(choice, getComputerChoice());
  updateUI(msg);
  checkFinal();
});

ui.replay.addEventListener("click", resetGame);

// init
resetGame();
