// Obtener el canvas y su contexto
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Definir tamaño del jugador y enemigos
const PLAYER_SIZE = 16;
const ENEMY_SIZE = 16;
const BIG_POINT_SIZE = 30;

// Definir posición inicial del jugador
let playerX = canvas.width / 2 - PLAYER_SIZE / 2;
let playerY = canvas.height / 2 - PLAYER_SIZE / 2;

// Definir dirección inicial de Link
let facingDirection = 'east';

// Definir posición inicial de la espada
let swordX = playerX + PLAYER_SIZE;
let swordY = playerY + PLAYER_SIZE / 2 - 2;

// Definir posición inicial de los enemigos
let enemies = [];

// Variables para el movimiento continuo
let movingLeft = false;
let movingUp = false;
let movingRight = false;
let movingDown = false;

// Variable para representar el estado de la espada
let isSwordActive = false;

// Velocidad de los enemigos
let enemySpeed = 1;

// Contador de puntos
let score = 0;

// Contador de nivel
let level = 1;

// Cantidad de enemigos para mostrar el cuadrado azul
let enemiesForBigPoint = 5;

// Posición fija pero aleatoria para el cuadrado azul
let fixedBigPointX = 0;
let fixedBigPointY = 0;

// Variable para verificar si ya se ha pasado al siguiente nivel
let nextLevelActivated = false;

// Funciones para activar y desactivar el movimiento
function startMoving(direction) {
  switch (direction) {
    case 'left':
      movingLeft = true;
      facingDirection = 'west';
      break;
    case 'up':
      movingUp = true;
      facingDirection = 'north';
      break;
    case 'right':
      movingRight = true;
      facingDirection = 'east';
      break;
    case 'down':
      movingDown = true;
      facingDirection = 'south';
      break;
  }
}

function stopMoving(direction) {
  switch (direction) {
    case 'left':
      movingLeft = false;
      break;
    case 'up':
      movingUp = false;
      break;
    case 'right':
      movingRight = false;
      break;
    case 'down':
      movingDown = false;
      break;
  }
}

// Funciones para activar y desactivar la espada
function activateSword() {
  isSwordActive = true;
  setTimeout(deactivateSword, 200); // Desactivar la espada después de 200 ms
}

function deactivateSword() {
  isSwordActive = false;
}

// Función para mover al jugador continuamente
function movePlayer() {
  const speed = 2;
  if (movingLeft && playerX > 0) {
    playerX -= speed;
  }
  if (movingUp && playerY > 0) {
    playerY -= speed;
  }
  if (movingRight && playerX < canvas.width - PLAYER_SIZE) {
    playerX += speed;
  }
  if (movingDown && playerY < canvas.height - PLAYER_SIZE) {
    playerY += speed;
  }
  // Actualizar posición de la espada
  switch (facingDirection) {
    case 'north':
      swordX = playerX + PLAYER_SIZE / 2 - 2;
      swordY = playerY - 22;
      break;
    case 'south':
      swordX = playerX + PLAYER_SIZE / 2 - 2;
      swordY = playerY + PLAYER_SIZE;
      break;
    case 'east':
      swordX = playerX + PLAYER_SIZE;
      swordY = playerY + PLAYER_SIZE / 2 - 2;
      break;
    case 'west':
      swordX = playerX - 22;
      swordY = playerY + PLAYER_SIZE / 2 - 2;
      break;
  }
}

// Función para mover los enemigos
function moveEnemies() {
  for (let enemy of enemies) {
    // Mover enemigo hacia abajo
    enemy.y += enemySpeed;
    // Si el enemigo llega al borde inferior, reiniciar su posición
    if (enemy.y > canvas.height) {
      enemy.y = -ENEMY_SIZE;
      enemy.x = Math.random() * (canvas.width - ENEMY_SIZE);
    }
  }
}

