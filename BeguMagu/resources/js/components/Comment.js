import React, {Component} from 'react'
import Header from './Header';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import {Box} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Zoom from "@material-ui/core/Zoom";
import ArchiveIcon from '@material-ui/icons/Archive';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import CircularProgress from "@material-ui/core/CircularProgress";
import {withRouter} from "react-router-dom";
import withStyles from "@material-ui/styles/withStyles";
import ConfirmDialog from "./ConfirmDialog";
import AutorenewIcon from '@material-ui/icons/Autorenew';
import ProgressDialog from "./ProgressDialog";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import Fab from "@material-ui/core/Fab";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

const useStyles = theme => ({
    root: {
        position: 'fixed',
        bottom: theme.spacing(6),
        left: theme.spacing(2),
        zIndex: 10000
    },
    text: {
        padding: theme.spacing(2, 2, 0),
    },
    paper: {
        paddingBottom: 50,
        height: '100%',
        overflow: 'auto',
    },
    list: {
        marginBottom: theme.spacing(1),
    },
    subheader: {
        textAlign: 'center',
        backgroundColor: '#eee',
        lineHeight: '36px'
    },
    bottomAppBar: {
        top: 'auto',
        bottom: 0,
        backgroundColor: theme.palette.background.default
    },
    topAppBar: {
        backgroundColor: theme.palette.background.default
    },
    grow: {
        flexGrow: 1,
    },
    private: {
        position: 'absolute',
        right: 0,
        top: 15,
        backgroundColor: 'red',
        color: 'white',
        borderRadius: 0,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        padding: '2px 6px',
        fontSize: 12
    },
    box: {
        height: 'calc(100vh - 100px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    link: {
        display: 'flex',
        alignItems: 'center'
    },
    archiveItem: {
        display: 'flex',
        alignItems: 'center'
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

class Comment extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isDeleted: false,
            ip: '',
            url: '',
            event: {
                id: '',
                user_id: '',
                title: '',
                username: '',
                description: '',
                date: '',
                status: '',
                like_count: 0,
                dislike_count: 0,
                community: {id: '', name: ''},
                comments: {
                    data: [],
                    total: 0
                },
            },
            openDialog: false,
            isProgress: false,
            addItemId: 0,
            currentPage: 1,
            hasMoreItem: false,
            isLoadMore: false,
        };
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        this.getData();
    }

    getData = () => {
        let {currentPage, event: {comments: {data}}} = this.state;
        const {match: {params}} = this.props;
        axios.get("/api/event/" + params.id + "?page=" + currentPage).then(response => {
            return response;
        }).then(json => {
            if (!json.data.error) {
                let event = json.data.data;
                data.push(...event.comments.data);
                if (this._isMounted) {
                    let isMyEvent = user && user.id === event.user_id;
                    this.setState(prevState => ({
                        event: {
                            ...prevState.event,
                            id: event.id,
                            user_id: event.user_id,
                            title: event.title,
                            username: event.username,
                            like_count: event.like_count,
                            dislike_count: event.dislike_count,
                            like: event.like,
                            date: event.date,
                            description: event.description,
                            status: event.status,
                            community: event.community,
                            comments: {data, total: event.comments.total}
                        },
                        error: '',
                        isLoading: false,
                        isLoadMore: false,
                        currentPage: ++currentPage,
                        hasMoreItem: event.comments.current_page !== event.comments.last_page
                    }));
                }
            }
        }).catch(error => {
            this.setState({
                error: error.message,
                isLoadMore: false
            });
            if (error.response) {
                if (error.response.status === 404) this.props.history.push('/');
            }
        });
    };
    handleReturn = () => {
        return this.props.history.goBack;
    };
    handleData = (comment) => {
        let {hasMoreItem, event: {comments}} = this.state;
        if (hasMoreItem) return false;
        let data = comments.data;
        data.push(comment);
        this.setState(prevState => ({
            event: {
                ...prevState.event, comments: {data, total: ++comments.total}
            }
        }))
    };
    handleEvent = (data) => {
        console.log(data)
        this.setState(prevState => ({
            event: {...prevState.event, status: data.status}
        }))
    };
    handleDeleteData = (id) => {
        let {event: {comments}} = this.state;
        let data = comments.data.filter(item => item.id !== id);
        this.setState(prevState => ({
            event: {
                ...prevState.event, comments: {data, total: --comments.total}
            }
        }))
    };

    handleSendMessage = () => {
        const {event} = this.state;
        const {match: {params}} = this.props;
        return this.props.history.push({pathname: '/comment/create/' + params.id, state: {event}});
    };
    loadMoreItems = (event) => {
        // let node = event.target;
        // const bottom = node.scrollHeight - node.scrollTop === node.clientHeight;
        if (this.state.hasMoreItem) {
            this.setState({isLoadMore: true});
            this.getData();
        }
    };
    handleDelete = (id) => {
        this.setState({isProgress: true});
        let {event: {comments}} = this.state;
        axios.delete("/api/comment/" + id).then(response => {
            return response;
        }).then(json => {
            if (!json.data.error) {
                let data = comments.data.filter(item => item.id !== id);
                this.setState(prevState => ({
                    error: '',
                    isProgress: false,
                    event: {
                        ...prevState.event, comments: {data, total: --comments.total}
                    }
                }))
            } else {
                this.setState({isProgress: false});
                alert(strings.NET_ERROR);
            }
        }).catch(error => {
            if (error.response) {
                let err = error.response.data;
                this.setState({
                    error: err.message,
                    isProgress: false
                })
            }
        });
    };

    handleConversion = () => {
        this.setState({isProgress: true});
        let {event} = this.state;
        event.status = event.status === 1 ? 0 : 1;
        axios.put("/api/event/" + event.id, {status: event.status}).then(response => {
            return response;
        }).then(json => {
            if (!json.data.error) {
                this.setState(prevState => ({
                    event: {...prevState.event, status: json.data.data.status},
                    error: '',
                    isProgress: false
                }));
            } else {
                this.setState({isProgress: false});
                alert(strings.NET_ERROR);
            }
        }).catch(error => {
            if (error.response) {
                let err = error.response.data;
                this.setState({
                    error: err.message,
                    isProgress: false
                })
            }
        });
    };
    handleEventDelete = () => {
        this.setState({openDialog: false, isProgress: true});
        let {event} = this.state;
        axios.delete("/api/event/" + event.id).then(response => {
            return response;
        }).then(json => {
            if (!json.data.error) {
                this.setState({isDeleted: true, isProgress: false});
                setTimeout(() => {
                    this.props.history.push("/")
                }, 1000);
            } else {
                this.setState({isProgress: false});
                alert(strings.NET_ERROR);
            }
        }).catch(error => {
            if (error.response) {
                let err = error.response.data;
                this.setState({
                    error: err.message,
                    isProgress: false
                })
            }
        });
    };
    handleAddedItem = () => {
        this.setState({addItemId: 0});
    };
    handleDeleteItem = (id) => {
        let {event: {comments}} = this.state;
        let data = comments.data.filter(item => item.id !== id);
        this.setState(prevState => ({
            event: {
                ...prevState.event, comments: {data, total: comments.total}
            }
        }))
    };

    handleEdit = () => {
        let {event} = this.state;
        return this.props.history.push('/editEvent/' + event.id);
    };
    handleOpen = () => {
        this.setState({openDialog: true});
    };

    handleClose = () => {
        this.setState({openDialog: false});
    };

    handleLike = (action, comment) => {
        let {event} = this.state;
        let data = {};
        data['action'] = action;
        if (comment) data['comment_id'] = comment.id;
        else data['event_id'] = event.id;
        axios.post("/api/like", data).then(response => {
            return response;
        }).then(json => {
            if (!json.data.error) {
                let like = action === 'like'
                if (comment) {
                    let item = event.comments.data.find(item => item.id === comment.id);
                    if (item.like === undefined) {
                        if (like) item.like_count++;
                        else item.dislike_count++;
                    } else {
                        if (item.like === like) return false;
                        item.like_count = like ? item.like_count + 1 : item.like_count - 1
                        item.dislike_count = like ? item.dislike_count - 1 : item.dislike_count + 1
                    }
                    item.like = like;
                } else {
                    if (event.like === undefined) {
                        if (like) event.like_count++;
                        else event.dislike_count++;
                    } else {
                        if (event.like === like) return false;
                        event.like_count = like ? event.like_count + 1 : event.like_count - 1
                        event.dislike_count = like ? event.dislike_count - 1 : event.dislike_count + 1
                    }
                    event.like = like;
                }
                this.setState({event: event});
            }
        }).catch(error => {
            console.log(error)
        });
    }

    render() {
        const {classes} = this.props;
        const {event, isLoading, isLoadMore, isProgress, openDialog} = this.state;
        let isMyEvent = user && user.id === event.user_id;
        let comment = event.comments.data;
        return (<React.Fragment>
                <CssBaseline/>
                <ProgressDialog open={isProgress}/>
                <ConfirmDialog title={strings.EVENT_DELETE} content={strings.ARE_YOU_DELETE_EVENT} open={openDialog}
                               cancelClick={this.handleClose} confirmClick={this.handleEventDelete}/>
                <Header title={strings.MESSAGES + " " + "(" + event.comments.total + ")"} user={user}/>
                {!isLoading ? <Paper style={{padding: 16}}>
                    <Typography variant="subtitle1">{event.title}</Typography>
                    <Typography variant="body2">{event.description}</Typography>
                    <Typography variant="subtitle2">{strings.COMMUNITY + ': ' + event.community.name}</Typography>
                    <Typography variant="subtitle2">{strings.PUBLISH_ON + ': ' + event.username}</Typography>
                    <Grid container alignItems="center" justify="space-between">
                        <Grid item>
                            <Typography variant="body2" component="span">{event.date}</Typography>
                        </Grid>
                        <Grid item >
                            <IconButton edge="start" color="inherit" aria-label="menu"
                                        onClick={() => this.handleLike('like')}>
                                {event.like === true ? <ThumbUpAltIcon fontSize="small" style={{color: 'green'}}/> :
                                    <ThumbUpAltOutlinedIcon fontSize="small"/>}
                            </IconButton>
                            <Typography variant="body2" component="span">{event.like_count}</Typography>

                            <IconButton edge="start" color="inherit" style={{marginRight: 8}} aria-label="menu"
                                        onClick={() => this.handleLike('dislike')}>
                                {event.like === false ? <ThumbDownIcon fontSize="small" style={{color: 'red'}}/> :
                                    <ThumbDownAltOutlinedIcon fontSize="small"/>}
                            </IconButton>
                            <Typography variant="body2" component="span">{event.dislike_count}</Typography>
                        </Grid>
                    </Grid>
                </Paper> : null}
                {isLoading ? <Box className={classes.box}>
                    <CircularProgress color="secondary"/>
                </Box> : null}
                {!isLoading && !comment.length ? <Box className={classes.box}>
                    <Typography>{strings.COMMENT_NOT_FOUND}</Typography>
                </Box> : null}
                {this.state.error ? <Snackbar
                    open={true}
                    TransitionComponent={this.TransitionUp}
                    message={this.state.error}
                /> : ''}
                {/*<Paper onScroll={this.loadMoreItems} className={classes.paper} elevation={0}>*/}
                <List className={classes.paper}>
                    {comment.map((item, index) => (
                        <Zoom key={item.id} in={true}>
                            <Paper>
                                {index === 0 || item.date !== comment[index - 1].date ?
                                    <ListSubheader className={classes.subheader}>{item.date}</ListSubheader> : ''}
                                <ListItem divider
                                          style={{backgroundColor: item.deleted_at === 'force' ? '#ffcdd2' : item.deleted_at != null ? '#FFECB3' : ''}}>

                                    <ListItemText primary={item.deleted_at == null ? item.name : null}
                                                  secondary={
                                                      item.deleted_at == null ?
                                                          <React.Fragment>
                                                              <Box component="span"><Typography component="span"
                                                                                                variant="body2">{item.content}</Typography></Box>
                                                              <Box component="span" display="flex"
                                                                   justifyContent="flex-end" alignItems="center">
                                                                  <IconButton edge="start" color="inherit"
                                                                              aria-label="menu"
                                                                              onClick={() => this.handleLike('like', item)}>
                                                                      {item.like === true ?
                                                                          <ThumbUpAltIcon fontSize="small"
                                                                                          style={{color: 'green'}}/> :
                                                                          <ThumbUpAltOutlinedIcon fontSize="small"/>}
                                                                  </IconButton>
                                                                  <Typography variant="body2"
                                                                              component="span">{item.like_count}</Typography>

                                                                  <IconButton edge="start" color="inherit"
                                                                              style={{marginRight: 8}} aria-label="menu"
                                                                              onClick={() => this.handleLike('dislike', item)}>
                                                                      {item.like === false ?
                                                                          <ThumbDownIcon fontSize="small"
                                                                                         style={{color: 'red'}}/> :
                                                                          <ThumbDownAltOutlinedIcon fontSize="small"/>}
                                                                  </IconButton>
                                                                  <Typography variant="body2"
                                                                              component="span">{item.dislike_count}</Typography>
                                                                  {isMyEvent ?
                                                                      <IconButton aria-label="delete" size="small"
                                                                                  onClick={() => this.handleDelete(item.id)}>
                                                                          <DeleteIcon/>
                                                                      </IconButton> : null}
                                                              </Box>
                                                          </React.Fragment> : null}/>
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
                {/*</Paper>*/}
                {isMyEvent || event.status ? <AppBar position="fixed" className={classes.bottomAppBar}>
                    <Toolbar>
                        <Grid container spacing={1}>
                            {isMyEvent ? <Grid item xs={6}>
                                <Button variant="outlined" color="secondary" fullWidth
                                        onClick={this.handleOpen}>{strings.DELETE}</Button>
                            </Grid> : ''}
                            {isMyEvent ? <Grid item xs={6}>
                                <Button variant="outlined" color="primary" fullWidth
                                        onClick={this.handleEdit}>{strings.EDIT}</Button>
                            </Grid> : ''}
                            <Grid item xs={isMyEvent ? 6 : 12}>
                                {!isMyEvent ? <Button variant="outlined" color="secondary" fullWidth
                                                      onClick={this.handleSendMessage}>
                                    {strings.SEND_MESSAGE}
                                </Button> : null}
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar> : null}
                <ScrollTop {...this.props}>
                    <Fab color="secondary" size="small" aria-label="scroll back to top">
                        <KeyboardArrowUpIcon/>
                    </Fab>
                </ScrollTop>
            </React.Fragment>
        )
    }
}

export default withRouter((withStyles(useStyles)(Comment)));
