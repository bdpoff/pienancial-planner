import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMount } from 'react-use';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride-react-19';
import { DndContext, DragOverlay, useSensors, useSensor, PointerSensor } from '@dnd-kit/core';
import { Button, ButtonGroup, useMediaQuery } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { register } from 'swiper/element/bundle';

import { AddDialog, AlertDialog, ConfirmDialog, IncomeDialog, ModifyDialog } from './components/Dialogs';
import BudgetPieChart from './components/BudgetPieChart';
import Draggable from './components/Draggable';
import Droppable from './components/Droppable';
import DownloadDialog from './components/DownloadDialog';
import PieChartSlice from './components/PieChartSlice';
import { setCategoryProp, removeCategory, selectCategories, selectIncome, selectExpenses } from './features/budget/budgetSlice'

register();

export default function App() {
  const orientation = useMediaQuery('(orientation: portrait)') ? 'vertical' : 'horizontal'
  //TODO: const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);

  const mainDivProps = {
    horizontal: { style: { display: 'flex', flexDirection: 'row', height: height, width: width, justifyContent: 'center', alignItems: 'center'} },
    vertical: { style: { display: 'flex', flexDirection: 'column', height: height, width: width, overflow: 'hidden' } }
  }
  const chartDivProps = {
    horizontal: { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' } },
    vertical: { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' } }
  }
  const chartWidth = (width / 2) * 0.8
  const chartHeight = (height / 2) * 0.8

  const chartProps = {
    horizontal: { height: chartWidth, width: chartWidth },
    vertical: { height: chartHeight, width: chartHeight }
  }
  const swiperDivProps = {
    horizontal: { style: { display: 'flex', flexDirection: 'column', height: height, justifyContent: 'center', alignItems: 'center' } },
    vertical: { style: { display: 'flex', flexDirection: 'row', width: width, justifyContent: 'center', alignItems: 'center' } }
  }
  const swiperProps = {
    horizontal: { slidesPerView: 'auto', centeredSlides: true, autoHeight: true, loop: true, direction: 'vertical', mousewheel: true, preventClicks: false, preventClicksPropagation: false, allowTouchMove: false },
    vertical: { slidesPerView: 'auto', centeredSlides: true, autoHeight: true, loop: true, direction: 'horizontal', mousewheel: true, preventClicks: false, preventClicksPropagation: false, allowTouchMove: false, style: {height: chartHeight, width: chartHeight} }
  }

  // const dialogProps = {
  //   maxWidth: false,
  //   sx: {
  //     height: height * 0.7,
  //     width: width * 0.5
  //   }
  // }

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const swiperRef = useRef(null);

  const [forceUpdate, setForceUpdate] = useState(false);
  const [runJoyride, setRunJoyride] = useState(false);
  const [joyrideStep, setJoyrideStep] = useState(0);
  const [activeId, setActiveId] = useState(-1);
  const [activePieId, setActivePieId] = useState(-1);
  const [categoryIndex, setCategoryIndex] = useState(-1);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openIncomeDialog, setOpenIncomeDialog] = useState(false);
  const [openDownloadDialog, setOpenDownloadDialog] = useState(false);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [confirmDialogTitle, setConfirmDialogTitle] = useState('');
  const [confirmDialogMessage, setConfirmDialogMessage] = useState('');
  const confirmDialogCallbackRef = useRef(null);

  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [alertDialogTitle, setAlertDialogTitle] = useState('');
  const [alertDialogMessage, setAlertDialogMessage] = useState('');

  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const income = useSelector(selectIncome);
  const expenses = useSelector(selectExpenses);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10
      }
    })
  )

  const joyrideSteps = [
    {
      title: "Welcome to Pienancial Planner!",
      content: (
        <div>
          This simple app can help you budget for different categories of expenses by managing them like slices in a pie. If you want to follow a short tutorial of the app, press <strong>Next</strong>. You can end the tutorial at any time by pressing <strong>Skip</strong>.
        </div>
      ),
      target: "#main-div",
      placement: "center",
      floaterProps: {
        hideArrow: true
      },
    },
    {
      title: "Set Your Income",
      content: (
        <div>
          The first step is to set your monthly income, so you know how many slices your pie can hold.<br /><br />
          Press the <strong>$</strong> button and set your income to continue.
        </div>
      ),
      placement: "right",
      target: "#income-button",
      styles: {
        buttonNext: {
          display: (typeof income === "number" && income > 0 ? "block" : "none"),
        }
      },
      spotlightClicks: true,
    },
    {
      title: "Add a Slice",
      content: (
        <div>
          Great, now it's time to create your first budget slice.<br /><br />
          Press the <strong>+</strong> button and add a new slice to continue.
        </div>
      ),
      target: "#add-button",
      styles: {
        buttonNext: {
          display: (typeof categories === "object" && categories.length > 0 ? "block" : "none")
        }
      },
      spotlightClicks: true,
    },
    {
      title: "Slice List",
      content: "Nice work! You can now see your budget slice in the list. If you ever want to modify a slice, just press it!",
      target: "#swiper-container",
    },
    {
      title: "Scroll the Slice List",
      content: "Once you add more slices, you'll want to be able to see the rest of them. You can swipe through the slice list using the buttons to either side.",
      target: "#swiper-prev-button",
    },
    {
      title: "Remove a Slice",
      content: (
        <div>
          If you ever want to remove a slice entirely, line it up in the list and press the <strong>-</strong> button.
        </div>
      ),
      target: "#remove-button",
    },
    {
      title: "Add a Slice to the Pie",
      content: (
        <div>
          Last step! To add a slice to your budget pie, just drag it over! You can use the preview to check if it will fit.<br /><br />
          Drag a slice onto the budget pie to continue.
        </div>
      ),
      target: "#main-div",
      placement: "bottom",
      styles: {
        tooltip: {
          opacity: (parseInt(activeId) > -1 ? 0.5 : 1),
        },
        buttonNext: {
          display: (typeof categories === "object" && categories.filter(cat => cat.active).length > 0 ? "block" : "none")
        }
      },
      floaterProps: {
        hideArrow: true
      },
      spotlightClicks: true,
    },
    {
      title: "Finish Your Budget!",
      content: "That's it! I hope you find Pienancial Planner helpful and easy to use!",
      target: "#main-div",
      placement: "center",
      floaterProps: {
        hideArrow: true
      },
    },
  ]

  useMount(() => {
    if (!localStorage.getItem("tutorialComplete")) setRunJoyride(true);
  });

  const handleJoyrideCallback = (data) => {
    console.log(data);
    const { action, index, status, type } = data;
    if (([STATUS.FINISHED, STATUS.SKIPPED]).includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      setJoyrideStep(0);
      setRunJoyride(false);
      localStorage.setItem("tutorialComplete", true)
    } else if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND]).includes(type)) {
      /*if (index === 2 && action == ACTIONS.NEXT) {
        setRunJoyride(false)
        setTimeout(() => {
          setRunJoyride(true)
          setJoyrideStep(3);
        }, 200);
      } else {*/
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      setJoyrideStep(nextStepIndex);
      //}
    }
  };

  function handleDragStart(event) {
    if (event.active.id === 'budget-pie-draggable') {

    } else {
      setActiveId(parseInt(event.active.id));
    }
  }

  function handleDragEnd(event) {
    if (event.over) {
      const index = Math.max(parseInt(activeId), parseInt(activePieId))
      if (index === -1) return
      const cat = categories[index]
      switch (event.over.id) {
        case "budget-pie-droppable":
          if (!cat.active){
            if (income >= expenses + cat.budget) {
              dispatch(setCategoryProp({ index: index, property: "active", value: true }));
              if (runJoyride) setJoyrideStep(joyrideStep + 1)
            } else {
              setAlertDialogTitle("Cannot Add Slice to Budget Pie");
              setAlertDialogMessage(`The budget for "${cat.name}" is $${cat.budget}, but there's only room for $${income - expenses} in the budget pie.`);
              setOpenAlertDialog(true);
            }
          }
          setActiveId(-1);
          setActivePieId(-1);
          break;
        case "swiper-container-droppable":
          dispatch(setCategoryProp({ index: index, property: "active", value: false }));
          setActiveId(-1);
          setActivePieId(-1);
          break;
        default:
          break;
      }
    }
  }

  function handleRemoveButtonClick() {
    setConfirmDialogTitle("Remove Slice");
    setConfirmDialogMessage(`Are you sure you want to remove "${categories[parseInt(swiperRef.current.swiper.realIndex)].name}"?`);
    const confirmDialogCallback = () => {
      const indexToRemove = parseInt(swiperRef.current.swiper.realIndex);
      swiperRef.current.swiper.slidePrev();
      dispatch(removeCategory({ index: indexToRemove }));
    };
    confirmDialogCallbackRef.current = confirmDialogCallback;
    setOpenConfirmDialog(true);
  }

  async function handleExportButtonClick() {
    setOpenDownloadDialog(true)
  }

  return (
    <div className="App">
      <Joyride
        callback={handleJoyrideCallback}
        continuous
        locale={{
          nextLabelWithProgress: 'Next ({step} of {steps})',
        }}
        run={runJoyride}
        hideCloseButton
        disableOverlayClose
        disableBeacon
        scrollToFirstStep
        showProgress
        showSkipButton
        stepIndex={joyrideStep}
        steps={joyrideSteps}
        styles={{
          options: {
            primaryColor: "#1976d2",
          },
          tooltipContent: {
            textAlign: "left"
          }
        }}
      />
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
        <div id="main-div" {...mainDivProps[orientation]}>
          <div {...chartDivProps[orientation]}>
            <Droppable id="budget-pie-droppable">
              <Draggable id="budget-pie-draggable">
                <BudgetPieChart id="budget-pie" {...chartProps[orientation]} setActivePieId={setActivePieId} />
              </Draggable>
            </Droppable>
            <ButtonGroup orientation="horizontal">
              <Button id="income-button" disabled={runJoyride && joyrideStep !== 1} onClick={() => setOpenIncomeDialog(true)}>
                <AttachMoneyRoundedIcon />
              </Button>
              <Button id="add-button" disabled={(runJoyride && joyrideStep !== 2) || typeof income !== "number"} onClick={() => setOpenAddDialog(true)} >
                <AddRoundedIcon />
              </Button>
              <Button id="remove-button" disabled={runJoyride || typeof categories !== 'object' || categories.length === 0} onClick={() => handleRemoveButtonClick()} >
                <RemoveRoundedIcon />
              </Button>
              <Button disabled={runJoyride} onClick={() => handleExportButtonClick()} >
                <DownloadRoundedIcon />
              </Button>
            </ButtonGroup>
          </div>
          <div {...swiperDivProps[orientation]}>
            <Button id="swiper-prev-button" onClick={() => swiperRef.current.swiper.slidePrev()}>
              {orientation === "horizontal" ?
                <KeyboardArrowUpRoundedIcon /> :
                <KeyboardArrowLeftRoundedIcon />
              }
            </Button>
            <Droppable id="swiper-container-droppable">
              <swiper-container id="swiper-container" key={forceUpdate} ref={swiperRef} {...swiperProps[orientation]}>
                {categories.map((category, index) => (
                  <swiper-slide key={`slide-${index}`} onClick={() => {
                    if (categories[index].active) {
                      setAlertDialogTitle("Cannot Modify Active Slice");
                      setAlertDialogMessage(`Slices can't be modified while they're in the budget pie. To modify "${categories[index].name}", drag it out of the budget pie first.`);
                      setOpenAlertDialog(true);
                    } else {
                      setCategoryIndex(index)
                    }
                  }} style={{ width: 'fit-content', justifyContent: 'center', alignItems: 'center' }}>
                    <h4 style={{ textAlign: 'center' }}>{category.name}</h4>
                    <Draggable id={index} key={`draggable-${index}`} disabled={categories[index].active}>
                      <PieChartSlice {...chartProps[orientation]} index={index} key={`slice-${index}`} fillOpacity={1} />
                    </Draggable>
                  </swiper-slide>
                ))}
              </swiper-container>
            </Droppable>
            <Button id="swiper-next-button" onClick={() => swiperRef.current.swiper.slideNext()}>
              {orientation === 'horizontal' ?
                <KeyboardArrowDownRoundedIcon /> :
                <KeyboardArrowRightRoundedIcon />
              }
            </Button>
          </div>
        </div>
        <DragOverlay dropAnimation={null}>
          {(parseInt(activeId) > -1 || parseInt(activePieId) > -1) ? (
            <PieChartSlice {...chartProps[orientation]} index={Math.max(parseInt(activeId), parseInt(activePieId))} fillOpacity={0.5} />
          ) : null}
        </DragOverlay>
      </DndContext>
      <AddDialog open={openAddDialog} onClose={(index) => {
        setOpenAddDialog(false);
        setForceUpdate(!forceUpdate)
        if (runJoyride && typeof index === "boolean" && index) setJoyrideStep(joyrideStep + 1);
        //TODO: Return index of new category and scroll to it
        //if (index > -1) swiperRef.current.swiper.slideToIndex(index)
      }} />
      <AlertDialog open={openAlertDialog} title={alertDialogTitle} message={alertDialogMessage} onClose={() => setOpenAlertDialog(false)} />
      <ConfirmDialog open={openConfirmDialog} title={confirmDialogTitle} message={confirmDialogMessage} confirmDialogCallback={confirmDialogCallbackRef.current} onClose={() => setOpenConfirmDialog(false)} />
      <DownloadDialog open={openDownloadDialog} onClose={() => setOpenDownloadDialog(false)} />
      <IncomeDialog open={openIncomeDialog} onClose={(newIncome) => {
        setOpenIncomeDialog(false)
        if (runJoyride && typeof newIncome === "number" && newIncome > 0) setJoyrideStep(joyrideStep + 1);
      }} />
      <ModifyDialog index={categoryIndex} onClose={() => setCategoryIndex(-1)} />
    </div>
  );
};