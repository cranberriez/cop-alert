$(function(){
    var socket = io.connect()

    // Switch mode
    $(".mainOption").on("click", function(){
        $('.mainOption').removeClass('active')
        $(this).addClass('active')
        $('form.active').removeClass('active')
        $($(this).attr('href')).addClass('active')
    })

    //  //  // Form Functions
    // Name Related
    function nameBad(text) {
        $('#createGForm p').removeClass('good')
        $('#createGForm button').removeClass('good')
        $('#createGForm p').addClass('bad')
        $('#createGForm button').addClass('bad')
        $('#createGForm p').text(text)
    }

    function checkName() {
        let name = $('#groupName').val()
        if (name.trim().length == 0) {
            $('#createGForm p').removeClass('bad good')
            $('#createGForm button').removeClass('bad good')
            $("#createGForm p").text('')
            return false
        }
        else if (name.length >= 16) {
            nameBad('Max letters 16')
            return false
        }
        else if (name.length == 0) {
            $('#createGForm p').removeClass('bad good')
            $('#createGForm button').removeClass('bad good')
            $("#createGForm p").text('')
            return false
        }
        else {
            $('#joinGForm p').removeClass('bad')
            $('#createGForm button').addClass('good')
            $("#createGForm p").text('')
            return true
        }
    }

    // Code Related
    function codeBad(text) {
        $('#joinGForm button').removeClass('good')
        $('#joinGForm p').addClass('bad')
        $('#joinGForm button').addClass('bad')
        $('#joinGForm p').text(text)
    }

    function checkCode() {
        let code = $('#groupCode').val()
        if (code.trim().length == 0) {
            $('#joinGForm p').removeClass('bad good')
            $("#joinGForm button").removeClass('bad good')
            $("#joinGForm p").text('')
            return false
        }
        else if (code.length != 7) {
            codeBad('Code Invalid')
            return false
        }
        else if (code.length == 0) {
            $('#joinGForm p').removeClass('bad good')
            $("#joinGForm button").removeClass('bad good')
            $("#joinGForm p").text('')
            return false
        }
        else {
            $('#joinGForm p').removeClass('bad')
            $('#joinGForm button').addClass('good')
            $("#joinGForm p").text('')
            return true
        }
    }

    // Create Form
    $('#createGForm').submit(function(e) {
        e.preventDefault()
        if (checkName()) {
            let name = $('#groupName').val()
            console.log('Creating room...')
            socket.emit('create', name)
        }
    })
    
    $('#createGForm').keyup(function() {
        checkName()
    })
    
    // Join Form
    $('#joinGForm').submit(function(e) {
        e.preventDefault()
        if (checkCode()) {
            let code = $('#groupCode').val()
            console.log('Joining room...')
            socket.emit('join', code)
        }
    })
    
    $('#joinGForm').keyup(function() {
        checkCode()
    })

    // 
    $('#alert').on('click', function() {
        startAlert()
        socket.emit('alert')
    })

    $('#stopAlert').on('click', function() {
        stopAlert()
        socket.emit('stopAlert')
    })

    function startAlert() {
        $('#alert').addClass('active')
    }

    function stopAlert() {
        $('#alert').removeClass('active')
    }

    // Sockets
    socket.on('error', function(message) {
        alert(message)
    })

    socket.on('roomInfo', function(code, name) {
        console.log(code + " " + name)
        $('.joincreate-cont').hide()
        $('.room').removeClass('hidden')
        $('#roomName').text(name)
        $('#roomCode').text(code)
    })

    socket.on('alert', function() {
        startAlert()
    }) 

    socket.on('stopAlert', function() {
        stopAlert()
    })
})
