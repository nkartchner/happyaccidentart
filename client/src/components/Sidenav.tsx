import React from "react";
import { makeStyles, Theme } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import defaultUser from "./default-user.jpg";
import NavLink from "./NavLink";
import { User } from "firebase";
import { FireCtx } from "../FirestoreContext";
import { useLocation } from "react-router-dom";
const useStyles = makeStyles((theme: Theme) => ({
    sidenavContainer: {
        padding: theme.spacing(1),
        boxShadow: theme.shadows[6],
        display: "grid",
        gridTemplateRows: "max-content 60px 0.5px repeat(7, 35px)",
        gap: "15px",
    },

    avatar: {
        height: 20,
        width: 20,
        borderRadius: "50%",
    },

    portfolioImg: {
        height: 50,
        width: 50,
        borderRadius: "50%",
        justifySelf: "center",
    },
    header: {
        textAlign: "center",
    },
    line: {
        height: 0.5,
        width: "90%",
        justifySelf: "center",
        backgroundColor: "white",
    },
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
interface NavLink {
    path: string;
    label: string;
    exact: boolean;
}

const generateLinks = (user: Partial<User> | null): NavLink[] => {
    console.log(user);
    const loginLinks = [
        { label: "Login", path: "/login", exact: false },
    ];
    const links = [
        { label: "Home", path: "/", exact: true },
        { label: "About", path: "/about", exact: false },
        { label: "Quotes", path: "/quotes", exact: false },
        { label: "Workshops", path: "/workshops", exact: false },
        { label: "Contact", path: "/contact", exact: false },
        { label: "Cart", path: "/cart", exact: false },
    ];

    return links.concat(
        user !== null
            ? [{ label: `${user.displayName}`, path: "/account", exact: false }]
            : loginLinks
    );
};
interface Props {}

const Sidenav: React.FC<Props> = () => {
    const firebase = React.useContext(FireCtx);
    const [links, setLinks] = React.useState<NavLink[]>([]);
    const location = useLocation();
    React.useEffect(() => {
        firebase.auth.onAuthStateChanged(user => {
            setLinks(generateLinks(user));
        });
    }, [firebase, setLinks]);
    const classes = useStyles();
    return (
        <div className={classes.sidenavContainer}>
            <Typography className={classes.header} variant="h6">
                Happy Accidents Art
            </Typography>
            <img
                alt="artist"
                src={defaultUser}
                className={classes.portfolioImg}
            />
            <div className={classes.line} />
            {links.map((link, i) => (
                <NavLink
                    exact={link.exact}
                    label={link.label}
                    key={i}
                    to={
                        link.label === "Cart"
                            ? {
                                  pathname: link.path,
                                  state: { background: location },
                              }
                            : link.path
                    }
                />
            ))}
        </div>
    );
};

export default Sidenav;
