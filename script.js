let blackjackgame = {
  player: { scoreSpan: "#score-player", box: "#player-box", score: 0 },
  dealer: { scoreSpan: "#score-dealer", box: "#dealer-box", score: 0 },
  cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "A", "J", "K", "Q"],
  cardspoint: {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    J: 10,
    K: 10,
    Q: 10,
    A: [1, 11],
  },
};

const PLAYER = blackjackgame["player"];
const DEALER = blackjackgame["dealer"];

let wincount = 0;
let losecount = 0;
let drawcount = 0;

//Buttons
document.querySelector("#hit-button").addEventListener("click", BlackJackHit);
document.querySelector("#deal-button").addEventListener("click", BlackJackDeal);
document.querySelector("#stand-button").addEventListener("click", DealerLogic);

//To select any random card and display
function RandomCard() {
  let randomcard =
    blackjackgame["cards"][
      Math.floor(Math.random() * blackjackgame["cards"].length)
    ];
  return randomcard;
}
//console.log(RandomCard())
// OUTPUT : 10 (Must display any random card)

//Shows card of active player on the page
function ShowCard(card, activeplayer) {
  if (activeplayer["score"] < 21) {
    let cardimg = document.createElement("img");
    cardimg.src = `./images/${card}.png`;
    document.querySelector(activeplayer["box"]).appendChild(cardimg);
  }
} //Shows card A(Example) in player-box
//console.log(ShowCard("A",PLAYER));
// OUTPUT : undefined

//Update the score
function UpdateScore(card, activeplayer) {
  if (activeplayer["score"] < 21) {
    if (card == "A") {
      //For Ace Card
      if (activeplayer["score"] > 10) {
        activeplayer["score"] += blackjackgame["cardspoint"][card][0];
      } else {
        activeplayer["score"] += blackjackgame["cardspoint"][card][1];
      }
    } else {
      //Except Ace card
      activeplayer["score"] += blackjackgame["cardspoint"][card];
    }
  }
}

//Display Score
function ShowScore(activeplayer) {
  if (activeplayer["score"] > 21) {
    document.querySelector(activeplayer["scoreSpan"]).textContent = "BUST!!!";
    document.querySelector(activeplayer["scoreSpan"]).style.color = "red";
  } else {
    document.querySelector(activeplayer["scoreSpan"]).textContent =
      activeplayer["score"];
  }
}

//Finds the winner
function FindWinner() {
  let winner;
  if (PLAYER["score"] <= 21) {
    if (DEALER["score"] > 21 || DEALER["score"] < PLAYER["score"]) {
      winner = PLAYER;
      wincount += 1;
    } else if (DEALER["score"] > PLAYER["score"]) {
      winner = DEALER;
      losecount += 1;
    } else if (DEALER["score"] == PLAYER["score"]) {
      drawcount += 1;
    }
  } else {
    if (DEALER["score"] <= 21) {
      winner = DEALER;
      losecount += 1;
    } else if (DEALER["score"] > 21) {
      drawcount += 1;
    }
  }
  return winner;
}
//console.log(FindWinner());
//OUTPUT :  {scoreSpan: "#score-player", box: "#player-box", score: 21}

//Displays the winner
function ShowWinner(winner) {
  let message, messageColor;
  if (winner == PLAYER) {
    message = "Player Won!!!";
    messageColor = "green";
  } else if (winner == DEALER) {
    message = "Player Lost!!!";
    messageColor = "red";
  } else {
    message = "It's a Draw!!!";
    messageColor = "gold";
  }
  document.querySelector("#blackjack-result").textContent = message;
  document.querySelector("#blackjack-result").style.color = messageColor;
}

// Update the table
function UpgradeCounter() {
  document.querySelector("#wins").innerHTML = wincount;
  document.querySelector("#losses").innerHTML = losecount;
  document.querySelector("#draws").innerHTML = drawcount;
}

// Hit Button
function BlackJackHit() {
  if (DEALER["score"] == 0) {
    let card = RandomCard();
    ShowCard(card, PLAYER);
    UpdateScore(card, PLAYER);
    ShowScore(PLAYER);
  }
}

//Deal button
function BlackJackDeal() {
  if (PLAYER["score"] > 0 && DEALER["score"] > 0) {
    let allimages = document
      .querySelector(".flex-blackjack-row-1")
      .querySelectorAll("img");
    for (let num = 0; num < allimages.length; num++) {
      allimages[num].remove();
    }

    UpgradeCounter();

    PLAYER["score"] = 0;
    DEALER["score"] = 0;
    ShowScore(PLAYER);
    ShowScore(DEALER);
    document.querySelector("#score-player").style.color = "green";
    document.querySelector("#score-dealer").style.color = "green";

    document.querySelector("#blackjack-result").textContent =
      "Let's play again!!!";
    document.querySelector("#blackjack-result").style.color = "black";
  }
}

//Dealer timer function
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//Logic for Dealer
async function DealerLogic() {
  if (PLAYER["score"] > 0 && DEALER["score"] === 0) {
    if (PLAYER["score"] > 21) {
      for (let num = 0; num < 2; num++) {
        let card = RandomCard();
        ShowCard(card, DEALER);
        UpdateScore(card, DEALER);
        ShowScore(DEALER);

        await sleep(500);
      }
    } //The await expression causes async function execution to pause until a Promise is settled
    else if (PLAYER["score"] <= 21) {
      while (PLAYER["score"] > DEALER["score"] && DEALER["score"] < 21) {
        let card = RandomCard(); //
        ShowCard(card, DEALER);
        UpdateScore(card, DEALER);
        ShowScore(DEALER);

        await sleep(500);
      }
    }
    ShowWinner(FindWinner());
  }
}
//console.log(DealerLogic());
//OUTPUT :  Promise {<pending>}
