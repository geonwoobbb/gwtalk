import React from 'react';
import '../css/Start.css';
import '../css/font.css';
import { Link } from 'react-router-dom';

function Main() {
    return (
        <div className="buttondistance">
            <Link to={'/Login'}>
                <button className="button1">뒤로가기</button>
            </Link>
        </div>
    );
}

export default Main;
