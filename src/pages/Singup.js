import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Login.css';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [userid, Setuserid] = useState('');
    const [password, SetPassword] = useState('');
    const [confirmpassword, Setconfirmpassword] = useState('');
    const [nickname, Setnickname] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmpassword) {
            setError('비밀번호가 일치하지 않습니다 다시 확인하세요.');
            return;
        }

        axios
            .post('/api/signup', { userid, password, nickname })
            .then((Response) => {
                if (Response.data.success) {
                    navigate('/Login');
                } else {
                    setError('id나 닉네임이 중복됩니다.');
                }
            })
            .catch((error) => {
                console.error('회원가입 오류:', error);
                setError('서버 오류가 발생했습니다.');
            });
    };

    return (
        <div className="container">
            <h1>건카오톡 ver 1.0</h1>

            <ul className="links">
                <li>
                    <Link to="/Login" id="Login">
                        로그인
                    </Link>
                </li>
                <li>
                    <Link to="/Signup" id="Signup">
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
                        onChange={(e) => Setuserid(e.target.value)}
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

                <div className="input__block">
                    <input
                        type="password"
                        placeholder="비밀번호 확인"
                        className="input"
                        id="confirmpassword"
                        value={confirmpassword}
                        onChange={(e) => Setconfirmpassword(e.target.value)}
                        required
                    />
                </div>

                <div className="input__block">
                    <input
                        type="nickname"
                        placeholder="닉네임"
                        className="input"
                        id="nickname"
                        value={nickname}
                        onChange={(e) => Setnickname(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="signin__btn">
                    회원가입
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Login;
