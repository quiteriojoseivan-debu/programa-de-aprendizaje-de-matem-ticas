from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def portada():
    return render_template("portada.html")

@app.route("/home")
def home():
    return render_template("index.html")

@app.route("/operaciones")
def operaciones():
    return render_template("operaciones.html")

@app.route("/suma")
def suma():
    return render_template("suma.html")

@app.route("/resta")
def resta():
    return render_template("resta.html")

@app.route("/multiplicacion")
def multiplicacion():
    return render_template("multiplicacion.html")

@app.route("/division")
def division():
    return render_template("division.html")

@app.route("/contar")
def contar():
    return render_template("contar.html")



if __name__ == "__main__":
    app.run(debug=True)
