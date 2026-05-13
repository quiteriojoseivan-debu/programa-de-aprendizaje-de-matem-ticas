let num1, num2;

function generarEjercicio() {
    document.getElementById("ejercicio-box").classList.remove("oculto");

    num1 = Math.floor(Math.random() * 10);
    num2 = Math.floor(Math.random() * 10);

    document.getElementById("pregunta").innerText = num1 + " + " + num2 + " = ?";
    document.getElementById("resultado").innerText = "";
    document.getElementById("respuesta").value = "";
}

function verificar() {
    let user = parseInt(document.getElementById("respuesta").value);
    let correcto = num1 + num2;

   if (user === correcto) {
    estrellas++;
    if (estrellas > 5) estrellas = 5;
    document.getElementById("resultado").innerText = "🎉 ¡Correcto!";
} else {
    estrellas = 0;
    document.getElementById("resultado").innerText = "😅 Intenta otra vez";
}
}

