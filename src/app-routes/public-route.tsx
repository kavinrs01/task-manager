import { Navigate } from "react-router-dom";

interface PublicRouteProps {
    isAuthenticated: boolean;
    children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ isAuthenticated, children }) => {
    if (isAuthenticated) {
        return <Navigate to="/app" replace />;
    }
    return children;
};
export { PublicRoute };

