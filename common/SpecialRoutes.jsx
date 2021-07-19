import { Route, Redirect } from "react-router-dom";
import getCookieToken from "../utils/getCookieToken";

const PrivateRoute = (props) => {
    const { children, component: Component, redirectTo, ...rest } = props;
    const userType = getCookieToken();
    const isLoggedIn = userType === "user";

    return (
        <Route
            {...rest}
            render={({ location }) => {
                if (isLoggedIn) {
                    return children || <Component />;
                } else {
                    return (
                        <Redirect
                            to={{
                                pathname: redirectTo,
                                state: { from: location },
                            }}
                        />
                    );
                }
            }}
        />
    );
};

const PublicRoute = (props) => {
    const { children, component: Component, ...rest } = props;
    const userType = getCookieToken();
    const isLoggedIn = userType === "student";

    return (
        <Route
            {...rest}
            render={() => {
                if (isLoggedIn) {
                    return <Redirect to="/cap-p/dashboard" />;
                } else {
                    return children || <Component />;
                }
            }}
        />
    );
};

export { PrivateRoute, PublicRoute };
