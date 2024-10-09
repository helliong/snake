// Получаем элементы DOM
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const pauseButton = document.getElementById('pauseButton');
const changeLanguageButton = document.getElementById('changeLanguageButton');
const instructions = document.getElementById('instructions');
const upButton = document.getElementById('upButton');
const leftButton = document.getElementById('leftButton');
const downButton = document.getElementById('downButton');
const rightButton = document.getElementById('rightButton');
const restartButton = document.getElementById('restartButton');

// Инициализируем переменные
let score = 0;
let snake = [{ x: 200, y: 200 }];
let dx = 20;
let dy = 0;
let food = { x: Math.floor(Math.random() * 20) * 20, y: Math.floor(Math.random() * 20) * 20 };
let gameInterval;
let isPaused = false;
let language = 'en';

// Функция для рисования змейки
function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, 20, 20));
}

// Функция для рисования еды
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, 20, 20);
}

// Функция для перемещения змейки
function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Проверка на съедание еды
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = language === 'en' ? `Score: ${score}` : `Счет: ${score}`;
        food = { x: Math.floor(Math.random() * 20) * 20, y: Math.floor(Math.random() * 20) * 20 };
    } else {
        snake.pop();
    }

    // Проверка на выход за границы
    if (head.x < 0) head.x = canvas.width - 20;
    if (head.x >= canvas.width) head.x = 0;
    if (head.y < 0) head.y = canvas.height - 20;
    if (head.y >= canvas.height) head.y = 0;

    // Проверка на столкновение с самой собой
    if (snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        clearInterval(gameInterval);
        isPaused = true;
        pauseButton.textContent = language === 'en' ? 'Game Over' : 'Игра окончена';
        restartButton.style.display = 'block'; // Показываем кнопку "Начать заново"
    }
}

// Основной игровой цикл
function gameLoop() {
    if (!isPaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSnake();
        drawFood();
        moveSnake();
    }
}

// Функция для смены языка
function changeLanguage() {
    language = language === 'en' ? 'ru' : 'en';
    scoreDisplay.textContent = language === 'en' ? `Score: ${score}` : `Счет: ${score}`;
    changeLanguageButton.textContent = language === 'en' ? 'Change Language' : 'Сменить язык';
    pauseButton.textContent = isPaused ? (language === 'en' ? 'Resume' : 'Продолжить') : (language === 'en' ? 'Pause' : 'Пауза');
    instructions.textContent = language === 'en' ? 'Press space to pause the game' : 'Чтобы поставить на паузу нажмите пробел';
}

// Функция для паузы/возобновления игры
function togglePause() {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? (language === 'en' ? 'Resume' : 'Продолжить') : (language === 'en' ? 'Pause' : 'Пауза');
}

// Обработчик событий для клавиатуры
document.addEventListener('keydown', event => {
    if (event.code === 'Space') {
        togglePause();
    } else if (event.code === 'ArrowUp' && dy === 0) {
        dx = 0;
        dy = -20;
    } else if (event.code === 'ArrowDown' && dy === 0) {
        dx = 0;
        dy = 20;
    } else if (event.code === 'ArrowLeft' && dx === 0) {
        dx = -20;
        dy = 0;
    } else if (event.code === 'ArrowRight' && dx === 0) {
        dx = 20;
        dy = 0;
    }
});

// Обработчики событий для кнопок на мобильных устройствах
upButton.addEventListener('click', () => {
    if (dy === 0) {
        dx = 0;
        dy = -20;
    }
});

leftButton.addEventListener('click', () => {
    if (dx === 0) {
        dx = -20;
        dy = 0;
    }
});

downButton.addEventListener('click', () => {
    if (dy === 0) {
        dx = 0;
        dy = 20;
    }
});

rightButton.addEventListener('click', () => {
    if (dx === 0) {
        dx = 20;
        dy = 0;
    }
});

// Обработчики событий для кнопок паузы и смены языка
pauseButton.addEventListener('click', togglePause);
changeLanguageButton.addEventListener('click', changeLanguage);

// Обработчик событий для кнопки "Начать заново"
restartButton.addEventListener('click', () => {
    score = 0;
    snake = [{ x: 200, y: 200 }];
    dx = 20;
    dy = 0;
    food = { x: Math.floor(Math.random() * 20) * 20, y: Math.floor(Math.random() * 20) * 20 };
    isPaused = false;
    restartButton.style.display = 'none'; // Скрываем кнопку "Начать заново"
    pauseButton.textContent = language === 'en' ? 'Pause' : 'Пауза';
    scoreDisplay.textContent = language === 'en' ? `Score: ${score}` : `Счет: ${score}`;
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 133); // Снижаем скорость на 25%
});

// Запуск игрового цикла
gameInterval = setInterval(gameLoop, 133); // Снижаем скорость на 25%