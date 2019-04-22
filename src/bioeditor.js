import React from "react";
import axios from './axios';


export default class Upload extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.handleChange = this.handleChange.bind(this)
        this.editBio = this.editBio.bind(this)
    };

    handleChange(e) {
        this.setState({bio: e.target.value});
    }

    editBio(e) {
        axios.post('/bioeditor', {
            bio: this.state.bio
        }).then(({data}) => {
            console.log('data:', data);
            this.props.setBio(data.bio);
        });
    }

    render() {
       const bio = this.props.bio;
       const newBio = "Tell us something about you..."

       if (bio) {
           return (
               <div id="bio">

                    <div id="box-bio">
                        {bio}
                    </div>

                    <div>
                        <a onClick={this.props.displayBio}><u>Update Your Bio</u></a>
                        <br />
                        {this.props.bioIsVisible &&
                            <div>
                            <br />
                            <textarea rows='10' cols='50' onChange={this.handleChange} />
                            <br />
                            <button onClick={this.editBio}>Submit!</button>
                            </div>
                        }
                    </div>

               </div>
           );
       } else {

           return (
               <div id="bio">

                    <div id="box-bio">
                        {newBio}
                    </div>


                    <div>
                        <a onClick={this.props.displayBio}><u>Add Bio</u></a>
                        <br />
                        {this.props.bioIsVisible &&
                           <div>
                                <br />
                               <textarea rows='10' cols='50' onChange={this.handleChange} />
                               <br />
                               <button onClick={this.editBio}>Submit!</button>
                           </div>
                       }

                    </div>

               </div>
           );
       };


   }

}
