// Constantes
const PROFESOR_CLAVE = "prueba";

// Datos del quiz
const allQuizData=[
{
question:"¿Cuál sería la consecuencia de utilizar un ancho de banda de resolución (RBW) demasiado amplio en una medición?",
options:[
"Se mejora la capacidad de separar señales muy cercanas.",
"El nivel de ruido disminuye y la resolución mejora.",
"Se pierde la capacidad de distinguir señales próximas en frecuencia.",
"No tiene ningún efecto sobre la medición."
],
correctAnswer:"Se pierde la capacidad de distinguir señales próximas en frecuencia.",
keywords:["RBW","ancho de banda","señales cercanas","resolución"]
},
{
question:"Si al variar el atenuador de RF la distorsión no cambia, ¿qué conclusión podemos sacar?",
options:[
"La distorsión es originada por el propio analizador.",
"La distorsión proviene de la señal original.",
"El nivel de ruido está fuera de especificaciones.",
"El oscilador local está generando armónicos."
],
correctAnswer:"La distorsión proviene de la señal original.",
keywords:["atenuador","distorsión","señal original"]
},
{
question:"El oscilador local en un analizador de espectro superheterodino permite:",
options:[
"Generar la escala en frecuencia para la pantalla.",
"Mezclar la señal de entrada para llevarla a una frecuencia intermedia (IF) fija.",
"Suprimir el ruido de fase de la señal.",
"Filtrar las componentes indeseadas en el dominio temporal."
],
correctAnswer:"Mezclar la señal de entrada para llevarla a una frecuencia intermedia (IF) fija.",
keywords:["oscilador local","frecuencia intermedia","IF","mezclar"]
},
{
question:"Un estudiante observa que dos señales muy próximas en frecuencia aparecen como una sola en el analizador de espectro. ¿Qué debería ajustar?",
options:[
"Disminuir el RBW.",
"Aumentar el tiempo de barrido.",
"Reducir el atenuador de entrada.",
"Subir la escala logarítmica en pantalla."
],
correctAnswer:"Disminuir el RBW.",
keywords:["RBW","señales próximas","resolución"]
},
{
question:"¿Qué diferencia práctica existe entre un osciloscopio y un analizador de espectro?",
options:[
"El osciloscopio muestra señales en el dominio del tiempo, el analizador en el dominio de la frecuencia.",
"El analizador mide tensión y el osciloscopio potencia.",
"Ambos trabajan en el mismo dominio pero con distinta escala.",
"El analizador de espectro es más preciso que cualquier osciloscopio."
],
correctAnswer:"El osciloscopio muestra señales en el dominio del tiempo, el analizador en el dominio de la frecuencia.",
keywords:["osciloscopio","analizador","dominio tiempo","dominio frecuencia"]
}
];

let currentQuestionIndex=0;
let userAnswers={};
let examStarted=false;
let quizFinished=false;

// 30 minutos
let timeLeft=30*60; 
let timerInterval;

const roleScreen=document.getElementById('role-screen');
const startScreen=document.getElementById('start-screen');
const professorScreen=document.getElementById('professor-screen');
const professorPanel=document.getElementById('professor-panel');
const quizScreen=document.getElementById('quiz-screen');
const resultsScreen=document.getElementById('results');
const quizContent=document.getElementById('quiz-content');
const questionCounter=document.getElementById('question-counter');
const nextBtn=document.getElementById('next-btn');
const scoreDisplay=document.querySelector('.score-display');
const resultsDetails=document.getElementById('results-details');

// Botones de rol
document.getElementById('btn-student').addEventListener('click', ()=>{
roleScreen.classList.remove('active');
startScreen.classList.add('active');
});

document.getElementById('btn-professor').addEventListener('click', ()=>{
roleScreen.classList.remove('active');
professorScreen.classList.add('active');
});

// Login profesor
document.getElementById('login-professor-btn').addEventListener('click', ()=>{
const cedula=document.getElementById('prof-cedula').value.trim();
const clave=document.getElementById('prof-clave').value.trim();
if(!cedula || !clave){ alert("Completa todos los campos."); return; }
if(clave!==PROFESOR_CLAVE){ alert("Clave incorrecta."); return; }
professorScreen.classList.remove('active');
professorPanel.classList.add('active');
loadGrades();
});

// Solo números en cédula estudiante
document.getElementById('user-cedula').addEventListener('input', e=>{ e.target.value=e.target.value.replace(/\D/g,''); });

// Inicio examen estudiante
document.getElementById('start-quiz-btn').addEventListener('click', ()=>{
if(!document.getElementById('user-name').value.trim()||
!document.getElementById('user-lastname').value.trim()||
!document.getElementById('user-cedula').value.trim()||
!document.getElementById('user-school').value){
alert("Por favor completa todos los campos correctamente."); return;
}
startScreen.classList.remove('active');
quizScreen.classList.add('active');
examStarted=true;
loadQuestion();
startTimer(); 
});

