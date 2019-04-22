export default function reducer (state = {}, action) {
    // return a new state object that contains a property
    // called friendsWannabes whose value is the array we got back from
    if (action.type == 'All_FRIENDS') {
        // console.log("action.friends: ", action.friends);
        state = Object.assign({}, state, {
            friends: action.friends
        });
    }

    if (action.type == 'UNFRIEND') {
     state = Object.assign({}, state, {
         friends: state.friends && state.friends.filter(
             friends => action.otherUserID != friends.id
         )});
    }

    if (action.type == 'ACCEPT_FRIENDSHIP') {
        state = Object.assign({}, state, {
            friends: state.friends.map(friends => {
                if (action.otherUserID == friends.id) {
                    return Object.assign({}, friends, {
                        accepted: true
                    });
                } else {
                    return Object.assign({}, friends);
                }
            })
        });
    }

    if (action.type == 'ONLINE_USERS'){
     // console.log('action.users: ', action.users)
         state = Object.assign({}, state, {
             users: action.users
         })

     }

     if (action.type == 'USER_JOINED') {
         console.log('action.joinedUser: ', action)
         console.log('state.joinedUser: ', state)
         state = Object.assing({}, state, {
             users: state.users.concat(action.joinedUser)
         })
         // console.log("users in userJoined: ", users);
     }

     if (action.type == 'USER_LEFT') {
       // console.log('action.userLeft: ', action);
       // console.log('state.userLeft: ', state)
       state = Object.assign({}, state, {
           users: state.users.filter(users => users.id != action.userLeft)
       })
       // console.log("users in userLeft: ", users);
    }

    if (action.type == 'CHAT_MESSAGE'){
     // console.log('reducer action.newMessage: ', action)
         state = Object.assign({}, state, {
             newMessage: action.newMessage
         })

     }


    // console.log("state in Reducer: ", state);
    return state;
}
