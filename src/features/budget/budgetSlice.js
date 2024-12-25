import { createSlice } from '@reduxjs/toolkit'
//import defaultBudget from './defaultBudget.json';

export const budgetSlice = createSlice({
  name: "budget",
  initialState: {
    budget: localStorage.getItem("budget") ? JSON.parse(localStorage.getItem("budget")) : {income: undefined, categories: []}
  },
  reducers: {
    setIncome: (state, data) => {
      if (typeof data.payload.income === "number") {
        state.budget.income = data.payload.income
        localStorage.setItem("budget", JSON.stringify(state.budget))
      }
    },
    addCategory: (state, data) => {
      const category = state.budget.categories.find(cat => { return cat.name === data.payload.name })
      if (!category) {
        state.budget.categories.push(data.payload)
        localStorage.setItem("budget", JSON.stringify(state.budget))
      }
    },
    modifyCategory: (state, data) => {
      const category = state.budget.categories[data.payload.index]
      if (category) {
        Object.assign(category, data.payload.category)
        localStorage.setItem("budget", JSON.stringify(state.budget))
      }
    },
    removeCategory: (state, data) => {
      const category = state.budget.categories[data.payload.index]
      if (category) {
        state.budget.categories.splice(state.budget.categories.indexOf(category), 1)
        localStorage.setItem("budget", JSON.stringify(state.budget))
      }
    },
    setCategoryProp: (state, data) => {
      const category = state.budget.categories[data.payload.index]
      if (category) {
        category[data.payload.property] = data.payload.value
        localStorage.setItem("budget", JSON.stringify(state.budget))
      }
    },
  },
  selectors: {
    selectIncome: (state) => state.budget.income,
    selectExpenses: (state) => state.budget.categories.filter(cat => { return cat.active }).reduce((sum, expense) => sum + expense.budget, 0),
    selectCategories: (state) => state.budget.categories,
    selectActiveCategories: (state) => state.budget.categories.filter(cat => { return cat.active }),
    selectCategory: (state, index) => state.budget.categories[index],
    selectCategoryIndexByName: (state, name) => state.budget.categories.findIndex(cat => cat.name === name)
  }
})

export const { setIncome, addCategory, modifyCategory, removeCategory, setCategoryProp } = budgetSlice.actions

export const { selectIncome, selectExpenses, selectCategories, selectActiveCategories, selectCategory, selectCategoryIndexByName } = budgetSlice.selectors

export default budgetSlice.reducer