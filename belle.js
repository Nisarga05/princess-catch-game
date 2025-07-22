const player = document.getElementById('player');
const gamebox = document.getElementById('gamebox');

let playerX = 170;
const speed = 10;
const playerWidth = 80;

const keys = {
  left: false,
  right: false
};

// listen for movement keys
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') keys.left = true;
  if (e.key === 'ArrowRight') keys.right = true;
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') keys.left = false;
  if (e.key === 'ArrowRight') keys.right = false;
});

// score and lives
let score = 0;
let lives = 3;

const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');

function updateHUD() {
  scoreDisplay.textContent = `Score: ${score}`;
  livesDisplay.textContent = `Lives: ${lives}`;
}

let objects = [];

function createFallingObject() {
  const obj = document.createElement('div');

  const isBad = Math.random() < 0.3; // 30% chance bad

  obj.classList.add('falling-object');
  if (isBad) {
    obj.classList.add('bad-object');
  } else {
    const goodObjects = ['rose', 'book'];
    const randomGood = goodObjects[Math.floor(Math.random() * goodObjects.length)];
    obj.classList.add(`${randomGood}-object`);
  }
  

  let minX = 120;
  let maxX = 950;
  let startX = minX + Math.random() * (maxX - minX - 50);
  obj.style.left = startX + 'px';
  obj.style.top = '0px';

  gamebox.appendChild(obj);

  objects.push({
    el: obj,
    x: startX,
    y: 0,
    speed: 5,
    type: isBad ? 'bad' : 'good'
  });
}

let spawnInterval;

let gameOver = false;

function gameLoop() {
  if (gameOver) return;

  requestAnimationFrame(gameLoop);

  // move player
  if (keys.left) {
    playerX -= speed;
    if (playerX < 120) playerX = 120;
  }
  if (keys.right) {
    playerX += speed;
    if (playerX > 950) playerX = 950;
  }

  player.style.left = playerX + 'px';

  // move objects
  for (let i = objects.length - 1; i >= 0; i--) {
    let obj = objects[i];
    obj.y += obj.speed;
    obj.el.style.top = obj.y + 'px';

    // check collision
    const playerRect = player.getBoundingClientRect();
    const objRect = obj.el.getBoundingClientRect();

    if (
      objRect.bottom >= playerRect.top &&
      objRect.left < playerRect.right &&
      objRect.right > playerRect.left
    ) {
      // caught object
      gamebox.removeChild(obj.el);
      objects.splice(i, 1);

      if (obj.type === 'bad') {
        lives = Math.max(0, lives - 1);
      } else {
        score += 10;
      }
      updateHUD();

      if (lives === 0) {
        endGame();
        return;
      }
    } else if (obj.y > 600) {
      // object missed
      gamebox.removeChild(obj.el);
      objects.splice(i, 1);

      if (obj.type === 'good') {
        lives = Math.max(0, lives - 1);
        updateHUD();

        if (lives === 0) {
          endGame();
          return;
        }
      }
      // if bad object missed → no penalty
    }
  }
}

function endGame() {
  gameOver = true;
  clearInterval(spawnInterval);

  const overlay = document.getElementById('gameover-overlay');
  const finalScore = document.getElementById('final-score');
  finalScore.textContent = `Your final score: ${score}`;
  overlay.classList.remove('hidden');
}

document.getElementById('restart-btn').addEventListener('click', () => {
  clearInterval(spawnInterval);

  // reset game
  score = 0;
  lives = 3;
  updateHUD();

  objects.forEach(obj => {
    if (obj.el && obj.el.parentNode) {
      obj.el.parentNode.removeChild(obj.el);
    }
  });
  objects = [];

  document.getElementById('gameover-overlay').classList.add('hidden');
  gameOver = false;

  spawnInterval = setInterval(createFallingObject, 2000);
  gameLoop();
});

// start game
function startGame() {
  score = 0;
  lives = 3;
  updateHUD();

  objects.forEach(obj => {
    if (obj.el && obj.el.parentNode) {
      obj.el.parentNode.removeChild(obj.el);
    }
  });
  objects = [];

  gameOver = false;
  spawnInterval = setInterval(createFallingObject, 2000);
  gameLoop();
}

document.getElementById('start-btn').addEventListener('click', () => {
  document.getElementById('start-screen').style.display = 'none';
  startGame();
});
document.getElementById("back-btn").addEventListener("click", () => {
  window.location.href = "index.html";
});


