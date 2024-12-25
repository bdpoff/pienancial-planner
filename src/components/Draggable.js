import React from 'react';
import {useDraggable} from '@dnd-kit/core';

export default function Draggable(props) {
  const {attributes, listeners, setNodeRef} = useDraggable({
    id: props.id,
    disabled: props.disabled
  });
  
  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      {props.children}
    </div>
  );
}