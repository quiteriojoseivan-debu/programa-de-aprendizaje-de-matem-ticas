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
let reconocimiento;
let escuchando = false;
let reintentos = 0;


// =========================
// 🔊 VOZ PRO (ESTABLE)
// =========================
let vocesListas = false;

speechSynthesis.onvoiceschanged = () => {
    vocesListas = true;
};

function hablar(texto){

    if(!window.speechSynthesis) return;

    speechSynthesis.cancel();

    const msg = new SpeechSynthesisUtterance(texto);
    const voces = speechSynthesis.getVoices();

    const sabina = voces.find(v =>
        v.name.toLowerCase().includes("sabina")
    );

    msg.voice =
        sabina ||
        voces.find(v => v.lang.toLowerCase().includes("es")) ||
        voces[0];

    msg.rate = 0.95;
    msg.pitch = 1;

    speechSynthesis.speak(msg);
}


// =========================
// 🎤 MICROFONO PRO MAX
// =========================
function iniciarVoz(){

    if(escuchando) return;

    if(reconocimiento){
        try{
            reconocimiento.abort();
        } catch(e){}
        reconocimiento = null;
    }

    escuchando = true;

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if(!SpeechRecognition){
        alert("Tu navegador no soporta reconocimiento de voz 😢");
        escuchando = false;
        return;
    }

    speechSynthesis.cancel();

    reconocimiento = new SpeechRecognition();

    reconocimiento.lang = "es-MX";
    reconocimiento.continuous = false;
    reconocimiento.interimResults = false;
    reconocimiento.maxAlternatives = 10;

    const btn = document.querySelector(".btn-micro");

    if(btn) btn.classList.add("activo");

    let resultadoFinal = "";
    let detectado = false;

    reconocimiento.onresult = function(event){

        let texto = "";

        for(let i = 0; i < event.results.length; i++){
            texto += event.results[i][0].transcript.toLowerCase() + " ";
        }

        resultadoFinal = texto.trim();

        console.log("Dijiste:", resultadoFinal);

        let numero = convertirTextoANumero(resultadoFinal);

        if(numero !== null && resultadoFinal.length > 0 && !detectado){

            detectado = true;

            document.getElementById("respuesta").value = numero;

            reconocimiento.stop();

            if(btn) btn.classList.remove("activo");

            escuchando = false;
            reintentos = 0;

            setTimeout(() => {
                verificar();
            }, 120);
        }
    };

    reconocimiento.onerror = function(e){

        console.log("Error voz:", e.error);

        if(btn) btn.classList.remove("activo");

        escuchando = false;

        if(e.error === "no-speech" && reintentos < 2){

            reintentos++;

            setTimeout(iniciarVoz, 300);

        } else {

            hablar("No pude escucharte bien");
        }
    };

    reconocimiento.onend = function(){

        if(btn) btn.classList.remove("activo");

        escuchando = false;

        reconocimiento = null;

        if(!resultadoFinal && reintentos < 2){

            reintentos++;

            setTimeout(iniciarVoz, 400);
        }
    };

    setTimeout(() => {

        if(reconocimiento){
            reconocimiento.start();
        }

    }, 200);

    setTimeout(() => {

        if(reconocimiento && escuchando){
            reconocimiento.stop();
        }

    }, 7000);
}


// =========================
// 🔢 TEXTO → NÚMERO
// =========================
function convertirTextoANumero(texto){

    texto = texto.toLowerCase().trim();

    const mapa = {
        "cero":0,
        "uno":1,
        "un":1,
        "dos":2,
        "tres":3,
        "cuatro":4,
        "cinco":5,
        "seis":6,
        "siete":7,
        "ocho":8,
        "nueve":9,
        "diez":10,
        "once":11,
        "doce":12,
        "trece":13,
        "catorce":14,
        "quince":15,
        "dieciseis":16,
        "dieciséis":16,
        "diecisiete":17,
        "dieciocho":18,
        "diecinueve":19,
        "veinte":20,
        "treinta":30,
        "cuarenta":40,
        "cincuenta":50,
        "sesenta":60,
        "setenta":70,
        "ochenta":80,
        "noventa":90,
        "cien":100
    };

    texto = texto.replace(
        /(la respuesta es|respuesta|es|son|creo que es)/g,
        ""
    ).trim();

    if(!isNaN(texto)){
        return parseInt(texto);
    }

    if(mapa.hasOwnProperty(texto)){
        return mapa[texto];
    }

    for(let palabra in mapa){

        if(texto.includes(palabra)){
            return mapa[palabra];
        }
    }

    let match = texto.match(/\d+/);

    if(match){
        return parseInt(match[0]);
    }

    return null;
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

        document.getElementById("resultado").innerText =
            "Escribe un número";

        hablar("Escribe o di un número");

        return;
    }

    let user = parseInt(input);
    let correcto = num1 * num2;

    let explicacion =
        document.getElementById("explicacion-error");

    if (user === correcto) {

        estrellas++;

        if (estrellas > 5) estrellas = 5;

        document.getElementById("resultado").innerText =
            "¡Correcto!";

        explicacion.innerText = "";

        sonidoCorrecto.currentTime = 0;
        sonidoCorrecto.play();

        hablar("Correcto");

        if (estrellas === 5) {

            sonidoRacha.currentTime = 0;
            sonidoRacha.play();

            hablar("Increíble, llevas una racha perfecta");
        }

        actualizarEstrellas();

        setTimeout(() => {

            generarEjercicio();

            setTimeout(() => {
                iniciarVoz();
            }, 300);

        }, 800);

    } else {

        estrellas = 0;

        document.getElementById("resultado").innerText =
            "Intenta otra vez";

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

        hablar("Intenta otra vez");

        actualizarEstrellas();

        setTimeout(() => {
            iniciarVoz();
        }, 500);
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

    if(!elemento) return;

    elemento.innerHTML = "";

    let i = 0;

    function escribir() {

        if (i < textoIA.length) {

            elemento.innerHTML += textoIA.charAt(i);

            i++;

            setTimeout(escribir, 20);

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

    setTimeout(() => {
        iniciarVoz();
    }, 1000);
};


// =========================
// 🔊 DESBLOQUEAR AUDIO
// =========================
document.body.addEventListener("click", () => {
    speechSynthesis.resume();
}, { once: true });
