import React from 'react';
import ReactDOM from 'react-dom';
import Welcome from './welcome';
import App from './app';
import * as io from 'socket.io-client';
import { getSocket } from './socket'

//__________________________________REDUX___________________________________________________
import { createStore, applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducer'
import { Provider } from 'react-redux'

const store = createStore(reducer, composeWithDevTools(applyMiddleware(reduxPromise)));
//_______________________________________REDUX______________________________________________


//_________________________________SOCKET.IO________________________________________________
const socket = io.connect();
//_________________________________SOCKET.IO________________________________________________



let component;
// console.log("pathname: ", location.pathname);

if (location.pathname == '/welcome') {
    component = <Welcome />
} else {
    component = (
        <Provider store = { store }>
            <App />
        </Provider>
    );
     getSocket(store)
}


ReactDOM.render(
    component, document.querySelector("main"));
