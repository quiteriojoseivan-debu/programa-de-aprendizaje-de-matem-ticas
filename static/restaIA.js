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

        // 🔥 FORZAR SABINA
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
// 🎲 GENERAR EJERCICIO
// =========================
function generarEjercicio() {

    num1 = Math.floor(Math.random() * 10);
    num2 = Math.floor(Math.random() * 10);

    // evitar negativos
    if (num2 > num1) {
        let temp = num1;
        num1 = num2;
        num2 = temp;
    }

    document.getElementById("pregunta").innerText =
        num1 + " - " + num2 + " = ?";

    document.getElementById("resultado").innerText = "";
    document.getElementById("respuesta").value = "";
    document.getElementById("explicacion-error").innerText = "";
}


// =========================
// ✅ VERIFICAR
// =========================
function verificar() {

    let input = document.getElementById("respuesta").value;

    if (input === "") {
        document.getElementById("resultado").innerText = "Escribe un número";
        return;
    }

    let user = parseInt(input, 10);
    let correcto = num1 - num2;

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

        let todas = "🍎".repeat(num1);
        let quitadas = "❌".repeat(num2);
        let restantes = "🍎".repeat(correcto);

        explicacion.innerText =
`Observa:

Tienes ${num1} manzanas.

${todas}

Quitamos ${num2} manzanas:

${quitadas}

Te quedan:

${restantes}

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
let textoIA = `Vamos a aprender a restar.

Tengo 5 manzanas.
Si quito 2 manzanas,
me quedan 3.

Restar significa quitar.

Para restar:
1. Observa los números
2. Quita la cantidad
3. Cuenta lo que queda

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