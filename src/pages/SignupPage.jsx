import Auth from "../components/Auth";

function SignupPage({ onLogin }) {
    return <Auth onLogin={onLogin} mode="signup" />;
}

export default SignupPage;