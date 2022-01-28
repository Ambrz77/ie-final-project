import React, {Component} from 'react'
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import List from "@material-ui/core/List";
import AutorenewIcon from '@material-ui/icons/Autorenew';
import Zoom from "@material-ui/core/Zoom";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import {withRouter} from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Header from "./Header";
import IconButton from "@material-ui/core/IconButton";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbDownAltOutlinedIcon from "@material-ui/icons/ThumbDownAltOutlined";
import ProgressDialog from "./ProgressDialog";

const useStyles = theme => ({
    root: {
        position: 'fixed',
        bottom: theme.spacing(2),
        left: theme.spacing(2),
        zIndex: 10000
    },
    paper: {
        paddingBottom: 50,
        height: '100%',
        overflow: 'auto',
    },
    search: {
        paddingTop: 8,
    },
    bottomAppBar: {
        top: 'auto',
        bottom: 0,
    },
    searchItem: {
        paddingLeft: 2,
        paddingRight: 2,
    },
    gutters: {
        paddingRight: 0
    },
    ledBox: {
        position: 'absolute',
        right: 10,
        top: 10
    },
    ledGreen: {
        width: 8,
        height: 8,
        backgroundColor: '#abff00',
        borderRadius: '50%',
        boxShadow: 'rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #304701 0 -1px 9px,#89ff00 0 2px 12px',
    },
    subheader: {
        textAlign: 'center',
        backgroundColor: '#eee',
        lineHeight: '36px'
    },
    inline: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    box: {
        height: 'calc(100vh - 100px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    primary: {
        paddingRight: 24
    }
});

function ScrollTop(props) {
    const {children, window, classes} = props;
    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
        disableHysteresis: true,
        threshold: 100,
    });

    const handleClick = event => {
        const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');

        if (anchor) {
            anchor.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    };

    return (
        <Zoom in={trigger}>
            <div onClick={handleClick} role="presentation" className={classes.root}>
                {children}
            </div>
        </Zoom>
    );
}

class Event extends Component {
    _isMounted = false;
    _timeout = undefined;
    _search = '';
    _height = 0;

