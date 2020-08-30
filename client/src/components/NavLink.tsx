import React from "react";
import * as H from "history";
import clsx from "clsx";
import { useRouteMatch, Link } from "react-router-dom";
import { makeStyles, Theme } from "@material-ui/core";
const useStyles = makeStyles((theme: Theme) => ({
    link: {
        height: 20,
        width: "100%",
        color: theme.palette.text.primary,
        textDecoration: "none",
        textAlign: "center",
        padding: theme.spacing(1, 0),
        "&:hover": {
            backgroundColor: theme.palette.action.hover,
        },
    },
    activeLink: {
        backgroundColor: theme.palette.action.hover,
    },
}));

interface Props {
    to:
        | string
        | H.LocationDescriptor<any>
        | ((location: H.Location<any>) => H.LocationDescriptor<any>);
    label: string;
    exact: boolean;
}

const NavLink: React.FC<Props> = ({ label, to, exact }) => {
    const classes = useStyles();
    const routeMatchParams =
        typeof to === "string" ? { path: to, exact } : { ...to, exact };
    const match = useRouteMatch(routeMatchParams);
    return (
        <Link
            className={clsx(classes.link, { [classes.activeLink]: match })}
            to={to}
        >
            {label}
        </Link>
    );
};

export default NavLink;
