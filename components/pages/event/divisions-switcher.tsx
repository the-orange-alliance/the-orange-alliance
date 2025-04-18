import { Box, Button, Stack } from '@mui/material';
import { Event } from '@the-orange-alliance/api/lib/cjs/models';
import NextLink from 'next/link';

interface Props {
  eventKey: string;
  divisions: Event[];
}

const DivisionsSwitcher: React.FC<Props> = ({ eventKey, divisions }) => {
  return (
    <Box
      sx={{
        display: 'inline-block',
        py: 0.5,
        px: 1,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        borderRadius: 1,
        mt: 1,
        overflow: 'scroll',
        maxWidth: '100%'
      }}
    >
      <Stack direction="row" spacing={0.5} width="fit-content">
        {divisions.map(division => {
          const isSelected = division.eventKey === eventKey;
          return (
            <NextLink
              key={division.eventKey}
              href={`/events/${division.eventKey}`}
              passHref
              legacyBehavior
            >
              <Button
                size="small"
                color={isSelected ? 'secondary' : 'inherit'}
                sx={{
                  display: 'block',
                  minWidth: 0,
                  color: isSelected ? undefined : 'text.secondary',
                  textAlign: 'center',
                  lineHeight: 1.25,
                  px: 1,
                  py: 1
                }}
              >
                {division.divisionName} Division
              </Button>
            </NextLink>
          );
        })}
      </Stack>
    </Box>
  );
};

export default DivisionsSwitcher;
