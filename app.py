# Dependencies imports
from flask import Flask, render_template
import datetime

# Module imports
import db_manager

# Creating the application
app = Flask(__name__)


# Routes
@app.route("/")
def index():
    return render_template("index.html", utc_dt=datetime.datetime.utcnow())

@app.route("/test_db")
def test_db():

    db_manager.add_row({"name": "", "move_id": 15,
                        "state_day": 17, "state_price": 16.41, "state_other_selled": True,
                        "action": 1, "result": -15})

    return "Success"