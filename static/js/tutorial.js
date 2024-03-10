// TUTORIAL DATA
TUTORIAL_DATA = [
    {
        "action": "sell",
        "explanation": "You should definitely <b>sell</b>",
        "state": {
            "price": 19.99,
            "day": 0,
            "other_selled": true
        }
    },
    {
        "outcome": {
            "reward": 19.99,
            "payoff": 9.99
        },
        "explanation": "You sold your stock for <b>19.99$</b>. Because the initial price of the stock was <b>10$</b>, you gained <b>9.99$</b>",
        "action": "any"
    },
    {
        "action": "dont sell",
        "explanation": "You should definitely not sell",
        "state": {
            "price": 1,
            "day": 0,
            "other_selled": false
        }
    },
    {
        "action": "dont sell",
        "explanation": "You should still wait. If you sell now you loose 2$",
        "state": {
            "price": 8,
            "day": 1,
            "other_selled": false
        }
    },
    {
        "action": "dont sell",
        "explanation": "Now the price is over 10. But notice your oponent just sold his stock (so you no longer have to worry about selling the same day as him). You still have plenty days left, let's wait for a better price.",
        "state": {
            "price": 12,
            "day": 2,
            "other_selled": true
        }
    },
    {
        "action": "sell",
        "explanation": "Selling the stock today seems appropiate",
        "state": {
            "price": 19.75,
            "day": 3,
            "other_selled": true
        }
    },
    {
        "outcome": {
            "reward": 19.75,
            "payoff": 9.75
        },
        "explanation": "You completed the tutorial. If you play <b>" + TOTAL_REQUIRED_GAMES + " games</b> you will be able to see your statistics as a reward. Proceed to the game.",
        "action": "any"
    }
]

let tutorial_current_step = -1;

function begin_tutorial() {
    tutorial_current_step = 0;

    tutorial_dom["quit_button"].style.display = "none";

    display_tutorial();
}

function tutorial_step(action) {

    if (action == TUTORIAL_DATA[tutorial_current_step]["action"])
        tutorial_current_step += 1;
    else
        return;

    if (action == "any") {
        // Dont show outcome
        game_dom["state"].style.display = 'block'
        game_dom["action"].style.display = 'flex'
        game_dom["outcome"].style.display = 'none';
    }

    display_tutorial();
}

function display_tutorial() {
    current_step = TUTORIAL_DATA[tutorial_current_step];
    // Display the explanation
    tutorial_dom["explanation"].innerHTML = current_step["explanation"]

    if ("outcome" in current_step) {
        // Show outcome
        game_dom["state"].style.display = 'none'
        game_dom["action"].style.display = 'none'
        game_dom["outcome"].style.display = 'block';

        if (tutorial_current_step == TUTORIAL_DATA.length - 1) {
            // Final step
            tutorial_dom["sell_button"].disabled = false;
            tutorial_dom["dont_sell_button"].disabled = false;
            document.getElementById("game-replay-button").style.display = 'none';
            tutorial_dom["quit_button"].style.display = "block";
        }
    }
    else  {
        // Display state
        game_state = current_step["state"]
        display_state()

        // Disable unwanted button
        if (current_step["action"] == "sell") {
            // Enable sell, disable dont sell
            tutorial_dom["sell_button"].disabled = false;
            tutorial_dom["dont_sell_button"].disabled = true;
        }
        else {
            // Enable don't sell, disable sell
            tutorial_dom["sell_button"].disabled = true;
            tutorial_dom["dont_sell_button"].disabled = false;
        }
    }

}
