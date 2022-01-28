import React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Alert from "@material-ui/lab/Alert/Alert";
import {Box, CssBaseline} from "@material-ui/core";
import Header from "./Header";
import withStyles from "@material-ui/core/styles/withStyles";
import {withRouter} from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import ProgressDialog from "./ProgressDialog";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = theme => ({
    grid: {
        padding: theme.spacing(1),
    },
    logoutButton: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    box: {
        height: 'calc(100vh - 100px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomAppBar: {
        top: 'auto',
        bottom: 0,
    },
});

class CreateComment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            event: {},
            error: '',
            isLoading: true,
            errorMessage: '',
            isCreated: false,
            formSubmitting: false,
            comment: {
                name: '',
                content: '',
            },
            redirect: props.redirect,
        };
    }
    componentDidMount() {
        if (this.props.location.state !== undefined) {
            let {event} = this.props.location.state;
            this.setState({isLoading: false, event});
        } else {
            const {match: {params}} = this.props;
            axios.get("/api/event/" + params.id).then(response => {
                return response;
            }).then(json => {
                if (!json.data.error) {
                    let data = json.data.data;
                    this.setState({
                        isLoading: false,
                        event: data,
                        error: ''
                    });
                }
            }).catch(error => {
                let err = error.message;
                this.setState({
                    error: err,
                })
            }).finally(this.setState({error: ''}));
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({formSubmitting: true});
        const {match: {params}} = this.props;
        let {comment} = this.state;
        let data = comment;
        data.event_id = Number(params.id);
        axios.post("/api/comment", data).then(response => {
            return response;
        }).then(json => {
            if (!json.data.error) {
                data = json.data.data;
                this.setState({
                    isCreated: true,
                    error: ''
                });
                setTimeout(() => {
                    return this.props.history.push('/event/' + data.event_id);
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
    handleContent = (e) => {
        let value = e.target.value;
        this.setState(prevState => ({
            comment: {
                ...prevState.comment, content: value
            }
        }));
    };

    render() {
        const {error, errorMessage,comment, formSubmitting, event,isLoading} = this.state;
        let arr = [];
        Object.values(errorMessage).forEach((value) => (
            arr.push(value)
        ));
        const {classes} = this.props;
        return <React.Fragment>
            <CssBaseline/>
            <ProgressDialog open={formSubmitting}/>
            <Header title={strings.CREATE_COMMENT}/>
            {isLoading ? <Box className={classes.box}>
                <CircularProgress color="secondary"/>
            </Box> : null}
            {!isLoading ? <Grid container>
                <Grid item>
                    {this.state.isCreated ? <Snackbar
                        open={true}
                        TransitionComponent={this.TransitionUp}
                        message={strings.MESSAGE_SEND_SUCCESSFULLY}
                    /> : ''}
                    {error ? <Alert variant="filled" severity="error">
                        <Typography>{error}</Typography>
                        {arr.map((item, i) => (
                            <Typography key={i} variant="caption">{item}</Typography>
                        ))}
                    </Alert> : ''}
                    <form style={{marginTop: 16}}>
                        <Grid container>
                            <Grid xs={12} item className={classes.grid}>
                                <TextField
                                    required
                                    id="outlined-name-input"
                                    fullWidth
                                    disabled
                                    label={strings.USERNAME}
                                    name="name"
                                    value={user.name || ''}
                                    variant="outlined"
                                    onChange={this.handleName}
                                />
                            </Grid>
                            <Grid xs={12} item className={classes.grid}>
                                <TextField
                                    required
                                    id="outlined-content-input"
                                    fullWidth
                                    label={strings.MESSAGE}
                                    name="content"
                                    multiline
                                    rows="4"
                                    variant="outlined"
                                    onChange={this.handleContent}
                                />
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid> : null}
            {!isLoading ? <AppBar position="fixed" className={classes.bottomAppBar} color={"default"}>
                <Toolbar>
                    <Button variant="outlined" name="singlebutton" fullWidth
                            disabled={formSubmitting}
                            onClick={this.handleSubmit}>{formSubmitting ? strings.SEND_MESSAGING : strings.SEND_MESSAGE}</Button>
                </Toolbar>
            </AppBar> : null}
        </React.Fragment>
    }

}

export default withRouter((withStyles(useStyles)(CreateComment)));
