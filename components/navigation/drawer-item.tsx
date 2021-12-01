import React, { forwardRef } from 'react';
import NextLink from 'next/link';
import { Box, Button, ButtonBase, Grid, Typography } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import TOAUser from '../../lib/TOAUser';
import { useTranslate } from '../../i18n/i18n';
import { useRouter } from 'next/router';

interface DrawerItemProps {
  title: string;
  href: string;
  icon: React.ReactElement;
  isActive?: boolean;
  isExternal?: boolean;
  onClick?: () => void;
  isMyToa?: boolean;
  toaUser?: TOAUser;
}

const LinkWrapper: React.ForwardRefRenderFunction<
  HTMLAnchorElement,
  { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>
> = ({ href, ...props }, ref) => (
  <NextLink href={href}>
    <a ref={ref} {...props} />
  </NextLink>
);

const DrawerItem = ({
  title,
  href,
  icon,
  isExternal,
  isActive,
  toaUser,
  isMyToa
}: DrawerItemProps) => {
  const theme = useTheme();
  const t = useTranslate();
  const router = useRouter();

  return (
    <>
      {isMyToa && !toaUser ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            py: 2,
            px: 2,
            mx: 1,
            my: 0.5,
            marginBottom: 0,
            paddingBottom: 0.5,
            borderRadius: 2,
            fontSize: '0.875rem',
            fontWeight: 500,
            lineHeight: 1,
            color: `${
              isActive ? theme.palette.primary.main : theme.palette.text.secondary
            } !important`
          }}
        >
          <Box sx={{ mr: 3 }}>{icon}</Box>

          <Grid container direction={'column'} justifyContent="center">
            <Grid item>
              {t('drawer.mytoa.hello').replace('{{ name }}', t('drawer.mytoa.guest'))}
            </Grid>
            <Grid item>
              <Grid container direction={'row'}>
                <Grid item>
                  <Button
                    size={'small'}
                    onClick={() => router.push({ pathname: '/account/login' })}
                  >
                    {t('drawer.mytoa.login')}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    size={'small'}
                    onClick={() => router.push({ pathname: '/account/register' })}
                  >
                    {t('drawer.mytoa.register')}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <ButtonBase
          href={isMyToa && !toaUser ? '' : href}
          target={isExternal ? '_blank' : undefined}
          component={isExternal ? 'a' : forwardRef(LinkWrapper)}
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            py: 1,
            px: 2,
            mx: 1,
            my: 0.5,
            borderRadius: 2,
            fontSize: '0.875rem',
            fontWeight: 500,
            lineHeight: 1,
            cursor: isMyToa && !toaUser ? 'default' : 'pointer',
            color: `${
              isActive ? theme.palette.primary.main : theme.palette.text.secondary
            } !important`,
            bgcolor: isActive ? alpha(theme.palette.primary.main, 0.1) : null,
            '&:hover': {
              bgcolor: isActive
                ? alpha(theme.palette.primary.main, 0.1)
                : theme.palette.action.hover
            }
          }}
        >
          <Box sx={{ mr: 3 }}>
            {!toaUser || !isMyToa || (isMyToa && toaUser && !toaUser.photoURL) ? (
              icon
            ) : (
              <img className={'avatar'} src={toaUser.photoURL} alt={'myTOA User Profile Photo'} />
            )}
          </Box>
          {!isMyToa && title}

          {isMyToa && toaUser && (
            <Grid container direction={'column'}>
              <Grid item>
                <Typography variant={'subtitle1'}>
                  <b>{toaUser.displayName}</b>
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant={'caption'}>{toaUser.email}</Typography>
              </Grid>
            </Grid>
          )}
        </ButtonBase>
      )}

      <style jsx>{`
        .avatar {
          flex: none;
          width: 32px;
          height: 32px;
          line-height: 32px;
          border-radius: 50%;
          background: #ececec;
          border: 1px solid #d8d8d8;
          font-size: 32px;
          color: #000;
          text-align: center;
          pointer-events: none;
        }
      `}</style>
    </>
  );
};

export default DrawerItem;
