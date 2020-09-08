import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Delete from "@material-ui/icons/Delete";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import WorkshopForm from "./WorkshopForm";
import { Workshop } from "../models/workshop";
import { Address } from "../models/address";
import Axios from "axios";

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
        container: { padding: 20, overflow: "auto" },
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
            flexDirection: "column",
            alignContent: "center",
        },
        detailsDesc: {
            gridColumn: 2,
        },
        coverImg: {
            borderRadius: 3,
            maxWidth: 360,
            display: "none",
            transition: `display ${theme.transitions.easing.easeIn}`
        },
        loadingCircle: {
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            width: 300,
            minHeight: 200,
        },
        loaded: {
            display: "unset",
        },
        deleteIcon: {
            marginRight: theme.spacing(2),
        },
    })
);

const WorkshopDetails: React.FC<{
    workshop: Workshop;
    editForm: (workshop: Workshop) => void;
}> = ({ workshop, editForm }) => {
    const classes = useStyles();
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const handleLoaded = () => {
        setIsLoading(false);
    };
    return (
        <div className={classes.detailsContainer}>
            <div className={classes.details}>
                <Typography variant="body1">What we're painting:</Typography>
                {isLoading && (
                    <div className={classes.loadingCircle}>
                        <CircularProgress />
                    </div>
                )}
                <img
                    onLoad={handleLoaded}
                    src={workshop.coverImage}
                    className={clsx(classes.coverImg, {
                        [classes.loaded]: !isLoading,
                    })}
                    alt="workshop goal"
                />
            </div>
            <div className={classes.detailsDesc}>
                <Typography variant="h5">{workshop.title}</Typography>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={() => editForm(workshop)}
                >
                    Edit
                </Button>
                <Typography variant="subtitle1" color="textSecondary">
                    {new Date(workshop.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body1">{workshop.desc}</Typography>
            </div>
        </div>
    );
};

const Workshops: React.FC = (): React.ReactElement => {
    const classes = useStyles();
    const [selectedWorkshop, setSelectedWorkshop] = React.useState<
        Workshop | undefined
    >(undefined);
    const [isAdding, setIsAdding] = React.useState<boolean>(false);
    const [open, setOpen] = React.useState<number | false>(false);

    const handleClick = (index: number) => () => {
        if (open === index) setOpen(false);
        else setOpen(index);
    };

    const [workshops, setWorkshops] = React.useState<Workshop[]>([]);

    React.useEffect(() => {
        axios
            .get<{ workshops: Workshop[] }>(
                "http://localhost:8081/api/workshops"
            )
            .then(({ data }) => {
                console.log(data);
                setWorkshops(data.workshops);
            })
            .catch(err => {
                console.error(err);
            });
    }, [setWorkshops]);

    const handleSubmitNewWorkshop = (workshop: Workshop, address?: Address) => {
        if (workshop.id > 0) return handleEdit(workshop);
        else
            Axios.post<{ workshop: Workshop }>(
                "http://localhost:8081/api/workshops",
                { workshop, address }
            )
                .then(({ data }) => {
                    console.log(
                        "Got the data back after creating something",
                        data
                    );
                    setWorkshops([...workshops, data.workshop]);
                })
                .catch(err => console.log("Something went very wrong", err));
    };

    const handleDelete = (id: number) => (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.stopPropagation();
        Axios.delete("http://localhost:8081/api/workshops/" + id)
            .then(({ data }) => {
                console.log("Deleted the workshop", data);
                setWorkshops(workshops.filter(w => w.id !== id));
            })
            .catch(err => console.log("Something went very wrong", err));
    };
    const handleEdit = (workshop: Workshop) => {
        Axios.put(
            "http://localhost:8081/api/workshops/" + workshop.id,
            workshop
        )
            .then(() => {
                setWorkshops(
                    workshops.map(w => (w.id === workshop.id ? workshop : w))
                );
                setIsAdding(false);
            })
            .catch(err =>
                console.log("Something happened when trying to edit", err)
            );
    };
    return (
        <div className={classes.container}>
            {isAdding ? (
                <WorkshopForm
                    submitNewWorkshop={handleSubmitNewWorkshop}
                    cancel={() => setIsAdding(false)}
                    workshop={selectedWorkshop}
                />
            ) : (
                <Button
                    onClick={() => setIsAdding(true)}
                    variant="contained"
                    color="primary"
                >
                    + Create Workshop
                </Button>
            )}
            <List
                aria-labelledby="workshops"
                className={classes.eventContainer}
            >
                {workshops.map((e, i) => (
                    <div key={e.id}>
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
                            <IconButton
                                color="secondary"
                                onClick={handleDelete(e.id)}
                                className={classes.deleteIcon}
                            >
                                <Delete />
                            </IconButton>
                            {open === i ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={open === i} timeout="auto">
                            <WorkshopDetails
                                workshop={e}
                                editForm={e => {
                                    setSelectedWorkshop(e);
                                    setIsAdding(true);
                                }}
                            />
                        </Collapse>
                    </div>
                ))}
            </List>
        </div>
    );
};

export default Workshops;
