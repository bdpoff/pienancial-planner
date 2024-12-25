import React from 'react';
import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function AlertDialog(props) {

  return (
    <Dialog {...props} open={props.open} onClose={props.onClose}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText>
          {props.message}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
