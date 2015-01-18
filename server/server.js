/**
 * Created by podko_000 on 17.01.15.
 */
var server = {

    io: null,
    games: [],
    clients: [],

    bind: function (io) {

        this.io = io;
        io.on("connection", server.onConnection);
        console.log("server started");
    },

    onConnection: function (socket) {

        console.log("onConnection");
        server.clients.push(socket);
        socket.on("addGame", server.onAddGame);
        socket.on("joinGame", server.onJoinGame);
        socket.on("getGames", server.onGetGames);
        socket.emit("initial", {"id": server.clients.length - 1});
        socket.emit("getGames", server.lean(server.games));

    },

    onGetGames: function (data) {

        console.log("onGetGames");
        console.log(data.id);
        server.clients[data.id].emit("getGames", server.lean(server.games));
        console.log("data sent");
    },

    onAddGame: function (data) {

        console.log("onAddGame");
        data.host = server.clients[data.id];
        data.hostId = data.id;
        server.games.push(data);
    },

    onJoinGame: function (data) {

        if (this.games[data.gameId]) {
            var game = server.games[data.gameId];
            game.started = true;
            game.guest = server.clients[data.id];
            game.guest = data.id;
            game.host.emit("joinGame", data);
            game.host.on("put", server.onPut);
            game.guest.on("put", server.onPut);
        }
    },

    onPut: function (data) {

        if (server.games[data.gameId]) {
            var game = server.games[data.gameId];
            var s = game.hostId == data.id ? game.guest : game.host;
            s.emit("put", data);
        }
    },

    lean: function (gameData) {

        var r = [];
        for (var i = 0; i < gameData.length; i++) {
            var g = gameData[i];
            var obj = {};
            for (var key in g) {
                if (key != 'host' && key != 'guest')
                    obj[key] = g[key];
            }
            r.push(obj);
        }
        return r;
    }
};

module.exports = server;