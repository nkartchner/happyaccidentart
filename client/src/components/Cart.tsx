import React from "react";
import { makeStyles } from "@material-ui/core";
import { CartCtx } from "./CartContext";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(theme => ({
    cartContainer: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "grid",
        zIndex: 1100,
    },
    cartModal: {
        maxHeight: "80%",
        width: "50%",
        zIndex: 1200,
        boxShadow: theme.shadows[12],
        justifySelf: "center",
        alignSelf: "center",
        display: "grid",
        gridTemplateRows: "max-content 1fr max-content",
        backgroundColor: theme.palette.background.paper,
        borderRadius: 5,
        padding: theme.spacing(3)
    },
    bkDrop: {
        width: "100%",
        height: "100%",
        position: "absolute",
        backgroundColor: "rgba(0,0,0, 0.8)",
    },
}));

const Cart: React.FC = (): React.ReactElement => {
    const cart = React.useContext(CartCtx);
    const classes = useStyles();
    const history = useHistory();
    const handleBkdropClick = () => {
        history.goBack();
    };
    React.useEffect(() => {
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.keyCode === 27) history.goBack();
        };
        document.addEventListener("keydown", handleEscKey);
        return () => {
            document.removeEventListener("keydown", handleEscKey);
        };
    }, [history]);
    return (
        <div className={classes.cartContainer}>
            <div className={classes.bkDrop} onClick={handleBkdropClick} />
            <div className={classes.cartModal}>
                <h1>Cart works</h1>
                <ul>
                    {(cart?.items || []).map((item, i) => (
                        <li key={i}>{JSON.stringify(item)}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
export default Cart;
