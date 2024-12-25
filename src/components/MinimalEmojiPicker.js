import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import  EmojiPicker, { Emoji } from "emoji-picker-react";

const categories = [
  'smileys_people',
  'objects',
  'food_drink',
  'travel_places',
  'activities',
  'animals_nature',
  'symbols',
  'flags'
];

export default function MinimalEmojiPicker(props) {  
  const [showPicker, setShowPicker] = useState(false);

  return (
    <Box label={props.label} border={1} sx={{borderRadius: '8px'}}>
      {!showPicker ? 
      <Button onClick={() => setShowPicker(true)} >
        <Emoji emojiStyle="native" unified={props.unified.length > 0 ? props.unified : "2753"} />
      </Button>
      : null}
      <EmojiPicker open={showPicker} emojiStyle="native" skinTonesDisabled={true} previewConfig={{showPreview: false}} categories={categories} onEmojiClick={(data) => {
        props.onEmojiClick(data)
        setShowPicker(false)
      }} />
    </Box>
  );
};