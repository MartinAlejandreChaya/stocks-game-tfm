// VARIABLES
let game_state = {}

function begin_game() {
    game_state = {
        "day": 0,
        "price": get_random_price(),
        "other_selled": false
    }

    display_state();

    // Enable dont sell button
    document.getElementById("game-dont-sell-button").disabled = false;
}

function game_step(action) {
    // Send to server game state and action
    send_server(game_state, action)

    // Take action
    if (action == "sell") {
        // Compute outcome
        penalization = !game_state["other_selled"] && get_other_selled();
        outcome = game_state["price"] / (penalization ? 2 : 1);

        // Show outcome, hide rest of game
        game_dom["state"].style.display = "none"
        game_dom["action"].style.display = "none";
        game_dom["outcome"].style.display = "block";

        display_outcome(outcome);
    }
    else {
        // Transition to new state
        game_state = {
            "day": game_state["day"] + 1,
            "price": get_random_price(),
            "other_selled": game_state["other_selled"] || get_other_selled()
        }

        display_state();

        if (game_state["day"] == 7) {
            // Disable dont sell button
            document.getElementById("game-dont-sell-button").disabled = true;
        }
    }
}


function restart_game() {
    game_id = game_id + 1;

    // hide outcome, show rest of game
    game_dom["state"].style.display = "block"
    game_dom["action"].style.display = "flex";
    game_dom["outcome"].style.display = "none";

    begin_game();
}

// AUX
function get_random_price() {
    return Math.random() * 20;
}
function get_other_selled() {
    return Math.random() < 1/7;
}

function display_state() {
    game_state_dom["day"].textContent = game_state["day"].toString()
    game_state_dom["price"].textContent = game_state["price"].toString()
    game_state_dom["other_selled"].textContent = game_state["other_selled"] ? "Yes" : "No"
}
function display_outcome(outcome) {
    game_outcome_dom["reward"].textContent = outcome.toString();
}

function send_server(game_state, action) {
    game_move = {
        "player_id": player_id,
        "game_id": game_id,
        "state_day": game_state["day"],
        "state_price": game_state["price"],
        "state_other_selled": game_state["other_selled"],
        "action": action == "sell",
        "result": 0
    }

    /* Send game move to server */
    fetch('/game_move', {
        method: "POST",
        body: JSON.stringify(game_move),
        headers: {"Content-Type": "application/json"},
    })
}