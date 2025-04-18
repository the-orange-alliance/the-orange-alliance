import { useMemo } from 'react';
import Image from 'next/image';
import { Stack, Typography } from '@mui/material';
import { useTranslate } from '@/i18n/i18n';
import SEO from '@/components/seo';

const NotFoundPage = () => {
  const t = useTranslate();
  const rand = useMemo(() => Math.floor(Math.random() * 3) + 1, []);

  return (
    <>
      <SEO title="Page Not Found" />
      <Stack alignItems="center" py={8} px={2} textAlign="center">
        <Image
          src={`/imgs/404-${rand}.png`}
          height={180}
          width={180}
          style={{ maxWidth: '100%', height: 'auto' }}
          aria-hidden="true"
          alt=""
        />
        <Typography variant="h1" mt={2} mb={1}>
          {t('pages.404.title')}
        </Typography>
        <Typography variant="body1">{t('pages.404.short_info')}</Typography>
      </Stack>
    </>
  );
};

export default NotFoundPage;
