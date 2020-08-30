import React from "react";
import * as H from "history";
import { Route, Switch, useLocation } from "react-router-dom";
import Sidenav from "./Sidenav";
import { makeStyles, Theme } from "@material-ui/core";
import Dashboard from "./Dashboard";
import Cart from "./Cart";
import Login from "./Login";
import Quotes from "./Quotes";
import Workshops from "./Workshops";

const useStyles = makeStyles((theme: Theme) => ({
    appContainer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: "grid",
        gridTemplateColumns: "240px calc(100% - 240px)",
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.default,
    },
}));

const MainRouter = () => {
    const classes = useStyles();
    const location = useLocation<{ background?: H.Location }>();
    const background = location.state && location.state.background;
    return (
        <div className={classes.appContainer}>
            <Sidenav />
            <Switch location={background || location}>
                <Route path="/login" component={Login} />
                <Route path="/quotes" component={Quotes} />
                <Route path="/workshops" component={Workshops} />
                <Route exact path="/" component={Dashboard} />
            </Switch>
            <Route exact path="/cart" component={Cart} />
        </div>
    );
};

export default MainRouter;
