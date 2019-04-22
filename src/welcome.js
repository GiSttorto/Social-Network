import React, { Component } from 'react';
import { HashRouter, Route } from 'react-router-dom';
import Registration from "./registration";



const Welcome = () => {
        return (
            <div>
                <div id="welcome">
                    <img src="./images/logo.jpg" />
                    <HashRouter>
                        <div>
                            <Route exact path="/" component={Registration} />
                        </div>
                    </HashRouter>
                </div>
            </div>
        );
    };

export default Welcome;
