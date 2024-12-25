import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MobileStepper, TextField } from '@mui/material';
import KeyboardArrowLeftRounded from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRounded from '@mui/icons-material/KeyboardArrowRightRounded';
import { MuiColorInput, matchIsValidColor } from 'mui-color-input'

import { useDispatch, useSelector } from 'react-redux';
import { selectIncome, selectExpenses, selectCategories, selectCategory, addCategory, modifyCategory, setIncome } from '../features/budget/budgetSlice';
import CategoryTable from './CategoryTable';
import DollarTextField from './DollarTextField';
import MinimalEmojiPicker from './MinimalEmojiPicker';

export function AddDialog(props) {
  useEffect(() => {
    if (props.open === true && activeStep < 0) setActiveStep(0)
  }, [props.open])
  const categories = useSelector(selectCategories)
  const income = useSelector(selectIncome)
  const dispatch = useDispatch();

  const [activeStep, setActiveStep] = useState(-1);

  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [color, setColor] = useState("");
  const [emoji, setEmoji] = useState("");

  const [nameError, setNameError] = useState("");
  const [budgetError, setBudgetError] = useState("");
  const [colorError, setColorError] = useState("");
  const [emojiError, setEmojiError] = useState("");
  useEffect(() => {
    validateStep()
  }, [name, budget, color, emoji])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinish = () => {
    dispatch(addCategory({ name: name, budget: parseInt(budget), color: color, emoji: emoji, active: false }))
    props.onClose(true);
    setActiveStep(-1);
    setName("");
    setBudget("");
    setColor("");
    setEmoji("");
  }

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        if (name === "") {
          setNameError("Slice name is required.")
          return
        }
        if (name.length > 32) {
          setNameError("Slice name may only be 32 characters long.")
          return
        }
        if (!/^[A-Za-z]+$/.test(name)) {
          setNameError("Slice name must only contain alphabetical characters.")
          return
        }
        if (categories.map(cat => cat.name.toLowerCase()).includes(name.toLowerCase())) {
          setNameError("Slice name is already in use.")
          return
        }
        setNameError("")
        break;
      case 1:
        const num = parseInt(budget)
        if (num < 1) {
          setBudgetError("Slice budget must be at least $1.")
          return
        }
        if (num > income) {
          setBudgetError(`Slice budget cannot be greater than income ($${income}).`)
          return
        }
        setBudgetError("")
        break;
      case 2:
        if (!matchIsValidColor(color)) {
          setColorError("Slice color must be a valid value.")
          return
        }
        if (categories.findIndex(cat => cat.color === color) > -1) {
          setColorError("Slice color is already in use.")
          return
        }
        setColorError("")
        break;
      case 3:
        if (categories.findIndex(cat => cat.emoji === emoji) > -1) {
          setEmojiError("Slice emoji is already in use.")
          return
        }
        setEmojiError("")
        break;
      default:
        break;
    }
    return true
  }

  return (
    <Dialog {...props} open={props.open} onClose={props.onClose}>
      <DialogTitle>Add Slice</DialogTitle>
      <DialogContent dividers={true}>
        {activeStep === 0 ? <TextField label="Slice Name" value={name} error={nameError.length > 0} helperText={nameError} type="text" onChange={(event) => { setName(event.target.value) }} /> : null}
        {activeStep === 1 ? <DollarTextField label="Slice Budget" value={budget} error={budgetError.length > 0} helperText={budgetError} slotProps={{ htmlInput: { step: 10 } }} onChange={(event) => { setBudget(event.target.value) }} /> : null}
        {activeStep === 2 ? <MuiColorInput label="Slice Color" value={color} error={colorError.length > 0} helperText={colorError} isAlphaHidden={true} format="hex" onChange={(value) => { setColor(value); }} /> : null}
        {activeStep === 3 ?
          <MinimalEmojiPicker label="Slice Emoji" unified={emoji} onEmojiClick={(data) => { setEmoji(data.unified) }} /> : null}
        {activeStep === 4 ? <CategoryTable category={{ name: name, budget: budget, color: color, emoji: emoji }} onNameClick={() => setActiveStep(0)} onBudgetClick={() => setActiveStep(1)} onColorClick={() => setActiveStep(2)} onEmojiClick={() => setActiveStep(3)} /> : null}
      </DialogContent>
      <DialogActions>
        <MobileStepper
          variant="dots"
          steps={5}
          position="static"
          activeStep={activeStep}
          backButton={
            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
              <KeyboardArrowLeftRounded />
              Back
            </Button>
          }
          nextButton={
            <Button
              variant={activeStep === 4 ? "contained" : "text"}
              size="small"
              onClick={activeStep === 4 ? handleFinish : handleNext}
              disabled={((activeStep === 0 && (name.length === 0 || nameError.length > 0)) || (activeStep === 1 && (budget.length === 0 || budgetError.length > 0)) || (activeStep === 2 && (color.length === 0 || colorError.length > 0)) || (activeStep === 3 && (emoji.length === 0 || emojiError.length > 0)))}>
              {activeStep === 4 ? "Finish" : "Next"}
              {activeStep === 4 ? null : <KeyboardArrowRightRounded />}
            </Button>
          }
        />
      </DialogActions>
    </Dialog>
  );
}

