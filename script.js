let timer;
let minutes = 0;
let seconds = 0;
let isRunning = false;
let puzzleItems = [];
let emptyItemIndex = 11; // Ô đen sẽ nằm ở vị trí cuối cùng ban đầu, nhưng sẽ thay đổi sau khi trộn
let steps = 0; // Biến để lưu số bước đi của lượt chơi

let history = []; // Mảng để lưu trữ lịch sử các lượt chơi

document.addEventListener("DOMContentLoaded", () => {
  // Khởi tạo danh sách các ô puzze__item
  puzzleItems = Array.from(document.querySelectorAll(".puzze__item"));

  const startBtn = document.getElementById("startBtn");
  startBtn.addEventListener("click", startGame);

  // Lắng nghe sự kiện bàn phím
  document.addEventListener("keydown", handleKeyPress);
});

function startGame() {
  const startBtn = document.getElementById("startBtn");
  const winMessage = document.getElementById("winMessage"); // Thẻ thông báo chiến thắng

  if (isRunning) {
    // Nếu trò chơi đang chạy, kết thúc
    stopGame();
    // Reset lại thông báo "YOU WIN!" khi chơi lại
    winMessage.textContent = "";
  } else {
    // Nếu trò chơi chưa chạy, bắt đầu mới
    isRunning = true;
    resetClock();
    shufflePuzzleItems();
    steps = 0; // Reset số bước đi khi bắt đầu lại
    startTimer();
    startBtn.textContent = "Kết thúc"; // Giữ chữ "Kết thúc" khi bắt đầu
    startBtn.classList.add("running"); // Thêm lớp "running"
    winMessage.textContent = ""; // Đảm bảo không có thông báo thắng khi bắt đầu
  }
}

function stopGame() {
  const startBtn = document.getElementById("startBtn");
  isRunning = false;
  clearInterval(timer); // Dừng bộ đếm thời gian
  startBtn.textContent = "Bắt đầu"; // Đổi lại thành "Bắt đầu"
  startBtn.classList.remove("running"); // Loại bỏ lớp "running"
  console.log(`Trò chơi kết thúc! Thời gian: ${formatTime(minutes, seconds)}`);
}

function resetClock() {
  minutes = 0;
  seconds = 0;
  document.getElementById("timer").textContent = formatTime(minutes, seconds);
}

function shufflePuzzleItems() {
  for (let i = 0; i < 100; i++) {
    for (let j = puzzleItems.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [puzzleItems[j], puzzleItems[k]] = [puzzleItems[k], puzzleItems[j]];
    }
  }
  const puzzleContainer = document.querySelector(".puzze");
  puzzleItems.forEach((item) => puzzleContainer.appendChild(item));

  emptyItemIndex = puzzleItems.findIndex((item) =>
    item.classList.contains("puzze__black")
  );
  console.log("Ô đen đã được đặt lại ở vị trí: " + emptyItemIndex);
}

function startTimer() {
  timer = setInterval(function () {
    seconds++;
    if (seconds == 60) {
      seconds = 0;
      minutes++;
    }
    document.getElementById("timer").textContent = formatTime(minutes, seconds);
  }, 1000);
}

function formatTime(minutes, seconds) {
  return (
    (minutes < 10 ? "0" + minutes : minutes) +
    ":" +
    (seconds < 10 ? "0" + seconds : seconds)
  );
}

function handleKeyPress(event) {
  const key = event.key;

  let swapIndex = -1;
  if (key === "ArrowUp" || key === "w") {
    swapIndex = emptyItemIndex - 4;
  } else if (key === "ArrowDown" || key === "s") {
    swapIndex = emptyItemIndex + 4;
  } else if (key === "ArrowLeft" || key === "a") {
    swapIndex = emptyItemIndex - 1;
  } else if (key === "ArrowRight" || key === "d") {
    swapIndex = emptyItemIndex + 1;
  }

  if (swapIndex >= 0 && swapIndex < puzzleItems.length) {
    if (
      (emptyItemIndex % 4 === 0 && swapIndex === emptyItemIndex - 1) ||
      ((emptyItemIndex + 1) % 4 === 0 && swapIndex === emptyItemIndex + 1)
    ) {
      return;
    }

    [puzzleItems[emptyItemIndex], puzzleItems[swapIndex]] = [
      puzzleItems[swapIndex],
      puzzleItems[emptyItemIndex],
    ];

    const puzzleContainer = document.querySelector(".puzze");
    puzzleItems.forEach((item) => puzzleContainer.appendChild(item));

    emptyItemIndex = swapIndex;

    steps++;

    checkWin();
  }
}

function checkWin() {
  const correctOrder = [
    "puzze__green",
    "puzze__red",
    "puzze__blue",
    "puzze__purple",
    "puzze__yellow",
    "puzze__pink",
    "puzze__indigo",
    "puzze__gray",
    "puzze__emeral",
    "puzze__amber",
    "puzze__lime",
    "puzze__black",
  ];

  for (let i = 0; i < puzzleItems.length; i++) {
    if (!puzzleItems[i].classList.contains(correctOrder[i])) {
      return;
    }
  }

  const winMessage = document.getElementById("winMessage");
  winMessage.textContent = "YOU WIN!";
  winMessage.style.color = "red";

  const startBtn = document.getElementById("startBtn");
  startBtn.textContent = "Chơi lại";

  history.push({
    index: history.length + 1,
    steps: steps,
    time: formatTime(minutes, seconds),
  });

  updateHistoryTable();
}

function updateHistoryTable() {
  const historyTableBody = document.querySelector(".history__table tbody");
  historyTableBody.innerHTML = "";

  history.forEach((entry) => {
    const row = document.createElement("tr");

    const indexCell = document.createElement("td");
    indexCell.textContent = entry.index;
    row.appendChild(indexCell);

    const stepsCell = document.createElement("td");
    stepsCell.textContent = entry.steps;
    row.appendChild(stepsCell);

    const timeCell = document.createElement("td");
    timeCell.textContent = entry.time;
    row.appendChild(timeCell);

    historyTableBody.appendChild(row);
  });
}
