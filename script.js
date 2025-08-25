// Borrar a todos los participantes registrados al cargar la página.
// Esto garantiza una tabla limpia en cada nueva sesión.
localStorage.removeItem('participants');
const allQuizData = [
    {
        question: "¿Cuál es la principal función del atenuador de entrada en el diagrama de bloques de un analizador de espectro?",
        options: [
            "Ajustar el nivel de referencia para mantener constante la posición del espectro.",
            "Suavizar el ruido presente en las mediciones después de la detección de la señal.",
            "Limitar el nivel de potencia de la señal de entrada para evitar la distorsión y optimizar el rango dinámico.",
            "Proporcionar la resolución del instrumento y mejorar la relación señal a ruido.",
            "Desplazar las diversas componentes de frecuencia de la señal de entrada a una frecuencia intermedia fija."
        ],
        correctAnswer: "Limitar el nivel de potencia de la señal de entrada para evitar la distorsión y optimizar el rango dinámico.",
        justification: "El atenuador calibrado se utiliza para limitar el nivel de potencia de la señal de entrada, manteniendo así el resto del instrumento en su rango normal de operación para evitar la distorsión. También ayuda a optimizar el rango dinámico de medición."
    },
    {
        question: "¿Qué efecto tiene un ancho de banda del filtro de resolución (RBW) angosto en la medición de una señal?",
        options: [
            "Aumenta el tiempo de barrido para visualizar el espectro completo y reduce la resolución.",
            "Mejora la relación señal a ruido (S/N) y la capacidad de diferenciar señales cercanas.",
            "Disminuye la sensibilidad del instrumento al reducir el nivel de ruido interno.",
            "Aumenta la probabilidad de que una señal de baja amplitud sea enmascarada por una de gran amplitud.",
            "Permite que el analizador represente un solo espectro de potencia que es la suma de las potencias de dos señales cercanas."
        ],
        correctAnswer: "Mejora la relación señal a ruido (S/N) y la capacidad de diferenciar señales cercanas.",
        justification: "Un filtro de resolución con un ancho de banda más estrecho mejora la relación señal a ruido al reducir la potencia del ruido de salida. Además, cuanto más estrecho es el filtro, mejor se pueden diferenciar en la pantalla dos componentes espectrales que estén cercanas entre sí, lo que mejora la resolución."
    },
    {
        question: "¿Cuál es la función del oscilador local en el diagrama de bloques del analizador de espectro?",
        options: [
            "Generar la señal de barrido para el eje horizontal de la pantalla.",
            "Procesar la señal de entrada en modo logarítmico para un amplio rango de medición.",
            "Mezclar la señal de entrada con una señal de frecuencia variable para obtener una frecuencia intermedia (IF) fija.",
            "Aplicar un filtrado posterior para suavizar el ruido presente en las mediciones.",
            "Medir el nivel de ruido promedio (DANL) del instrumento."
        ],
        correctAnswer: "Mezclar la señal de entrada con una señal de frecuencia variable para obtener una frecuencia intermedia (IF) fija.",
        justification: "El oscilador local es un sintonizador que, mediante el método heterodino, mezcla la señal de entrada con su propia señal de frecuencia variable. El resultado es una señal con una frecuencia intermedia (IF) fija, lo que permite que el resto del circuito utilice filtros altamente selectivos."
    },
    {
        question: "¿Cuál es la principal diferencia entre un osciloscopio y un analizador de espectro?",
        options: [
            "El osciloscopio trabaja en el dominio frecuencial y el analizador de espectro en el dominio temporal.",
            "El osciloscopio mide la amplitud de una señal, mientras que el analizador de espectro mide la fase.",
            "El osciloscopio visualiza una señal en el dominio temporal, mientras que el analizador de espectro la representa en el dominio frecuencial.",
            "El osciloscopio utiliza la serie de Fourier para descomponer la señal, a diferencia del analizador de espectro.",
            "El analizador de espectro solo se utiliza para señales de muy alta frecuencia, mientras que el osciloscopio es para cualquier rango."
        ],
        correctAnswer: "El osciloscopio visualiza una señal en el dominio temporal, mientras que el analizador de espectro la representa en el dominio frecuencial.",
        justification: "El análisis de una señal se puede realizar en el dominio temporal o frecuencial. El osciloscopio se utiliza para visualizar la función temporal de una señal, mientras que el analizador de espectro representa las componentes espectrales de la señal, es decir, su espectro de frecuencias."
    },
    {
        question: "¿Qué prueba sencilla se puede realizar para distinguir la distorsión de la señal de entrada de la distorsión generada por el propio analizador de espectro?",
        options: [
            "Aumentar el tiempo de barrido y observar si los productos de distorsión cambian de posición.",
            "Cambiar el ancho de banda del filtro de vídeo (VBW) y ver si la distorsión desaparece.",
            "Variar la frecuencia del oscilador local y notar si el nivel de distorsión se mantiene constante.",
            "Cambiar el valor del atenuador de RF y observar si el nivel de distorsión se modifica.",
            "Medir la sensibilidad del analizador ajustando la atenuación a 0 dB."
        ],
        correctAnswer: "Cambiar el valor del atenuador de RF y observar si el nivel de distorsión se modifica.",
        justification: "Si el nivel de distorsión cambia al modificar el valor del atenuador de RF, se puede concluir que parte de esa distorsión es causada por el propio analizador de espectro, ya que un cambio en la atenuación interna afecta la potencia de la distorsión generada por el mezclador."
    }
];

