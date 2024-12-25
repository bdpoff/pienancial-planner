import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import SquareRoundedIcon from '@mui/icons-material/SquareRounded';
import { Emoji } from 'emoji-picker-react';

export default function CategoryTable(props) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          <TableRow key={0} onClick={props.onNameClick}>
            <TableCell component="th" scope="row">Name</TableCell>
            <TableCell align="right">{props.category.name}</TableCell>
          </TableRow>
          <TableRow key={1} onClick={props.onBudgetClick}>
            <TableCell component="th" scope="row">Budget</TableCell>
            <TableCell align="right">${props.category.budget}</TableCell>
          </TableRow>
          <TableRow key={2} onClick={props.onColorClick}>
            <TableCell component="th" scope="row">Color</TableCell>
            <TableCell align="right">
              <SquareRoundedIcon sx={{ color: props.category.color }} />
            </TableCell>
          </TableRow>
          <TableRow key={3} onClick={props.onEmojiClick}>
            <TableCell component="th" scope="row">Emoji</TableCell>
            <TableCell align="right">
              <Emoji emojiStyle="native" unified={props.category.emoji}/>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}