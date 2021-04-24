import React, { useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Login } from "./components/Login";
import { Email } from "./components/email/Email";
import { Navbar } from "./components/navbar/Navbar";
import { Application } from "./components/application/Application";
import "./assets/scss/font.scss";
import "./assets/scss/common.scss";
// @ts-ignore
import { Helmet } from "react-helmet";
import favicon from "../src/assets/img/favicon.png";
import WebContent from "./components/webContent/WebContent";
import { Account } from "./components/account/Account";
import { ApplicationPeriod } from "./components/applicationPeriods/ApplicationPeriod";
import { checkLogin } from "./components/redux/auth/action";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { Overview } from "./components/overview/Overview";
import LoadingComponent from "./components/general/Loading";

function App() {
    const dispatch = useDispatch();
    const { isAuth, role } = useSelector((state: RootState) => state.auth.payload.login);
    //Get if edit container in period is shown
    const { id: clickedPeriodId } = useSelector((state: RootState) => state.applicationPeriod.payload.edit);
    //Get if edit container in user is shown
    const { userId: clickedUserId } = useSelector((state: RootState) => state.user.payload.edit);
    //Get if edit container in email is shown
    const { id: clickedEmailId } = useSelector((state: RootState) => state.email.payload.edit);

    //Check if the user is logged in
    useEffect(() => {
        dispatch(checkLogin());
    }, [dispatch]);

    useEffect(() => {
        document.querySelector(".outer_container")?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, [isAuth, clickedPeriodId, clickedUserId, clickedEmailId]);

    //Stop the component from rendering before check login is done
    if (isAuth === null) {
        return <LoadingComponent height="full" />;
    }

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>收生系統｜Admission Helper</title>
                <link id="favicon" rel="icon" href={favicon} type="image/x-icon" />
            </Helmet>

            <div className="App" style={{ overflow: "hidden" }}>
                {!isAuth && (
                    <Switch>
                        <Route component={Login} />
                    </Switch>
                )}
                {isAuth && (
                    <>
                        <Navbar />
                        {role === "admin" ? (
                            <div className="switch_container">
                                <Switch>
                                    <Route path="/" exact component={Overview}></Route>
                                    <Route path="/application/:id" component={Application} />
                                    <Route path="/application/add" component={Application} />
                                    <Route path="/application" component={Application} />
                                    <Route path="/application-period" component={ApplicationPeriod} />
                                    <Route path="/email" component={Email} />
                                    <Route path="/overview" component={Overview} />
                                    <Route path="/web-content" component={WebContent}></Route>
                                    <Route path="/account" component={Account}></Route>
                                    <Route>
                                        <Redirect to="/overview" />
                                    </Route>
                                </Switch>
                            </div>
                        ) : (
                            <div className="switch_container">
                                <Switch>
                                    <Route path="/" exact component={Overview}></Route>
                                    <Route path="/application/:id" component={Application} />
                                    <Route path="/application/add" component={Application} />
                                    <Route path="/application" component={Application} />
                                    <Route path="/overview" component={Overview} />
                                    <Route path="/account" component={Account}></Route>

                                    <Route>
                                        <Redirect to="/overview" />
                                    </Route>
                                </Switch>
                            </div>
                        )}
                        {/* <ScrollArrow /> */}
                    </>
                )}
            </div>
        </>
    );
}

export default App;
