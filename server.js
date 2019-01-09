const express = require("express")
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

// Static Files
app.use(express.static('./static'))

// Routing
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
})

// Functions
function validMessage(msg) {
    if (msg.length < 1 || msg.length > 128) {
        return false
    }
    else {
        return true
    }
}

function genRoomCode() {
    var code = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 7; i++){
        code += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return code;
}

function checkName(name) {
    if (name.trim().length == 0) {
        return false
    }
    else if (name.length >= 16) {
        return false
    }
    else {
        return true
    }
}

// Socket IO
var rooms = {}

io.on('connection', function(socket) {
    function sendError(message) {
        io.to(socket.id).emit('error', message)
    }

    function purgeRooms() {
        for (const room in io.sockets.adapter.rooms) {
            let adapRooms = io.sockets.adapter.rooms
            console.log("Room: " + room + ", Clients: " + adapRooms[room].length)
            if (adapRooms[room].length <= 0) {
                console.log('Room ' + room + ' deleted')
                io.sockets.adapter.rooms.delete(room)
                rooms.delete(room)
            }
        }

    }

    socket.on('create', function(name) {
        if (checkName(name)) {
            console.log('\nRoom is being created...')
            let code = genRoomCode()
            while (code in rooms) {
                code = genRoomCode()
            }
            console.log('Room ' + name + ' created with code ' + code)
            rooms[code] = name
            io.to(socket.id).emit('roomInfo', code, rooms[code])
            socket.leaveAll()
            socket.join(code);
            purgeRooms()
        }
        else {
            console.log('\nUser attempted to create a room with an invalid name')
            sendError("Invalid room name")
        }
    })

    socket.on('join', function(code) {
        if (code in rooms) {
            console.log('\nUser joined room ' + rooms[code] + " code:" + code)
            io.to(socket.id).emit('roomInfo', code, rooms[code])
            socket.leaveAll()
            socket.join(code)
            purgeRooms()
        }
        else {
            console.log('\nUser attempted to join non-existent room')
            sendError("Room does not exist")
        }
    })

    socket.on('alert', function() {
        io.emit('alert')
        console.log('Alert!!')
    })

    socket.on('stopAlert', function() {
        io.emit('stopAlert')
        console.log('Alert Canceled')
    })
})

// Listen on port 8080
port = 8080
http.listen(port, function() {
    console.log('listening on port ' + port)
})