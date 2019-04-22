import React from 'react'
import axios from './axios'
import ProfilePic from './profilepic'
import FriendButton from './friendbutton'
import BioEditor from './bioeditor'


export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        // console.log("id: ", id);
        axios.get('/users/' + id)
            .then(results => {
                // console.log("results otherprofiles: ", results);
                if (results.data.id) {
                this.setState(results.data);
                // console.log("results.data: ", results.data);
            } else {
                this.props.history.push('/');
            }
        }).catch((err) => {
            // console.log("err otherprofiles: ", err);
            this.props.history.push('/');
        });
    }

    render() {
        // console.log("this: ", this.state);
        // console.log("this.pic: ", this.state.picurl);
        if (!this.state.bio) {

        }
        return (
            <div>

                <div >
                    <ProfilePic
                    image = {this.state.picurl}
                    />
                </div>

                <div id="info">
                    <h2>{this.state.first} {this.state.last}</h2>
                    <p>Bio:</p>
                    <div id="box-bio">
                        {this.state.bio}
                    </div>
                    <FriendButton
                    otherUserId={this.props.match.params.id}
                    />
                </div>

         </div>

        )
    }


}
