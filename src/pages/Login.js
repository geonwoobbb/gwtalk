import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Login.css';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [userid, SetUserid] = useState('');
    const [password, SetPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .post('/api/login', { userid, password })
            .then((Response) => {
                if (Response.data.success) {
                    console.log('로그인 성공!', Response.data.user);
                    navigate('/Main');
                } else {
                    setError('아이디 또는 비밀번호가 틀렸습니다. 다시하세요 ^^');
                }
            })
            .catch((error) => {
                console.error('로그인 오류:', error);
                setError('서버 오류가 발생했습니다.');
            });
    };

    return (
        <div className="container">
            <h1>건카오톡 ver 1.0</h1>

            <ul className="links">
                <li>
                    <Link to="/Login" id="signin">
                        로그인
                    </Link>
                </li>
                <li>
                    <Link to="/Signup" id="signup">
                        회원가입
                    </Link>
                </li>
            </ul>

            <form action="" method="post" onSubmit={handleSubmit}>
                <div className="first-input input__block first-input__block">
                    <input
                        type="text"
                        placeholder="아이디"
                        className="input"
                        id="userid"
                        value={userid}
                        onChange={(e) => SetUserid(e.target.value)}
                        required
                    />
                </div>

                <div className="input__block">
                    <input
                        type="password"
                        placeholder="비밀번호"
                        className="input"
                        id="password"
                        value={password}
                        onChange={(e) => SetPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="signin__btn">
                    로그인
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Login;
