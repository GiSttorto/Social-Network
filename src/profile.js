import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bioeditor";



export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state;
    }

    render() {
        return (
            <div>
                <div id="profile">
                    <ProfilePic
                        image={this.props.picurl}
                        showUploader={this.props.showUploader}
                    />
                    <div id="info">
                        <h2>{this.props.first} {this.props.last}</h2>
                        <BioEditor
                        bio={this.props.bio}
                        setBio = {this.props.setBio}
                        displayBio = {this.props.displayBio}
                        bioIsVisible = {this.props.bioIsVisible}
                        />
                    </div>
                </div>

            </div>
        );
    }
}
