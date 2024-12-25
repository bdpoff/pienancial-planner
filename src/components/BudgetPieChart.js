import React, { useCallback, useState } from 'react';
import { PieChart, Pie, Cell } from "recharts";
import { useSelector } from 'react-redux';
import { selectIncome, selectExpenses, selectActiveCategories, selectCategories } from '../features/budget/budgetSlice';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  emoji
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
      {emoji ? String.fromCodePoint(parseInt(emoji, 16)) : null}
    </text>
  );
};

const BudgetPieChart = (props) => {
  const income = useSelector(selectIncome);
  const activeCategories = useSelector(selectActiveCategories);
  const categories = useSelector(selectCategories);
  const expenses = useSelector(selectExpenses);

  const onMouseDown = useCallback((data) => {
    props.setActivePieId(categories.findIndex(cat => cat.name === data.name))
  }, []);
  const onMouseUp = useCallback(() => {
    props.setActivePieId(-1)
  }, []);

  const data = [
    { name: "none", value: income - expenses, color: "#FFFFFF", opacity: 1 }
  ]
  activeCategories.forEach(cat => {
    data.push({ name: cat.name, value: cat.budget, color: cat.color, opacity: 1, emoji: cat.emoji })
  });

  const center = props.width / 2
  const radius = center * 0.9

  return (
    <div>
      {(activeCategories.length === 0) ?
        <svg {...props}>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="#FFFFFF"
            stroke="#777"
            strokeWidth={1}
          />
        </svg> :
        <PieChart {...props}>
          <Pie
            data={data}
            cx={center}
            cy={center}
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={radius}
            fill="#FFFFFF"
            dataKey="value"
            stroke="#777"
            strokeWidth={1}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      }
    </div>
  );
}

export default BudgetPieChart;