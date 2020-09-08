import React from "react";
import { TextField, Button, Checkbox } from "@material-ui/core";
import emptyWorkshop, { Workshop } from "../models/workshop";
import { makeStyles, createStyles, Theme } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import emptyAddress, { Address } from "../models/address";
import { DateTimePicker } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

type ChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(1),
            display: "grid",
            gridTemplateColumns: "300px 300px",
            gap: "15px",
            alignItems: "center",
            justifyContent: "center",
        },
        fullCol: {
            gridColumn: "1 / -1",
        },
        actions: {
            justifyContent: "end",
            gridColumn: 2,
            display: "inline-block",
            justifySelf: "end",
        },
        submitBtn: {
            margin: theme.spacing(0, 1),
        },

        cancelBtn: {
            margin: theme.spacing(0, 1),
        },
    })
);
interface WorkshopFormProps {
    submitNewWorkshop: (workshop: Workshop, address: Address) => void;
    cancel: () => void;
}

const WorkshopForm: React.FC<WorkshopFormProps> = ({
    cancel,
    submitNewWorkshop,
}): React.ReactElement => {
    const classes = useStyles();

    const [form, setForm] = React.useState<Workshop>(emptyWorkshop());
    const [address, setAddress] = React.useState<Address>(emptyAddress());
    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };
    const handleChange = (e: ChangeEvent) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleDateChange = (e: MaterialUiPickersDate) => {
        if (e) setForm({ ...form, date: new Date(e) });
    };
    const handleCheckboxChange = () => {
        setForm({ ...form, isOnline: !form.isOnline });
    };
    const handleSubmit = () => {
        // ! Validation goes here
        submitNewWorkshop(form, address);
    };
    const handleCancel = () => {
        // setForm(emptyWorkshop());
        // setAddress(emptyAddress());
        cancel();
    };
    return (
        <div className={classes.root}>
            <TextField
                value={form.title}
                onChange={handleChange}
                variant="outlined"
                name="title"
                label="Title"
                required
                color="secondary"
            />

            <DateTimePicker
                label="DateTimePicker"
                inputVariant="outlined"
                value={form.date}
                name="date"
                onChange={e => handleDateChange(e)}
            />

            {/* <div> */}
            {/* <input id="coverImage" hidden type="file" accept="image/*" />
                <label htmlFor="coverImage">
                    <Button
                        color="primary"
                        variant="contained"
                        component="span"
                    >
                        Upload
                    </Button>
                </label> */}
            <TextField
                type="url"
                value={form.coverImage}
                onChange={handleChange}
                label="Cover Image"
                color="secondary"
                name="coverImage"
                variant="outlined"
            />
            {/* </div> */}

            <TextField
                value={form.capacity}
                onChange={e =>
                    +e.target.value >= 0 &&
                    handleChange(e as React.ChangeEvent<HTMLInputElement>)
                }
                required
                variant="outlined"
                name="capacity"
                label="Capacity"
                color="secondary"
                type="number"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={form.isOnline}
                        onChange={handleCheckboxChange}
                        name="isOnline"
                        color="secondary"
                    />
                }
                label="Online"
            />
            <TextField
                value={form.desc}
                onChange={handleChange}
                variant="outlined"
                name="desc"
                label="Description"
                color="secondary"
                multiline={true}
                rows={4}
                className={classes.fullCol}
            />
            {!form.isOnline && (
                <>
                    <TextField
                        onChange={handleAddressChange}
                        value={address.name}
                        className={classes.fullCol}
                        name="name"
                        variant="outlined"
                        label="Name"
                        color="secondary"
                    />
                    <TextField
                        onChange={handleAddressChange}
                        value={address.address}
                        className={classes.fullCol}
                        name="address"
                        variant="outlined"
                        label="Address"
                        color="secondary"
                    />
                    <TextField
                        onChange={handleAddressChange}
                        value={address.city}
                        name="city"
                        variant="outlined"
                        label="City"
                        color="secondary"
                    />
                    <TextField
                        onChange={handleAddressChange}
                        value={address.state}
                        name="state"
                        variant="outlined"
                        label="State"
                        color="secondary"
                    />
                    <TextField
                        onChange={e => {
                            if (!isNaN(+e.target.value))
                                handleAddressChange(
                                    e as React.ChangeEvent<HTMLInputElement>
                                );
                        }}
                        value={address.zipCode}
                        name="zipCode"
                        variant="outlined"
                        label="Zip Code"
                        color="secondary"
                    />
                </>
            )}
            <div className={classes.actions}>
                <Button
                    onClick={handleCancel}
                    className={classes.cancelBtn}
                    color="secondary"
                    variant="contained"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    className={classes.submitBtn}
                    color="primary"
                    variant="contained"
                >
                    Submit
                </Button>
            </div>
        </div>
    );
};

export default WorkshopForm;
