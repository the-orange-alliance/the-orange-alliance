import { Button, Card, CardContent, Typography } from '@mui/material';
import { Email, Upload } from '@mui/icons-material';

const ApiDocs = () => {
  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Typography variant={'h5'} sx={{ mb: 2 }}>
          <b>Add Data</b>
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Do you have some data you'd like to add to The Orange Alliance?
        </Typography>
        <Typography variant={'h6'}>Teams Data</Typography>
        <Typography sx={{ mb: 2 }}>
          Data related to a specific team is often submitted directly by that team. This data can
          only be updated via the{' '}
          <a href={'https://my.firstinspires.org/Dashboard/'} target={'_blank'} rel={'noreferrer'}>
            firstinspires.org Dashboard
          </a>{' '}
          by Lead Mentors 1 and 2, and generally takes about 24 hours to appear on The Orange
          Alliance once submitted.
        </Typography>
        <Typography variant={'h6'}>Official Events (Including Off-season)</Typography>
        <Typography sx={{ mb: 2 }}>
          Data related to official events come directly from the FIRST Tech Challenge Scoring
          System. Please refer to Chapter 10 for setting up the event and Chapter 16 for sending
          results to FIRST in the{' '}
          <a
            target={'_blank'}
            rel={'noreferrer'}
            href={
              'https://www.firstinspires.org/sites/default/files/uploads/resource_library/ftc/scorekeeper-guide.pdf'
            }
          >
            Scorekeeper Guide
          </a>
          .
        </Typography>
        <Typography variant={'h6'}>Unregistered Events</Typography>
        <Typography sx={{ mb: 2 }}>
          For events not registered through the FIRST Tech Challenge Online Scoring System, please
          use one of the following methods to upload results to The Orange Alliance.
        </Typography>
        <Button
          sx={{ mb: 2 }}
          href={'https://upload.theorangealliance.org'}
          target={'_blank'}
          rel={'noreferrer'}
        >
          <Upload sx={{ mr: 3 }} /> DataSync - Sync your event live with TOA
        </Button>
        <br />
        <Button href={'mailto:data@theorangealliance.org'} target={'_blank'} rel={'noreferrer'}>
          <Email sx={{ mr: 3 }} /> Add event results after the event has ended
        </Button>
      </CardContent>
    </Card>
  );
};

export default ApiDocs;
