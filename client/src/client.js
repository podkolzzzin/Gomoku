/**
 * Created by podko_000 on 17.01.15.
 */

var client = {
    socket: null,
    id: -1,

    callback: null,
    on_game_added_callback: null,
    get_games_callback: null,
    on_put_callback: null,
    on_join_callback: null,

    create: function (ip, callback) {
        this.socket = io('http://' + ip + ':8080');
        this.socket.on("initial", this.onInitial);
        this.socket.on("getGames", this.onGetGames);
        this.socket.on("gameAdded", this.onGameAdded);
        this.socket.on("put", this.onPut);
        this.callback = callback;
    },

    onInitial: function (data) {
        client.id = data.id;

        if (client.callback) {
            client.callback(client.id);
        }
    },

    onGetGames: function (data) {
        if (client.get_games_callback) {
            client.get_games_callback(data);
        }
    },

    addOnJoinGameCallback: function (callback) {
        this.on_join_callback = callback;
    },

    onJoinGame: function (data) {
        if (client.on_join_callback) {
            client.on_join_callback(data);
        }
    },

    addOnPutCallback: function (callback) {
        this.on_put_callback = callback;
    },

    onPut: function (data) {
        if (client.on_put_callback) {
            client.on_put_callback(data);
        }
    },

    getGames: function (callback) {
        this.socket.emit("getGames", {id: this.id});
        this.get_games_callback = callback;
    },

    addGame: function (callback) {
        this.socket.emit("addGame", {id: this.id});
        this.socket.on("joinGame", this.onJoinGame);
        this.on_game_added_callback = callback;
    },

    onGameAdded: function (data) {
        client.gameId = data.gameId;
        if (client.on_game_added_callback) {
            client.on_game_added_callback();
        }
    },

    put: function (x, y, type) {
        this.socket.emit("put", {
            id: this.id,
            gameId: this.gameId,
            x: x,
            y: y,
            type: type,
            owner: client.id
        });
    },

    joinGame: function (gameId) {
        this.gameId = gameId;
        this.socket.emit("joinGame", {
            id: this.id,
            gameId: gameId
        });
    }
};