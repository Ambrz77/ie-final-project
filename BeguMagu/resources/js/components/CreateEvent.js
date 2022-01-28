import React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Alert from "@material-ui/lab/Alert/Alert";
import {CssBaseline, FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
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
    }
});

class CreateEvent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: '',
            errorMessage: '',
            isCreated: false,
            formSubmitting: false,
            community: [],
            event: {
                community_id: '',
                title: '',
                description: '',
            },
            redirect: props.redirect,
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.getData();
    }

    getData = () => {
        let {community} = this.state;
        axios.get("/api/user/community").then(response => {
            return response;
        }).then(json => {
            if (!json.data.error) {
                if (this._isMounted) {
                    let data = json.data;
                    community.push(...data.data);
                    this.setState({
                        community : community,
                        error: '',
                        isFirstRun: false,
                        isLoading: false
                    });
                }
            }
        }).catch(error => {
            let err = error.message;
            if (this._isMounted) {
                this.setState({
                    error: err,
                    isLoading: false
                })
            }
        }).finally(this.setState({error: ''}));
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({formSubmitting: true});
        let data = this.state.event;
        axios.post("/api/event", data).then(response => {
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
    handleTitle = (e) => {
        let value = e.target.value;
        this.setState(prevState => ({
            event: {
                ...prevState.event, title: value
            }
        }));
    };
    handleDescription = (e) => {
        let value = e.target.value;
        this.setState(prevState => ({
            event: {
                ...prevState.event, description: value
            }
        }));
    };
    handleCommunity = (e) => {
        let value = e.target.value;
        this.setState(prevState => ({
            event: {
                ...prevState.event, community_id: value
            }
        }));
    };

    render() {
        const {error, errorMessage,formSubmitting,community} = this.state;
        let arr = [];
        Object.values(errorMessage).forEach((value) => (
            arr.push(value)
        ));
        const {classes} = this.props;
        return <React.Fragment>
            <CssBaseline/>
            <Header title={strings.CREATE_EVENT}/>
            <ProgressDialog open={formSubmitting}/>
            <Grid container>
                <Grid item>
                    {this.state.isCreated ? <Snackbar
                        open={true}
                        TransitionComponent={this.TransitionUp}
                        message={strings.EVENT_CREATED_SUCCESSFULLY}
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
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel htmlFor="outlined-community-native-simple">{strings.COMMUNITY_NAME}</InputLabel>
                                    <Select
                                        displayEmpty
                                        onChange={this.handleCommunity}
                                        label="Community"
                                        inputProps={{
                                            name: 'community_id',
                                            id: 'outlined-community-native-simple',
                                        }}
                                    >
                                        {community.map(item => <MenuItem value={item.id} key={item.id}>{item.name}</MenuItem> )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid xs={12} item className={classes.grid}>
                                <TextField
                                    required
                                    id="outlined-title-input"
                                    fullWidth
                                    label={strings.EVENT_TITLE}
                                    name="title"
                                    variant="outlined"
                                    onChange={this.handleTitle}
                                />
                            </Grid>
                            <Grid xs={12} item className={classes.grid}>
                                <TextField
                                    required
                                    id="outlined-description-input"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label={strings.EVENT_DESCRIPTION}
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
                        {formSubmitting ? strings.CREATING_CONVERSION : strings.CREATE_CONVERSION}
                    </Button>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    }

}

export default withRouter((withStyles(useStyles)(CreateEvent)));
