class Handler {

    // Game elements
    gameElem;
    gameBatLeftElem; 
    gameBatRightElem;
    gameBallElem;
    playerOneScoreElem;
    playerTwoScoreElem;

    // Game element bounding boxes
    gameBatLeftBB;
    gameBatRightBB;
    
    // Speed parameters
    gameBallSpeedX = .8;
    gameBallSpeedY = .8;
    gameBallSpeedIncrement = 0;
    gameBatSpeed = 1;

    // Position parameters
    gameBatLeftXPos = 50;
    gameBatRightXPos = 50;
    gameBallXPos = 50;
    gameBallYPos = 50;

    // Intervals
    gameBallMoveInterval;

    // Player parameters
    playerOneScore = 0;
    playerTwoScore = 0;

    // Constructor - Initialize game variables
    constructor(gameElem) {
        this.gameElem = gameElem;

        // Assign elements to variables
        this.gameBatLeftElem = document.querySelector(".bat#leftBat");
        this.gameBatRightElem = document.querySelector(".bat#rightBat");
        this.gameBallElem = document.querySelector("#ball");

        this.playerOneScoreElem = document.querySelector(".score#playerone");
        this.playerTwoScoreElem = document.querySelector(".score#playertwo");

        document.addEventListener('keydown', this.keyDownHandler);
        document.addEventListener('keyup', this.keyUpHandler);
    }

    // Start, Stop and Reset methods
    start = (btnElem) => {

        if (btnElem) {
            btnElem.disabled = true;
            btnElem.parentNode.querySelector("button#stop").disabled = false;
        }

        this.gameBallSpeedX = Math.round(Math.random()) ? this.gameBallSpeedX : -this.gameBallSpeedX;
        this.gameBallSpeedY = Math.round(Math.random()) ? this.gameBallSpeedY : -this.gameBallSpeedY;

        this.gameBatLeftXPos = 50;
        this.gameBatRightXPos = 50;
        this.gameBatLeftElem.style.top = this.gameBatLeftXPos + "%";
        this.gameBatRightElem.style.top = this.gameBatRightXPos + "%";

        this.gameBatLeftBB = this.gameBatLeftElem.getBoundingClientRect();
        this.gameBatRightBB = this.gameBatRightElem.getBoundingClientRect();

        this.gameBallXPos = 50;
        this.gameBallYPos = Math.floor(Math.random() * 90) + 5;
        this.gameBallElem.style.left = this.gameBallXPos + "%";
        this.gameBallElem.style.top = this.gameBallYPos + "%";

        this.playerOneScoreElem.innerHTML = this.playerOneScore;
        this.playerTwoScoreElem.innerHTML = this.playerTwoScore;

        this.gameBallSpeedIncrement = 0;

        setTimeout(() => this.gameBallMoveInterval = setInterval(this.moveBall, 20), 3000);
    }

    stop = (btnElem) => {

        if (btnElem) {
            btnElem.disabled = true;
            btnElem.parentNode.querySelector("button#start").disabled = false;
        }

        clearInterval(this.gameBallMoveInterval);
    }

    reset = (btnElem) => {

        if (btnElem) {
            btnElem.parentNode.querySelectorAll("button").forEach(btn => btn.disabled = false);
        }

        this.stop(btnElem.parentNode.querySelector("button#stop"));
        this.playerOneScore = 0;
        this.playerTwoScore = 0;
        
        this.gameBatLeftXPos = 50;
        this.gameBatRightXPos = 50;
        this.gameBatLeftElem.style.top = this.gameBatLeftXPos + "%";
        this.gameBatRightElem.style.top = this.gameBatRightXPos + "%";

        this.gameBallXPos = 50;
        this.gameBallYPos = 50;
        this.gameBallElem.style.left = this.gameBallXPos + "%";
        this.gameBallElem.style.top = this.gameBallYPos + "%";
    }

    // Movement
    moveLeftGameBat = (direction) => {
        if (direction === "up" && this.gameBatLeftXPos > 8) {
            this.gameBatLeftXPos -= this.gameBatSpeed;
        } else if (direction === "down" && this.gameBatLeftXPos < 92) {
            this.gameBatLeftXPos += this.gameBatSpeed;
        }
        this.gameBatLeftElem.style.top = this.gameBatLeftXPos + "%";
        this.gameBatLeftBB = this.gameBatLeftElem.getBoundingClientRect();
    }

