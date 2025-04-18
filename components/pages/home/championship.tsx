import EventItem from '@/components/ui/event-item';
import { Box, Card, Link, Typography } from '@mui/material';
import { Event } from '@the-orange-alliance/api/lib/cjs/models';

interface Props {
  events: Event[];
}

const ChampionshipCoverage: React.FC<Props> = ({ events }) => {
  return (
    <Card sx={{ mb: 2, p: 2 }}>
      <Typography
        component="h2"
        sx={{ fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.5, letterSpacing: '-0.02em' }}
      >
        Welcome to the {new Date().getFullYear()} <em>FIRST</em> Championship!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
        More info at{' '}
        <Link href="https://firstchampionship.org" target="_blank" color="secondary">
          firstchampionship.org
        </Link>
      </Typography>

      {events.map(event => (
        <EventItem key={event.eventKey} event={event} showWatch />
      ))}
    </Card>
  );
};

export default ChampionshipCoverage;
