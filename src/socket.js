import * as io from 'socket.io-client';
import {onlineUsers, userJoined, userLeft, newChatMessage} from './actions'


let socket;

export function getSocket(store) {
    if (!socket) {
        socket = io.connect();

        socket.on('onlineUsers', data => {
            // console.log("data socket: ", data);
            store.dispatch(
                onlineUsers(data.onlineUsers)
            )
        });

        socket.on('userJoined', data => {
            // console.log("userJoined.data socket: ", data);
            store.dispatch(
                userJoined(data)
            )
        });

        socket.on('userLeft', data => {
            store.dispatch(
                userLeft(data)
            )
        });


        socket.on('newChatMessage', data => {
            store.dispatch(
                newChatMessage(data)
            )
        });
    }
    // console.log("socket: ", socket);
    return socket;
}
