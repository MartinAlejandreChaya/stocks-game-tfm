// CONSTANTS

// VARIABLES
let current_user_data = {};

window.onload = () => {

    // Setup visibility of different components
    const user_data = document.getElementById("user-data");
    const game = document.getElementById("game")
    const game_state = document.getElementById("game-state");
    const game_explanation = document.getElementById("game-explanation");
    const game_action = document.getElementById("game-action");
    const game_outcome = document.getElementById("game-outcome");

    // Initial visibility
    user_data.style.display = "block";
    game.style.display = "none";

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

    // Play button
    const play_button = document.getElementById("play-button");
    play_button.addEventListener('click', () => {
        /* Verify user-data */
        current_user_data = verify_user_data();
        if (current_user_data["error"]) {
            alert(current_user_data["error"]);
            return;
        }

        /* Send play to server */
        fetch('/play_request', {
            method: "POST",
            body: JSON.stringify(current_user_data),
            headers: {"Content-Type": "application/json"},
        })
            .then((res) => res.json())
            .catch((error) => alert("Error. Please reload page"))
            .then(data => {
                /* Server will respond with OK or with 'Master user' */
                if (data["player_id"] == -1) {
                    alert(JSON.stringify(data));
                     // TODO: console.log(data); rather than alert
                    return;
                }
                console.log(data);

                // If everything went well
                user_data.style.display = "none";
                game.style.display = "block";
                game_state.style.display = "block";
                game_explanation.style.display = "none";
                game_outcome.style.display = "none";
            })
            .catch(error => {
                alert("Error. Please reload page.");
            });

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

        user_data.style.display = "none";
        game.style.display = "block";
        game_state.style.display = "block";
        game_explanation.style.display = "block";
        game_outcome.style.display = "none";
    })

    // Quit tutorial button
    const quit_tutorial_button = document.getElementById("quit-tutorial-button");
    quit_tutorial_button.addEventListener('click', () => {
        // User data has already been verified
        //* Send play to server with has done tutorial option */
        current_user_data["tutorial"] = true;

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

                console.log(data);

                // If everything went well
                user_data.style.display = "none";
                game.style.display = "block";
                game_state.style.display = "block";
                game_explanation.style.display = "none";
                game_outcome.style.display = "none";
            })
            .catch(error => {
                alert("Error. Please reload page.");
            });

        game_state.style.display = "block";
        game_explanation.style.display = "none";
        game_outcome.style.display = "none";
    })
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

    // Level of studies not null
    study_level = document.getElementById("user-data-study-level").value;
    if (study_level == "null") {
        return {"error": "You must introduce your current or past highest study level."}
    }

    // All data is good
    return {
        "name": name,
        "age": age,
        "study_level": study_level,
        "study_field_maths":  document.getElementById("study-field-maths").checked,
        "study_field_economy": document.getElementById("study-field-economy").checked,
        "study_field_social": document.getElementById("study-field-social").checked,
        "error": false,
        "tutorial": false
    };
}