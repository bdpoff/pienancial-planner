import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { MuiColorInput, matchIsValidColor } from 'mui-color-input'
import { useDispatch, useSelector } from 'react-redux';
import { modifyCategory, selectIncome, selectCategory, selectCategories } from '../features/budget/budgetSlice';
import CategoryTable from './CategoryTable';
import DollarTextField from './DollarTextField';
import MinimalEmojiPicker from './MinimalEmojiPicker';

export default function ModifyDialog(props) {
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
    }
    return false;
  }

  function handleConfirm() {
    dispatch(modifyCategory({ index: props.index, category: {name: name, budget: parseInt(budget), color: color, emoji: emoji, active: false}}))
    props.onClose()
  }

  function handleDone(value) {
    /*switch(modifyField) {
      case "name":
        setName(value)
        break;
      case "budget":
        setBudget(value)
        break;
      case "color":
        setColor(value)
        break;
      case "emoji":
        setEmoji(value)
        break;
    }*/
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

  /*return (
    <Dialog open={props.index > -1} onClose={props.onClose}>
      <DialogTitle>
        <TextField type="text" defaultValue={category ? category.name : "Category"} onChange={handleNameChange}/>
      </DialogTitle>
      <TextField type="text" defaultValue={category ? category.name : "Category"} onChange={(event) => handlePropChange("name", event.target.value)} />
          <TextField type="number" defaultValue={category ? category.budget : 0} onInput={(event) => handlePropChange("budget", parseInt(event.target.value))} max={income} />
          <Switch checked={category ?? category.active} onChange={(event) => handlePropChange("active", event.target.checked)} />
      <TextField type="number" defaultValue={category ? category.budget : 0} onInput={handleBudgetChange} max={income} />
      {!showPicker ? (
        <Button onClick={() => setShowPicker(true)} >
          <Emoji emojiStyle="native" unified={category ? category.emoji : "2753"} />
        </Button>
      ) : null}
      <MinimalEmojiPicker open={showPicker} onEmojiClick={handleEmojiChange} emojiStyle="native" skinTonesDisabled={false} />
      <Input type="color" value={category ? category.color : "#FFFFFF"} onInput={handleColorChange}/>
    </Dialog>
  );*/
}