import axios from './axios';
import {getSocket} from './socket'
// all the axios request will go here
// all action creators here
// so... every function here MUST return an object with a type property!


export async function receiveFriendsWannabes() {
    const { data } = await axios.get('/friends_wannabes');
    // console.log("data.actions: ", data);
    return {
        type: 'All_FRIENDS',
        friends: data
    };
}
    // axios GET request to get friends and wannabes!
    // ONCE WE GET RESP FROM SERVER... return an object that contains type AND list we just got back from server!
    // make sure you have friends or pending friends WHO HAVE SENT YOU A REQUEST...


    export function unfriend(otherUserID){
        return axios.post('/cancelfriendship/'+ otherUserID).then(() => {
            return {
                type: 'UNFRIEND',
                otherUserID
                };
            });
        }


    export function acceptFriendship(otherUserID){
    return axios.post('/acceptfriendship/'+ otherUserID).then(() => {
        return {
            type: 'ACCEPT_FRIENDSHIP',
            otherUserID
        };
    });
}


    export async function onlineUsers (data){
        console.log("onlineUsers data: ", data);
        return {
            type: 'ONLINE_USERS',
            users: data
        }
    }

    export async function userJoined (data) {
        console.log("userJoined data: ", data);
        return {
            type: 'USER_JOINED',
            joinedUser: data
        }
    }


    export async function userLeft(data) {
        return {
            type: 'USER_LEFT',
            userLeft: data,
        }
    }

    export async function newChatMessage(data) {
        // console.log("actions newChatMessage data: ", data);
        return {
            type: 'CHAT_MESSAGE',
            newMessage: data

        }
    }
