import { Card, Typography } from '@mui/material';
import { useTranslate } from '../../../i18n/i18n';

interface IProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const SideCard = ({ children, title, description }: IProps) => {
  const t = useTranslate();

  return (
    <Card sx={{ p: 3, mb: 2 }}>
      <Typography fontSize="1.25rem" fontWeight={500} mb={description ? 0 : 2}>
        {t(title)}
      </Typography>
      {description && (
        <Typography fontSize="1rem" color="gray" mb={2}>
          {t(description)}
        </Typography>
      )}
      {children}
    </Card>
  );
};

export default SideCard;
