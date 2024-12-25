import React from 'react';
import { InputAdornment, TextField } from '@mui/material';

export default function DollarTextField(props) {
  const trimProps = {...props}
  delete trimProps.slotProps
  return (
    <TextField
      type='number'
      slotProps={{
        input: {
          startAdornment: <InputAdornment position="start">$</InputAdornment>
        },
        ...props.slotProps
      }}
      {...trimProps}
    />
  )
};