import React from "react";
import { theme } from "./styles/theme";
import MainRouter from "./components/MainRouter";
import { ThemeProvider } from "@material-ui/core";
import FirestoreContext from "./FirestoreContext";
import CartContext from "./components/CartContext";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <FirestoreContext>
                    <CartContext>
                        <MainRouter />
                    </CartContext>
                </FirestoreContext>
            </MuiPickersUtilsProvider>
        </ThemeProvider>
    );
};

export default App;
