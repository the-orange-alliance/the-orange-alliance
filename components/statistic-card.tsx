import Avatar from '@mui/material/Avatar';
import { Card, CardProps, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface Props {
  title: string;
  subtitle: string;
  icon: React.ReactElement;
}
type NativeAttrs = Omit<CardProps, keyof Props>;
export type StatisticCardProps = Props & NativeAttrs;

const StatisticCard = ({ title, subtitle, icon, sx, ...props }: StatisticCardProps) => {
  const theme = useTheme();

  return (
    <Card sx={{ p: 2, display: 'flex', flexDirection: 'row', ...sx }} {...props}>
      <Avatar
        sx={{
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          mr: 2
        }}
      >
        {icon}
      </Avatar>
      <div>
        <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
        <Typography
          sx={{ color: theme.palette.grey[600], lineHeight: 'normal', fontSize: '0.875rem' }}
        >
          {subtitle}
        </Typography>
      </div>
    </Card>
  );
};

export default StatisticCard;
