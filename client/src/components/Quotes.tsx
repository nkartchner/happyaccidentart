import React from "react";
import { FireCtx } from "../FirestoreContext";
import { Typography, List, ListItem, ListItemText } from "@material-ui/core";

type IQuotes = { [key: string]: string[] };

const Quotes: React.FC = (): React.ReactElement => {
    const firebase = React.useContext(FireCtx);
    const [quotes, setQuotes] = React.useState<IQuotes>({});
    React.useEffect(() => {
        const unsub = firebase.firestore
            .collection("quotes")
            .onSnapshot(snap => {
                let q: IQuotes = {};
                snap.forEach(doc => {
                    const d: { [key: string]: string[] } = doc.data();
                    Object.keys(d).forEach(name => {
                        q[name] = d[name];
                    });
                });
                setQuotes(q);
            });
        return () => {
            unsub();
        };
    }, [firebase, setQuotes]);
    return (
        <div style={{ padding: 16 }}>
            {Object.keys(quotes).map(artistName => (
                <div key={artistName}>
                    <Typography variant="h6">{artistName}</Typography>
                    <List>
                        {quotes[artistName].map(quote => (
                            <ListItem key={quote}>
                                <ListItemText>{quote}</ListItemText>
                            </ListItem>
                        ))}
                    </List>
                </div>
            ))}
        </div>
    );
};

export default Quotes;
