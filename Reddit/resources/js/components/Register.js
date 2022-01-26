import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";
import Alert from '@material-ui/lab/Alert';
import {CssBaseline} from "@material-ui/core";
import Header from "./Header";
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import ProgressDialog from "./ProgressDialog";

const useStyles = theme => ({
    grid: {
        padding: theme.spacing(1),
    },
    logoutButton: {
        flexGrow:1,
        justifyContent:'flex-end',
    },
    passwordValid: {
        color:'red',
        fontSize:12
    },
    gutters:{
        paddingTop: 8,
        paddingBottom: 8
    },
    bottomAppBar: {
        top: 'auto',
        bottom: 0,
    },
    form: {
        marginTop:16,
        paddingBottom: 100
    }
});
class Register extends Component {
    // 2.1
    constructor(props) {
        super(props);
        this.state = {
            isRegistered: false,
            error: '',
            errorMessage: '',
            formSubmitting: false,
            open: true,
            user: {
                name: '',
                mobile: '',
                email: '',
                password: '',
                password_confirmation: '',
            },
            redirect: props.redirect,
        };
    }

    componentDidMount() {
        const {prevLocation} = this.state.redirect || {prevLocation: {pathname: '/'}};
        if (prevLocation && user) {
            return this.props.history.push(prevLocation);
        }
    }

// 2.4
    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({formSubmitting: true});
        ReactDOM.findDOMNode(this).scrollIntoView();
        let userData = this.state.user;
        axios.post("/api/signup", userData)
            .then(response => {
                return response;
            }).then(json => {
            if (json.data.success) {
                let userData = {
                    id: json.data.id,
                    name: json.data.name,
                    email: json.data.email,
                    activation_token: json.data.activation_token,
                };
                let appState = {
                    user: userData
                };
                localStorage["appState"] = JSON.stringify(appState);
                this.setState({
                    isRegistered: appState.isRegistered,
                    user: appState.user
                });
                setTimeout(() => {
                    return this.props.history.push("/login");
                },1000);
            } else {
                this.setState({formSubmitting: false});
                alert(strings.NET_ERROR);
            }
        }).catch(error => {
            if (error.response) {
                // The request was made and the server responded with a status code that falls out of the range of 2xx
                let err = error.response.data;
                let errors = err.hasOwnProperty('errors') ? err.errors : [];
                this.setState({
                    error: err.message,
                    errorMessage: errors,
                    formSubmitting: false
                })
            } else if (error.request) {
                // The request was made but no response was received `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js
                let err = error.request;
                this.setState({
                    error: err,
                    formSubmitting: false
                })
            } else {
                // Something happened in setting up the request that triggered an Error
                let err = error.message;
                this.setState({
                    error: err,
                    formSubmitting: false
                })
            }
        }).finally(this.setState({error: ''}));
    };

    handleName = (e) => {
        let value = e.target.value;
        this.setState(prevState => ({
            user: {
                ...prevState.user, name: value
            }
        }));
    };

    handleEmail = (e) => {
        let value = e.target.value;
        this.setState(prevState => ({
            user: {
                ...prevState.user, email: value
            }
        }));
    };

    handlePassword = (e) => {
        let value = e.target.value;
        this.setState(prevState => ({
            user: {
                ...prevState.user, password: value
            }
        }));
    };

    handlePasswordConfirm = (e) => {
        let value = e.target.value;
        this.setState(prevState => ({
            user: {
                ...prevState.user, password_confirmation: value
            }
        }));
    };

     TransitionUp = (props) => {
        return <Slide {...props} direction="up" />;
    };

     handleClose = () => {
        this.setState({open : false});
    };
    render() {
        let {errorMessage,open,formSubmitting} = this.state;
        const {classes} = this.props;
        let arr = [];
        Object.values(errorMessage).forEach((value) => (
            arr.push(value)
        ));
        return (
            <React.Fragment>
                <CssBaseline/>
                <ProgressDialog open={formSubmitting}/>
                <Header title={strings.CREATE_AN_ACCOUNT} />
            <Grid container>
                <Grid item>
                    {this.state.isRegistered ? <Snackbar
                        open={open}
                        TransitionComponent={this.TransitionUp}
                        message={strings.REGISTER_SUCCESSFULLY}
                    /> : ''}
                    {this.state.error ? <Alert variant="filled" severity="error">
                        <Typography>{strings.ERROR}</Typography>
                        {arr.map((item, i) => (
                            <Typography key={i} variant="caption" >{item}</Typography>
                        ))}
                    </Alert> : ''}
                    <form className={classes.form}>
                        <Grid container>
                            <Grid xs={12} item className={classes.grid}>
                                <TextField
                                    required
                                    id="outlined-name-input"
                                    fullWidth
                                    label={strings.USERNAME}
                                    name="name"
                                    variant="outlined"
                                    onChange={this.handleName}
                                />
                            </Grid>
                            <Grid xs={12} item className={classes.grid}>
                                <TextField
                                    required
                                    id="outlined-email-input"
                                    fullWidth
                                    label={strings.EMAIL}
                                    type="email"
                                    name="email"
                                    variant="outlined"
                                    onChange={this.handleEmail}
                                />
                            </Grid>
                            <Grid xs={12} item className={classes.grid}>
                                <TextField
                                    required
                                    id="outlined-password-input"
                                    fullWidth
                                    label={strings.PASSWORD}
                                    type="password"
                                    name="password"
                                    autoComplete="current-password"
                                    variant="outlined"
                                    onChange={this.handlePassword}
                                />
                            </Grid>
                            <Grid xs={12} item className={classes.grid}>
                                <TextField
                                    required
                                    id="outlined-confirm-password-input"
                                    fullWidth
                                    label={strings.CONFIRM_PASSWORD}
                                    type="password"
                                    name="password_confirm"
                                    autoComplete="current-password"
                                    variant="outlined"
                                    onChange={this.handlePasswordConfirm}
                                />
                            </Grid>
                            <Grid xs={12} item className={classes.grid}>
                               <Typography variant="body2" className={classes.passwordValid}>{strings.PASSWORD_VALID}</Typography>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
                <AppBar position="fixed" className={classes.bottomAppBar} color={"default"}>
                    <Toolbar classes={{gutters: classes.gutters}}>
                       <Grid container spacing={1}>
                           <Grid item xs={12}>
                               <Button variant="outlined" disabled={formSubmitting} fullWidth onClick={this.handleSubmit}>
                                   {strings.CREATE_ACCOUNT}
                               </Button>
                           </Grid>
                           <Grid item xs={12}>
                               <Button variant="outlined" color="secondary" fullWidth onClick={() => this.props.history.push('/login')}>
                                   {strings.LOGIN_TO_ACCOUNT}
                               </Button>
                           </Grid>
                       </Grid>
                    </Toolbar>
                </AppBar>
            </React.Fragment>
        )
    }
}
export default withStyles(useStyles)(Register);