let quizData;
let currentQuestionIndex = 0;
let userAnswers = {};
let startTime;
let timerInterval;
let ipAddress = 'Cargando...';
let quizSubmitted = false;
// El puntaje por pregunta es de 4 puntos
const pointsPerQuestion = 4;
// VARIABLES PARA ALMACENAR LOS DATOS DEL USUARIO
let userName = '';
let userLastname = '';
let userCedula = '';

// DURACIÓN DEL QUIZ EN SEGUNDOS (20 MINUTOS)
const quizDuration = 1200;
// Límite de caracteres para la justificación (200 letras)
const maxChars = 200;
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
// OBTENER LOS NUEVOS ELEMENTOS DEL FORMULARIO
const userNameInput = document.getElementById('user-name');
const userLastnameInput = document.getElementById('user-lastname');
const userCedulaInput = document.getElementById('user-cedula');

const startQuizBtn = document.getElementById('start-quiz-btn');
const quizContent = document.getElementById('quiz-content');
const questionCounter = document.getElementById('question-counter');
const timerDisplay = document.getElementById('timer');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const resultsContainer = document.getElementById('results');
const resultsDetails = document.getElementById('results-details');
const scoreDisplay = document.querySelector('.score-display');
const leaderboardContainer = document.getElementById('leaderboard');
const leaderboardTableBody = document.querySelector('#leaderboard-table tbody');
const showLeaderboardBtn = document.getElementById('show-leaderboard-btn');
const exportBtn = document.getElementById('export-btn');

async function fetchIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ipAddress = data.ip;
    } catch (error) {
        console.error("Error al obtener la dirección IP:", error);
        ipAddress = 'No disponible';
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Función para validar que solo se ingresen números en el campo de cédula
userCedulaInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

// VALIDAR TODOS LOS CAMPOS Y EVITAR DUPLICADOS ANTES DE INICIAR EL QUIZ
startQuizBtn.addEventListener('click', () => {
    userName = userNameInput.value.trim();
    userLastname = userLastnameInput.value.trim();
    userCedula = userCedulaInput.value.trim();

    if (!userName || !userLastname || !userCedula) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    const participants = JSON.parse(localStorage.getItem('participants')) || [];
    const existingUser = participants.find(p => p.cedula === userCedula);

    if (existingUser) {
        alert('Ya existe un participante registrado con este número de cédula. No puedes participar más de una vez.');
        return;
    }

    startScreen.style.display = 'none';
    quizScreen.style.display = 'block';
    startQuiz();
});

function startQuiz() {
    shuffleArray(allQuizData);
    quizData = allQuizData.slice(0, 5);
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
    fetchIP();
    loadQuestion();
}

function updateTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const timeRemaining = quizDuration - elapsedTime;

    if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        timerDisplay.textContent = 'Tiempo: 00:00';
        alert('¡El tiempo se ha agotado! El quiz se ha terminado automáticamente.');
        displayResults();
        return;
    }

    const minutes = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
    const seconds = (timeRemaining % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `Tiempo restante: ${minutes}:${seconds}`;
}

function loadQuestion() {
    const questionData = quizData[currentQuestionIndex];
    const currentAnswer = userAnswers[currentQuestionIndex];
    const savedJustification = currentAnswer ? currentAnswer.userJustification : '';

    let optionsHtml = '';
    questionData.options.forEach(option => {
        const isSelected = (currentAnswer && currentAnswer.answer === option) ? ' selected' : '';
        optionsHtml += `<li class="option${isSelected}">${option}</li>`;
    });
    quizContent.innerHTML = `
        <div class="question-box">
            <p>${questionData.question}</p>
        </div>
        <ul class="options-list">
            ${optionsHtml}
        </ul>
        <div class="user-justification-container">
            <label for="user-justification">Tu Justificación:</label>
            <textarea id="user-justification" placeholder="Escribe aquí tu justificación de hasta ${maxChars} letras..." rows="4">${savedJustification}</textarea>
            <div class="word-count"><span id="char-counter">0</span>/${maxChars} letras</div>
        </div>
    `;
    questionCounter.textContent = `Pregunta ${currentQuestionIndex + 1} de ${quizData.length}`;
    updateNavigationButtons();
    addEventListeners();

    const justificationTextarea = document.getElementById('user-justification');
    const charCount = justificationTextarea.value.length;
    document.getElementById('char-counter').textContent = charCount;
}

