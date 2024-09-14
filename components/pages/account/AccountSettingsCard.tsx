import { Google, GitHub, LockClock, Lock } from '@mui/icons-material';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import toast from 'react-hot-toast';
import { useTranslate } from '@/i18n/i18n';
import { useAppContext } from '@/lib/toa-context';
import TOAUser from '@/lib/models/toa-user';
import { readableDate, readableTime } from '@/lib/utils/common';
import {
  unlinkProvider,
  linkProvider,
  sendPasswordReset,
  changeDisplayName,
  changeEmail
} from '@/providers/firebase-provider';
import SideCard from './SideCard';

const AccountSettingsCard = () => {
  const { user, setUser } = useAppContext();
  const t = useTranslate();

  const unlink = (provider: 'github' | 'google') => {
    unlinkProvider(provider)
      .then(() => {
        const newUser = new TOAUser().fromJSON(user?.toJSON());
        switch (provider) {
          case 'github':
            newUser.githubLinked = false;
            break;
          case 'google':
            newUser.googleLinked = false;
            break;
        }
        setUser(newUser);
      })
      .catch(() => {
        toast.error('general.error_occurred');
      });
  };

  const link = (provider: 'github' | 'google') => {
    linkProvider(provider)
      .then(() => {
        const newUser = new TOAUser().fromJSON(user?.toJSON());
        switch (provider) {
          case 'github':
            newUser.githubLinked = true;
            break;
          case 'google':
            newUser.googleLinked = true;
            break;
        }
        setUser(newUser);
        toast.success(t('general.success').replace('{{ name }}', provider));
      })
      .catch(() => {
        toast.error(t('general.error_occurred'));
      });
  };

  const reset = () => {
    sendPasswordReset()
      .then(() => {
        toast.success(t('pages.account.reset_password_email'));
      })
      .catch(() => {
        toast.error(t('general.error_occurred'));
      });
  };

  const changeName = () => {
    const name = prompt('Please Enter a New Name:');
    if (name == null) {
      return toast.error(t('general.error_occurred'));
    }

    changeDisplayName(name);
    const newUser = new TOAUser().fromJSON(user?.toJSON());
    newUser.displayName = name;
    setUser(newUser);
    toast.success(t('account.updated_name'));
  };

  const changeEmailAddress = () => {
    const email = prompt('Please Enter a New Email:');

    if (email == null) {
      toast.error(t('general.error_occurred'));
      return;
    }
    const success = changeEmail(email);

    if (success) {
      const newUser = new TOAUser().fromJSON(user?.toJSON());
      newUser.email = email;
      setUser(newUser);
      toast.success(t('account.updated_email'));
    } else {
      toast.error(t('account.fail_update_email'));
    }
  };

  if (!user) return null;

  return (
    <SideCard title="pages.account.account_settings">
      <List>
        {/* Reset Password */}
        <ListItem button onClick={reset}>
          <ListItemIcon>
            <Lock />
          </ListItemIcon>
          <ListItemText>{t('pages.account.reset_password')}</ListItemText>
        </ListItem>

        {/* Un/link Google */}
        <ListItem button onClick={() => (user.googleLinked ? unlink('google') : link('google'))}>
          <ListItemIcon>
            <Google />
          </ListItemIcon>
          <ListItemText>
            {t(
              user.googleLinked ? 'pages.account.unlink_account' : 'pages.account.link_account'
            ).replace('{{ name }}', 'Google')}
          </ListItemText>
        </ListItem>

        {/* Un/link Github */}
        <ListItem button onClick={() => (user.githubLinked ? unlink('github') : link('github'))}>
          <ListItemIcon>
            <GitHub />
          </ListItemIcon>
          <ListItemText>
            {t(
              user.githubLinked ? 'pages.account.unlink_account' : 'pages.account.link_account'
            ).replace('{{ name }}', 'Github')}
          </ListItemText>
        </ListItem>

        {/* Change Name */}
        <ListItem button onClick={changeName}>
          <ListItemIcon>
            <Lock />
          </ListItemIcon>
          <ListItemText>{t('pages.account.change_name')}</ListItemText>
        </ListItem>

        {/* Change Email Address */}
        <ListItem button onClick={changeEmailAddress}>
          <ListItemIcon>
            <Lock />
          </ListItemIcon>
          <ListItemText>{t('pages.account.change_email_address')}</ListItemText>
        </ListItem>

        {/* Login Info */}
        <ListItem>
          <ListItemIcon>
            <LockClock />
          </ListItemIcon>
          <ListItemText
            secondary={t('pages.account.last_signin')}
            primary={
              readableDate(user.metadata.lastSignInTime) +
              ' ' +
              readableTime(user.metadata.lastSignInTime)
            }
          />
        </ListItem>
      </List>
    </SideCard>
  );
};

export default AccountSettingsCard;
