import React, {Component} from 'react';
import axios from './axios';
import { Link } from 'react-router-dom';


export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this[e.target.name] = e.target.value;
    }

    submit(e) {
           e.preventDefault();
           axios
               .post("/register", {
                   first: this.first,
                   last: this.last,
                   email: this.email,
                   password: this.password
               })
               .then(({ data }) => {
                   if (data.success) {
                       location.replace("/");
                   } else {
                       this.setState({
                           error: true
                       });
                   }
               });
       }

    render() {
        return (
                <div id="form">
                    {this.state.error && (
                        <div id="error">
                            <p>Oops... something is wrong! :( </p>
                            <p>You must fill out the entire form</p>
                        </div>
                    )}
                    <input type="text" name="first" placeholder="First Name" autoComplete="off" onChange={e => this.handleChange(e)} />
                    <input type="text" name="last" placeholder="Last Name" autoComplete="off"  onChange={e => this.handleChange(e)} />
                    <input type="text" name="email" placeholder="Email" autoComplete="off"  onChange={e => this.handleChange(e)} />
                    <input type="password" name="password" placeholder="Password" autoComplete="off"  onChange={e => this.handleChange(e)} />
                    <button  onClick={e => this.submit(e)}> Submit!</button>
                </div>
        )
    }
}
