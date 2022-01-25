import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import withStyles from "@material-ui/core/styles/withStyles";

const useStyles = theme => ({
    root: {
        padding: '8px 32px 20px 32px'
    },
    text: {
        padding: '6px 36px',
    }
});
class ProgressDialog extends Component{
    constructor(props) {
        super(props);
    }
    render() {
        const {classes} = this.props;
        const {open} = this.props;
        return (
            <div>
                <Dialog
                    open={open}
                    keepMounted
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogContent classes={{root: classes.root}}>
                            <Box display="flex"><CircularProgress color="secondary"/> <Button disableRipple classes={{text: classes.text} }>{strings.PLEASE_WAIT}</Button></Box>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}
export default withStyles(useStyles)(ProgressDialog);
