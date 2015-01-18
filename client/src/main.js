/**
 * Created by chernikovalexey on 1/17/15.
 */

var qs = (function (a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
        var p = a[i].split('=');
        if (p.length != 2) continue;
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));

var main = {};

main.userData = {
    id: 402
};

main.initGames = function () {
    client.getGames(function (games) {
        for (var i = 0, len = games.length; i < len; ++i) {
            var game = games[i];
            var game_div = $('<div>')
                .addClass('game')
                .addClass('game-' + game.id)
                .data('id', game.id)
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

main.createGame = function () {
    client.addGame(function () {
    });

    client.addOnJoinGameCallback(function (data) {
        console.log('another player joined', data);
        game.initField();
    });
};

$(function () {
    client.create("twopeoplesoftware.com", function () {
        main.initGames();
    });

    $('.create-game').on('click', main.createGame);

    client.addOnPutCallback(function (data) {
        game.putGo(data.x, data.y, data.type, data.owner);
    });

    $.getScript("src/platform_" + qs['platform'] + ".js", function () {
        console.log(qs['platform'] + ' loaded');
    });
});