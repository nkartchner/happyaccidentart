import React from "react";
import { makeStyles, Theme, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
    dashContainer: {
        gridColumn: 2,
        padding: theme.spacing(3),
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    banner: {
        top: 0,
        left: 0,
        maxHeight: 400,
        width:"100%",
        gridColumn: 2,
        position: "absolute",
        backgroundPosition: "center",
    },
    bannerName: {
        position: "relative",
    },
}));

interface Props {}

const Dashboard: React.FC<Props> = () => {
    const classes = useStyles();
    const container = React.useRef<HTMLDivElement>(null);
    const [width, setWidth] = React.useState<number | null>(null);
    React.useEffect(() => {
        if (container.current) {
            setWidth(container.current.clientWidth);
        }
    }, [container, setWidth]);
    return (
        <>
            {width && (
                <img
                    className={classes.banner}
                    src={`https://lorempixel.com/${width}/600`}
                    alt="banner"
                />
            )}
            <div ref={container} className={classes.dashContainer}>
                <Typography className={classes.bannerName} color="textPrimary" variant="h4">
                    Doroth Chuday
                </Typography>
            </div>
        </>
    );
};

export default Dashboard;
