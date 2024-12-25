import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
//import { Document, Page } from '@react-pdf/renderer';
import { useSelector } from 'react-redux';
import { selectIncome, selectActiveCategories } from '../features/budget/budgetSlice';
import BudgetPieChart from './BudgetPieChart';

export default function PienancialPlan(props) {
  const income = useSelector(selectIncome);
  const categories = useSelector(selectActiveCategories);

  return (
    <div id={props.id}>
        <BudgetPieChart height={400} width={400} />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Income</TableCell>
                <TableCell align="right">${income}</TableCell>
              </TableRow>
            </TableHead>
          </Table>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell align="right">Budget</TableCell>
                <TableCell align="right">Percentage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {category.name}
                  </TableCell>
                  <TableCell align="right">${category.budget}</TableCell>
                  <TableCell align="right">{((category.budget / income) * 100).toFixed(2)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
  );
}