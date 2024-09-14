import Image from 'next/image';
import { Grid, Typography } from '@mui/material';
import { useTranslate } from '../i18n/i18n';

const InternalErrorPage = () => {
  const t = useTranslate();
  const rand = Math.floor(Math.random() * 3) + 1;

  return (
    <Grid container alignItems="center" justifyContent="center">
      <Grid item sx={{ textAlign: 'center' }}>
        <Image src={`/imgs/404-${rand}.png`} alt="404" height={310} width={310} />
        <Typography variant="h3">{t('pages.500.title')}</Typography>
        <Typography variant="body1">{t('pages.500.short_info')}</Typography>
      </Grid>
    </Grid>
  );
};

export default InternalErrorPage;
