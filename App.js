import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { Layout } from "antd";

import Leaderboard from "./views/Leaderboard/Leaderboard";
import Dashboard from "./views/Dashboard/Dashboard";
import Login from "./views/Login/Login";
import Register from "./views/Register/Register";
import ECellFooter from "./common/ECellFooter";

import "./App.less";
import { PrivateRoute, PublicRoute } from "./common/SpecialRoutes";

const { Footer } = Layout;

const App = () => {
    return (
        <Layout className="App">
            <Router>
                <Switch>
                    <PublicRoute exact path="/cap-p/login" component={Login} />
                    <PublicRoute exact path="/cap-p/register" component={Register} />
                    <PrivateRoute exact path="/cap-p/dashboard" component={Dashboard} redirectTo="/cap-p/login"/>
                    <PrivateRoute exact path="/cap-p/leaderboard" component={ Leaderboard } />
                    {/* <Route path="*" component={() => window.location.href = "https://ecell.iitm.ac.in/cap"} /> */}
                    <Route path="*" component={() => window.location.href = "/cap-p/login"} />
                </Switch>
            </Router>
            <Footer
                style={{
                    backgroundColor: "white",
                    boxShadow: "0px -1px 20px rgba(85, 85, 85, 0.2)",
                    padding: "20px",
                    marginTop: "1rem",
                    position: "sticky",
                    verticalAlign: "bottom",
                    width: "100%",
                    zIndex: 100,
                }}>
                <ECellFooter
                    developers={[
                        {
                            name: "Ashish",
                            whatsappNum: "+91 9983321407",
                            profileURL: "https://github.com/ashishshroti14",
                        },
                        {
                            name: "Abhijit",
                            whatsappNum: "+91 8895219514",
                            profileURL: "https://github.com/abhijit-hota",
                        },
                        {
                            name: "Harsh",
                            whatsappNum: "+91 9345105302",
                            profileURL: "",
                        },
                    ]}
                />
            </Footer>
        </Layout>
    );
};

export default App;