function startTimer(){
timerInterval=setInterval(()=>{
const minutes=Math.floor(timeLeft/60);
const seconds=timeLeft%60;
document.getElementById('timer').textContent=
`Tiempo: ${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
if(timeLeft <= 0){
clearInterval(timerInterval);
alert("⏰ El tiempo ha finalizado. El examen se cerrará automáticamente.");
displayResults();
}
timeLeft--;
},1000);
}

function loadQuestion(){
const q=allQuizData[currentQuestionIndex];
const saved=userAnswers[currentQuestionIndex]||{answer:"",justification:""};
let optionsHtml="";
q.options.forEach(opt=>{
const sel=saved.answer===opt?"selected":"";
optionsHtml+=`<li class="${sel}">${opt}</li>`;
});
quizContent.innerHTML=`
<div class="question-box">${q.question}</div>
<ul class="options-list">${optionsHtml}</ul>
<div class="user-justification-container">
<label>Tu Justificación:</label>
<textarea id="user-justification" placeholder="Máx. 200 caracteres...">${saved.justification}</textarea>
<div class="word-count" id="word-count">${saved.justification.length}/200</div>
</div>
`;
questionCounter.textContent=`Pregunta ${currentQuestionIndex+1} de ${allQuizData.length}`;

document.querySelectorAll('.options-list li').forEach(li=>{
li.addEventListener('click',()=>{ document.querySelectorAll('.options-list li').forEach(l=>l.classList.remove('selected')); li.classList.add('selected'); });
});

document.getElementById('user-justification').addEventListener('input', e=>{
if(e.target.value.length>200) e.target.value=e.target.value.slice(0,200);
document.getElementById('word-count').textContent=`${e.target.value.length}/200`;
});
}

// Siguiente
nextBtn.addEventListener('click', ()=>{
const selected=document.querySelector('.options-list li.selected');
const justification=document.getElementById('user-justification').value.trim();
userAnswers[currentQuestionIndex]={ answer:selected?selected.textContent:"", justification };
currentQuestionIndex++;
if(currentQuestionIndex<allQuizData.length){ loadQuestion(); }
else{ displayResults(); }
});

function displayResults(){
quizFinished=true;
examStarted=false;
clearInterval(timerInterval);
quizScreen.classList.remove('active');
resultsScreen.classList.add('active');
let totalScore=0;
resultsDetails.innerHTML="";
allQuizData.forEach((q,i)=>{
const ua=userAnswers[i]||{answer:"",justification:""};
let points=0;
const answerCorrect=ua.answer===q.correctAnswer;
let justificationCorrect=false;
if(ua.justification){
const lowerJust=ua.justification.toLowerCase();
justificationCorrect=q.keywords.every(kw=>lowerJust.includes(kw.toLowerCase()));
}
if(answerCorrect && justificationCorrect) points=4;
else if(answerCorrect && !justificationCorrect) points=1;
else if(!answerCorrect && justificationCorrect) points=3;
else points=0;
totalScore+=points;

let classes="result-item";
let icon="";
if(points===4){ classes+=" correct"; icon="✅"; }
else if(points===1||points===3){ classes+=" partial"; icon="⚠️"; }
else { classes+=" incorrect"; icon="❌"; }

let html=`<div class="${classes}">${icon} <strong>Pregunta ${i+1}:</strong> ${q.question}<br>
<strong>Tu respuesta:</strong> ${ua.answer||"No respondida"}<br>
<strong>Respuesta correcta:</strong> ${q.correctAnswer}<br>`;
if(ua.justification) html+=`<strong>Justificación:</strong> ${ua.justification}<br>`;
html+=`<strong>Puntos:</strong> ${points}/4</div>`;
resultsDetails.innerHTML+=html;
});
scoreDisplay.textContent=`Puntuación Total: ${totalScore}/${allQuizData.length*4}`;

// Guardar nota si no existe
saveGrade(totalScore);
}

function saveGrade(score){
const name=document.getElementById('user-name').value.trim();
const lastname=document.getElementById('user-lastname').value.trim();
const cedula=document.getElementById('user-cedula').value.trim();
const school=document.getElementById('user-school').value;
let grades=JSON.parse(localStorage.getItem('grades')||'[]');
if(grades.some(g=>g.cedula===cedula)) return; // ya existe
grades.push({name,lastname,cedula,school,score});
localStorage.setItem('grades',JSON.stringify(grades));
}

function loadGrades(){
const tbody=document.querySelector('#grades-table tbody');
tbody.innerHTML="";
let grades=JSON.parse(localStorage.getItem('grades')||'[]');
grades.forEach((g,idx)=>{
const tr=document.createElement('tr');
tr.innerHTML=`
<td>${g.name}</td>
<td>${g.lastname}</td>
<td>${g.cedula}</td>
<td>${g.school}</td>
<td>${g.score}</td>
<td><button onclick="deleteGrade(${idx})">❌ Borrar</button></td>
`;
tbody.appendChild(tr);
});
}

function deleteGrade(index){
let grades=JSON.parse(localStorage.getItem('grades')||'[]');
grades.splice(index,1);
localStorage.setItem('grades',JSON.stringify(grades));
loadGrades();
}

// Finalizar examen si cambia de pestaña solo durante examen
document.addEventListener("visibilitychange", ()=>{
if(examStarted && !quizFinished && document.hidden){ alert("El examen ha finalizado automáticamente."); displayResults(); }
});
window.addEventListener("blur", ()=>{
if(examStarted && !quizFinished){ alert("El examen ha finalizado automáticamente."); displayResults(); }
});