    constructor(props) {
        super(props);
        this.state = {
            event: [],
            community: {},
            title: '',
            error: '',
            isJoin: false,
            isAdmin: false,
            currentPage: 1,
            hasMoreItem: false,
            isLoading: true,
            isFirstRun: true,
            isLoadMore: false,
            formSubmitting: false
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        this.getData();
    }

    getData = () => {
        let {event, currentPage} = this.state;
        const {match: {params}} = this.props;
        axios.get("/api/community/" + params.id + "?page=" + currentPage + this._search).then(response => {
            return response;
        }).then(json => {
            if (!json.data.error) {
                if (this._isMounted) {
                    let data = json.data;
                    event.push(...data.data);
                    this.setState({
                        community: data.community,
                        event: event,
                        error: '',
                        isAdmin: data.is_admin,
                        isJoin: data.is_join,
                        isFirstRun: false,
                        isLoadMore: false,
                        currentPage: ++currentPage,
                        hasMoreItem: data.meta.current_page !== data.meta.last_page,
                        isLoading: false
                    });
                }
            }
        }).catch(error => {
            let err = error.message;
            if (this._isMounted) {
                this.setState({
                    error: err,
                    isLoadMore: false,
                    isLoading: false
                })
            }
        }).finally(this.setState({error: ''}));
    };
    loadMoreItems = (event) => {
        // let node = event.target;
        // const bottom = node.scrollHeight - node.scrollTop === node.clientHeight;
        if (this.state.hasMoreItem) {
            this.setState({isLoadMore: true});
            this.getData();
        }
    };

    handleData = (data) => {
        let {event, hasMoreItem} = this.state;
        if (hasMoreItem) return false;
        event.push(data);
        this.setState({event});
    };

    handlePostCreate = () => {
        return this.props.history.push("/event/create");
    };

    handleEdit = (e, event) => {
        e.stopPropagation();
        return this.props.history.push('/editEvent/' + event.id);
    };

    handleCommunityEdit = (e) => {
        e.stopPropagation();
        return this.props.history.push("/editCommunity/" + this.state.community.id);
    };

    handleEvent = (event) => {
        return this.props.history.push("/event/" + event.id);
    };

    handleTitle = (e) => {
        let value = e.target.value;
        if (this._timeout !== undefined) clearTimeout(this._timeout);
        this._timeout = setTimeout(() => {
            this.setState({isLoading: true, event: [], currentPage: 1}, () => {
                if(value)this._search = '&title='+value;
                else this._search = '';
                this.getData();
            });
        }, 1000)
    };

    handleJoin = () => {
        const {community, isJoin} = this.state;
        this.setState({formSubmitting: true});
        if (!isJoin) {
            axios.post("/api/community/user", {community_id: community.id}).then(response => {
                return response;
            }).then(json => {
                if (!json.data.error) {
                    if (this._isMounted) {
                        this.setState({
                            isJoin: true,
                            formSubmitting: false,
                            isLoading: false
                        });
                    }
                }
            }).catch(error => {
                if (this._isMounted) {
                    this.setState({
                        isLoading: false,
                        formSubmitting: false,
                    })
                }
            });
        } else {
            axios.delete("/api/community/user/" + community.id).then(response => {
                return response;
            }).then(json => {
                if (!json.data.error) {
                    if (this._isMounted) {
                        this.setState({
                            isJoin: false,
                            isLoading: false,
                            formSubmitting: false,
                        });
                    }
                }
            }).catch(error => {
                if (this._isMounted) {
                    this.setState({
                        isLoading: false,
                        formSubmitting: false,
                    })
                }
            });
        }
    }


    render() {
        const {classes} = this.props;
        let {community, event, isLoading, isFirstRun, isLoadMore, isAdmin, isJoin, formSubmitting} = this.state;
        return (
            <React.Fragment>
                <CssBaseline/>
                <ProgressDialog open={formSubmitting}/>
                <Header title={this.props.match.params.title || community.name}/>
                {!isFirstRun ? <Grid container className={classes.search}>
                    <Grid item xs={12} className={classes.searchItem}>
                        <TextField
                            size="small"
                            id="outlined-title-input"
                            fullWidth
                            label={strings.TITLE}
                            variant="outlined"
                            onChange={this.handleTitle}
                        />
                    </Grid>
                </Grid> : null}
                {isLoading ? <Box className={classes.box}>
                    <CircularProgress color="secondary"/>
                </Box> : null}
                {!isLoading && !event.length ? <Box className={classes.box}>
                    <Typography>{strings.CONVERSION_NOT_FOUND}</Typography>
                </Box> : null}
                <List className={classes.paper}>
                    {event.map((item, index) => (
                        <Zoom key={item.id} in={true}>
                            <Paper>
                                <ListItem divider button onClick={() => this.handleEvent(item)}
                                          classes={{gutters: classes.gutters}}>
                                    <ListItemText classes={{secondary: classes.inline}}
                                                  primary={<Typography className={classes.primary}
                                                                       variant={"body2"}>{item.title}</Typography>}
                                                  secondary={user.id === item.user_id ? <React.Fragment>
                                                      <Button color={"primary"} size="small"
                                                              onClick={(e) => this.handleEdit(e, item)}>
                                                          {strings.EDIT}
                                                      </Button>
                                                  </React.Fragment> : ''}/>
                                </ListItem>
                            </Paper>
                        </Zoom>
                    ))}
                    {this.state.hasMoreItem ? <Box display="flex" justifyContent="center" m={2}>
                        {isLoadMore ? <CircularProgress size={24} color="secondary"/> :
                            <Fab color="secondary" size="small" aria-label="load more item"
                                 onClick={this.loadMoreItems}>
                                <AutorenewIcon/>
                            </Fab>}
                    </Box> : null}
                </List>
                {!isFirstRun ? <AppBar position="fixed" className={classes.bottomAppBar} color={"default"}>
                    <Toolbar>
                        <Grid container spacing={1}>
                            {isJoin || isAdmin ? <Grid item xs={6}>
                                <Button variant="outlined" fullWidth onClick={this.handlePostCreate}>
                                    {strings.CREATE_EVENT}
                                </Button>
                            </Grid> : null}
                            {!isAdmin ?
                                <Grid item xs={isJoin ? 6 : 12}>
                                    <Button variant="contained" color={isJoin ? 'secondary' : 'primary'} fullWidth onClick={this.handleJoin}>
                                        {isJoin ? strings.LEAVE_COMMUNITY : strings.JOIN_COMMUNITY}
                                    </Button>
                                </Grid> : <Grid item xs={6}>
                                    <Button variant="outlined" fullWidth onClick={this.handleCommunityEdit}>
                                        {strings.EDIT_COMMUNITY}
                                    </Button>
                                </Grid>}
                        </Grid>
                    </Toolbar>
                </AppBar> : null}
                {isLoading}
                <ScrollTop {...this.props}>
                    <Fab color="secondary" size="small" aria-label="scroll back to top">
                        <KeyboardArrowUpIcon/>
                    </Fab>
                </ScrollTop>
            </React.Fragment>
        )
    }
}

export default withRouter((withStyles(useStyles)(Event)));
