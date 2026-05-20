import Button from './ui/Button';

function Navbar({ user, darkMode, setDarkMode, handleLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>ApplyTrack</h1>
        {user && <p className="navbar-user">Welcome, <strong>{user}</strong></p>}
      </div>
      <div className="navbar-controls">
        <Button variant="secondary" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </Button>
        {user && (
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;