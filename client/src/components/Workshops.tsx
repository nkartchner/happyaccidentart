import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { FireCtx } from "../FirestoreContext";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
const MONTHS = [
    "Jan",
    "Feb",
    "March",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        addBtn: {
            gridColumn: 2,
            position: "absolute",
            bottom: 30,
            right: 30,
        },
        eventContainer: {
            padding: theme.spacing(2),
        },
        event: {
            borderRadius: 3,
        },
        detailsContainer: {
            display: "grid",
            gap: "16px",
            padding: theme.spacing(2, 0),
            paddingLeft: "60px",
            width: "calc(100% - 60px)",
            borderBottomLeftRadius: 3,
            borderBottomRightRadius: 3,
            gridTemplateColumns: "1fr 3fr",
            backgroundColor: theme.palette.background.paper,
        },
        selected: {
            backgroundColor: theme.palette.background.paper,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
        },
        calendarContainer: {
            display: "grid",
            gridColumn: 1,
            boxShadow: theme.shadows[10],
            marginRight: theme.spacing(2),
            justifyItems: "center",
            borderRadius: theme.spacing(0.5),
            backgroundColor: theme.palette.background.paper,
        },
        month: {
            gridRow: 1,
            padding: theme.spacing("4px", 2),
            borderBottomLeftRadius: 1,
            borderBottomRightRadius: 1,
            borderBottom: "1px solid " + theme.palette.secondary.light,
        },
        day: {
            gridRow: 2,
            padding: theme.spacing("4px", 2),
        },
        details: {
            gridColumn: 1,
            display: "flex",
            flexDirection:"column",
            alignContent:"center"
        },
        detailsDesc: {
            gridColumn: 2,
        },
        coverImg: {
            borderRadius: 3,
        },
    })
);

const WorkshopDetails: React.FC<any> = ({ e }) => {
    const classes = useStyles();
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const handleLoaded = () => {
        console.log("Loaded");
        setIsLoading(false);
    };
    return (
        <div className={classes.detailsContainer}>
            <div className={classes.details}>
                <Typography variant="body1">What we're painting:</Typography>
                {isLoading && <CircularProgress />}
                <img
                    onLoad={handleLoaded}
                    src={e.coverImg}
                    className={classes.coverImg}
                    alt="workshop goal"
                />
            </div>
            <div className={classes.detailsDesc}>
                <Typography variant="h5">{e.title}</Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    {new Date(e.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body1">{e.desc}</Typography>
            </div>
        </div>
    );
};

const Workshops: React.FC = (): React.ReactElement => {
    const classes = useStyles();
    const [open, setOpen] = React.useState<number | false>(false);

    const handleClick = (index: number) => () => {
        if (open === index) setOpen(false);
        else setOpen(index);
    };

    const firebase = React.useContext(FireCtx);
    const [events, setEvents] = React.useState<any[]>([]);

    React.useEffect(() => {
        axios
            .get("http://localhost:8000/api/workshops")
            .then(({ data }) => {
                console.log(data);
                setEvents(data);
            })
            .catch(err => {
                console.error(err);
            });
    }, [firebase, setEvents]);
    return (
        <>
            <List aria-labelledby="events" className={classes.eventContainer}>
                {events.map((e, i) => (
                    <React.Fragment key={i}>
                        <ListItem
                            button
                            onClick={handleClick(i)}
                            className={clsx(classes.event, {
                                [classes.selected]: open === i,
                            })}
                        >
                            <ListItemIcon className={classes.calendarContainer}>
                                <Typography
                                    component="span"
                                    className={classes.month}
                                    color="textPrimary"
                                >
                                    {MONTHS[new Date(e.date).getMonth()]}
                                </Typography>
                                <Typography
                                    component="span"
                                    className={classes.day}
                                    color="textPrimary"
                                >
                                    {new Date(e.date).getDay()}
                                </Typography>
                            </ListItemIcon>
                            <ListItemText
                                primary={e.title}
                                secondary={new Date(e.date).toDateString()}
                            />
                            {open ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={open === i} timeout="auto" unmountOnExit>
                            <WorkshopDetails e={e} />
                        </Collapse>
                    </React.Fragment>
                ))}
            </List>
            <Fab color="primary" aria-label="add" className={classes.addBtn}>
                <AddIcon />
            </Fab>
        </>
    );
};

export default Workshops;
