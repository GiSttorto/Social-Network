import React from "react";
import axios from "./axios";

export default class Logout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.logout = this.logout.bind(this);
    }

    logout() {
        // event.preventDefault();
        axios.post("/logout", {}).then(({ data }) => {
            if (data.success) {
                location.replace("/welcome");
            } else {
                this.setState({
                    error: true
                });
            }
        });
    }
    render() {
        return <a id="link" onClick={this.logout}>LOGOUT</a>;
    }
}
