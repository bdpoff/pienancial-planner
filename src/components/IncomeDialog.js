import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { selectIncome, selectExpenses, setIncome } from '../features/budget/budgetSlice';
import DollarTextField from './DollarTextField';

export default function IncomeDialog(props) {
  const dispatch = useDispatch();
  const income = useSelector(selectIncome)
  const expenses = useSelector(selectExpenses)
  const [newIncome, setNewIncome] = useState(`${income}` ?? "");
  const [incomeError, setIncomeError] = useState("");

  useEffect(() => {
    validateIncome()
  }, [newIncome])

  function validateIncome() {
    const num = parseInt(newIncome)
    if (num < 1) {
      setIncomeError("Income must be at least $1.")
      return
    }
    if (num < expenses) {
      setIncomeError(`Income cannot be less than expenses ($${expenses}).`)
      return
    }
    setIncomeError("")
    return true
  }

  function handleIncomeChange(event) {
    setNewIncome(event.target.value)
  }

  function handleConfirm() {
    dispatch(setIncome({ income: parseInt(newIncome) }))
    props.onClose()
  }

  return (
    <Dialog {...props} open={props.open} onClose={props.onClose} >
      <DialogTitle>Income</DialogTitle>
      <DialogContent dividers={true}>
        <DollarTextField value={newIncome} error={incomeError.length > 0} helperText={incomeError} slotProps={{ htmlInput: { step: 10 } }} onChange={handleIncomeChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onClose()}>Cancel</Button>
        <Button variant="contained" onClick={() => handleConfirm()} disabled={newIncome.length === 0 || incomeError.length > 0}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}