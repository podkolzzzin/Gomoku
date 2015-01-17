/**
 * Created by podko_000 on 17.01.15.
 */

var client = {

    socket: null,
    id: -1,

    create: function (ip) {
        this.socket = io('http://'+ip+':8080');
        this.socket.on("initial", this.onInitial);
        this.socket.on("getGames", this.onGetGames);
    },

    onInitial: function (data) {

        client.id = data.id;
        console.log(data);
    },

    onGetGames: function (data) {

        console.log(data);
    },

    onJoinGame: function (data) {

        console.log(data);
    },

    onPut: function (data) {

        console.log(data);
    },

    getGames: function(data) {

        this.socket.emit("getGames", {id: this.id});
    },

    addGame: function () {

        this.socket.emit("addGame", {id: this.id});
    },

    put: function(x,y, type) {

        socket.emit("put", {
            id: this.id,
            x: x,
            y: y,
            type: type
        });
    },

    joinGame: function(gameId) {

        socket.emit("joinGame", {
            id: this.id,
            gameId: gameId
        });
    }
};