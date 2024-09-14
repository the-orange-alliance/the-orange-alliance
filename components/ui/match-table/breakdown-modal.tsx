import type { Match } from '@the-orange-alliance/api/lib/cjs/models';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MatchDetailsCard from '../../pages/match/match-details-card';

interface MatchBreakdownModalProps {
  match: Match | null;
  open: boolean;
  onClose: () => void;
}

const MatchBreakdownModal: React.FC<MatchBreakdownModalProps> = ({ match, open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          width: '40rem',
          maxWidth: '90%'
        }
      }}
    >
      {match && (
        <>
          <DialogTitle sx={{ m: 0, p: 2 }}>
            {match.matchName}
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme => theme.palette.grey[500]
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            {match.details.matchKey === '' ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  py: 12
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <MatchDetailsCard match={match} />
            )}
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

export default MatchBreakdownModal;
