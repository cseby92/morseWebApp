'use strict'
let myToken = '';
let myUserName ='';

$(() => {
    $('#register').click(()=> {
        $.post('http://localhost:3000/users',
            {
                username: $('#username').val(),
                name: $('#name').val()
            })
            .done(( data, textStatus, jqXHR ) => { 
                myToken = data.token;
                myUserName = $('#username').val();
                gnerateUi();
            })
            .fail(( jqXHR, textStatus, errorThrown )  =>{
                alert('Username already exists');
            });
    });

    let gnerateUi = function(){
        $(document.body).empty();
        $(document.body).append('<button id="refresh"> refresh </button>');
        $(document.body).append('<div id="leftside"> </div>');
        $(document.body).append('<div id="rightside"> </div>');
        

        $('#refresh').click(() => {
            $('#leftside').empty();
            $('#rightside').empty();
            generateLeft();
            generateRight();
        });

        generateLeft();
        generateRight();
        
    }

    let generateRight = () => {
        $.ajax({ 
            url : 'http://localhost:3000/users/' + myUserName + '/messages',
            type : 'get',
            headers : {
                'X-Auth' : myToken
            },
            dataType : 'json'

        }).done( (data, textStatus, jqXHR) => {
                let html = '';
                data.forEach((msg) => {
                    html += '<li> From: ' + msg.from  + ' To: ' + msg.to + ' Message: ' + msg.message + '</li>';
                });
                $('#rightside').append('<ul>' + html + '<lu>');
            }).
            fail((jqXHR, textStatus, errorThrown) => {
                alert('FAIL');
            });
    }

    let generateLeft = () => {
        $.get('http://localhost:3000/users')
            .always((data, textStatus, jqXHR) => {
                let html = '';
                data.forEach((user) => {
                    html += '<li>' + user.username +'</li>';
                });
                $('#leftside').append('<ul>' + html + '</ul>');
                $('#leftside').append('<label> Click on user to send him the text </label> <input value="" id="textbox" />');   
                $('li').click(function(){
                    sendMessage($(this).text(), $('#textbox').val());
                })
            });
    }

    let sendMessage = (to, msg) => { 
        $.ajax({ 
            url : 'http://localhost:3000/users/' + to + '/messages',
            type : 'post',
            data :{
                message : msg
            },
            headers : {
                'X-Auth' : myToken
            },
            dataType : 'json'

        }).done( (data, textStatus, jqXHR) => {
            gnerateUi();
            });
          fail((jqXHR, textStatus, errorThrown) => {
                    alert('FAIL');
            });

    };

});
