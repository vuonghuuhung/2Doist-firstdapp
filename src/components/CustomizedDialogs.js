import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import CircularIndeterminate from './CircularIndeterminate';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function CustomizedDialogs(props) {
  const { showSign, mined, transactionHash, setShowDialog, error, setError } = props;

  return (
    <div>
      <BootstrapDialog
        aria-labelledby="customized-dialog-title"
        open={true}
      >
        <BootstrapDialogTitle id="customized-dialog-title">
          {mined && !error && 'Appointment Confirmed'}
          {!mined && !error &&  !showSign && 'Confirming Your Appointment...'}
          {!mined && !error && showSign && 'Please Sign to Confirm'}
          {error && 'ERROR'}
        </BootstrapDialogTitle>
        {!error && <DialogContent dividers>
          {mined && !error && <div>
            Your appointment has been confirmed and is on the blockchain.<br /><br />
            <a target="_blank" href={`https://goerli.etherscan.io/tx/${transactionHash}`}>View on Etherscan</a>
            </div>}
          {!mined && !showSign && <div><p>Please wait while we confirm your appoinment on the blockchain....</p></div>}
          {!mined && showSign && <div><p>Please sign the transaction to confirm your appointment.</p></div>}
          <div className='circle'>
            {!mined && !error && <CircularIndeterminate />}
          </div>
        </DialogContent>}
        {mined && !error && <DialogActions>
          <Button autoFocus onClick={() => {
            setShowDialog(false);
            window.location.reload();
          }}>
            Close
          </Button>
        </DialogActions>}
        {error && <DialogActions>
          <Button autoFocus onClick={() => {
            setShowDialog(false);
            setError(false);
            window.location.reload();
          }}>
            Close
          </Button>
        </DialogActions>}
      </BootstrapDialog>
    </div>
  );
}