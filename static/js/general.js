// CONSTANTS

// Variables
const user_data = {
    "name": "",
    "age": -1,
    "gender": "",
    "study_level": "",
    "study_field": ""
}

window.onload = () => {

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
        /* Send play to server */
        /* Server will respond with OK or with 'Master user' */
        /* Then do this
            * Hide rules
            * Fix user name
            * Hide play button
            * Display play component
                - An indicator that visually and explicitly shows
                the game state: (day, price, other_selled)
                - Two buttons (sell, don't sell)
            * Display username playing bar that fills up as you generate more data
            * Show user average
            * Show some strategies averages.
            * Show current database average (?) Maybe this introduces bias
        */
    })

    /* Setup input fields */
    setupInputs();
}

function setupInputs(play_button) {

    const name_input = document.getElementById("user-data-name");

    name_input.addEventListener('keyup', (ev) => {
        user_data["name"] = name_input.value;
    })
}