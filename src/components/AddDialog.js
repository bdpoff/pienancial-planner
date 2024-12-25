import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MobileStepper, TextField } from '@mui/material';
import KeyboardArrowLeftRounded from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRounded from '@mui/icons-material/KeyboardArrowRightRounded';
import { MuiColorInput, matchIsValidColor } from 'mui-color-input'
import { useDispatch, useSelector } from 'react-redux';
import { selectIncome, selectCategories, addCategory } from '../features/budget/budgetSlice';
import CategoryTable from './CategoryTable';
import DollarTextField from './DollarTextField';
import MinimalEmojiPicker from './MinimalEmojiPicker';

export default function AddDialog(props) {
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
    props.onClose();
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
      case 4:
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