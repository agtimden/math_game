// Класс MathGame представляет собой основную логику математической игры
class MathGame {
    constructor() {
        // Определение уровней сложности игры
        this.levels = ['Начальный', 'Средний', 'Продвинутый'];
        // Текущий уровень (начинаем с 0 - начальный уровень)
        this.currentLevel = 0;
        // Счетчики правильных и неправильных ответов
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        // Счетчик заданных вопросов
        this.questionsAsked = 0;
        // Множество для хранения уже использованных вопросов
        this.usedQuestions = new Set();
        
        // Получение ссылок на DOM элементы
        this.levelInfo = document.getElementById('levelInfo');
        this.questionElement = document.getElementById('question');
        this.answerInput = document.getElementById('answerInput');
        this.correctCount = document.getElementById('correctCount');
        this.incorrectCount = document.getElementById('incorrectCount');
        this.submitButton = document.getElementById('submitButton');
        this.restartButton = document.getElementById('restartButton');
        this.exitButton = document.getElementById('exitButton');
        this.resultMessage = document.getElementById('resultMessage');
        
        // Привязка обработчиков событий к кнопкам и полю ввода
        this.submitButton.addEventListener('click', () => this.checkAnswer());
        this.restartButton.addEventListener('click', () => this.restartGame());
        this.exitButton.addEventListener('click', () => this.exitGame());
        // Обработка нажатия Enter в поле ввода
        this.answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkAnswer();
        });
        
        // Запуск игры
        this.startGame();
    }
    
    // Метод для начала новой игры
    startGame() {
        // Сброс всех параметров к начальным значениям
        this.currentLevel = 0;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.questionsAsked = 0;
        this.usedQuestions.clear();
        // Обновление интерфейса и генерация первого вопроса
        this.updateUI();
        this.generateQuestion();
    }
    
    // Метод для генерации нового вопроса
    generateQuestion() {
        let question, answer;
        
        // Генерация вопросов в зависимости от текущего уровня
        switch(this.currentLevel) {
            case 0: // Начальный уровень - простые арифметические операции
                const operators = ['+', '-', '*'];
                const operator = operators[Math.floor(Math.random() * operators.length)];
                const num1 = Math.floor(Math.random() * 10) + 1;
                const num2 = Math.floor(Math.random() * 10) + 1;
                
                question = `${num1} ${operator} ${num2}`;
                answer = eval(question);
                break;
                
            case 1: // Средний уровень - операции сравнения
                const compareOperators = ['>', '<', '==='];
                const compareOperator = compareOperators[Math.floor(Math.random() * compareOperators.length)];
                const compNum1 = Math.floor(Math.random() * 10) + 1;
                const compNum2 = Math.floor(Math.random() * 10) + 1;
                
                question = `${compNum1} ${compareOperator} ${compNum2}`;
                answer = eval(question);
                break;
                
            case 2: // Продвинутый уровень - логические операции и двоичные числа
                const logicType = Math.random() < 0.5 ? 'binary' : 'logic';
                
                if (logicType === 'binary') {
                    const binaryNum = Math.floor(Math.random() * 16);
                    question = `Переведите ${binaryNum} в двоичную систему`;
                    answer = binaryNum.toString(2);
                } else {
                    const bool1 = Math.random() < 0.5;
                    const bool2 = Math.random() < 0.5;
                    const logicOperator = Math.random() < 0.5 ? '&&' : '||';
                    question = `${bool1} ${logicOperator} ${bool2}`;
                    answer = eval(question);
                }
                break;
        }
        
        // Проверка на повторение вопроса
        const questionKey = `${this.currentLevel}-${question}`;
        if (this.usedQuestions.has(questionKey)) {
            return this.generateQuestion();
        }
        
        // Сохранение вопроса и ответа
        this.usedQuestions.add(questionKey);
        this.currentQuestion = question;
        this.currentAnswer = answer;
        // Отображение вопроса и очистка поля ввода
        this.questionElement.textContent = question;
        this.answerInput.value = '';
        this.answerInput.focus();
    }
    
    // Метод для проверки ответа пользователя
    checkAnswer() {
        const userAnswer = this.answerInput.value.trim();
        let isCorrect = false;
        
        // Специальная обработка для логических значений
        if (this.currentLevel === 2 && typeof this.currentAnswer === 'boolean') {
            isCorrect = (userAnswer.toLowerCase() === this.currentAnswer.toString());
        } else {
            isCorrect = (userAnswer === this.currentAnswer.toString());
        }
        
        // Обновление счетчиков и отображение результата
        if (isCorrect) {
            this.correctAnswers++;
            this.resultMessage.textContent = 'Правильно!';
            this.resultMessage.style.color = '#4CAF50';
        } else {
            this.incorrectAnswers++;
            this.resultMessage.textContent = `Неправильно! Правильный ответ: ${this.currentAnswer}`;
            this.resultMessage.style.color = '#f44336';
        }
        
        this.questionsAsked++;
        this.updateUI();
        
        // Проверка завершения уровня
        if (this.questionsAsked >= 10) {
            this.checkLevelCompletion();
        } else {
            this.generateQuestion();
            this.resultMessage.textContent = '';
        }
    }
    
    // Метод для проверки завершения уровня
    checkLevelCompletion() {
        const successRate = (this.correctAnswers / 10) * 100;
        
        // Проверка условий перехода на следующий уровень
        if (successRate >= 80 && this.currentLevel < 2) {
            this.currentLevel++;
            this.questionsAsked = 0;
            this.usedQuestions.clear();
            this.updateUI();
            this.generateQuestion();
        } else if (this.currentLevel === 2 && successRate >= 80) {
            this.resultMessage.textContent = 'Поздравляем! Вы прошли игру!';
            this.showGameOverButtons();
        } else {
            this.resultMessage.textContent = 'К сожалению, вы не прошли на следующий уровень.';
            this.showGameOverButtons();
        }
    }
    
    // Метод для отображения кнопок окончания игры
    showGameOverButtons() {
        this.submitButton.style.display = 'none';
        this.answerInput.style.display = 'none';
        this.restartButton.style.display = 'inline-block';
        this.exitButton.style.display = 'inline-block';
    }
    
    // Метод для обновления интерфейса
    updateUI() {
        this.levelInfo.textContent = `Уровень: ${this.levels[this.currentLevel]}`;
        this.correctCount.textContent = this.correctAnswers;
        this.incorrectCount.textContent = this.incorrectAnswers;
    }
    
    // Метод для перезапуска игры
    restartGame() {
        this.submitButton.style.display = 'inline-block';
        this.answerInput.style.display = 'inline-block';
        this.restartButton.style.display = 'none';
        this.exitButton.style.display = 'none';
        this.answerInput.disabled = false;
        this.submitButton.disabled = false;
        this.resultMessage.textContent = '';
        this.startGame();
    }
    
    // Метод для выхода из игры
    exitGame() {
        window.close();
    }
}

// Запуск игры при загрузке страницы
window.onload = () => {
    new MathGame();
}; 