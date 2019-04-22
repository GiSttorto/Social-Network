import React from 'react'
import axios from './axios'

export default class FriendButton extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.handleClick = this.handleClick.bind(this);
    }


    componentDidMount() {
        // console.log("TESTE");
        // ajax request to server to figure out INITIAL status of friendship
        // console.log("this.props: ", this.props.otherUserId);
        var otherUserId = this.props.otherUserId
         // console.log("otherUserId_1: ", otherUserId);
        axios.get('/get-initial-status/' + otherUserId)
            .then(response => {
                // console.log("response: ", response);
                // response is reponse we got from db
                // IF we did get data from db -- we need to read the response, and based off of it, render a button
                // that either says Cancel Friend Request, Accept Friend Request, or Ende Friendship
                // if we got no data from the db -- then the 2 users don't have a friendship and the button should
                // say Send Friend request
                if (response.data.rows[0]) {
                    if (response.data.rows[0].accepted == true) {
                        this.setState({
                            buttonText: "Unfriend"
                        });
                    } else if ( response.data.rows[0].receiver == otherUserId ){
                        this.setState({
                            buttonText: "Accept Friend Request"
                        });
                    } else if (response.data.rows[0].accepted == false) {
                        this.setState({
                            buttonText: "Cancel Friend Request"
                        });
                    }

                } else {
                   this.setState({
                       buttonText: 'Send Friend Request'
                   });

                    }
                }).catch (err => {
                    console.log(" error componentDidMount:  ", err);
                })
            }


    handleClick() {
        // handleClick has 2 jobs:
        // (1) tell server to run INSERT, UPDATE, or DELETE query (based off of what buttonText was when it was
        // clicked)
        //(2) change buttonText in state so that the actual text of the button changes after we've receive
        // a response
        // IF the button said Send Friend Request when the button was clicked -- POST request to server,
        // and server should run an INSERT query into friendship

        // IF the button said either Cancel Friendship OR End Friendship -- POST request to server, and
        //server should run a DELETE query

        // IF the button said Accept Friend Request run an UPDATE query to update the 'accepted' column
        //from false to true
        var otherUserId = this.props.otherUserId
         // console.log("otherUserId_2: ", otherUserId);
         if (this.state.buttonText == "Send Friend Request") {
            axios.post("/friendrequest/" + otherUserId)
                .then(() => {
                    this.setState({
                        buttonText: "Cancel Friend Request"
                    });
                }).catch(err => {
                    // console.log("error /friendrequest.js/: ", err);
                })
            } else if (this.state.buttonText == "Accept Friend Request") {
                axios.post("/acceptfriendship/" + otherUserId)
                .then(() => {
                    this.setState({
                        buttonText: "Unfriend"
                        });
                    }).catch(err => {
                        console.log("error /acceptfriendship.js/: ", err);
                    })

            } else if (this.state.buttonText == "Cancel Friend Request" || this.state.buttonText == "Unfriend") {
                axios.post("/cancelfriendship/" + otherUserId)
                .then(() => {
                    this.setState({
                        buttonText: "Send Friend Request"
                    });
                }).catch(err => {
                    console.log("error /cancelfriendship.js/: ", err);
                })
            }


        }

        // console.log("clicking!!!");
        // this.setState({
        //     buttonText: 'Whatever'
        // });






    render() {
        // console.log("this.state: ", this.state);
        return (
            <div>
                <button id="friendButton" onClick={this.handleClick}>
                    {this.state.buttonText}
                </button>
            </div>
        )
    }
}
