import React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Alert from "@material-ui/lab/Alert/Alert";
import {CssBaseline} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import Header from "./Header";
import {withRouter} from "react-router-dom";
import ProgressDialog from "./ProgressDialog";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

const useStyles = theme => ({
    grid: {
        padding: theme.spacing(1),
    },
    logoutButton: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    bottomAppBar: {
        top: 'auto',
        bottom: 0,
    },
});

class CreateCommunity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: '',
            errorMessage: '',
            isCreated: false,
            formSubmitting: false,
            community: {
                name: '',
                description: '',
            },
            redirect: props.redirect,
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({formSubmitting: true});
        let data = this.state.community;
        axios.post("/api/community", data).then(response => {
            return response;
        }).then(json => {
            if (!json.data.error) {
                data = json.data.data;
                this.setState({
                    isCreated: true,
                    error: ''
                });
                setTimeout(() => {
                    return this.props.history.goBack();
                }, 1000);
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
            community: {
                ...prevState.community, name: value
            }
        }));
    };

    handleDescription = (e) => {
        let value = e.target.value;
        this.setState(prevState => ({
            community: {
                ...prevState.community, description: value
            }
        }));
    };

    render() {
        const {error, errorMessage,formSubmitting} = this.state;
        let arr = [];
        Object.values(errorMessage).forEach((value) => (
            arr.push(value)
        ));
        const {classes} = this.props;
        return <React.Fragment>
            <CssBaseline/>
            <Header title={strings.CREATE_COMMUNITY} user={user}/>
            <ProgressDialog open={formSubmitting}/>
            <Grid container>
                <Grid item>
                    {this.state.isCreated ? <Snackbar
                        open={true}
                        TransitionComponent={this.TransitionUp}
                        message={strings.COMMUNITY_CREATED_SUCCESSFULLY}
                    /> : ''}
                    {error ? <Alert variant="filled" severity="error">
                        <Typography >{error}</Typography>
                        {arr.map((item, i) => (
                            <Typography key={i} variant="caption" >{item}</Typography>
                        ))}
                    </Alert> : ''}
                    <form style={{marginTop: 16}}>
                        <Grid container>
                            <Grid xs={12} item className={classes.grid}>
                                <TextField
                                    required
                                    id="outlined-name-input"
                                    fullWidth
                                    label={strings.COMMUNITY_NAME}
                                    name="name"
                                    variant="outlined"
                                    onChange={this.handleName}
                                />
                            </Grid>
                            <Grid xs={12} item className={classes.grid}>
                                <TextField
                                    required
                                    id="outlined-description-input"
                                    fullWidth
                                    label={strings.COMMUNITY_DESCRIPTION}
                                    name="description"
                                    variant="outlined"
                                    onChange={this.handleDescription}
                                />
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
            <AppBar position="fixed" className={classes.bottomAppBar} color={"default"}>
                <Toolbar>
                    <Button variant="outlined" fullWidth  disabled={formSubmitting} onClick={this.handleSubmit}>
                        {formSubmitting ? strings.CREATING_CONVERSION : strings.CREATE_COMMUNITY}
                    </Button>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    }

}

export default withRouter((withStyles(useStyles)(CreateCommunity)));
