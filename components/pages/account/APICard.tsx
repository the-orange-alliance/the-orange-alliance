import { Link, Typography } from '@mui/material';
import { useTranslate } from '@/i18n/i18n';
import { useAppContext } from '@/lib/toa-context';
import SideCard from './SideCard';
import NextLink from 'next/link';

const APICard = () => {
  const t = useTranslate();
  const { user } = useAppContext();

  if (!user) return null;

  return (
    <>
      <SideCard
        title="pages.account.api_card.title"
        description="pages.account.api_card.description"
      >
        {/* API Key Generated */}
        {user.apiKey ? (
          <>
            <Typography variant="subtitle2">{t('pages.account.api_card.your_key')}</Typography>
            <code className="api-key">{user.apiKey || 'Not found'}</code>
          </>
        ) : (
          <Typography fontWeight={500}>{t('pages.account.api_card.generating_key')}</Typography>
        )}

        {/* API Docs */}
        <Typography sx={{ marginTop: 2 }} variant="subtitle1">
          Check out the{' '}
          <NextLink href="/apidocs" passHref legacyBehavior>
            <Link>API Documentation</Link>
          </NextLink>{' '}
          for more information.
        </Typography>
      </SideCard>
      <style jsx>{`
        .api-key {
          display: inline-block;
          color: #2563eb;
          background: #eff6ff;
          line-height: 1.2;
          overflow-wrap: anywhere;
          padding: 0.25rem 0.5rem;
          border-radius: 0.5rem;
        }
      `}</style>
    </>
  );
};

export default APICard;
