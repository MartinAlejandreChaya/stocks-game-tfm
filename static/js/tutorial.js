// TUTORIAL DATA
TUTORIAL_DATA = [
    {
        "state": {
            "price": 0.1,
            "day": 0,
            "other_selled": false
        },
        "action": "dont sell",
        "explanation": "You will always start on <b>Monday</b>. You have <b>7 days</b> left to sell your stock. Today you are offered a price of <b>0.1</b>. Let's play <i>Don't sell</i>.",
    },
    {
        "state": {
            "price": 19.99,
            "day": 1,
            "other_selled": false
        },
        "action": "sell",
        "explanation": "In this example tutorial, I will guide you through the actions by disabling and enabling the <i>Sell</i> and <i>Don't sell</i> buttons.",
    },
    {
        "outcome": {
            "reward": 19.99,
            "penalization": false
        },
        "explanation": "You sold your stock for <b>19.99</b>, and your opponent didn't sell his stock on the same day, therefore your reward is <b>19.99</b>",
        "action": "any"
    },
    {
        "state": {
            "price": 19.98,
            "day": 0,
            "other_selled": false
        },
        "explanation": "Let's play again. Today the price is <b>19.98</b>. We will select <i>Sell</i>.",
        "action": "sell",
    },
    {
        "outcome": {
            "reward": 9.99,
            "penalization": true
        },
        "explanation": "This time you colluded with the other agent. So you both get penalized and receive a reward of <b>9.99</b> (19.98 divided by 2)",
        "action": "any"
    },
    {
        "state": {
            "price": 0.1,
            "day": 0,
            "other_selled": false
        },
        "action": "dont sell",
        "explanation": "Let's play one last game, then you are on your own.",
    },
    {
        "state": {
            "price": 0.2,
            "day": 1,
            "other_selled": false
        },
        "action": "dont sell",
        "explanation": "You have 6 days left to sell the stock.",
    },
    {
        "state": {
            "price": 0.1,
            "day": 2,
            "other_selled": false
        },
        "action": "dont sell",
        "explanation": "5 days left. In the real game, the price will actually be random. For this tutorial I have preselected it to demonstrate 😉.",
    },
    {
        "state": {
                "price": 0.05,
                "day": 3,
                "other_selled": false
        },
        "action": "dont sell",
        "explanation": "4 days left. Remember you can hide the rules by pressing the <u>Hide</u> button at the lower right.",
    },
    {
        "state": {
                "price": 0.07,
                "day": 4,
                "other_selled": true
        },
        "action": "dont sell",
        "explanation": "You can notice, <i>Other agent sold?</i> is now <b>Yes</b>, meaning the other agent sold his stock in the previous day. You needn't worry about colluding with him anymore for the remaining game.",
    },
    {
        "state": {
                "price": 0.05,
                "day": 5,
                "other_selled": true
        },
        "action": "dont sell",
        "explanation": "2 days left",
    },
    {
        "state": {
                "price": 12,
                "day": 6,
                "other_selled": true
        },
        "action": "sell",
        "explanation": "You have arrived to the end of the week. You are forced to sell your stock today no matter the price offered.",
    },
    {
        "outcome": {
            "reward": 12,
            "penalization": false
        },
        "explanation": "You reward is <b>12</b>. Now you are ready to play the actual game. If you play <b>" + TOTAL_REQUIRED_GAMES + " games</b> you will be able to see your statistics.",
        "action": "any"
    },
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

        display_outcome(current_step["outcome"]["reward"], current_step["outcome"]["penalization"])

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
