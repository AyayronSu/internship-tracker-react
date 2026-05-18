import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Auth({ onLogin, mode }) {
    const isLoginMode = mode === "login";
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLoginMode ? '/login' : '/register';

        try {
            const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                if (isLoginMode) {
                    onLogin(data.user);
                } else {
                    navigate('/login');
                }
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError("Server connection failed.");
        }
    };

    return (
        <div className="auth-container">
            <h2>{isLoginMode ? 'Login' : 'Sign Up'}</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required 
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit">{isLoginMode ? 'Enter' : 'Create Account'}</button>
            </form>

            {isLoginMode ? (
                <p className="auth-switch-text">
                    Need an account? <Link to="/login" className="toggle-link">Login here</Link>
                </p>
            )}

            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default Auth;