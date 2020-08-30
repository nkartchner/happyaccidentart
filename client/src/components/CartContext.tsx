import React from "react";

export interface ICartCtx {
    items: any[];
    addItem: (item: any) => void;
    removeItem: (index: number) => void;
}

export const CartCtx = React.createContext<ICartCtx | undefined>(undefined);

const CartContext: React.FC = ({ children }): React.ReactElement => {
    const [cart, setCart] = React.useState<any[]>([]);
    const handleAddItem = (item: any) => {
        setCart([...cart, item]);
    };
    const handleRemoveItem = (index: number) => {
        const newCart = [...cart];
        const [itemRemoved] = newCart.splice(index, 1);
        console.log("Impliment toast to confirm item removed", itemRemoved);
        setCart(newCart);
    };
    return (
        <CartCtx.Provider
            value={{
                items: cart,
                addItem: handleAddItem,
                removeItem: handleRemoveItem,
            }}
        >
            {children}
        </CartCtx.Provider>
    );
};

export default CartContext;
