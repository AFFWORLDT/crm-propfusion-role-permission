import { Outlet, useLocation } from "react-router-dom";
import { usePermissionCheck } from "../hooks/usePermissionCheck";
import { getRoutePermissions } from "../utils/permissionMapping";
import PageNotFound from "./PageNotFound";

function ProtectedRoute() {
    const location = useLocation();
    const routePermissions = getRoutePermissions(location.pathname);
    const { hasAccess, isLoading } = usePermissionCheck(routePermissions);

    if (isLoading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    if (!hasAccess) {
        return <PageNotFound />;
    }

    return <Outlet />;
}

export default ProtectedRoute;