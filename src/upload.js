import React from 'react';
import axios from './axios';

export default class Upload extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <div id="upload-component">
                <div id="box">
                    <div id="box-grey"></div>
                    <div id="upload">
                        <form>
                        <p onClick={this.props.hideUploader}>X</p>
                        <label htmlFor='file'><strong>Choose Your New Profile Picture</strong></label>
                        <br />
                        <input type='file' onChange={e => {
                            const form = new FormData;
                            form.append('file', e.target.files[0]);
                            axios.post('/upload', form);
                        }}/>
                        <br />
                        <button>Upload</button>
                        </form>
                    </div>
                </div>
            </div>
        )

    }

}
