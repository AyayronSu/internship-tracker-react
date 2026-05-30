import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "./ui/FormInput";
import Button from "./ui/Button";
import { api } from "../services/api"

function Auth({ onLogin, mode }) {
    const isLoginMode = mode === "login";
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLoginMode) {
                const data = await api.login(username, password);
                onLogin(data.user);
            } else {
                await api.register(username, password);
                navigate('/login');
            }
        } catch (err) {
            setError(err.message || "An authentication error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>{isLoginMode ? 'Login' : 'Sign Up'}</h2>
            <form onSubmit={handleSubmit}>
                <FormInput 
                    placeholder="Username" 
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required 
                />
                <FormInput
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)} 
                    required 
                />
                <Button type="submit" loading={loading}>
                    {isLoginMode ? 'Enter' : 'Create Account'}
                </Button>
            </form>

            {isLoginMode ? (
                <p className="auth-switch-text">
                    Need an account? <Link to="/signup" className="toggle-link">Register here</Link>
                </p>
            ) : (
                <p className="auth-switch-text">
                    Already have an account? <Link to="/login" className="toggle-link">Login here</Link>
                </p>
            )}

            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default Auth;