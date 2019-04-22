import React from 'react';
import ProfilePic from './profilepic';
import Upload from './upload';
import Profile from './profile';
import BioEditor from './bioeditor'
import OtherProfile from './otherprofile'
import { BrowserRouter, Route } from "react-router-dom"
import axios from './axios';
import Friends from './friends'
import Chat from './chat'
import OnlineUsers from './onlineusers'
import { Link } from 'react-router-dom'
import Logout from './logout'


export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderIsVisible: false,
            bioIsVisible: false
        };
        this.showUploader = this.showUploader.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
        this.setImage = this.setImage.bind(this);
        this.displayBio = this.displayBio.bind(this);
        this.setBio = this.setBio.bind(this);
    }

    showUploader() {
        this.setState({
            uploaderIsVisible: true
        });
    }


    hideUploader() {
        this.setState({
            uploaderIsVisible: false
        });
    }


    setImage(picurl) {
        this.setState({
            picurl,
            uploaderIsVisible: false})
            // console.log("picurl: ", picurl);
    }

    displayBio() {
          this.setState({
              bioIsVisible: true
          });
    }

    setBio(bio) {
        this.setState({
            bio,
            bioIsVisible: false});
    }



     componentDidMount() {
        axios.get('/user')
            .then(({data}) => {
                // console.log("data: ", {data})
                if (data.id) {
                    this.setState(data);
                }
            }).catch(err => {
                console.log("error DiMount: ", err);
            });
    }


    render() {
        if (!this.state.id) {
            return <div> <h1>NOT WORKING 😡🤯🤬</h1> </div>;
        }
        // console.log("this: ", this.state);
        // console.log("image: ", this.state.picurl)
        return (
          <BrowserRouter>
            <div>
                <div id="perfil">
                    <a href="/"> <img id="logo" src="./images/logo.jpg" /></a>

                    <div id="links">
                        <Link id="link" to="/chat">Chat</Link>
                        <Link id="link" to="/online">Who is online</Link>
                        <Link id="link" to="/friends">Friends</Link>
                        <Logout id="link" />
                    </div>

                    <ProfilePic
                        image={this.state.picurl}
                        first={this.state.first}
                        last={this.state.last}
                        onClick={this.showUploader}
                    />

                </div>

                    {this.state.uploaderIsVisible && <Upload setImage={this.setImage} hideUploader={this.hideUploader}/>}

                <hr />

                    <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    id={this.state.id}
                                    first={this.state.first}
                                    last={this.state.last}
                                    picurl={this.state.picurl}
                                    onClick={this.showUploader}
                                    bio={this.state.bio}
                                    setBio={this.setBio}
                                    displayBio= {this.displayBio}
                                    bioIsVisible= {this.state.bioIsVisible}
                                />
                            )}
                       />


                   <Route path="/user/:id" component={OtherProfile} />

                   <Route path="/friends" render={() => <Friends />} />

                    <Route path="/online" render={() => <OnlineUsers />} />

                   <Route path="/chat" render={() => <Chat />} />
            </div>
          </BrowserRouter>
        )
    }
}
