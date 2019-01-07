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

// Listen on port 8080
port = 8080
app.listen(port, () => console.log(`App listening on port ${port}!`))
