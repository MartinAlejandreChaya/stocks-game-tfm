// CONSTANTS

// VARIABLES
let current_user_data = {};
let player_id, game_id;
let game_state_dom = {}
let game_dom = {}
let game_outcome_dom = {}
let in_tutorial = false;
let tutorial_dom = {}

window.onload = () => {

    // Setup visibility of different components
    const user_data = document.getElementById("user-data");
    const game = document.getElementById("game")
    game_dom["state"] = document.getElementById("game-state");
    game_dom["explanation"] = document.getElementById("game-explanation");
    game_dom["action"] = document.getElementById("game-action");
    game_dom["outcome"] = document.getElementById("game-outcome");

    // Initial visibility
    user_data.style.display = "block";
    game.style.display = "none";

    // Game state DOM
    game_state_dom["day"] = document.getElementById("game-state-day");
    game_state_dom["price"] = document.getElementById("game-state-price");
    game_state_dom["other_selled"] = document.getElementById("game-state-other-selled");
    // Game outcome DOM
    game_outcome_dom["reward"] = document.getElementById("game-outcome-reward")
    // Tutorial DOM
    tutorial_dom["explanation"] = document.getElementById("game-explanation-text");

    // Rules hide button
    const rules_hide_button = document.getElementById("rules-hide-button")
    const rules_p = document.getElementById("rules-p")
    let rules_button_hidden = false;
    rules_p.style.maxHeight = '300px';
    rules_hide_button.addEventListener('click', (ev) => {
        if (rules_button_hidden) {
            rules_p.style.maxHeight = '300px'
            rules_hide_button.textContent = "Hide"
        }
        else {
            rules_p.style.maxHeight = '0px'
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

                // Begin game
                in_tutorial = false;
                player_id = data["player_id"]
                game_id = 0
                begin_game()
            })
            .catch(error => {
                alert("Error. Please reload page.");
            });

        game_state.style.display = "block";
        game_explanation.style.display = "none";
        game_outcome.style.display = "none";
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
}


function verify_user_data() {
    // Name not taken?
    name = document.getElementById("user-data-name").value;
    name = name.trim()
    if (name.length <= 0) {
        return {"error": "Name field can't be empty"}
    }

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

    // All data is good
    return {
        "name": name,
        "age": age,
        "gender": gender,
        "study_level": study_level,
        "study_field_maths":  document.getElementById("study-field-maths").checked,
        "study_field_economy": document.getElementById("study-field-economy").checked,
        "study_field_social": document.getElementById("study-field-social").checked,
        "error": false,
    };
}