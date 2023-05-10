import { Box, Typography, TextareaAutosize } from '@mui/material';
import React from 'react';

const Home = (props) => {
  function updateToken(e) {
    props.setTokenState(e.target.value)
  }


  return (
    <Box p={5}>
      <Typography variant='h2'>
        Welcome to WISER
      </Typography>
      <TextareaAutosize
        minRows={5}
        onChange={e => updateToken(e)}
      >
      </TextareaAutosize>
    </Box>
  )
};

export default Home;
