'use strict'

class UserHandler{
    constructor(){
        this._users = [];
    }

    static encodeUserName(username){
        
        let name = username.toUpperCase();
        let ret = '';
        for(let i=0; i < name.length; i++ ){
            if(name.charCodeAt(i) + 10 > 90)
                ret += String.fromCharCode(((name.charCodeAt(i) + 10)  % 90) + 48);
            else
                ret += String.fromCharCode(name.charCodeAt(i) + 10);
        }
        return ret;
    }
    checkIfAuthExists(auth){
        let ret = false;
        this._users.forEach((user) => {
            if(user.token === auth)
                ret = true;
            });
        return ret;
    }

    checkIfUserExists(usrName){
        let ret = false;
        this._users.forEach((user) => { 
            if(usrName === user.username)
               ret = true;    
            });
        return ret;
    }

    searchUserByAuth(auth){
        let usr = '';
        this._users.forEach((user) => {
            if(user.token === auth)
                usr = user.username;
        });
        return usr;
    }

    addUser(user){
        if(!user.name){
            this._users.push({
                username : user.username,
                name : '',
                token : UserHandler.encodeUserName(user.username),
                messages : []
            });
        }else{
            this._users.push({
                username : user.username,
                name : user.name,
                token : UserHandler.encodeUserName(user.username),
                messages : []
            });
        }
        console.log(this._users);
    }

    addMessage(sender, target,msg){
        this._users.forEach((user) => { 
            if(target === user.username)
                user.messages.push(this.createMessage(sender, target, msg));
            if(sender === user.username )
                user.messages.push(this.createMessage(sender, target, msg));
        });
    }

    createMessage(sender, target, msg){
        let senderName = '';
        let targetName = '';
        this._users.forEach((user) => {
            if(sender === user.username){
                if(user.name === '')
                    senderName = user.username;
                else
                    senderName = user.name;
            }
        });

        this._users.forEach((user) => {
            if(target === user.username){
                if(user.name === '')
                    targetName = user.username;
                else
                    targetName = user.name;
            }
        });

        return { from : senderName, to : targetName, message: msg };
    }

    getUserMessages(usrName){
        let retMsgs = [];
        this._users.forEach((user) => {
            if(user.username === usrName){
                retMsgs =  user.messages;
            }
        });
        return retMsgs;
    }

    listUsers(){
        let retUsers = [];
        this._users.forEach((user) => {
            retUsers.push({username: user.username, name: user.name  });
        });

        return retUsers;
    }


}

module.exports = UserHandler;