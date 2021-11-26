import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';

const CircularProgressWithLabel = function ({ value, label }: { value: number; label?: string }) {
  // For progress bar, have percentages less than 3% display as 3%, just to show it a little better
  // as it's a very small percentage, so it barely shows up
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        margin: '.5em'
      }}
    >
      <CircularProgress
        size="5em"
        variant="determinate"
        value={100}
        color="inherit"
        sx={{
          color: '#f5f5f5',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      />
      <CircularProgress
        size="5em"
        variant="determinate"
        value={value === 0 ? 0 : Math.max(Math.ceil(value), 3)}
        color="primary"
      />

      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {label || `${Math.round(value * 10) / 10}%`}
        </Typography>
      </Box>
    </Box>
  );
};

export default CircularProgressWithLabel;
