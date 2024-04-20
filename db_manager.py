from datetime import datetime
import numpy as np

# DB Connection
from init_db import conn


def new_game(game_data):
    with conn.cursor() as cur:
        cur.execute("INSERT INTO games (player_id, state_day, state_price, state_other_selled, action, result) "
            " VALUES (%s, %s, %s, %s, %s, %s)", (game_data["player_id"], game_data["state_day"],
            game_data["state_price"], game_data["state_other_selled"], game_data["action"], game_data["result"]))
    conn.commit()


def new_player(player_data):
    with conn.cursor() as cur:

        player_data["date"] = datetime.now()
        player_data["oponent_id"] = np.random.randint(0, 3)

        cur.execute("INSERT INTO players (date, age, gender, study_level, study_field, oponent_id) "
            " VALUES (%s, %s, %s, %s, %s, %s) RETURNING id", (player_data["date"], player_data["age"], player_data["gender"],
            player_data["study_level"], player_data["study_field"], player_data["oponent_id"]))

        player_id = cur.fetchone()[0]

        if (player_data["paypal"]):
            cur.execute("INSERT INTO concurso (player_id, player_paypal) VALUES (%s, %s)", (player_id, player_data["paypal"]))

    conn.commit()
    return {
        "player_id": player_id,
        "oponent_id": player_data["oponent_id"]
    }


# Return the important data for the master user to see
def get_master_user_data():
    with conn.cursor() as cur:
        cur.execute("SELECT COUNT(*) FROM players")
        n_players = cur.fetchone()[0]
        cur.execute("SELECT COUNT(*) FROM players WHERE players.finished = TRUE")
        n_finishing_players = cur.fetchone()[0]
        cur.execute("SELECT COUNT(*) FROM games")
        n_moves = cur.fetchone()[0]
        cur.execute("SELECT COUNT(*) FROM games WHERE action = TRUE")
        n_games = cur.fetchone()[0]
        cur.execute("SELECT AVG(result) FROM games WHERE action = TRUE")
        average_score = cur.fetchone()[0]

    return {
        "n_players": n_players,
        "n_moves": n_moves,
        "n_games": n_games,
        "average_score": average_score,
        "n_finishing_players": n_finishing_players
    }


def get_player_statistics(player_id, batch_size):
    with conn.cursor() as cur:
        cur.execute("SELECT AVG(result) FROM games WHERE action = TRUE")
        player_base_average = cur.fetchone()[0]

        cur.execute("SELECT AVG(result) FROM games WHERE games.player_id = %s AND action = TRUE", (player_id,))
        player_average = cur.fetchone()[0]

        cur.execute("SELECT AVG(result) FROM (SELECT result from games WHERE games.player_id = %s"
                    " AND action = TRUE ORDER BY id DESC LIMIT %s) AS result_col", (player_id, batch_size))
        player_batch_average = cur.fetchone()[0]

        cur.execute("SELECT average_score FROM players WHERE players.finished = TRUE")
        players_average = cur.fetchall()

        player_rank = 0
        player_batch_rank = 0
        print(player_average)

        for avg in players_average:
            print(avg)
            if (avg[0] > player_average):
                player_rank += 1
            if (avg[0] > player_batch_average):
                player_batch_rank += 1

        n_players = len(players_average)
        if (n_players == 0): n_players = 1

        # Update the player average score and finished
        cur.execute("UPDATE players SET average_score = %s, finished = %s WHERE id = %s", (player_average, True, player_id))

    conn.commit()
    return {
        "player_base_average": player_base_average,
        "your_average": player_average,
        "your_percentile": (100. * player_rank / n_players),
        "last_20": {
            "average": player_batch_average,
            "percentile": (100. * player_batch_rank / n_players)
        }
    }