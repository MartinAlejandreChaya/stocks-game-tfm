import json
from csv import DictWriter
from datetime import datetime;

VALUES_PATH = "db/values.json"

DB_GAMES_PATH = "db/games.csv"
DB_GAMES_FIELD_NAMES = ["player_id", "game_id", "state_day",
                        "state_price", "state_other_selled",
                        "action", "result"]

DB_PLAYERS_PATH = "db/players.csv"
DB_PLAYERS_FIELD_NAMES = ["player_id", "date", "tutorial", "name", "age",
                          "gender", "study_level", "study_field_maths",
                          "study_field_economy", "study_field_social"]


def new_game(game_data):
    with open(DB_GAMES_PATH, 'a', newline='') as f_object:
        dictwriter_object = DictWriter(f_object, fieldnames=DB_GAMES_FIELD_NAMES, extrasaction='ignore')

        dictwriter_object.writerow(game_data)
        f_object.close()

    increment_n_games();


def new_player(player_data):
    with open(DB_PLAYERS_PATH, 'a', newline='') as f_object:
        dictwriter_object = DictWriter(f_object, fieldnames=DB_PLAYERS_FIELD_NAMES, extrasaction='ignore')

        player_data["date"] = datetime.now();
        player_data["player_id"] = get_new_player_id();

        dictwriter_object.writerow(player_data)
        f_object.close()

    return player_data["player_id"]


def increment_n_games():
    values = get_values()
    values["n_games"] += 1
    save_values(values)


def get_new_player_id():
    values = get_values()

    values["n_players"] += 1
    valid_id = values["valid_player_id"]
    values["valid_player_id"] += 1

    save_values(values)

    return valid_id


# Auxiliar function for managing json
def get_values():
    json_file = open(VALUES_PATH, "r")  # Open the JSON file for reading
    values = json.load(json_file)  # Read the JSON into the buffer
    json_file.close()  # Close the JSON file
    return values


def save_values(new_values):
    json_file = open(VALUES_PATH, "w+")
    json_file.write(json.dumps(new_values))
    json_file.close()

# Return the important data for the master user to see
def get_master_user_data():
    return get_values()