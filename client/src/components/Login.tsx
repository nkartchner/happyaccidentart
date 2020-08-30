import React from "react";
import { FireCtx } from "../FirestoreContext";
import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { useHistory } from "react-router-dom";
const useStyles = makeStyles(theme => ({
    loginContainer: {
        display: "grid",
        gridAutoRows: "max-content",
        padding: theme.spacing(3),
        gap: "20px",
        justifyItems: "center",
    },
    svg: {
        position: "absolute",
        left: "16px",
        height: "20px",
        width: "20px",
        marginTop: "2px",
    },
    btn: {
        padding: theme.spacing(1.4, 2),
        marginBottom: 4,
    },
}));
const EMAIL_REG = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/);

const Login: React.FC = (): React.ReactElement => {
    const classes = useStyles();
    const firebase = React.useContext(FireCtx);
    const [email, setEmail] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [errors, setErrors] = React.useState<{
        email?: string;
        password?: string;
    }>({});
    const history = useHistory();
    const handleLoginWithGoogle = async () => {
        try {
            const response = await firebase.auth.signInWithPopup(
                firebase.providers.google
            );
            if (response.user) {
                history.push("/dashboard");
            }
        } catch (error) {
            console.log("Something went wrong when signing in with google");
        }
    };
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setErrors({});
    };

    const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setErrors({});
    };
    const handleLoginWithEmailAndPw = async () => {
        const errs: typeof errors = {};
        if (!email) errs.email = "Email is required";
        if (!password) errs.password = "Password is required";
        if (!EMAIL_REG.test(email)) errs.email = "Invalid Email";
        if (Object.keys(errors).length) {
            setErrors(errs);
        } else {
            try {
                const result = await firebase.auth.signInWithEmailAndPassword(
                    email,
                    password
                );
                console.log("IN THE LOGIN. WTF?", result);
                if (result.user) {
                    history.push("/dashboard");
                }
            } catch (err) {
                const errCodes: {
                    [key: string]: {
                        message: string;
                        errorKey: "email" | "password";
                    };
                } = {
                    "auth/user-not-found": {
                        errorKey: "email",
                        message: "User was not found",
                    },
                    "auth/invalid-credential": {
                        errorKey: "email",
                        message: err.message,
                    },
                    "auth/invalid-email-verified": {
                        errorKey: "email",
                        message: err.message,
                    },
                    "auth/invalid-password": {
                        errorKey: "password",
                        message: err.message,
                    },
                    "auth/wrong-password": {
                        errorKey: "password",
                        message: "The password is invalid",
                    },
                };
                console.log(err.code);
                setErrors({
                    [errCodes[err.code].errorKey]: errCodes[err.code].message,
                });
            }
        }
    };
    return (
        <form className={classes.loginContainer}>
            <Typography variant="h6">Create an account</Typography>
            <Button
                variant="contained"
                color="primary"
                className={classes.btn}
                onClick={handleLoginWithGoogle}
                startIcon={
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.566 2.684-3.874 2.684-6.614z"
                            fill="#4285F4"
                        ></path>
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                            fill="#34A853"
                        ></path>
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                            fill="#FBBC05"
                        ></path>
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                            fill="#EA4335"
                        ></path>
                    </svg>
                }
            >
                <Typography>Sign in with Google</Typography>
            </Button>
            <TextField
                required
                value={email}
                type="email"
                label="Email"
                variant="outlined"
                color="secondary"
                autoComplete="email"
                error={"email" in errors}
                helperText={errors.email}
                onChange={handleEmailChange}
            />
            <TextField
                required
                value={password}
                type="password"
                label="Password"
                variant="outlined"
                color="secondary"
                autoComplete="password"
                error={"password" in errors}
                helperText={errors.password}
                onChange={handlePwChange}
            />
            <Button
                variant="contained"
                onClick={handleLoginWithEmailAndPw}
                color="primary"
            >
                Create Account
            </Button>
            <Link color="textPrimary" href="/register">
                Don't have an account?
            </Link>
        </form>
    );
};

export default Login;