    moveRightGameBat = (direction) => {
        if (direction === "up" && this.gameBatRightXPos > 8) {
            this.gameBatRightXPos -= this.gameBatSpeed;
        } else if (direction === "down" && this.gameBatRightXPos < 92) {
            this.gameBatRightXPos += this.gameBatSpeed;
        }
        this.gameBatRightElem.style.top = this.gameBatRightXPos + "%";
        this.gameBatRightBB = this.gameBatRightElem.getBoundingClientRect();
    }

    moveBall = () => {

        this.gameBallXPos += this.gameBallSpeedX + ( this.gameBallSpeedX < 0 ? -this.gameBallSpeedIncrement : this.gameBallSpeedIncrement );
        this.gameBallYPos += this.gameBallSpeedY + ( this.gameBallSpeedY < 0 ? -this.gameBallSpeedIncrement : this.gameBallSpeedIncrement );

        // Check for wall collision
        if (this.gameBallYPos <= 0 || this.gameBallYPos >= 100) {
            this.gameBallSpeedY = -this.gameBallSpeedY;
            this.gameBallYPos += ( this.gameBallSpeedY + ( this.gameBallSpeedY < 0 ? -this.gameBallSpeedIncrement : this.gameBallSpeedIncrement ) ) * 2;
        }
        if (this.gameBallXPos <= 0) {
            this.playerTwoScore++;
            clearInterval(this.gameBallMoveInterval);
            this.start();
        } else if (this.gameBallXPos >= 100) {
            this.playerOneScore++;
            clearInterval(this.gameBallMoveInterval);
            this.start();
        }

        this.gameBallElem.style.left = this.gameBallXPos + "%";
        this.gameBallElem.style.top = this.gameBallYPos + "%";

        let ballBB = this.gameBallElem.getBoundingClientRect();

        // Check for bat collision
        if (ballBB.left <= this.gameBatLeftBB.right && ballBB.top >= this.gameBatLeftBB.top && ballBB.bottom <= this.gameBatLeftBB.bottom) {
            this.gameBallSpeedX = -this.gameBallSpeedX;
            this.chanceChangeBallYSpeed();
            this.gameBallSpeedIncrement += 0.05;
        }
        if (ballBB.right >= this.gameBatRightBB.left && ballBB.top >= this.gameBatRightBB.top && ballBB.bottom <= this.gameBatRightBB.bottom) {
            this.gameBallSpeedX = -this.gameBallSpeedX;
            this.chanceChangeBallYSpeed();
            this.gameBallSpeedIncrement += 0.05;
        }
        
    }

    chanceChangeBallYSpeed = () => {
        if (Math.floor(Math.random() * 6) === 1 && this.gameBallSpeedY * 1 > 0.2) {
            this.gameBallSpeedY -= 0.2;
        }
        if (Math.floor(Math.random() * 6) === 1 && this.gameBallSpeedY * 1 < 1.6) {
            this.gameBallSpeedY += 0.2;
        }
    }

    // Controls
    pressedKeys = {};
    controlHandleInterval;

    keyDownHandler = (e) => {
        if (this.pressedKeys[e.code]) return;
        this.pressedKeys[e.code] = true;
        if (Object.keys(this.pressedKeys).length === 1) {
            this.controlHandleInterval = setInterval(() => {
                if (this.pressedKeys["KeyW"]) this.moveLeftGameBat("up");
                else if (this.pressedKeys["KeyS"]) this.moveLeftGameBat("down");

                if (this.pressedKeys["ArrowUp"]) this.moveRightGameBat("up");
                else if (this.pressedKeys["ArrowDown"]) this.moveRightGameBat("down");
            }, 10);
        }
    }

    keyUpHandler = (e) => {
        delete this.pressedKeys[e.code];
        if (Object.keys(this.pressedKeys).length === 0) {
            clearInterval(this.controlHandleInterval);
        }
    }

}