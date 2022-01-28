import React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Alert from "@material-ui/lab/Alert/Alert";
import CssBaseline from "@material-ui/core/CssBaseline";
import Header from "./Header";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import withStyles from "@material-ui/core/styles/withStyles";
import ProgressDialog from "./ProgressDialog";
import ConfirmDialog from "./ConfirmDialog";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
const useStyles = theme => ({
    paper: {
        paddingBottom: 50,
    },
    grid: {
        padding: theme.spacing(1),
    },
    bottomAppBar: {
        top: 'auto',
        bottom: 0,
    },
    box: {
        height: 'calc(100vh - 100px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    gutters:{
        paddingTop: 8,
        paddingBottom: 8
    },
    subheader: {
        textAlign: 'center'
    }
});
class EditEvent extends Component{
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            errorMessage : [],
            isUpdated : false,
            openDialog: false,
            isProgress: false,
            isDeleted : false,
            community: [],
            formSubmitting: false,
            isLoading: true,
            event: {
                community_id: '',
                title: '',
                description: '',
            },
            redirect: props.redirect,
        };
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

    componentDidMount() {
        this._isMounted = true;
        const {match: {params}} = this.props;
        this.getData();
        axios.get("/api/event/" + params.id).then(response => {
            return response;
        }).then(json => {
            if (!json.data.error) {
                let data = json.data.data;
                this.setState({
                    event: data,
                    isLoading: false,
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

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({formSubmitting: true});
        let data = this.state.event;
        axios.put("/api/event/" + data.id, data).then(response => {
            return response;
        }).then(json => {
            if (!json.data.error) {
                this.setState({
                    isUpdated: true,
                    event: data,
                    error: ''
                });
                setTimeout(() => {
                    return this.props.history.push("/event/" + data.id);
                },1000);
            } else {
                this.setState({formSubmitting: false});
                alert(strings.NET_ERROR);
            }
        }).catch(error => {
            if (error.response) {
                // The request was made and the server responded with a status code that falls out of the range of 2xx
                let err = error.response.data;
                this.setState({
                    error: err.message,
                    errorMessage: err.errors,
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
    handleOpen = () => {
        this.setState({openDialog: true});
    };

    handleClose = () => {
        this.setState({openDialog: false});
    };

    handleDelete = () => {
        this.setState({openDialog: false,isProgress: true});
        let {event} = this.state;
        axios.delete("/api/event/" + event.id).then(response => {
            return response;
        }).then(json => {
            if (!json.data.error) {
                this.setState({isDeleted : true});
                setTimeout(() => {
                    this.props.history.push("/")
                },1000);
            } else {
                this.setState({isProgress: false});
                alert(strings.NET_ERROR);
            }
        });
    };

    render() {
        const { error,errorMessage,formSubmitting,isLoading,event,isProgress,community,openDialog,isUpdated,isDeleted } = this.state;
        let arr = [];
        const {classes} = this.props;
        Object.values(errorMessage).forEach((value) => (
            arr.push(value)
        ));
        return  <React.Fragment>
            <CssBaseline />
            <Header title={strings.EDIT_CONVERSION} user={user} />
            <ProgressDialog open={formSubmitting || isProgress}/>
            <ConfirmDialog title={strings.EVENT_DELETE} content={strings.ARE_YOU_DELETE_EVENT} open={openDialog} cancelClick={this.handleClose} confirmClick={this.handleDelete}/>
            {isLoading ? <Box className={classes.box}>
                <CircularProgress color="secondary"/>
            </Box> : null}
        <Grid container>
            <Grid item>
                {isUpdated || isDeleted ? <Snackbar
                    open={true}
                    TransitionComponent={this.TransitionUp}
                    message={isUpdated ? strings.EVENT_EDITED_SUCCESSFULLY : strings.EVENT_DELETED_SUCCESSFULLY}
                />  : ''}
                {error ? <Alert variant="filled" severity="error">
                    <Typography >{error}</Typography>
                    {arr.map((item, i) => (
                        <Typography key={i} variant="caption" >{item}</Typography>
                    ))}
                </Alert> : ''}
                <form onSubmit={this.handleSubmit} style={{marginTop:16}}>
                    <Grid container>
                        <Grid xs={12} item className={classes.grid}>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel htmlFor="outlined-community-native-simple">{strings.COMMUNITY_NAME}</InputLabel>
                                <Select
                                    value={event.community_id}
                                    disabled
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
                                value={event.title || ''}
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
                                value={event.description || ''}
                                name="description"
                                variant="outlined"
                                onChange={this.handleDescription}
                            />
                        </Grid>
                    </Grid>
                </form>
                </Grid>
            </Grid>
            {!isLoading ? <AppBar position="fixed" className={classes.bottomAppBar} color={"default"}>
                <Toolbar classes={{gutters: classes.gutters}}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Button variant="outlined" fullWidth onClick={this.handleSubmit}
                                    disabled={formSubmitting}>{formSubmitting ? strings.EDITING_CONVERSION : strings.EDIT}</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="outlined" color={"secondary"} fullWidth onClick={this.handleOpen}>
                                {strings.EVENT_DELETE}
                            </Button>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar> : null}
        </React.Fragment>
    }

}
export default withStyles(useStyles)(EditEvent);
