import React from 'react';
import { useSelector } from 'react-redux';
import { selectIncome, selectCategory } from '../features/budget/budgetSlice';

//TODO: Convert to Sector

const PieChartSlice = (props) => {
  const income = useSelector(selectIncome);
  const category = useSelector(state => selectCategory(state, props.index));

  const radius = (props.width / 2) * 0.9
  const angle = ((category.budget / income) * 360);

  const radians = (angle * Math.PI) / 180;
  const endX = radius + (radius * Math.cos(radians));
  const endY = radius - (radius * Math.sin(radians));
  const largeArcFlag = angle > 180 ? 1 : 0;

  const d = `M ${radius} ${radius} H ${radius * 2} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${endX} ${endY} Z`;

  const labelRadius = radius / 2;
  const labelAngle = angle / 2;
  const labelRadians = (labelAngle * Math.PI) / 180; 
  const labelX = radius + (labelRadius * Math.cos(labelRadians));
  const labelY = radius - (labelRadius * Math.sin(labelRadians));

  return (
    <svg width={props.width} height={props.height}>
      <path d={d} fill={category.color} fillOpacity={props.fillOpacity}/>
      <text x={labelX} y={labelY} fill="white" textAnchor="middle" dominantBaseline="central">
        {category.emoji ? String.fromCodePoint(parseInt(category.emoji, 16)) : null}
      </text>
    </svg>
  );
};

export default PieChartSlice;
