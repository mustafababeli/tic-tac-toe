
// Board owner/handler

function Board () {
let playField = ["", "", "", "", "" , "" , "", "" , ""];

    function get() { 
        return playField.slice();
    }

    function write(index, mark) {
        if (playField[index] !== "") return false;
        playField[index] = mark;
        return true;
    }

    function reset() {
        playField = ["", "", "", "", "" , "" , "", "" , ""];
    }

    return{ get, write, reset }
}

// Computer choice Function

function Computer (mark) {

    function computerChoice(boardStateForComputer) {

        let validComputerMoves = [];

        for( let i = 0 ; i < boardStateForComputer.length ; i++ ) {
            if (boardStateForComputer[i] === "") validComputerMoves.push(i);
        }

        if (validComputerMoves.length === 0) return null;

        let index = validComputerMoves[Math.floor(Math.random() * validComputerMoves.length)];

        return index;
    }
    return { mark, computerChoice }
}

// Win checker

function isGameWin (boardState) {
    
    if (boardState[0] === boardState[1] && boardState[1] === boardState[2] && boardState[0] !== "") return { winner: boardState[0], line:[0, 1, 2]};
    if (boardState[3] === boardState[4] && boardState[4] === boardState[5] && boardState[3] !== "") return { winner: boardState[3], line:[3, 4, 5]};
    if (boardState[6] === boardState[7] && boardState[7] === boardState[8] && boardState[6] !== "") return { winner: boardState[6], line:[6, 7, 8]};
    if (boardState[0] === boardState[3] && boardState[3] === boardState[6] && boardState[0] !== "") return { winner: boardState[0], line:[0, 3, 6]};
    if (boardState[1] === boardState[4] && boardState[4] === boardState[7] && boardState[1] !== "") return { winner: boardState[1], line:[1, 4, 7]};
    if (boardState[2] === boardState[5] && boardState[5] === boardState[8] && boardState[2] !== "") return { winner: boardState[2], line:[2, 5, 8]};
    if (boardState[0] === boardState[4] && boardState[4] === boardState[8] && boardState[0] !== "") return { winner: boardState[0], line:[0, 4, 8]};
    if (boardState[2] === boardState[4] && boardState[4] === boardState[6] && boardState[2] !== "") return { winner: boardState[2], line:[2, 4, 6]};
        return null;
}

// Tie checkerr

function isBoardTie(boardState) {
    return !boardState.includes("");
}

// Factory functions instances & glob variubles

const board = Board();
const computer = Computer("O")
let gameStatus = "playing"
let computerTimer = null;
let winningLine = null;
let isComputerThinking = false;

// HTML elemens link & game handler

const areas = document.getElementsByClassName("area");

for ( let i = 0 ; i < areas.length ; i++) {
    areas[i].addEventListener("click", (e) => 
    {
        //Human move by clicck
        const humanMove = Number(e.target.dataset.index);
        let state = board.get();
    
        if (gameStatus !== "playing") return;
        if (isComputerThinking) return;
        if (state[humanMove] !== "") return;
        
        board.write(humanMove, "X");
    
        render();
    
        //win check
    
        let boardState = board.get();
        let result = isGameWin(boardState);
        if (result !== null) {
          gameStatus = result.winner;
          winningLine = result.line;
          render();
          return;
        }

    
        // tie check
    
        if (isBoardTie(boardState)) return gameStatus = "Tie";
    
        //computer move wrapped in timer to add a less robotic sense وكذا :)
        
        isComputerThinking = true;
        computerTimer = setTimeout ( () => {

            if (gameStatus !== "playing") {
                isComputerThinking = false;
                 return;
            }

            const computerMove = computer.computerChoice(board.get());
        
            if (computerMove === null) {
                gameStatus = "Tie";
                isComputerThinking = false;
                return;
}           

            if (gameStatus !== "playing") {
                isComputerThinking = false;
                return;
            }
        
            board.write(computerMove, "O");
        
            render();
            
            //win check
        
            boardState = board.get();
            result = isGameWin(boardState);
            if (result !== null) {
                gameStatus = result.winner;
                winningLine = result.line;
                isComputerThinking = false;
                render();
                return;
            }

        
            // tie check
            
            if (isBoardTie(boardState)) {
                gameStatus = "Tie";
                isComputerThinking = false;
                return;
            }

            isComputerThinking = false;

        }, 1000);
    
    });
}


// Paint the screen from state

function render () {

    const state = board.get();
    for ( let i = 0 ; i < areas.length ; i ++) {
        areas[i].textContent = state[i];
        if (winningLine && winningLine.includes(i)) {
            areas[i].classList.add("win");
        }
        else {
            areas[i].classList.remove("win")
        }
    }
}

render();




const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", () => {
    board.reset();
    gameStatus = "playing";
    winningLine = null;
    if (computerTimer !== null) clearTimeout(computerTimer);
    computerTimer = null;
    isComputerThinking = false;

    render()
})


