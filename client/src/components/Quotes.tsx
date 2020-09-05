import React from "react";
import { Typography, List, ListItem, ListItemText } from "@material-ui/core";
import Axios from "axios";

type IQuotes = { [key: string]: string[] };

const Quotes: React.FC = (): React.ReactElement => {
    const [quotes, setQuotes] = React.useState<IQuotes>({});
    React.useEffect(() => {
        Axios.get<{ quotes: IQuotes }>("http://localhost:8081/api/quotes")
            .then(({ data }) => {
                setQuotes(data.quotes);
            })
            .catch(err => console.log("Something bad happened", err));
    }, [setQuotes]);

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
