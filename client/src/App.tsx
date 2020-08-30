import React from "react";
import { theme } from "./styles/theme";
import MainRouter from "./components/MainRouter";
import { ThemeProvider } from "@material-ui/core";
import FirestoreContext from "./FirestoreContext";
import CartContext from "./components/CartContext";

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <FirestoreContext>
                <CartContext>
                    <MainRouter />
                </CartContext>
            </FirestoreContext>
        </ThemeProvider>
    );
};

export default App;
