import Avatar from '@mui/material/Avatar';
import { Box, BoxProps, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface Props {
  title: string;
  subtitle: string;
  icon: React.ReactElement;
}
type NativeAttrs = Omit<BoxProps, keyof Props>;
export type StatisticCardProps = Props & NativeAttrs;

const StatisticCard = ({ title, subtitle, icon, sx, ...props }: StatisticCardProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: 'white',
        p: 2,
        display: 'flex',
        flexDirection: 'row',
        borderRadius: 4,
        ...sx
      }}
      {...props}
    >
      <Avatar
        sx={{
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          mr: 2
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
        <Typography
          sx={{ color: theme.palette.grey[600], lineHeight: 'normal', fontSize: '0.875rem' }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatisticCard;
