import Auth from "../components/Auth";

function LoginPage({ onLogin }) {
    return <Auth onLogin={onLogin} mode="login" />;
}

export default LoginPage;