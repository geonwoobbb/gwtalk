import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Start from './pages/Start';
import Chat from './pages/Chat';
import Main from './pages/Main';
import Profile from './pages/Profile';
import Login from './pages/Login';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Start />} />
                <Route path="/Start" element={<Start />} />
                <Route path="/Chat" element={<Chat />} />
                <Route path="/Profile" element={<Profile />} />
                <Route path="/Main" element={<Main />} />
                <Route path="/Login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}
export default App;
