# Dependencies imports
from flask import Flask, render_template, request, jsonify
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

    db_manager.new_game({"player_id": 1, "game_id": 12,
                        "state_day": 17, "state_price": 16.41,
                         "state_other_selled": True, "action": 1, "result": -15})

    return "Success"


@app.route('/play_request', methods=['POST'])
def handle_play_request():
    user_data = request.get_json()

    # MASTER USER. Show information
    if (user_data["name"] == "master_user --getData pass22"):
        values = db_manager.get_values()
        values["player_id"] = -1
        return jsonify(values)

    response = {
        "player_id": db_manager.new_player(user_data),
    }
    return jsonify(response)

@app.route("/game_move", methods=['POST'])
def handle_game_move():

    game_data = request.get_json()

    db_manager.new_game(game_data);

    return ('', 200)