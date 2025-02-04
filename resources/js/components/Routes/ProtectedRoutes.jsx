import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const IsAuthenticatedRoutes = () => {
    const { authed, user } = useAuth();
    const location = useLocation();

    return (
        authed && user.authorized ? <Navigate to="/" state={{ from: location }}/> : <Outlet/>
    )
};

export const PrivateRoutes = () => {
    const { authed, user } = useAuth();
    const location = useLocation();

    return (
        authed && user.authorized ? <Outlet/> : <Navigate to="login" state={{ from: location }}/>
    )
}

export const AdminRoutes = () => {
    const { authed, user } = useAuth();
    const location = useLocation();

    return (
        authed && user.authorized && user.is_admin ? <Outlet/> : <Navigate to="/" state={{ from: location }}/>
    )
}
