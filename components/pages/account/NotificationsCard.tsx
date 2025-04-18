import { FormControlLabel, Checkbox, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslate } from '@/i18n/i18n';
import { useAppContext } from '@/lib/toa-context';
import { cloudMessaging } from '@/providers/firebase-provider';
import SideCard from './SideCard';

const NotificationsCard = () => {
  const { user } = useAppContext();
  const t = useTranslate();

  const [notificationsConsent, setNotificationsConsent] = useState<
    'granted' | 'denied' | 'unsupported' | null
  >(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);

  useEffect(() => {
    cloudMessaging.isSupported().then(supported => {
      if (!supported) {
        setNotificationsConsent('unsupported');
      } else if (Notification.permission === 'granted') {
        cloudMessaging
          .tokenInlocalforage()
          .then(token => {
            setNotificationsConsent('granted');
            const isEnabled = (!!token && user?.cloudMessagingTokens?.includes(token)) || false;
            setNotificationsEnabled(isEnabled);
          })
          .catch(() => setNotificationsConsent('unsupported'));
      } else {
        setNotificationsConsent('denied');
      }
    });
  }, []);

  const handleToggleNotifications = () => {
    if (notificationsEnabled) {
      cloudMessaging
        .disable()
        .then(() => {
          setNotificationsEnabled(false);
          toast.success(t('pages.account.notifications_card.disabled'));
        })
        .catch(() => {
          toast.error(t('general.error_occurred'));
        });
    } else {
      cloudMessaging
        .init()
        .then(() => {
          setNotificationsEnabled(true);
          setNotificationsConsent('granted');
          toast.success(t('pages.account.notifications_card.enabled'));
        })
        .catch(() => {
          toast.error(
            t('general.error_occurred') + '. ' + t('pages.account.notifications_card.help')
          );
        });
    }
  };

  if (!user || !notificationsConsent) return null;

  return (
    <SideCard
      title="pages.account.notifications_card.title"
      description="pages.account.notifications_card.summary"
    >
      {notificationsConsent === 'unsupported' ? (
        <div>{t('pages.account.notifications_card.unsupported')}</div>
      ) : (
        <>
          <FormControlLabel
            control={
              <Checkbox
                checked={notificationsEnabled}
                onChange={handleToggleNotifications}
                disabled={notificationsConsent !== 'granted'}
              />
            }
            label={t(
              notificationsEnabled
                ? 'pages.account.notifications_card.enabled'
                : 'pages.account.notifications_card.disabled'
            )}
          />

          {notificationsConsent !== 'granted' && (
            <Button variant="contained" fullWidth onClick={handleToggleNotifications}>
              {t('pages.account.notifications_card.grant_access')}
            </Button>
          )}
        </>
      )}
    </SideCard>
  );
};

export default NotificationsCard;
