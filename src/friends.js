import React from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { receiveFriendsWannabes, unfriend, acceptFriendship } from './actions';

// 1. server
//    - 3 server routes
//      - GET /friends-wannabes
//        - should query the db to get a list of all of our friends and wanna friends, and then res.json that list back to client
//        - the query you need: https://gist.github.com/friedmandavid/9a7e8b1090eb0b28017a090d9a3c642c
//      - POST /delete (whatever route you used in part 6)...
//        - DELETE friendship from friendships table
//      - POST /update (whatever route you used in part 6)...
//        - UPDATE accepted column from false to true
// 2. client
//    - friends.js
//      - when component mounts — dispatch. Pass to dispatch your action creator (function) that's responsible for making the GET axios request to get list of friends and wannabes
//      - mapStateToProps function that splits the list we get from server up into 2 lists — a list for wannabes and a list for friends
//        - filter method might come in handy here...
//      - render the list of wannabes
//        - for each wannabe it renders add a button with a click handler that dispatches the action to accept the friend request
//        - hint: https://github.com/spicedacademy/wintergreen-socialnetwork/blob/matijevic-hotornot/src/hot.js
//      - render the list of friends
//        - for each friend it renders add a button with a click handler that dispatches the action to end the friendship
//    - actions.js
//      - 3 action creator functions:
//        - receiveFriendsWannabes — will make the axios GET request to the server to retrieve the list of friends and wannabes
//          - once we have that list, we want to return an object with type property and a friendsWannabes property whose value is the array we just got back from server
//            - if you get back an empty array, check to make sure you have friends / people have sent YOU a request….
//        -  unfriend— makes an axios POST request to server to trigger a DELETE, return an object that again has type property AND the id of use whose friendship we just ended
//          - use same POST route from part 6...
//        - acceptFriend() —  makes an axios POST request to the server to trigger an UPDATE, then return an object that again has type property AND the id of the user who's friendship was just accepted
//          - use the same POST route from part 6...
//    - reducer.js
//      - 'RECEIVE_FRIENDS_WANNABES' — return a new global state object that has property friendsWannabes, and whose value is the array we got back from the server.
//        - this can be done using the Object.assign() or … strategies — whatever you prefer!
//      - 'ACCEPT_FRIEND' — return a new object that has all of the properties of the current state object but the array of friends and wannabes is replaced with a new array that has all of the objects that were in the old array EXCEPT one of the friends / wannabes in the array will be replaced with a new object that has all of the properties of the old one EXCEPT it's accepted property will have a value of true
//        - hint: map
//      - 'UNFRIEND' — return a new state object that has all the properties of the current state object EXCEPT the array of friendsWannabes is replaced with a new array that has all of the objects that were in the old list of friends and wannabes EXCEPT one user (the person whose friendship was just ended) is filtered out
//        - hint: filter

class Friends extends React.Component {
    constructor() {
        super()
    }

    componentDidMount() {
        this.props.dispatch(receiveFriendsWannabes());
        // console.log("dispatch: ", this.props.dispatch( receiveFriendsWannabes() ) );

        // DISPATCH
    }

    render() {
        // console.log("this.props friends.js", this.props);
        var friendList = ""
        var wannabes = ""

            if (this.props.friends == null) {

            } else {
                // console.log("this.props.friends", this.props.friends);
                var friendList = this.props.friends.map(friend => (
                    <div>

                        <div>
                            <div id="friend-request" key={friend.id}>
                                <Link id="try" to={`/user/${friend.id}`}>
                                    <h2>{friend.first}  {friend.last}</h2>
                                </Link>
                                <img src={friend.picurl} />

                            <div id="button">
                                <button onClick={() => this.props.dispatch(unfriend(friend.id))}>Unfriend</button>
                            </div>

                            </div>
                        </div>

                    </div>
                ));
            }

            if (this.props.wannabes == null) {

            } else {
                // console.log("this.props.wannabes", this.props.wannabes);
                var wannabes = this.props.wannabes.map(wannabe => (

                    <div>
                        <div id="friend-request" key={wannabe.id}>

                            <Link id="try" to={`/user/${wannabe.id}`}>
                                <h2>{wannabe.first}  {wannabe.last}</h2>
                            </Link>
                            <img src={wannabe.picurl} />

                            <div>
                                <button onClick={() => this.props.dispatch(acceptFriendship(wannabe.id))}>Accept Request</button>
                            </div>
                        </div>
                    </div>
                ))
            }
                // console.log("this.state Friends.js", this.state);
                return (

                    <div id="try">
                        <div id="friends-container">

                            <div >

                                <div>
                                    <h1>Friends Request : </h1>
                                    <div>{wannabes}</div>
                                </div>

                                <hr />

                                <div>
                                    <h1>Friends : </h1>
                                    <div>{friendList}</div>
                                </div>

                            </div>

                        </div>
                    </div>
                )
            }
}





const mapStateToProps = state => {
    return {
        friends: state.friends && state.friends.filter(friends => friends.accepted == true),
        wannabes: state.friends && state.friends.filter(friends => friends.accepted == false),
    };
};

export default connect(mapStateToProps)(Friends)
