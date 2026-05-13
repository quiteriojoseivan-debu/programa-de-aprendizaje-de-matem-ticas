let tipo = "";
let correcta;
let num1, num2;
let historial = [];

/* MENUS */
function mostrarMenu(menu){
    historial.push(menuActual());
    ocultarTodo();
    document.getElementById("menu-" + menu).classList.remove("oculto");
}

function volver(){
    ocultarTodo();
    let anterior = historial.pop();
    if(anterior) document.getElementById(anterior).classList.remove("oculto");
}

function ocultarTodo(){
    document.querySelectorAll(".menu, #zona-chat").forEach(e => e.classList.add("oculto"));
}

function menuActual(){
    let all = document.querySelectorAll(".menu");
    for(let m of all){
        if(!m.classList.contains("oculto")) return m.id;
    }
}

/* ENTRAR A SUMA */
function irASuma(){
    tipo = "suma";
    ocultarTodo();
    document.getElementById("zona-chat").classList.remove("oculto");
    iniciarSumaIA();
}

/* 🔊 VOZ ARREGLADA (ESPERA + SABINA) */
let vocesListas = false;

// Detectar cuando ya cargaron
speechSynthesis.onvoiceschanged = () => {
    vocesListas = true;
};

function hablar(texto){
    if(!window.speechSynthesis) return;

    const ejecutar = () => {
        const msg = new SpeechSynthesisUtterance(texto);
        const voces = speechSynthesis.getVoices();

        // 🔥 Forzar Sabina
        const sabina = voces.find(v => v.name.toLowerCase().includes("sabina"));

        msg.voice = sabina || voces.find(v => v.lang.toLowerCase().includes("es")) || voces[0];

        msg.rate = 0.95;
        msg.pitch = 1.1;
        msg.volume = 1;

        speechSynthesis.cancel();
        speechSynthesis.speak(msg);
    };

    // 🔥 Esperar si aún no cargan voces
    if(!vocesListas){
        setTimeout(ejecutar, 500);
    } else {
        ejecutar();
    }
}

/* CHAT */
function agregarMensaje(texto, clase){
    let chat = document.getElementById("chat");
    let div = document.createElement("div");
    div.className = clase;
    div.innerText = texto;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;

    if(clase === "bot") hablar(texto);
}

/* INICIAR */
function iniciarSumaIA(){
    let chat = document.getElementById("chat");
    chat.innerHTML = "";

    fetch("/modo_suma")
    .then(res => res.json())
    .then(data => {
        agregarMensaje(data.texto, "bot");
        setTimeout(nuevaPregunta, 2000);
    });
}

/* PREGUNTA */
function nuevaPregunta(){
    fetch("/pregunta", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({tipo: tipo})
    })
    .then(res => res.json())
    .then(data => {
        correcta = data.respuesta;
        num1 = data.num1;
        num2 = data.num2;
        agregarMensaje(`¿Cuánto es ${num1} + ${num2}?`, "bot");
    });
}

/* ENVIAR */
function enviar(){
    let input = document.getElementById("input");
    let valor = input.value.trim();
    if(!valor) return;

    agregarMensaje(valor, "user");

    fetch("/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            mensaje: valor,
            tipo: tipo,
            correcta: correcta,
            num1: num1,
            num2: num2
        })
    })
    .then(res => res.json())
    .then(data => {
        agregarMensaje(data.respuesta, "bot");
        if(data.nueva){
            setTimeout(nuevaPregunta, 1500);
        }
    });

    input.value = "";
}

/* VOLVER */
function volverMenu(){
    ocultarTodo();
    document.getElementById("menu-principal").classList.remove("oculto");
}