// Escuchar eventos de teclado para mover al jugador y activar la espada
document.addEventListener('keydown', function (e) {
  switch (e.keyCode) {
    case 37: // Left arrow
      startMoving('left');
      break;
    case 38: // Up arrow
      startMoving('up');
      break;
    case 39: // Right arrow
      startMoving('right');
      break;
    case 40: // Down arrow
      startMoving('down');
      break;
    case 32: // Spacebar
      activateSword(); // Activar la espada al presionar la barra espaciadora
      break;
  }
});

document.addEventListener('keyup', function (e) {
  switch (e.keyCode) {
    case 37: // Left arrow
      stopMoving('left');
      break;
    case 38: // Up arrow
      stopMoving('up');
      break;
    case 39: // Right arrow
      stopMoving('right');
      break;
    case 40: // Down arrow
      stopMoving('down');
      break;
  }
});

// Función para dibujar al jugador
function drawPlayer() {
  ctx.fillStyle = 'green';
  ctx.fillRect(playerX, playerY, PLAYER_SIZE, PLAYER_SIZE);
}

// Función para dibujar la espada
function drawSword() {
  if (isSwordActive) {
    ctx.fillStyle = 'gray'; // Color de la espada
    switch (facingDirection) {
      case 'north':
        ctx.fillRect(playerX + PLAYER_SIZE / 2 - 2, playerY - 22, 4, 22);
        break;
      case 'south':
        ctx.fillRect(playerX + PLAYER_SIZE / 2 - 2, playerY + PLAYER_SIZE, 4, 22);
        break;
      case 'east':
        ctx.fillRect(playerX + PLAYER_SIZE, playerY + PLAYER_SIZE / 2 - 2, 22, 4);
        break;
      case 'west':
        ctx.fillRect(playerX - 22, playerY + PLAYER_SIZE / 2 - 2, 22, 4);
        break;
    }
  }
}

// Función para dibujar a los enemigos
function drawEnemies() {
  ctx.fillStyle = 'red';
  for (let enemy of enemies) {
    ctx.fillRect(enemy.x, enemy.y, ENEMY_SIZE, ENEMY_SIZE);
  }
}

// Función para dibujar el punto grande azul si se han eliminado suficientes enemigos
function drawBigPoint() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(fixedBigPointX, fixedBigPointY, BIG_POINT_SIZE, BIG_POINT_SIZE);
}

// Función para dibujar el contador de puntos
function drawScore() {
  ctx.fillStyle = 'black';
  ctx.font = '16px Arial';
  ctx.fillText('Score: ' + score, 8, 20);
}

// Función para dibujar el contador de nivel
function drawLevel() {
  ctx.fillStyle = 'black';
  ctx.font = '16px Arial';
  ctx.fillText('Level: ' + level, canvas.width - 70, 20);
}

// Función para generar un nuevo enemigo
function generateEnemy() {
  const randomX = Math.random() * (canvas.width - ENEMY_SIZE);
  const randomY = Math.random() * -canvas.height; // Comenzar desde arriba
  enemies.push({ x: randomX, y: randomY });
}

// Función para detectar colisiones entre el jugador y los enemigos
function detectCollisions() {
  for (let enemy of enemies) {
    if (
      playerX < enemy.x + ENEMY_SIZE &&
      playerX + PLAYER_SIZE > enemy.x &&
      playerY < enemy.y + ENEMY_SIZE &&
      playerY + PLAYER_SIZE > enemy.y
    ) {
      // Colisión detectada
      gameOver();
    }
  }
}

// Función para detectar colisiones entre la espada y los enemigos
function detectSwordCollision() {
  if (isSwordActive) {
    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      // Verificar si el enemigo está dentro del área de la espada
      if (
        enemy.x < swordX + 20 &&
        enemy.x + ENEMY_SIZE > swordX &&
        enemy.y < swordY + 20 &&
        enemy.y + ENEMY_SIZE > swordY
      ) {
        // Colisión detectada, eliminar al enemigo y aumentar la puntuación
        enemies.splice(i, 1);
        score += 1;
      }
    }
  }
}