function addEventListeners() {
    const options = document.querySelectorAll('.options-list .option');
    options.forEach(option => {
        option.addEventListener('click', () => {
            const selected = document.querySelector('.options-list .option.selected');
            if (selected) {
                selected.classList.remove('selected');
            }
            option.classList.add('selected');
            saveCurrentAnswer();
        });
    });
    const justificationTextarea = document.getElementById('user-justification');
    justificationTextarea.addEventListener('input', () => {
        const charCount = justificationTextarea.value.length;
        document.getElementById('char-counter').textContent = charCount;
        if (charCount > maxChars) {
            justificationTextarea.value = justificationTextarea.value.substring(0, maxChars);
            document.getElementById('char-counter').textContent = maxChars;
        }
        saveCurrentAnswer();
    });
}

function saveCurrentAnswer() {
    const selectedOption = document.querySelector('.options-list .option.selected');
    const userJustification = document.getElementById('user-justification').value;
    const correctJustification = quizData[currentQuestionIndex].justification;
    const userJustificationNormalized = userJustification.trim().toLowerCase();
    const correctJustificationNormalized = correctJustification.trim().toLowerCase();

    // Lógica para verificar justificación con palabras clave
    const keywords = correctJustificationNormalized.split(' ').filter(word => word.length > 3);
    let isJustificationCorrect = false;
    for (const keyword of keywords) {
        if (userJustificationNormalized.includes(keyword)) {
            isJustificationCorrect = true;
            break;
        }
    }

    userAnswers[currentQuestionIndex] = {
        question: quizData[currentQuestionIndex].question,
        answer: selectedOption ? selectedOption.textContent : 'No respondida',
        isCorrect: selectedOption ? selectedOption.textContent === quizData[currentQuestionIndex].correctAnswer : false,
        userJustification: userJustification,
        isJustificationCorrect: isJustificationCorrect
    };
}

function updateNavigationButtons() {
    if (currentQuestionIndex === quizData.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }
}

nextBtn.addEventListener('click', () => {
    const currentAnswer = userAnswers[currentQuestionIndex];
    if (!currentAnswer || currentAnswer.answer === 'No respondida' || currentAnswer.userJustification.trim() === '') {
        alert('Por favor, selecciona una respuesta y escribe una justificación antes de continuar.');
        return;
    }

    // Elimina la ventana de confirmación
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    }
});

submitBtn.addEventListener('click', () => {
    const currentAnswer = userAnswers[currentQuestionIndex];
    if (!currentAnswer || currentAnswer.answer === 'No respondida' || currentAnswer.userJustification.trim() === '') {
        alert('Por favor, selecciona una respuesta y escribe una justificación antes de terminar.');
        return;
    }

    // Elimina la ventana de confirmación
    clearInterval(timerInterval);
    displayResults();
});

function displayResults() {
    if(quizSubmitted) return;
    quizSubmitted = true;
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const finalScore = calculateScore();

    saveParticipantData(finalScore, elapsedTime);

    quizContent.style.display = 'none';
    document.querySelector('.navigation-buttons').style.display = 'none';
    document.querySelector('.quiz-status').style.display = 'none';
    resultsContainer.style.display = 'block';

    let resultsHtml = '';
    quizData.forEach((q, index) => {
        const userAnswer = userAnswers[index];
        const isCorrectAnswer = userAnswer && userAnswer.isCorrect;
        const isJustificationCorrect = userAnswer && userAnswer.isJustificationCorrect;

        let questionScore = 0;
        let resultClass = 'incorrect';

        if (isCorrectAnswer && isJustificationCorrect) {
            questionScore = 4;
            resultClass = 'correct';
        } else if (isCorrectAnswer || isJustificationCorrect) {
            questionScore = 2;
            resultClass = '';
        }

        resultsHtml += `
            <div class="result-item ${resultClass}">
                <p><strong>Pregunta ${index + 1}:</strong> ${q.question}</p>
                <p style="color: ${isCorrectAnswer ? 'var(--correct-color)' : 'var(--incorrect-color)'};">
                    Tu respuesta: <strong>${userAnswer ? userAnswer.answer : 'No respondida'}</strong> ${isCorrectAnswer ? '✔' : '❌'}
                </p>
                ${!isCorrectAnswer ? `<p style="color: var(--correct-color);">Respuesta correcta: <strong>${q.correctAnswer}</strong></p>` : ''}

                <p class="user-justification-result">
                    <strong>Tu justificación:</strong> ${userAnswer ? userAnswer.userJustification : 'No proporcionada'}
                    ${isJustificationCorrect ? '✔' : '❌'}
                </p>
                <hr>
                <p><strong>Puntuación:</strong> ${questionScore} de ${pointsPerQuestion} puntos</p>
            </div>
        `;
    });
    scoreDisplay.textContent = `Puntuación total: ${finalScore} de ${quizData.length * pointsPerQuestion}`;
    resultsDetails.innerHTML = resultsHtml;
}

