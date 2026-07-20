from flask import Flask, render_template

app = Flask(__name__)

@app.route('/') 
def mainPage():
    return render_template("landingPage.html")


@app.route('/main')
def drawingPage():
    return render_template("mainPage.html")


if __name__ == ("__main__"):
    app.run(debug=True)
