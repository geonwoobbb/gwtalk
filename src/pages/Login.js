import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Login.css';

function Login() {
    return (
        <div className="container">
            <h1>SIGN IN</h1>

            <ul className="links">
                <li>
                    <Link to="#" id="signin">
                        SIGN IN
                    </Link>
                </li>
                <li>
                    <Link to="#" id="signup">
                        SIGN UP
                    </Link>
                </li>
            </ul>

            <form action="" method="post">
                <div className="first-input input__block first-input__block">
                    <input type="ID" placeholder="아이디" className="input" id="ID" />
                </div>

                <div className="input__block">
                    <input type="password" placeholder="비밀번호" className="input" id="password" />
                </div>

                <div className="input__block">
                    <input
                        type="password"
                        placeholder="Repeat password"
                        className="input repeat__password"
                        id="repeat__password"
                    />
                </div>

                <button className="signin__btn">Login</button>
            </form>
        </div>
    );
}

export default Login;
