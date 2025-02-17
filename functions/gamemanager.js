let game = null;

export function getGame() {
    return game;
}

export function setGame(newGame) {
    if(game) {
        throw new Error('Game already exists');
    }
    else
        game = newGame;
}

export function removeGame() {
    game = null;
}
