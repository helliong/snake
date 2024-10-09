// Получаем элемент canvas и его контекст для рисования
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Получаем элемент для отображения счета
const scoreElement = document.getElementById('score');

// Получаем элемент для инструкций
const instructionsElement = document.getElementById('instructions');

// Получаем кнопку для смены языка
const languageButton = document.getElementById('languageButton');

// Определяем масштаб и размеры игрового поля
const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

// Объявляем переменные для змейки, фрукта, счета и интервала игры
let snake;
let fruit;
let score = 0;
let gameInterval;
let isPaused = false;
let isEnglish = false;

// Функция для инициализации игры
(function setup() {
    snake = new Snake(); // Создаем объект змейки
    fruit = new Fruit(); // Создаем объект фрукта
    fruit.pickLocation(); // Выбираем случайное положение для фрукта

    // Запускаем игровой цикл с интервалом 200 мс (увеличенная скорость на 25%)
    gameInterval = window.setInterval(() => {
        if (!isPaused) { // Проверяем, не находится ли игра на паузе
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем канвас
            fruit.draw(); // Рисуем фрукт
            snake.update(); // Обновляем состояние змейки
            snake.draw(); // Рисуем змейку
            snake.checkCollision(); // Проверяем столкновения змейки
            snake.checkFruitCollision(fruit); // Проверяем столкновения змейки с фруктом
        }
    }, 200);
}());

// Обработчик событий для клавиш
window.addEventListener('keydown', (evt) => {
    const direction = evt.key.replace('Arrow', ''); // Получаем направление без префикса "Arrow"
    if (direction === ' ') { // Если нажата клавиша пробел, приостанавливаем или возобновляем игру
        isPaused = !isPaused;
    } else {
        snake.changeDirection(direction); // Изменяем направление змейки
    }
});

// Обработчик событий для кнопки смены языка
languageButton.addEventListener('click', () => {
    isEnglish = !isEnglish;
    updateLanguage();
});

// Функция для обновления языка
function updateLanguage() {
    if (isEnglish) {
        scoreElement.textContent = `Score: ${score}`;
        instructionsElement.textContent = 'Press space to pause';
        languageButton.textContent = 'Change Language';
    } else {
        scoreElement.textContent = `Счет: ${score}`;
        instructionsElement.textContent = 'Нажмите пробел для паузы';
        languageButton.textContent = 'Сменить язык';
    }
}

// Класс Snake для управления змейкой
function Snake() {
    this.x = 0; // Начальная позиция змейки по оси X
    this.y = 0; // Начальная позиция змейки по оси Y
    this.xSpeed = scale * 1; // Начальная скорость змейки по оси X
    this.ySpeed = 0; // Начальная скорость змейки по оси Y
    this.total = 0; // Общее количество сегментов змейки
    this.tail = []; // Массив для хранения сегментов змейки

    // Метод для рисования змейки
    this.draw = function() {
        ctx.fillStyle = "#4CAF50"; // Устанавливаем цвет змейки

        for (let i = 0; i < this.tail.length; i++) {
            ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale); // Рисуем каждый сегмент змейки
        }

        ctx.fillRect(this.x, this.y, scale, scale); // Рисуем голову змейки
    };

    // Метод для обновления состояния змейки
    this.update = function() {
        for (let i = 0; i < this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i + 1]; // Обновляем позиции сегментов змейки
        }

        this.tail[this.total - 1] = { x: this.x, y: this.y }; // Добавляем новый сегмент в конец хвоста

        this.x += this.xSpeed; // Обновляем позицию головы змейки по оси X
        this.y += this.ySpeed; // Обновляем позицию головы змейки по оси Y

        if (this.x >= canvas.width) {
            this.x = 0; // Перемещаем змейку на противоположную сторону канваса по оси X
        }

        if (this.y >= canvas.height) {
            this.y = 0; // Перемещаем змейку на противоположную сторону канваса по оси Y
        }

        if (this.x < 0) {
            this.x = canvas.width - scale; // Перемещаем змейку на противоположную сторону канваса по оси X
        }

        if (this.y < 0) {
            this.y = canvas.height - scale; // Перемещаем змейку на противоположную сторону канваса по оси Y
        }
    };

    // Метод для изменения направления змейки
    this.changeDirection = function(direction) {
        switch (direction) {
            case 'Up':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = -scale * 1;
                }
                break;
            case 'Down':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = scale * 1;
                }
                break;
            case 'Left':
                if (this.xSpeed === 0) {
                    this.xSpeed = -scale * 1;
                    this.ySpeed = 0;
                }
                break;
            case 'Right':
                if (this.xSpeed === 0) {
                    this.xSpeed = scale * 1;
                    this.ySpeed = 0;
                }
                break;
        }
    };

    // Метод для проверки столкновений змейки с самой собой
    this.checkCollision = function() {
        for (let i = 0; i < this.tail.length; i++) {
            if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                this.total = 0; // Сбрасываем количество сегментов змейки
                this.tail = []; // Очищаем массив сегментов змейки
                score = 0; // Сбрасываем счет
                updateLanguage(); // Обновляем отображение счета
            }
        }
    };

    // Метод для проверки столкновений змейки с фруктом
    this.checkFruitCollision = function(fruit) {
        if (this.x === fruit.x && this.y === fruit.y) {
            this.total++; // Увеличиваем количество сегментов змейки
            score++; // Увеличиваем счет
            updateLanguage(); // Обновляем отображение счета
            fruit.pickLocation(); // Выбираем новое случайное положение для фрукта
        }
    };
}

// Класс Fruit для управления фруктом
function Fruit() {
    this.x; // Позиция фрукта по оси X
    this.y; // Позиция фрукта по оси Y

    // Метод для выбора случайного положения фрукта
    this.pickLocation = function() {
        this.x = Math.floor(Math.random() * rows) * scale;
        this.y = Math.floor(Math.random() * columns) * scale;
    };

    // Метод для рисования фрукта
    this.draw = function() {
        ctx.fillStyle = "#FF0000"; // Устанавливаем цвет фрукта
        ctx.fillRect(this.x, this.y, scale, scale); // Рисуем фрукт
    };
}