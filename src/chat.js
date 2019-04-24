import React from 'react';
import {connect} from 'react-redux';
import {getSocket} from './socket';
import {newChatMessage} from './actions'

class Chat extends React.Component {
    constructor(props){
        super(props)
    }


    handleKeyDown(e) {
        if (e.which === 13) {
            //I wanna do something
            // console.log("handleKeyDown");
            getSocket().emit('newChatMessage', e.target.value)
            // console.log('e.target.value: ', e.target.value);
        }
    }

    componentDidUpdate() {
        // console.log("this.chatContainer: ", this.elem);
        this.chatContainer.scrollTop = '100px'
    }

    componentDidUpdate() {
        // console.log("hello");
    }


    render() {
        // console.log("this.props:  ", this.props);
        // console.log("this.state: ",  this.state);
        var messages = ""

        if (this.props.newMessage == null ) {
            console.log("nothing");
        } else {
            var messages =  this.props.newMessage.map (message => (
                <div id="each-chat-container">
                    <div id="row" key={message.id}>


                    <div>
                        <img src={message.picurl} />
                    </div>


                    <div id="message">
                        <h2><strong>{message.first} {message.last}:</strong></h2>
                        <p>{message.msg}</p>

                        <hr />
                        <p><u>Send at: {message.create_at}</u></p>
                    </div>


                    </div>
                </div>

            ))

        }

        // console.log("messages: ", messages);


        return (
            <div>
                <div id="chat">
                    <h1><u>CHAT</u></h1>
                </div>

                <div id="chat-container">
                    <div ref={elem => (this.elem = elem)}>
                    {messages}
                    </div>
                </div>

                <div id="textarea-chat">
                    <h2>Me: </h2>
                    <textarea rows='10' cols='40' onKeyDown = { this.handleKeyDown} />
                </div>
            </div>
        )
    }
}


const mapStateToProps = state => {
    // console.log(" CHAT mapStateToProps ", state);
    // return state;
    // console.log("state.newMessage: ", state.newMessage);
    return {
        newMessage: state.newMessage
    }
};

export default connect(mapStateToProps)(Chat);
