/**
 * Created by podko_000 on 17.01.15.
 */
var server = {

    masterGameId: 0,
    masterClientId: 0,
    io: null,
    games: [],
    clients: [],

    bind: function (io) {

        this.io = io;
        io.on("connection", server.onConnection);
        io.on("disconnect", server.onDisconnect);
        console.log("server started");
    },

    getById: function (id, array) {

        console.log(array);
        for (var s in array) {
            console.log(s, id);
            if (array[s].id == id)
                return s;
        }
    },

    getSocket: function (id) {

        return server.getById(id, server.clients);
    },

    getGame: function (id) {

        return server.getById(id, server.games);
    },

    onConnection: function (socket) {

        console.log("onConnection");
        server.clients.push(socket);
        socket.id = server.masterClientId++;
        console.log({clientId: socket.id});
        socket.on("addGame", server.onAddGame);
        socket.on("joinGame", server.onJoinGame);
        socket.on("getGames", server.onGetGames);
        socket.on("finishGame", server.onGameFinished);
        socket.emit("initial", {"id": socket.id});
        socket.emit("getGames", server.lean(server.games));

    },

    onDisconnect: function () {

        var index = server.clients.indexOf(this);
        var socket = server.clients[index];
        console.log("onDisconnect", {id: socket.id});
        server.clients.splice(index, 1);
        server.games.forEach(function (i) {
            var game = server.games[i];
            if (game.host == socket.id || game.guest == socket.id) {
                var socket = game.hostId == socket.id ? game.guest : game.host;
                socket.emit("playerLeft", {});
                server.games.splice(i, 1);
            }
        });
    },

    onGameFinished: function (data) {

        console.log("onGameFinished", data);
        var game = server.getGame(data.gameId);
        server.splice(server.indexOf(game), 1);
    },

    onGetGames: function (data) {

        console.log("onGetGames", data);
        this.emit("getGames", server.lean(server.games));
        console.log("data sent");
    },

    onAddGame: function (data) {

        console.log("onAddGame", data);
        data.gameId = server.masterGameId++;
        data.host = server.getSocket(data.id);
        console.log("num of clients",server.clients.length);
        data.hostId = data.id;
        this.emit("gameAdded", {gameId: data.gameId});
        server.games.push(data);
    },

    onJoinGame: function (data) {

        console.log("onJoinGame", data);
        if (server.getGame(data.gameId)) {
            var game = server.getGame(data.gameId);
            game.started = true;
            game.guest = server.getSocket(data.id);
            game.guestId = data.id;
            game.host.emit("joinGame", data);
            game.host.on("put", server.onPut);
            game.guest.on("put", server.onPut);
        }
    },

    onPut: function (data) {

        console.log("onPut", data);
        if (server.getGame(data.gameId)) {
            var game = server.getGame(data.gameId);
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