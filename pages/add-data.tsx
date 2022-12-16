import { Button, Card, CardContent, Container, Link, Typography } from '@mui/material';
import { Email, Upload } from '@mui/icons-material';
import SEO from '../components/seo';

const ApiDocs = () => {
  return (
    <>
      <SEO
        title="Add data"
        description="Learn how to add data to The Orange Alliance."
        url="/add-data"
      />

      <Container sx={{ py: 6 }}>
        <Typography variant="h1">Add Data</Typography>
        <Typography
          sx={{
            fontSize: '1.125rem',
            fontWeight: 500,
            color: 'text.secondary',
            mt: 0.5
          }}
        >
          Do you have some data you'd like to add to The Orange Alliance?
        </Typography>

        <Typography variant="h4" component="h2" sx={{ mt: 4 }}>
          Teams Data
        </Typography>
        <Typography>
          Data related to a specific team is often submitted directly by that team. This data can
          only be updated via the{' '}
          <Link
            href="https://my.firstinspires.org/Dashboard/"
            target="_blank"
            rel="noreferrer"
            color="secondary"
          >
            firstinspires.org Dashboard
          </Link>{' '}
          by Lead Mentors 1 and 2, and generally takes about 24 hours to appear on The Orange
          Alliance once submitted.
        </Typography>

        <Typography variant="h4" component="h2" sx={{ mt: 4 }}>
          Official Events (Including Off-season)
        </Typography>
        <Typography>
          Data related to official events come directly from the <em>FIRST</em> Tech Challenge
          Scoring System. Please refer to "Uploading Event Data to <em>FIRST</em>" in the{' '}
          <Link
            href="https://www.firstinspires.org/sites/default/files/uploads/resource_library/ftc/scorekeeper-guide.pdf"
            target="_blank"
            rel="noreferrer"
            color="secondary"
          >
            Scorekeeper Guide
          </Link>
          .
        </Typography>

        <Typography variant="h4" component="h2" sx={{ mt: 4 }}>
          Unregistered Events
        </Typography>
        <Typography sx={{ mb: 2 }}>
          For events not registered through the <em>FIRST</em> Tech Challenge Online Scoring System,
          please use one of the following methods to upload results to The Orange Alliance.
        </Typography>
        <Button
          href="https://upload.theorangealliance.org"
          target="_blank"
          rel="noreferrer"
          size="small"
          startIcon={<Upload />}
          color="info"
          sx={{ mb: 2 }}
        >
          DataSync - Sync your event live with TOA
        </Button>
        <br />
        <Button
          href="mailto:data@theorangealliance.org"
          target="_blank"
          rel="noreferrer"
          size="small"
          startIcon={<Email />}
          color="info"
        >
          Add event results after the event has ended
        </Button>
      </Container>
    </>
  );
};

export default ApiDocs;
