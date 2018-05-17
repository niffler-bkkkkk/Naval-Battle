function damagedOrSunk(board, attacks) {
    var sunk = 0,
        damaged = 0,
        notTouched = 0,
        points = 0;
    var boat = [0, 0, 0],
        attackedBoats = [0, 0, 0];
    var boardRow = board.length;
    var boardColumn = board[0].length;
    var attacksLength = attacks.length;
    for (let i = attacksLength - 1; i >= 0; i--) {
        var currentBoat = board[boardRow - attacks[i][1]][attacks[i][0] - 1];
        for (let j = 0; j < 3; j++) {
            if (currentBoat === j + 1) {
                attackedBoats[j]++;
            }
        }
    }
    for (let row = 0; row < boardRow; row++) {
        for (let column = 0; column < boardColumn; column++) {
            for (let k = 0; k < 3; k++) {
                if (board[row][column] === k + 1) {
                    boat[k]++;
                }
            }
        }
    }
    for (let k = 0; k < 3; k++) {
        if (attackedBoats[k] && attackedBoats[k] === boat[k]) {
            points++;
            sunk++;
        } else if (attackedBoats[k] && attackedBoats[k] < boat[k]) {
            points += 0.5;
            damaged++;
        } else if (!attackedBoats[k] && boat[k]) {
            points--;
            notTouched++;
        }
    }
    return {
        'sunk': sunk,
        'damaged': damaged,
        'notTouched': notTouched,
        'points': points
    }
}

