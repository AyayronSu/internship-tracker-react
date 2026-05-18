import { Navigate } from "react-router-dom";

function ProtectedRoute({ user, loading, children }) {
    if (loading) {
        return (
            <div className="loading-spinner">
                <p>Verifying session...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;