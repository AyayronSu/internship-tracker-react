import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "./ui/FormInput";
import Button from "./ui/Button";
import { api } from "../services/api";

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
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <div className="auth-brand-mark">A</div>
          <span className="auth-brand-name">ApplyTrack</span>
        </div>

        <h2>{isLoginMode ? 'Welcome back' : 'Create your account'}</h2>
        <p className="auth-subtitle">
          {isLoginMode
            ? 'Sign in to manage your job applications.'
            : 'Start tracking your job search in one place.'}
        </p>

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Username"
            placeholder="e.g. johndoe"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <FormInput
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button type="submit" loading={loading} loadingText="Please wait...">
            {isLoginMode ? 'Sign in' : 'Create account'}
          </Button>
        </form>

        {error && <p className="error">{error}</p>}

        <p className="auth-switch-text">
          {isLoginMode ? (
            <>Don't have an account? <Link to="/signup" className="toggle-link">Sign up free</Link></>
          ) : (
            <>Already have an account? <Link to="/login" className="toggle-link">Sign in</Link></>
          )}
        </p>
      </div>
    </div>
  );
}

export default Auth;