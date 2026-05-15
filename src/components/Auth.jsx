import { useState } from "react";

function Auth({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/login' : '/register';

        try {
            const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok) {
                if (isLogin) onLogin(data.user);
                else setIsLogin(true);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError("Server connection failed.");
        }
    };

    return (
        <div className="auth-container">
            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} required />
                <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
                <button type="submit">{isLogin ? 'Enter' : 'Create Account'}</button>
            </form>
            <button className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
            </button>
            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default Auth;