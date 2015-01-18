/**
 * Created by chernikovalexey on 1/17/15.
 */

var main = {};

main.userData = {
    id: 402,
    is_server: false
};

main.fadeIn = function (selector) {
    var called = false;
    var callback = function () {
        if (!called) {
            called = true;
            $('.' + selector).fadeIn(125);
        }
    };
    $('.layout').each(function () {
        if ($(this).is(":visible")) {
            $(this).fadeOut(125, callback);
        }
    });
    if (!called) {
        callback();
    }
};

main.initGames = function () {
    client.getGames(function (games) {
        console.log('got games')

        for (var i = 0, len = games.length; i < len; ++i) {
            var game = games[i];
            var game_div = $('<div>')
                .addClass('game')
                .addClass('game-' + game.gameId)
                .data('id', game.gameId)
                .data('creator', game.hostId);

            $('.games').append(game_div);
        }

        $('.game').on('click', main.joinGame);
    });
};

main.joinGame = function (event) {
    var id = +$(this).data('id');

    client.joinGame(id);

    game.my_turn = game.TURN_NOUGHT;

    game.initField();
};

main.createGame = function (event) {
    main.is_server = true;

    client.addGame(function () {
    });

    client.addOnJoinGameCallback(function (data) {
        console.log('another player joined', data);
        game.initField();
    });
};

$(function () {
    $.getScript("src/platform_vk.js", function () {
        client.create("twopeoplesoftware.com", function () {
            main.fadeIn('menu-layout');
            main.initGames();
        });

        $('.create-game').on('click', main.createGame);

        client.addOnPutCallback(function (data) {
            game.putGo(data.x, data.y, data.type, data.owner);
        });

        client.addOnPlayerLeftCallback(function () {
            console.log('leeeft!');
        });
    });
});