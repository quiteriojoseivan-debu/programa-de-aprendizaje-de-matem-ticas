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

    num2 = Math.floor(Math.random() * 9) + 1;
    num1 = num2 * Math.floor(Math.random() * 10);

    document.getElementById("pregunta").innerText =
        num1 + " ÷ " + num2 + " = ?";

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
    let correcto = num1 / num2;

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

        let porGrupo = correcto;

        let grupos = "";
        for (let i = 0; i < num2; i++) {
            grupos += "🍎".repeat(porGrupo) + "  ";
        }

        explicacion.innerText =
`Observa:

Tienes ${num1} manzanas.
Las vas a repartir en ${num2} grupos iguales...

${"🍎".repeat(num1)}

Ahora separamos en grupos:

${grupos}

Cada grupo tiene:
${porGrupo} manzanas`;

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
let textoIA = `Vamos a aprender a dividir.

Tengo 6 manzanas.
Si las reparto en 2 grupos iguales,
cada grupo recibe 3 manzanas.

Dividir significa repartir en partes iguales.

Para dividir:
1. Observa los números
2. Reparte en grupos
3. Cuenta cuánto recibe cada grupo

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