import json
from csv import DictWriter
from datetime import datetime
import pandas as pd
import numpy as np

VALUES_PATH = "db/values.json"

DB_GAMES_PATH = "db/games.csv"
DB_GAMES_FIELD_NAMES = ["player_id", "game_id", "state_day",
                        "state_price", "state_other_selled",
                        "action", "result"]

DB_PLAYERS_PATH = "db/players.csv"
DB_PLAYERS_FIELD_NAMES = ["player_id", "date", "age", "gender", "study_level",
                          "study_field", "oponent_id", "average_score"]


def new_game(game_data):
    with open(DB_GAMES_PATH, 'a', newline='') as f_object:
        dictwriter_object = DictWriter(f_object, fieldnames=DB_GAMES_FIELD_NAMES, extrasaction='ignore')

        dictwriter_object.writerow(game_data)
        f_object.close()

    increment_n_games();


def new_player(player_data):
    with open(DB_PLAYERS_PATH, 'a', newline='') as f_object:
        dictwriter_object = DictWriter(f_object, fieldnames=DB_PLAYERS_FIELD_NAMES, extrasaction='ignore')

        player_data["date"] = datetime.now()
        player_data["player_id"] = get_new_player_id()
        player_data["oponent_id"] = np.random.randint(0, 3)
        player_data["average_score"] = -1

        dictwriter_object.writerow(player_data)
        f_object.close()

    return {
        "player_id": player_data["player_id"],
        "oponent_id": player_data["oponent_id"]
    }


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


def get_player_statistics(player_id, batch_size):
    df = pd.read_csv(DB_GAMES_PATH, header=0, names=DB_GAMES_FIELD_NAMES, index_col = False)

    player_base_average = df[df["action"] == True]["result"].mean()

    # save player-base average to json
    values = get_values()
    values["player_base_average"] = player_base_average
    values["finishing_players"] += 1
    save_values(values)

    # Compute player average
    df2 = df[df["player_id"] == player_id].loc[df["action"] == True]
    player_average = df2["result"].mean()
    player_batch_average = df2["result"].tail(batch_size).mean()

    # Compute player rank
    df = pd.read_csv(DB_PLAYERS_PATH, header=0, names=DB_PLAYERS_FIELD_NAMES,
                     index_col=False,  dtype={"average_score": np.float64}, encoding='latin1')
    df.loc[df["player_id"] == player_id, "average_score"] = player_average
    # Save player average score
    df.to_csv(DB_PLAYERS_PATH, index=False)


    # Calculate the rank of your score
    player_rank = 1
    player_batch_rank = 1
    n_players = 1
    for sc in df["average_score"]:
        if (sc != -1 and sc != player_average):
            if (sc > player_average): player_rank += 1
            if (sc > player_batch_average): player_batch_rank += 1
            n_players += 1

    return {
        "player_base_average": player_base_average,
        "your_average": player_average,
        "your_percentile": (100. * player_rank / n_players),
        "last_20": {
            "average": player_batch_average,
            "percentile": (100. * player_batch_rank / n_players)
        }
    }