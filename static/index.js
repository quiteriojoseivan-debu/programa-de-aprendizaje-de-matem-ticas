// =========================
// 🤖 MENSAJE PORTADA PRO
// =========================
let mensajeCompleto = [
"Bienvenido estudiante.",
"Este es un programa diseñado para ayudarte a aprender matemáticas de forma fácil, divertida e inteligente.",
"Aquí podrás desarrollar tus habilidades paso a paso con ejercicios pensados especialmente para ti.",
"Tendrás dos opciones principales:",
"1️ Aprender a contar: desde lo más básico como reconocer números y seguir secuencias.",
"2️ Operaciones: donde practicarás sumas, restas, multiplicaciones y divisiones.",
"Encontrarás actividades para mejorar tu rapidez y comprensión.",
"Elige una opción y comienza tu aprendizaje."
];


// =========================
// 🔊 VOZ (ARREGLADA PRO)
// =========================
let vocesListas = false;

speechSynthesis.onvoiceschanged = () => {
    vocesListas = true;
};

function hablar(texto, callback){

    if(!window.speechSynthesis) return;

    const ejecutar = () => {

        const msg = new SpeechSynthesisUtterance(texto);
        const voces = speechSynthesis.getVoices();

        // 🔥 FORZAR SABINA
        const sabina = voces.find(v => v.name.toLowerCase().includes("sabina"));

        msg.voice = sabina || voces.find(v => v.lang.toLowerCase().includes("es")) || voces[0];

        msg.rate = 0.9;
        msg.pitch = 1;

        // ✅ CUANDO TERMINA → sigue el flujo
        msg.onend = () => {
            if(callback) callback();
        };

        // ❌ QUITAMOS cancel() (ese era el problema)
        speechSynthesis.speak(msg);
    };

    if(!vocesListas){
        setTimeout(ejecutar, 500);
    } else {
        ejecutar();
    }
}


// =========================
// ✍️ ESCRIBIR + HABLAR PRO
// =========================
function escribirYHablarPro() {

    let contenedor = document.getElementById("asistente");
    contenedor.innerHTML = "";

    let i = 0;

    function siguienteMensaje() {

        if (i >= mensajeCompleto.length) return;

        let texto = mensajeCompleto[i];

        let parrafo = document.createElement("p");
        contenedor.appendChild(parrafo);

        let j = 0;

        function escribir() {
            if (j < texto.length) {
                parrafo.innerHTML += texto.charAt(j);
                j++;
                setTimeout(escribir, 25);
            } else {

                // 🔥 AHORA ESPERA A QUE TERMINE LA VOZ
                hablar(texto, () => {
                    i++;
                    setTimeout(siguienteMensaje, 500);
                });

            }
        }

        escribir();
    }

    siguienteMensaje();
}


// =========================
// 🚀 INICIAR
// =========================
window.onload = function() {
    escribirYHablarPro();
};


// =========================
// 🔊 DESBLOQUEAR AUDIO
// =========================
document.body.addEventListener("click", () => {
    speechSynthesis.resume();
}, { once: true });