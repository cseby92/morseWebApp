'use strict'

const expect = require('chai').expect;
const UserHandler = require('./userhandler');

describe('UserHandler functions', () => {
    
    let handler;

    beforeEach(() =>{
        handler = new UserHandler();
    });

    it('encodeusername: should return the encoded username', () => {
        expect(UserHandler.encodeUserName('alice')).to.eql('KVSMO');
    });

    it('addUser: should add the user incresing the size of the users array', () =>{
        handler.addUser({username : 'bob', name: ''});
        expect(handler._users.length).to.eql(1);
        expect(handler._users[0]).to.eql({
                                            username : 'bob', 
                                            name: '',
                                            token : UserHandler.encodeUserName('bob'),
                                            messages : [] 
                                        });

        handler.addUser({username : 'bob2', name: 'Adam Sandler'});
        expect(handler._users[1]).to.eql({
                                            username : 'bob2', 
                                            name: 'Adam Sandler',
                                            token : UserHandler.encodeUserName('bob2'),
                                            messages : [] 
                                        });
    });
    
    it('checkIfUserExists: should return true if user exists', () => {
        handler.addUser({username : 'bob', name: ''});
        expect(handler.checkIfUserExists('bob')).to.eql(true);
        expect(handler.checkIfUserExists('bobbbbbbbbb')).to.eql(false);
    });

    it('checkIfAuthExists: should return true if user token exists', () => {
        handler.addUser({username : 'bob', name: ''});
        expect(handler.checkIfAuthExists(UserHandler.encodeUserName('bob'))).to.eql(true);
        expect(handler.checkIfAuthExists(UserHandler.encodeUserName('bobbbbbb'))).to.eql(false);
    });

    it('searchUserByAuth: should return the username by token', () => {
        handler.addUser({username : 'bob', name: ''});
        expect(handler.searchUserByAuth(UserHandler.encodeUserName('bob'))).to.eql('bob');
    });

    it('addMessage: should return the username ', () =>{
        handler.addUser({username : 'bob', name: ''});
        handler.addUser({username : 'john', name: 'John Doe'});

        handler.addMessage('bob', 'john', 'Hello John!');
        expect(handler._users[0].messages[0]).to.eql({from : 'bob', to: 'John Doe', message : 'Hello John!'});
        expect(handler._users[1].messages[0]).to.eql({from : 'bob', to: 'John Doe', message : 'Hello John!'});
    });

    it('getUserMessages: should return the sent and reviced messages for the given user',() => {
        handler.addUser({username : 'bob', name: ''});
        handler.addUser({username : 'john', name: 'John Doe'});
        handler.addMessage('bob', 'john', 'Hello John!');
        
        expect(handler.getUserMessages('bob').length).to.eql(1);
        expect(handler.getUserMessages('bob')).to.eql( [{from : 'bob', to: 'John Doe', message : 'Hello John!'}]);

        handler.addMessage('bob', 'john', 'What\'s up?');

        expect(handler.getUserMessages('bob').length).to.eql(2);
        expect(handler.getUserMessages('bob')).to.eql( [
                                                        {from : 'bob', to: 'John Doe', message : 'Hello John!'},
                                                        {from : 'bob', to: 'John Doe', message : 'What\'s up?'}
                                                        ]);


    });

    it('listUsers: should return the list of users', () =>{
        handler.addUser({username : 'bob', name: ''});
        handler.addUser({username : 'john', name: 'John Doe'});
        expect(handler.listUsers()).to.eql([{username : 'bob', name: ''},{username : 'john', name: 'John Doe'}]);
    });

    
});

