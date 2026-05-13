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
let cantidad = 0;
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
// 🎲 GENERAR OBJETOS
// =========================
function generarObjetos() {

    let zona = document.getElementById("zona-objetos");
    zona.innerHTML = "";

    cantidad = Math.floor(Math.random() * 10) + 1;

    for (let i = 0; i < cantidad; i++) {
        zona.innerHTML += "🍎 ";
    }

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

    let explicacion = document.getElementById("explicacion-error");

    if (user === cantidad) {

        estrellas++;
        if (estrellas > 5) estrellas = 5;

        document.getElementById("resultado").innerText = "🎉 ¡Correcto!";
        explicacion.innerText = "";

        sonidoCorrecto.currentTime = 0;
        sonidoCorrecto.play();

        if (estrellas === 5) {
            sonidoRacha.currentTime = 0;
            sonidoRacha.play();
        }

        actualizarEstrellas();
        setTimeout(generarObjetos, 800);

    } else {

        estrellas = 0;

        document.getElementById("resultado").innerText = "😅 Intenta otra vez";

        let conteo = "";
        for (let i = 1; i <= cantidad; i++) {
            conteo += i + "️⃣ ";
        }

        explicacion.innerText =
`Observa:

Cuenta cada manzana una por una:

${"🍎 ".repeat(cantidad)}

Conteo:

${conteo}

Total = ${cantidad}`;

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
let textoIA = `Vamos a aprender a contar.

Observa las manzanas.

Cuenta una por una:
1, 2, 3...

Contar es decir cuántos objetos hay.

Para contar:
1. Señala cada objeto
2. Di un número
3. No repitas ni saltes

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
    generarObjetos();
    actualizarEstrellas();
};


// =========================
// 🔊 DESBLOQUEAR AUDIO
// =========================
document.body.addEventListener("click", () => {
    speechSynthesis.resume();
}, { once: true });