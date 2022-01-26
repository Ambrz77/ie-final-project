import React, {Component} from 'react';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";
import Box from "@material-ui/core/Box";
import Alert from "@material-ui/lab/Alert/Alert";
import {CssBaseline} from "@material-ui/core";
import Header from "./Header";
import withStyles from "@material-ui/core/styles/withStyles";
import {Link} from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import ProgressDialog from './ProgressDialog'

const useStyles = theme => ({
    grid: {
        padding: theme.spacing(1),
    },
    logoutButton: {
        flexGrow:1,
        justifyContent:'flex-end',
    },
    gutters:{
        paddingTop: 8,
        paddingBottom: 8
    },
    form: {
        marginTop:16,
        paddingBottom: 100
    },
    bottomAppBar: {
        top: 'auto',
        bottom: 0,
    },
});
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            error: '',
            showPassword:false,
            errorMessage: [],
            formSubmitting: false,
            user: {},
            redirect: props.redirect,
        };
    }
    componentDidMount() {
        const { prevLocation } = this.state.redirect || { prevLocation: { pathname: '/' } };
        if (prevLocation && user) {
            return this.props.history.push(prevLocation);
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({formSubmitting: true});
        let userData = this.state.user;
        axios.post("/api/login",userData).then(response => {
            return response;
        }).then(json => {
            if (json.data.success) {
                let userData = {
                    id: json.data.id,
                    name: json.data.name,
                    email: json.data.email,
                    access_token: json.data.access_token,
                };
                let appState = {
                    user: userData
                };
                localStorage["appState"] = JSON.stringify(appState);
                this.setState({
                    isLoggedIn: appState.isLoggedIn,
                    user: appState.user,
                    error: ''
                });
                setTimeout(() => {
                    location.reload();
                },1000);
            }
            else {
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
            let errObj = JSON.parse(JSON.stringify(error));
            let err = errObj.message;
            this.setState({
                error: err,
                formSubmitting: false
            })
        }
        }).finally(this.setState({error: ''}));
    };
    handleEmail = (e) => {
        let value = e.target.value;
        this.setState(prevState => ({
            user: {
                ...prevState.user, email: value
            }
        }));
    };
     handleClickShowPassword = () => {
        this.setState({ showPassword: !this.state.showPassword });
    };

     handleMouseDownPassword = event => {
        event.preventDefault();
    };
    handlePassword = (e) => {
        let value = e.target.value;
        this.setState(prevState => ({
            user: {
                ...prevState.user, password: value
            }
        }));
    };
    TransitionUp = (props) => {
        return <Slide {...props} direction="up" />;
    };
    render() {
        const { error,errorMessage,formSubmitting } = this.state;
        let arr = [];
        const {classes} = this.props;
        Object.values(errorMessage).forEach((value) => (
            arr.push(value)
        ));
        return (
            <React.Fragment>
                <CssBaseline/>
                <ProgressDialog open={formSubmitting}/>
                <Header title={strings.LOGIN_TO_ACCOUNT} user={this.state.user} isLoggedIn={this.state.isLoggedIn} />
            <Grid container>
                <Grid item>
                        {this.state.isLoggedIn ? <Snackbar
                            open={true}
                            TransitionComponent={this.TransitionUp}
                            message={strings.LOGIN_SUCCESSFULLY}
                        />  : ''}
                    {error ? <Alert variant="filled" severity="error">
                        <Typography >{error}</Typography>
                        {arr.map((item, i) => (
                            <Typography key={i} variant="caption" >{item}</Typography>
                        ))}
                    </Alert> : ''}
                        <form className={classes.form}>
                            <Grid container >
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
                            </Grid>
                            <Grid xs={12} item className={classes.grid}>
                            <Link to={'/password/email'}>{strings.HOW_FORGET_PASSWORD}</Link>
                            </Grid>
                        </form>
                </Grid>
            </Grid>
                <AppBar position="fixed" className={classes.bottomAppBar} color={"default"}>
                    <Toolbar classes={{gutters: classes.gutters}}>
                        <Grid container spacing={1}>
                        <Grid item xs={12}>
                        <Button variant="outlined" disabled={formSubmitting} fullWidth onClick={this.handleSubmit}>
                            {formSubmitting ? strings.LOGGING : strings.LOGIN}
                        </Button>
                    </Grid>
                       <Grid item xs={12}>
                           <Button variant="outlined" color="secondary"  fullWidth onClick={() => this.props.history.push('/register')}>
                               {strings.CREATE_AN_ACCOUNT}
                           </Button>
                       </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
            </React.Fragment>
        )
    }
}
export default withStyles(useStyles)(Login);
