// CONSTANTS

// VARIABLES
let current_user_data = {};
let player_id, game_id = -1;
let oponent_id = 1;
let game_state_dom = {}
let game_dom = {}
let game_outcome_dom = {}
let game_statistics_dom = {}
let in_tutorial = false
let tutorial_dom = {}
let player_average_score = -1;
let game_batches = 0;

window.onload = () => {

    // Setup visibility of different components
    const user_data = document.getElementById("user-data");
    const game = document.getElementById("game")
    game_dom["state"] = document.getElementById("game-state");
    game_dom["explanation"] = document.getElementById("game-explanation");
    game_dom["action"] = document.getElementById("game-action");
    game_dom["outcome"] = document.getElementById("game-outcome");

    // Initial visibility
    user_data.style.display = "flex";
    game.style.display = "none";

    // Game state DOM
    game_state_dom["day"] = {}
    game_state_dom["day"]["text"] = document.getElementById("game-state-day-text");
    game_state_dom["day"]["days_left"] = document.getElementById("game-state-day-days-left");
    game_state_dom["price"] = document.getElementById("game-state-price");
    game_state_dom["other_selled"] = document.getElementById("game-state-other-selled");
    // Game outcome DOM
    game_outcome_dom["reward"] = document.getElementById("game-outcome-reward")
    game_outcome_dom["penalization"] = document.getElementById("game-outcome-penalization")
    game_outcome_dom["game_number"] = document.getElementById("game-outcome-game-number");
    game_outcome_dom["game_progress"] = document.getElementById("game-player-progress-filling-div")
    // Hide player progress during tutorial.
    document.getElementById("game-player-progress").style.display = 'none';

    const elems = document.getElementsByClassName("total-games-required");
    for (let i=0; i<elems.length; i++) {
        elems[i].textContent = TOTAL_REQUIRED_GAMES.toString();
    }
    document.getElementById("total-games-played-so-far").textContent = TOTAL_REQUIRED_GAMES.toString();

    // Statistics DOM
    game_statistics_dom["all"] = document.getElementById("game-statistics")
    game_statistics_dom["your-score"] = document.getElementById("game-statistics-your-score");
    game_statistics_dom["player-score"] = document.getElementById("game-statistics-players-score");
    game_statistics_dom["percentile"] = document.getElementById("game-statistics-percentile");
    game_statistics_dom["text-top"] = document.getElementById("game-statistics-text-top");
    game_statistics_dom["last-20"] = {
        "average": document.getElementById("game-statistics-last-20-your-score"),
        "percentile": document.getElementById("game-statistics-last-20-percentile"),
        "text-top": document.getElementById("game-statistics-last-20-text-top"),
        "all": document.getElementById("game-statistics-last-20-games")
    }
    // Tutorial DOM
    tutorial_dom["explanation"] = document.getElementById("game-explanation-text");

    // Rules hide button
    const rules_hide_button = document.getElementById("rules-hide-button")
    const rules_div = document.getElementById("rules-div")
    let rules_button_hidden = false;
    rules_div.style.maxHeight = '500px';
    rules_hide_button.addEventListener('click', (ev) => {
        if (rules_button_hidden) {
            rules_div.style.maxHeight = '500px'
            rules_hide_button.textContent = "Hide"
        }
        else {
            rules_div.style.maxHeight = '0px'
            rules_hide_button.textContent = "Show rules"
        }
        rules_button_hidden = !rules_button_hidden;
    })

    // Tutorial button
    const tutorial_button = document.getElementById("tutorial-button");
    tutorial_button.addEventListener('click', () => {
        /* Verify user-data */
        current_user_data = verify_user_data();
        if (current_user_data["error"]) {
            alert(current_user_data["error"]);
            return;
        }

        in_tutorial = true;
        begin_tutorial();

        user_data.style.display = "none";
        game.style.display = "block";
        game_dom["state"].style.display = "block";
        game_dom["explanation"].style.display = "block";
        game_dom["outcome"].style.display = "none";
    })

    // Quit tutorial button
    const quit_tutorial_button = document.getElementById("quit-tutorial-button");
    tutorial_dom["quit_button"] = quit_tutorial_button
    quit_tutorial_button.addEventListener('click', () => {
        // User data has already been verified
        //* Send play to server */

        fetch('/play_request', {
            method: "POST",
            body: JSON.stringify(current_user_data),
            headers: {"Content-Type": "application/json"},
        })
            .then((res) => res.json())
            .catch((error) => {
                console.log("Error: ", error)
                alert("Error. Please reload page");
                return null;
             })
            .then(data => {
                /* Server will respond with OK or with 'Master user' */
                if (data == null) return;

                // If everything went well
                user_data.style.display = "none";
                game.style.display = "block";
                document.getElementById("game-replay-button").style.display = 'block';
                game_dom["state"].style.display = "block";
                game_dom["explanation"].style.display = "none";
                game_dom["outcome"].style.display = "none";
                game_dom["action"].style.display = "flex";
                // Show player progress
                document.getElementById("game-player-progress").style.display = 'block';

                // Begin game
                in_tutorial = false;
                player_id = data["player_id"]
                oponent_id = data["oponent_id"]
                game_id = 0
                begin_game()
            })
            .catch(error => {
                console.log("Error: ", error)
                alert("Error. Please reload page.");
            });
    })

    // Game replay button
    const game_replay_button = document.getElementById("game-replay-button");
    game_replay_button.addEventListener('click', () => {
        if (in_tutorial) tutorial_step("any");
        else restart_game();
    })

    // sell and dont sell buttons
    const game_sell_button = document.getElementById("game-sell-button");
    game_sell_button.addEventListener('click', () => {
        if (in_tutorial) tutorial_step("sell");
        else game_step("sell");
    })
    const game_dont_sell_button = document.getElementById("game-dont-sell-button");
    game_dont_sell_button.addEventListener('click', () => {
        if (in_tutorial) tutorial_step("dont sell");
        else game_step("dont sell");
    })

    tutorial_dom["sell_button"] = game_sell_button;
    tutorial_dom["dont_sell_button"] = game_dont_sell_button;

    const game_continue_playing_button = document.getElementById("continue-playing-button");
    game_continue_playing_button.addEventListener('click', () => {
        // Show average score so far
        document.getElementById("game-continue-div").style.display = 'block'
        document.getElementById("game-statistics-average-score").textContent = player_average_score;

        // Hide statistics
        game_statistics_dom["all"].style.display = "none";

        game_batches += 1;

        // Send the player to the game
        restart_game();
    })
}


function verify_user_data() {
    // Age > 10, Age < 120
    age = document.getElementById("user-data-age").value;
    if (age < 10 || age > 120) {
        return {"error": "Age must be between 10 and 120"}
    }

    // Gender
    gender = document.getElementById("user-data-gender").value;

    // Level of studies not null
    study_level = document.getElementById("user-data-study-level").value;
    if (study_level == "null") {
        return {"error": "You must introduce your current or past highest study level."}
    }

    // Study field
    study_field = document.getElementById("user-data-study-field").value;
    if (study_field.length > 150) {
        return {"error": "The study field should be shorter than 150 characters."}
    }

    // All data is good
    return {
        "name": name,
        "age": age,
        "gender": gender,
        "study_level": study_level,
        "study_field":  study_field,
        "error": false,
    };
}