function calculateScore() {
    let totalScore = 0;
    Object.values(userAnswers).forEach(answer => {
        const isCorrectAnswer = answer.isCorrect;
        const isJustificationCorrect = answer.isJustificationCorrect;
        if (isCorrectAnswer && isJustificationCorrect) {
            totalScore += 4;
        } else if (isCorrectAnswer || isJustificationCorrect) {
            totalScore += 2;
        }
    });
    return totalScore;
}

function saveParticipantData(score, timeTaken) {
    const newParticipant = {
        name: userName,
        lastname: userLastname,
        cedula: userCedula,
        score: score,
        timeTaken: timeTaken,
        date: new Date().toLocaleString()
    };
    const participants = JSON.parse(localStorage.getItem('participants')) || [];
    participants.push(newParticipant);

    localStorage.setItem('participants', JSON.stringify(participants));
}

// Event listener para el nuevo botón de exportación
exportBtn.addEventListener('click', () => {
    exportToCSV();
});

function exportToCSV() {
    const participants = JSON.parse(localStorage.getItem('participants')) || [];
    if (participants.length === 0) {
        alert('No hay participantes para exportar.');
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Nombre,Apellido,Cedula,Puntuacion,Tiempo (segundos),Fecha\r\n";

    participants.forEach(p => {
        const row = `${p.name},${p.lastname},${p.cedula},${p.score},${p.timeTaken},"${p.date}"`;
        csvContent += row + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "resultados_quiz.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

showLeaderboardBtn.addEventListener('click', () => {
    displayLeaderboard();
});
function displayLeaderboard() {
    resultsContainer.style.display = 'none';
    leaderboardContainer.style.display = 'block';
    const participants = JSON.parse(localStorage.getItem('participants')) || [];
    leaderboardTableBody.innerHTML = '';

    if (participants.length === 0) {
        leaderboardTableBody.innerHTML = '<tr><td colspan="4">Aún no hay participantes registrados.</td></tr>';
        return;
    }

    participants.forEach((p, index) => {
        const minutes = Math.floor(p.timeTaken / 60);
        const seconds = p.timeTaken % 60;
        const formattedTime = `${minutes} min ${seconds} seg`;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${p.name} ${p.lastname}</td>
            <td>${p.score}</td>
            <td>${formattedTime}</td>
        `;
        leaderboardTableBody.appendChild(row);
    });
}

// =========================================================================
// Medidas de seguridad adicionales
// =========================================================================

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && !quizSubmitted) {
        clearInterval(timerInterval);
        quizSubmitted = true;
        alert('¡Has salido de la página! El quiz se ha terminado por seguridad.');
        // Oculta todas las pantallas y muestra solo resultados
        if (typeof startScreen !== 'undefined') startScreen.style.display = 'none';
        if (typeof quizScreen !== 'undefined') quizScreen.style.display = 'none';
        if (typeof resultsContainer !== 'undefined') resultsContainer.style.display = 'block';
        displayResults();
    }
});
document.addEventListener('contextmenu', event => {
    event.preventDefault();
});
document.addEventListener('keydown', event => {
    if (event.key === 'F12' || (event.ctrlKey && (event.shiftKey || event.altKey) && (event.key === 'I' || event.key === 'J' || event.key === 'U')) || (event.ctrlKey && (event.key === 'a' || event.key === 'c' || event.key === 'x' || event.key === 's'))) {
        event.preventDefault();
        alert('Esta acción está deshabilitada por razones de seguridad.');
    }
    if (event.key === 'PrintScreen' || event.key === 'SysRq') {
        event.preventDefault();
        alert('No se permiten capturas de pantalla.');
    }
});
window.addEventListener('beforeprint', (event) => {
    alert('La impresión de esta página no está permitida.');
    event.preventDefault();
});