import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { onlineUsers, joinedUser, userLeft } from './actions';

class OnlineUsers extends React.Component {
    constructor(props){
        super(props)
    }


    render() {
        // console.log("this.props.users: ", this.props.users );
        const usersOnline = this.props.users
        // console.log("const usersOnline: ", usersOnline);
        var usersOnlineReturn = ""

        if (!usersOnline) {
            return (
                <div>
                    <h1>No users online</h1>
                </div>
            )
        } else {
            var usersOnlineReturn = this.props.users.map(users => (
                <div>
                    <Link id="try" to={`/user/${users.id}`}>
                        <div id="online-container" key={users.id}>
                            <h2>{users.first}  {users.last}</h2>
                            <img src={users.picurl} />
                        </div>
                    </Link>
                </div>
            ))
        }


        return (
            <div>
                <div id="users-online">
                    <h2><u>Users Online:</u></h2>
                </div>

                <div id="online">
                {usersOnlineReturn}
                </div>

            </div>
        )
    }
}


const mapStateToProps = state => {
    // console.log(" mapStateToProps ", state);
    // return state;
    return {
        users: state.users
    }
    // console.log("users mapStateToProps: ", users);
};

export default connect(mapStateToProps)(OnlineUsers);