export function AlertDialog(props) {

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

export function ConfirmDialog(props) {

  function handleConfirm() {
    if(typeof props.confirmDialogCallback === 'function') {
      props.confirmDialogCallback();
    }
    if(typeof props.onClose === 'function') {
      props.onClose();
    }
  }

  return (
    <Dialog {...props} open={props.open} onClose={props.onClose}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText>
          {props.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onClose()}>Cancel</Button>
        <Button variant="contained" onClick={() => handleConfirm()}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}

export function IncomeDialog(props) {
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
    props.onClose(parseInt(newIncome))
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

export function ModifyDialog(props) {
  const categories = useSelector(selectCategories)
  const income = useSelector(selectIncome)
  const category = useSelector(state => selectCategory(state, props.index))
  const dispatch = useDispatch();
  const [modifyField, setModifyField] = useState("");

  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [color, setColor] = useState("");
  const [emoji, setEmoji] = useState("");

  useEffect(() => {
    if (props.index < 0) {
      setName("")
      setBudget("")
      setColor("")
      setEmoji("")
    } else {
      setName(category.name)
      setBudget(`${category.budget}`)
      setColor(category.color)
      setEmoji(category.emoji)
    }
  }, [props.index])

  useEffect(() => {
    validateStep()
  }, [name, budget, color, emoji])

  const [nameError, setNameError] = useState("");
  const [budgetError, setBudgetError] = useState("");
  const [colorError, setColorError] = useState("");
  const [emojiError, setEmojiError] = useState("");

  function confirmDisabled() {
    switch(modifyField){
      case "name":
        return (name.length === 0 || nameError.length > 0);
      case "budget":
        return (budget.length === 0 || budgetError.length > 0);
      case "color":
        return (color.length === 0 || colorError.length > 0);
      case "emoji":
        return (emoji.length === 0 || emojiError.length > 0);
      default:
        break;
    }
    return false;
  }

  function handleConfirm() {
    dispatch(modifyCategory({ index: props.index, category: {name: name, budget: parseInt(budget), color: color, emoji: emoji, active: false}}))
    props.onClose()
  }

  function handleDone(value) {
    setModifyField("")
  }

  const validateStep = () => {
    switch(modifyField) {
      case "name":
        if (name === "") {
          setNameError("Slice name is required.")
          return
        }
        if (name.length > 32) {
          setNameError("Slice name may only be 32 characters long.")
          return
        }
        if (!/^[A-Za-z]+$/.test(name)) {
          setNameError("Slice name must only contain alphabetical characters.")
          return
        }
        const matchIndex = categories.findIndex(cat => cat.name.toLowerCase() === name.toLowerCase())
        if (matchIndex > -1 && matchIndex !== props.index) {
          setNameError("Slice name is already in use.")
          return
        }
        setNameError("")
        break;
      case "budget":
        const num = parseInt(budget)
        if (num < 1) {
          setBudgetError("Slice budget must be at least $1.")
          return
        }
        if (num > income) {
          setBudgetError(`Slice budget cannot be greater than income ($${income}).`)
          return
        }
        setBudgetError("")
        break;
      case "color":
        if (!matchIsValidColor(color)) {
          setColorError("Slice color must be a valid value.")
          return
        }
        if (categories.findIndex(cat => cat.color === color) > -1) {
          setColorError("Slice color is already in use.")
          return
        }
        setColorError("")
        break;
      case "emoji":
        if (categories.findIndex(cat => cat.emoji === emoji) > -1) {
          setEmojiError("Slice emoji is already in use.")
          return
        }
        setEmojiError("")
        break;
      case 4:
        break;
    }
    return true
  }

  return (
    <Dialog {...props} open={props.index > -1} onClose={props.onClose}>
      <DialogTitle>Modify Slice</DialogTitle>
      {props.index > -1 ?
        <DialogContent dividers={true}>
          <CategoryTable category={{name: name, budget: budget, color: color, emoji: emoji}} onNameClick={() => setModifyField("name")} onBudgetClick={() => setModifyField("budget")} onColorClick={() => setModifyField("color")} onEmojiClick={() => setModifyField("emoji")}/>
        </DialogContent>
        : null}
      <DialogActions>
        {modifyField.length === 0 ?
          <div>
            <Button onClick={() => props.onClose()}>Cancel</Button>
            <Button variant="contained" onClick={() => handleConfirm()}>Confirm</Button>
          </div> : null}
        {modifyField === "name" ?
          <div>
            <TextField label="Slice Name" value={name} error={nameError.length > 0} helperText={nameError} type="text" onChange={(event) => { setName(event.target.value) }} />          <Button variant="contained" diabled={confirmDisabled()} onClick={() => handleDone()}>Done</Button>
          </div> : null}
        {modifyField === "budget" ?
          <div>
            <DollarTextField label="Slice Budget" value={budget} error={budgetError.length > 0} helperText={budgetError} slotProps={{ htmlInput: { step: 10 } }} onChange={(event) => { setBudget(event.target.value) }} />
            <Button variant="contained" diabled={confirmDisabled()} onClick={() => handleDone()}>Done</Button>
          </div> : null}
        {modifyField === "color" ?
          <div>
            <MuiColorInput label="Slice Color" value={color} error={colorError.length > 0} helperText={colorError} isAlphaHidden={true} format="hex" onChange={(value) => { setColor(value); }} />
            <Button variant="contained" diabled={confirmDisabled()} onClick={() => handleDone()}>Done</Button>
          </div> : null}
        {modifyField === "emoji" ?
          <div>
            <MinimalEmojiPicker label="Slice Emoji" unified={emoji} onEmojiClick={(data) => { setEmoji(data.unified) }} />
            <Button variant="contained" diabled={confirmDisabled()} onClick={() => handleDone()}>Done</Button>
          </div> : null}
      </DialogActions>
    </Dialog>
  );
}