// Función para finalizar el juego
function gameOver() {
  // Limpiar el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Dibujar el mensaje de Game Over
  ctx.fillStyle = 'black';
  ctx.font = '24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 20);
  
  // Dibujar el botón Restart
  ctx.fillStyle = 'blue';
  ctx.fillRect(canvas.width / 2 - 50, canvas.height / 2 + 10, 100, 40);
  ctx.fillStyle = 'white';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Restart', canvas.width / 2, canvas.height / 2 + 35);
  
  // Escuchar clics en el botón Restart
  canvas.addEventListener('click', restartGame);
}

// Función para reiniciar el juego
function restartGame(event) {
  // Obtener coordenadas del clic
  const clickX = event.clientX - canvas.offsetLeft;
  const clickY = event.clientY - canvas.offsetTop;
  
  // Verificar si se hizo clic en el botón Restart
  if (clickX >= canvas.width / 2 - 50 && clickX <= canvas.width / 2 + 50 &&
      clickY >= canvas.height / 2 + 10 && clickY <= canvas.height / 2 + 50) {
    // Eliminar el evento click para evitar que se reinicie múltiples veces
    canvas.removeEventListener('click', restartGame);
    
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Reiniciar variables
    playerX = canvas.width / 2 - PLAYER_SIZE / 2;
    playerY = canvas.height / 2 - PLAYER_SIZE / 2;
    enemies = [];
    score = 0;
    level = 1;
    enemiesForBigPoint = 5;
    nextLevelActivated = false;
    
    // Iniciar el juego
    main();
  }
}

// Función para detectar colisiones entre el jugador y el punto azul
function detectBigPointCollision() {
  // Verificar si el jugador colisiona con el punto azul
  if (
    playerX < fixedBigPointX + BIG_POINT_SIZE &&
    playerX + PLAYER_SIZE > fixedBigPointX &&
    playerY < fixedBigPointY + BIG_POINT_SIZE &&
    playerY + PLAYER_SIZE > fixedBigPointY
  ) {
    // Si hay colisión, pasar al siguiente nivel
    nextLevel();
  }
}

// Función para calcular la distancia entre dos puntos
function distanceBetween(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// Función para pasar al siguiente nivel
function nextLevel() {
  level++; // Incrementar el nivel
  enemiesForBigPoint += level * 5; // Incrementar la cantidad de enemigos para mostrar el punto azul
  // Reiniciar la posición del jugador
  playerX = canvas.width / 2 - PLAYER_SIZE / 2;
  playerY = canvas.height / 2 - PLAYER_SIZE / 2;
  // Reiniciar la posición de los enemigos
  for (let enemy of enemies) {
    enemy.x = Math.random() * (canvas.width - ENEMY_SIZE);
    enemy.y = Math.random() * -canvas.height;
  }
  // Cambiar la posición del punto azul de manera aleatoria pero lejos del jugador
  do {
    fixedBigPointX = Math.random() * (canvas.width - BIG_POINT_SIZE);
    fixedBigPointY = Math.random() * (canvas.height - BIG_POINT_SIZE);
  } while (distanceBetween(playerX, playerY, fixedBigPointX, fixedBigPointY) < 100); // Asegurar que esté al menos a 100 píxeles de distancia
}

// Función principal del juego
function main() {
  // Limpiar el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Mover al jugador continuamente
  movePlayer();

  // Dibujar al jugador
  drawPlayer();

  // Dibujar la espada
  drawSword();

  // Mover los enemigos
  moveEnemies();

  // Dibujar a los enemigos
  drawEnemies();

  // Dibujar el punto grande azul si se han eliminado suficientes enemigos
  if (score >= enemiesForBigPoint) {
    drawBigPoint();
  }

  // Dibujar el contador de puntos
  drawScore();

  // Dibujar el contador de nivel
  drawLevel();

  // Generar nuevos enemigos aleatoriamente
  if (Math.random() < 0.01) {
    generateEnemy();
  }

  // Detectar colisiones entre el jugador y los enemigos
  detectCollisions();

  // Detectar colisiones entre la espada y los enemigos
  detectSwordCollision();

  // Detectar colisiones entre el jugador y el punto azul
  detectBigPointCollision();

  // Llamar a la función main nuevamente para animar el juego
  requestAnimationFrame(main);
}

// Iniciar el juego
main();
