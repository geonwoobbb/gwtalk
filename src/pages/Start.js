import React from 'react';
import '../css/Start.css';
import '../css/font.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';

function Start() {
    return (
        <div className="app">
            <div className="main">
                <div className="centerpx">건카오톡 ver 1.0</div>
                <div className="buttondistance">
                    <Link to={'/Login'}>
                        <button className="button1">실행하기</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Start;
