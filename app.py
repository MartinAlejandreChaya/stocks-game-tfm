from flask import Flask
import db_manager

app = Flask(__name__)

@app.route("/")
def index():
    return "Hello world!"

@app.route("/test_db")
def test_db():

    db_manager.add_row({"name": "", "move_id": 15,
                        "state_day": 17, "state_price": 16.41, "state_other_selled": True,
                        "action": 1, "result": -15})

    return "Success"