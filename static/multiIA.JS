// =========================
// 🔊 SONIDOS
// =========================
const sonidoCorrecto = new Audio("/static/sonidos/correcto.wav");
const sonidoError = new Audio("/static/sonidos/error.wav");
const sonidoRacha = new Audio("/static/sonidos/racha.wav");

sonidoCorrecto.volume = 0.5;
sonidoError.volume = 0.5;
sonidoRacha.volume = 0.6;


// =========================
// 🎮 VARIABLES
// =========================
let num1, num2;
let estrellas = 0;


// =========================
// 🔊 VOZ (ARREGLADA)
// =========================
let vocesListas = false;

speechSynthesis.onvoiceschanged = () => {
    vocesListas = true;
};

function hablar(texto){

    if(!window.speechSynthesis) return;

    const ejecutar = () => {

        const msg = new SpeechSynthesisUtterance(texto);
        const voces = speechSynthesis.getVoices();

        const sabina = voces.find(v => v.name.toLowerCase().includes("sabina"));

        msg.voice = sabina || voces.find(v => v.lang.toLowerCase().includes("es")) || voces[0];

        msg.rate = 0.9;
        msg.pitch = 1;

        speechSynthesis.cancel();
        speechSynthesis.speak(msg);
    };

    if(!vocesListas){
        setTimeout(ejecutar, 500);
    } else {
        ejecutar();
    }
}


// =========================
// 🎤 MICROFONO (NUEVO)
// =========================
let reconocimiento;

function iniciarVoz(){

    if(!('webkitSpeechRecognition' in window)){
        alert("Tu navegador no soporta reconocimiento de voz 😢");
        return;
    }

    reconocimiento = new webkitSpeechRecognition();
    reconocimiento.lang = "es-MX";
    reconocimiento.continuous = false;
    reconocimiento.interimResults = false;

    const btn = document.querySelector(".btn-micro");
    if(btn) btn.classList.add("activo");

    reconocimiento.start();

    reconocimiento.onresult = function(event){

        let texto = event.results[0][0].transcript.toLowerCase();

        console.log("Dijiste:", texto);

        let numero = convertirTextoANumero(texto);

        document.getElementById("respuesta").value = numero;

        if(btn) btn.classList.remove("activo");

        // 🔥 OPCIONAL AUTO-RESPONDER
        // verificar();
    };

    reconocimiento.onerror = function(){
        if(btn) btn.classList.remove("activo");
        alert("Error al reconocer voz");
    };

    reconocimiento.onend = function(){
        if(btn) btn.classList.remove("activo");
    };
}


// =========================
// 🔢 TEXTO → NÚMERO
// =========================
function convertirTextoANumero(texto){

    const mapa = {
        "cero":0, "uno":1, "dos":2, "tres":3, "cuatro":4,
        "cinco":5, "seis":6, "siete":7, "ocho":8, "nueve":9,
        "diez":10
    };

    // número directo
    if(!isNaN(texto)){
        return parseInt(texto);
    }

    // palabra
    if(mapa[texto] !== undefined){
        return mapa[texto];
    }

    return "";
}


// =========================
// 🎲 GENERAR EJERCICIO
// =========================
function generarEjercicio() {

    num1 = Math.floor(Math.random() * 10);
    num2 = Math.floor(Math.random() * 10);

    document.getElementById("pregunta").innerText =
        num1 + " × " + num2 + " = ?";

    document.getElementById("resultado").innerText = "";
    document.getElementById("respuesta").value = "";
    document.getElementById("explicacion-error").innerText = "";
}


// =========================
// ✅ VERIFICAR RESPUESTA
// =========================
function verificar() {

    let input = document.getElementById("respuesta").value;

    if (input === "") {
        document.getElementById("resultado").innerText = "Escribe un número";
        return;
    }

    let user = parseInt(input, 10);
    let correcto = num1 * num2;

    let explicacion = document.getElementById("explicacion-error");

    if (user === correcto) {

        estrellas++;
        if (estrellas > 5) estrellas = 5;

        document.getElementById("resultado").innerText = "¡Correcto!";
        explicacion.innerText = "";

        sonidoCorrecto.currentTime = 0;
        sonidoCorrecto.play();

        if (estrellas === 5) {
            sonidoRacha.currentTime = 0;
            sonidoRacha.play();
        }

        actualizarEstrellas();
        setTimeout(generarEjercicio, 800);

    } else {

        estrellas = 0;

        document.getElementById("resultado").innerText = "Intenta otra vez";

        let filas = "";

        for (let i = 0; i < num1; i++) {
            filas += "🍎".repeat(num2) + "\n";
        }

        explicacion.innerText =
`Observa:

Tienes ${num1} grupos.
Cada grupo tiene ${num2} manzanas.

Así se ve:

${filas}

Ahora cuenta todas:

Total = ${correcto} manzanas`;

        sonidoError.currentTime = 0;
        sonidoError.play();

        actualizarEstrellas();
    }
}


// =========================
// ⭐ ESTRELLAS
// =========================
function actualizarEstrellas() {

    let texto = "";

    for (let i = 0; i < 5; i++) {
        texto += (i < estrellas) ? "★" : "☆";
    }

    document.getElementById("estrellas").innerText = texto;
}


// =========================
// 🤖 MENSAJE IA
// =========================
let textoIA = `Vamos a aprender a multiplicar.

Tengo 3 grupos de 2 manzanas.
Si junto todos los grupos,
tengo 6 manzanas en total.

Multiplicar significa sumar varias veces el mismo número.

Para multiplicar:
1. Observa los números
2. Forma grupos iguales
3. Cuenta el total

Ahora intenta los ejercicios.`;


// =========================
// ✍️ ESCRIBIR + HABLAR
// =========================
function escribirYHablar() {

    let elemento = document.getElementById("asistente");
    if (!elemento) return;

    elemento.innerHTML = "";

    let i = 0;

    function escribir() {

        if (i < textoIA.length) {

            elemento.innerHTML += textoIA.charAt(i);
            i++;

            setTimeout(escribir, 25);

        } else {
            hablar(textoIA);
        }
    }

    escribir();
}


// =========================
// 🚀 INICIO
// =========================
window.onload = function () {

    escribirYHablar();
    generarEjercicio();
    actualizarEstrellas();
};


// =========================
// 🔊 DESBLOQUEAR AUDIO
// =========================
document.body.addEventListener("click", () => {
    speechSynthesis.resume();
}, { once: true });