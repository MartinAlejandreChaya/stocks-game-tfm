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


@app.route('/play_request', methods=['POST'])
def handle_play_request():
    user_data = request.get_json()

    response = {
        "player_id": db_manager.new_player(user_data),
    }

    return jsonify(response)


@app.route("/game_move", methods=['POST'])
def handle_game_move():

    game_data = request.get_json()

    db_manager.new_game(game_data);

    return ('', 200)


@app.route("/master_user/getData22")
def get_data():
    values = db_manager.get_values()
    return jsonify(values)