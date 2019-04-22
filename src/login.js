import React from 'react';
import axios from './axios';


export default class Login extends React.Component {
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
               .post("/login", {
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
                   <div>
                       {this.state.error && (
                           <div>
                               <p>Oops! Something is wrong! :( </p>
                               <p>This email is not register yet or the password does not match</p>
                           </div>
                       )}
                       <input type="text" name="email" placeholder="Email" autoComplete="off"  onChange={e => this.handleChange(e)} />
                       <input type="password" name="password" placeholder="Password" autoComplete="off"  onChange={e => this.handleChange(e)} />
                       <button  onClick={e => this.submit(e)}> Submit!</button>
                    </div>
                )
            }
        }
