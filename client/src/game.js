/**
 * Created by chernikovalexey on 1/17/15.
 */

var game = {};

game.config = {
    FWIDTH: 19,
    FHEIGHT: 19
};

game.TURN_CROSS = 'cross';
game.TURN_NOUGHT = 'nought';
game.my_turn = game.TURN_CROSS;
game.current_turn = game.TURN_CROSS;

var getCellSelector = function (cx, cy, add_class) {
    return (add_class ? '.' : '') + 'cell-' + cx + '-' + cy;
};
var getOppositeTurn = function (turn) {
    return 0x3 - turn;
};

game.initField = function () {
    for (var h = 1; h <= this.config.FHEIGHT; ++h) {
        for (var w = 1; w <= this.config.FWIDTH; ++w) {
            var cell_div = $('<div>')
                .addClass('cell')
                .addClass(getCellSelector(w, h, false))
                .data('cx', w)
                .data('cy', h)
                .css('top', -h * 3);
            $('.game-field').append(cell_div);
        }
    }

    $('.cell').on('click', game.putGo);
};

game.putGo = function (event) {
    var cx = +$(this).data('cx');
    var cy = +$(this).data('cy');
    var cell = $(getCellSelector(cx, cy, true));

    if (!cell.hasClass('engaged')) {
        cell
            .addClass('engaged')
            .addClass(game.my_turn)
            .data('turn', game.my_turn)
            .data('owner', main.userData.id);
    }

    game.checkVictory();
};

var _hasVerticalVictory = function (is_vertical) {
    var max_line = 0;
    var prev_cell_turn = null, current_cell_turn = null;

    for (var y = 1; y <= game.config.FHEIGHT; ++y) {
        for (var x = 1; x <= game.config.FWIDTH; ++x) {
            var cell_div = is_vertical
                ? $(getCellSelector(y, x, true))
                : $(getCellSelector(x, y, true));

            if (cell_div.hasClass('engaged')) {
                prev_cell_turn = current_cell_turn;
                current_cell_turn = cell_div.data('turn');
            }

            if (cell_div.hasClass('engaged') && (prev_cell_turn === null || current_cell_turn === prev_cell_turn) && max_line < 5) {
                ++max_line;
            } else if (max_line === 5) {
                return current_cell_turn;
            } else {
                prev_cell_turn = null;
                current_cell_turn = null;
                max_line = 0;
            }
        }
    }

    return null;
};

var _hasDiagonalVictory = function (top, inverted) {
    var size = Math.min(game.config.FWIDTH, game.config.FHEIGHT);
    var max_diagonal = 0;
    var prev_cell_turn = null, current_cell_turn = null;

    for (var offset = 0; offset <= size - 1; ++offset) {
        for (var i = 1 + offset; i <= size; ++i) {
            var cell_div = top
                ? (!inverted ? $(getCellSelector(i, i - offset, true)) : $(getCellSelector(i - offset, size - i + 1, true)))
                : (!inverted ? $(getCellSelector(i - offset, i, true)) : $(getCellSelector(i, size - i + 1 + offset, true)));

            if (cell_div.hasClass('engaged')) {
                prev_cell_turn = current_cell_turn;
                current_cell_turn = cell_div.data('turn');
            }

            if (cell_div.hasClass('engaged') && (prev_cell_turn === null || current_cell_turn === prev_cell_turn) && max_diagonal < 5) {
                ++max_diagonal;
            } else if (max_diagonal === 5) {
                return current_cell_turn;
            } else {
                prev_cell_turn = null;
                current_cell_turn = null;
                max_diagonal = 0;
            }
        }
    }

    return null;
};

game.checkVictory = function () {
    var vertical = _hasVerticalVictory(true);
    var horizontal = _hasVerticalVictory(false);
    var ltr = _hasDiagonalVictory(true, false) || _hasDiagonalVictory(false, false);
    var rtl = _hasDiagonalVictory(true, true) || _hasDiagonalVictory(false, true);
    var winner = vertical || horizontal || ltr || rtl;

    if (winner === game.my_turn) {
        console.log('you win!');
    } else if (winner === getOppositeTurn(game.my_turn)) {
        console.log('you lose!');
    }
};

$(function () {
    game.initField();
});