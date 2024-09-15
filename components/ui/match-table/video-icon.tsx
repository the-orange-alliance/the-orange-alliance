import PlayIcon from '@mui/icons-material/PlayCircleOutline';
import { Link } from '@mui/material';

interface MatchVideoIconProps {
  videoUrl: string;
}

const MatchVideoIcon: React.FC<MatchVideoIconProps> = ({ videoUrl }) => {
  return videoUrl ? (
    <Link
      href={videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      color="secondary"
      aria-label="Play Match Video"
    >
      <PlayIcon
        sx={{
          fontSize: '1.125em',
          verticalAlign: 'middle'
        }}
      />
    </Link>
  ) : (
    <PlayIcon
      sx={{
        color: 'divider',
        fontSize: '1.125em',
        verticalAlign: 'middle'
      }}
      titleAccess="No Match Video Available"
    />
  );
};

export default MatchVideoIcon;
