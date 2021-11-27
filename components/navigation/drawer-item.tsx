import NextLink from 'next/link';
import { Box, ButtonBase } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

interface DrawerItemProps {
  title: string;
  href: string;
  icon: React.ReactElement;
  isActive?: boolean;
  isExternal?: boolean;
  onClick?: () => void;
}

const LinkWrapper = ({ href, ...props }) => (
  <NextLink href={href}>
    <a {...props} />
  </NextLink>
);

const DrawerItem = ({ title, href, icon, isExternal, isActive }: DrawerItemProps) => {
  const theme = useTheme();

  return (
    <ButtonBase
      href={href}
      target={isExternal ? '_blank' : undefined}
      component={isExternal ? 'a' : LinkWrapper}
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
        color: `${isActive ? theme.palette.primary.main : theme.palette.text.secondary} !important`,
        bgcolor: isActive ? alpha(theme.palette.primary.main, 0.1) : null,
        '&:hover': {
          bgcolor: isActive ? alpha(theme.palette.primary.main, 0.1) : theme.palette.action.hover
        }
      }}
    >
      <Box sx={{ mr: 3 }}>{icon}</Box>
      {title}
    </ButtonBase>
  );
};

export default DrawerItem;
