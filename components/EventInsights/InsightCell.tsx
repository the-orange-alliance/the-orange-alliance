import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import { useTranslate } from '../../i18n/i18n';
import CircularProgressWithLabel from './CircularProgressWithLabel';

const InsightCell = function ({
  value,
  label,
  translationKey,
  year,
  percent = true
}: {
  value: number;
  label?: string;
  translationKey: string;
  year: string;
  percent?: boolean;
}) {
  const lang = useTranslate();
  return (
    <Grid
      item
      container
      xs={6}
      md={4}
      xl={3}
      sx={{ alignContent: 'space-between', padding: '.5em' }}
    >
      <Typography sx={{ textAlign: 'center', textTransform: 'uppercase', fontSize: '.75em' }}>
        {lang(`pages.event.subpages.insights.${year}.${translationKey}`)}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', margin: 'auto' }}>
        <CircularProgressWithLabel
          value={value}
          label={label}
          percent={percent}
        ></CircularProgressWithLabel>
      </Box>
    </Grid>
  );
};

export default InsightCell;
