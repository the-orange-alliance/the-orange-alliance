import { Avatar, Box, Button, Card, Container, IconButton, Link, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { GitHub, LinkedIn } from '@mui/icons-material';
import SEO from '@/components/seo';

const people: {
  name: string;
  title: string;
  profile?: string;
  github?: string;
  linkedin?: string;
}[] = [
  {
    name: 'Alexander Fera',
    title: 'Co-Founder, Board Member, and Executive Director',
    profile: 'alex.png',
    github: 'afera15',
    linkedin: 'alexfera'
  },
  {
    name: 'Keith Moore',
    title: 'Co-Creator',
    profile: 'keith.png'
  },
  {
    name: 'Kyle Flynn',
    title: 'Board Member and Chief Technology Officer',
    profile: 'kyle.png',
    github: 'kyle-flynn',
    linkedin: 'kyle-flynn-a48719136'
  },
  {
    name: 'Soren Zaiser',
    title: 'Board Member and Principal Software Engineer',
    profile: 'soren.png',
    github: 'Techno11',
    linkedin: 'spzproductions'
  },
  {
    name: 'Ofek Ashery',
    title: 'Lead Developer',
    profile: 'ofek.png',
    github: 'ofekashery',
    linkedin: 'ofekashery'
  },
  {
    name: 'Noah Holoubek',
    title: 'Developer & Security Engineer',
    profile: 'noah.png',
    github: 'nholo1332',
    linkedin: 'noah-holoubek-3116a9171'
  }
];

const About = () => {
  return (
    <>
      <SEO title="About" url="/about" />

      <Box
        component="section"
        sx={{
          background: theme =>
            `linear-gradient(25deg, #ff98002e, ${theme.palette.background.paper})`
        }}
      >
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Typography
            component="h1"
            sx={{
              fontWeight: 500,
              color: 'text.secondary'
            }}
          >
            About The Orange Alliance
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: '1.5rem', md: '2rem' },
              fontWeight: 900,
              maxWidth: 'sm'
            }}
          >
            We empower and support the next generation of innovators and leaders. We're building our
            future.
          </Typography>
        </Container>
      </Box>

      <Container component="section" maxWidth="md" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Box>
              <Typography fontSize="1.125rem" fontWeight={500} mb={2}>
                The Orange Alliance is best way to scout, watch, and relive <em>FIRST</em> Tech
                Challenge. We empower students to achieve their full potential.
              </Typography>
              <Typography gutterBottom>
                We continually strive to make The Orange Alliance an even more valuable resource for
                our users. If you would like to help out, have any questions, or have suggests feel
                free to reach out to us through{' '}
                <Link href="https://discord.gg/MdfDBhC" target="_blank" color="secondary">
                  Discord
                </Link>{' '}
                or contact us at{' '}
                <Link href="mailto:contact@theorangealliance.org" target="_blank" color="secondary">
                  contact@theorangealliance.org
                </Link>
                .
              </Typography>
              <Typography>
                The Orange Alliance was inspired by The Blue Alliance, but we are not affiliated.
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, lg: 5 }}>
            <Box
              sx={{
                display: 'block',
                position: 'relative',
                width: '100%',
                maxWidth: '32rem',
                borderRadius: '1.25rem',
                overflow: 'hidden',
                background: 'url(/assets/images/about/robot-poster.png) center / cover',
                boxShadow: 4,
                mx: 'auto',
                '&:before': {
                  paddingBottom: '60%',
                  display: 'block',
                  content: '""'
                }
              }}
            />
          </Grid>
        </Grid>
      </Container>

      <Box
        component="section"
        sx={{
          bgcolor: 'background.paper',
          borderTop: theme => `1px solid ${theme.palette.divider}`,
          borderBottom: theme => `1px solid ${theme.palette.divider}`
        }}
      >
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            About <em>FIRST</em>
            <sup>®</sup>
          </Typography>
          <Typography mb={1}>
            <em>FIRST</em>
            <sup>®</sup> is the world’s leading youth-serving nonprofit advancing STEM education.
            Through a suite of inclusive, team-based robotics programs for ages 4-18 and backed by a
            global network of mentors, coaches, volunteers, alumni, and sponsors, <em>FIRST</em> has
            a proven impact on learning, interest, and skill-building inside and outside of the
            classroom.
          </Typography>
          <Typography mb={2}>
            <em>FIRST</em> Tech Challenge students learn to think like engineers. Teams design,
            build, and program their robots to compete on a 12' X 12' field, in an alliance format,
            against other teams. Robots are built from a reusable platform, powered by Android
            technology, and programmed using Java-based programming languages. Teams, including
            students, coaches, and mentors, are required to develop strategy and build robots based
            on sound engineering principles, such as rapid prototyping. Awards are earned for the
            competition, as well as community outreach, robot design, and other real-world
            accomplishments.
          </Typography>

          <Button
            variant="contained"
            color="secondary"
            href="https://www.firstinspires.org/"
            target="_blank"
            size="small"
          >
            Join the movement
          </Button>
        </Container>
      </Box>

      <Container component="section" maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h4" component="h2">
          Connect and contribute
        </Typography>
        <Typography>Get involved in our community. Everyone is welcome!</Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr'
            },
            maxWidth: '48rem',
            mt: 1
          }}
        >
          <Link
            href="https://discord.gg/MdfDBhC"
            target="_blank"
            underline="none"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              textAlign: 'start',
              p: 1.5,
              borderRadius: 2,
              transition: 'background-color 0.2s ease',
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                bgcolor: '#5865F21D',
                height: '3.5rem',
                width: '3.5rem',
                boxShadow: 1,
                border: theme => `2px solid ${theme.palette.background.paper}`,
                '& > svg': {
                  width: '1.5rem',
                  height: '1.5rem'
                }
              }}
            >
              <svg viewBox="0 0 28 28" fill="#5865F2" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.7187 4.77725C21.8791 3.93502 19.937 3.33752 17.9421 3C17.6691 3.488 17.4221 3.99009 17.2021 4.50417C15.0772 4.18396 12.9162 4.18396 10.7912 4.50417C10.5711 3.99015 10.3241 3.48806 10.0513 3C8.05507 3.34037 6.11171 3.93929 4.27023 4.78166C0.61442 10.1905 -0.376614 15.465 0.118903 20.6646C2.25984 22.2464 4.65616 23.4494 7.20369 24.2213C7.77732 23.4498 8.28491 22.6313 8.72107 21.7746C7.89264 21.4652 7.09306 21.0834 6.33158 20.6338C6.53199 20.4884 6.728 20.3387 6.91739 20.1933C9.13312 21.2353 11.5515 21.7756 14 21.7756C16.4485 21.7756 18.8668 21.2353 21.0826 20.1933C21.2742 20.3497 21.4702 20.4994 21.6684 20.6338C20.9054 21.0842 20.1044 21.4666 19.2745 21.7768C19.7101 22.6331 20.2177 23.4509 20.7919 24.2213C23.3416 23.4525 25.7397 22.2501 27.8811 20.6668C28.4625 14.6369 26.8878 9.41089 23.7187 4.77725ZM9.34873 17.4669C7.96789 17.4669 6.8271 16.2138 6.8271 14.6722C6.8271 13.1306 7.92825 11.8664 9.34432 11.8664C10.7604 11.8664 11.8924 13.1306 11.8682 14.6722C11.8439 16.2138 10.756 17.4669 9.34873 17.4669ZM18.6512 17.4669C17.2682 17.4669 16.1318 16.2138 16.1318 14.6722C16.1318 13.1306 17.233 11.8664 18.6512 11.8664C20.0695 11.8664 21.1927 13.1306 21.1685 14.6722C21.1442 16.2138 20.0585 17.4669 18.6512 17.4669Z" />
              </svg>
            </Box>
            <Box flex={1} pl={2}>
              <Typography fontWeight={500}>Discord</Typography>
              <Typography color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                To get involved in the community, ask questions, and share tips.
              </Typography>
            </Box>
          </Link>

          <Link
            href="https://github.com/the-orange-alliance"
            target="_blank"
            underline="none"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              textAlign: 'start',
              p: 1.5,
              borderRadius: 2,
              transition: 'background-color 0.2s ease',
              '&:hover, &:focus': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                bgcolor: '#0066cc12',
                height: '3.5rem',
                width: '3.5rem',
                boxShadow: 1,
                border: theme => `2px solid ${theme.palette.background.paper}`,
                '& > svg': theme => ({
                  width: '1.5rem',
                  height: '1.5rem',
                  fill: '#0F172A',
                  ...theme.applyStyles('dark', {
                    fill: '#fff'
                  })
                })
              }}
            >
              <svg viewBox="0 0 28 28" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14 0C6.265 0 0 6.265 0 14c0 6.195 4.008 11.427 9.572 13.282.7.123.963-.297.963-.665 0-.332-.018-1.434-.018-2.607-3.517.647-4.427-.858-4.707-1.645-.157-.402-.84-1.645-1.435-1.977-.49-.263-1.19-.91-.018-.928 1.103-.018 1.89 1.015 2.153 1.435 1.26 2.117 3.273 1.523 4.078 1.155.122-.91.49-1.523.892-1.873-3.115-.35-6.37-1.557-6.37-6.912 0-1.523.542-2.783 1.435-3.763-.14-.35-.63-1.785.14-3.71 0 0 1.173-.367 3.85 1.436a12.99 12.99 0 013.5-.473c1.19 0 2.38.157 3.5.473 2.677-1.82 3.85-1.435 3.85-1.435.77 1.925.28 3.36.14 3.71.893.98 1.435 2.222 1.435 3.762 0 5.372-3.273 6.563-6.387 6.912.507.438.944 1.278.944 2.59 0 1.873-.017 3.378-.017 3.85 0 .368.262.805.962.665A14.022 14.022 0 0028 14c0-7.735-6.265-14-14-14z"
                />
              </svg>
            </Box>
            <Box flex={1} pl={2}>
              <Typography fontWeight={500}>GitHub</Typography>
              <Typography color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                To file issues, request features, and contribute, check out our GitHub.
              </Typography>
            </Box>
          </Link>
        </Box>
      </Container>

      <Container component="section" maxWidth="md" sx={{ pt: 2 }}>
        <Typography variant="h4" component="h2" mb={2}>
          Meet the Team behind The Orange Alliance
        </Typography>
        <Grid container direction="row" spacing={2}>
          {people.map(person => (
            <Grid key={person.name} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card
                sx={{
                  borderRadius: 2,
                  p: 2,
                  height: '100%'
                }}
                variant="outlined"
              >
                <Box display="flex">
                  <Avatar
                    src={`/assets/images/about/${person.profile}`}
                    alt={person.name}
                    imgProps={{ loading: 'lazy' }}
                    sx={{
                      borderRadius: 2,
                      width: 56,
                      height: 56,
                      mb: 2,
                      mr: 'auto'
                    }}
                  />
                  {person.github && (
                    <IconButton
                      href={`https://github.com/${person.github}/`}
                      target="_blank"
                      size="small"
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      <GitHub fontSize="small" />
                    </IconButton>
                  )}
                  {person.linkedin && (
                    <IconButton
                      href={`https://www.linkedin.com/in/${person.linkedin}/`}
                      target="_blank"
                      size="small"
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      <LinkedIn fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                <Typography fontSize="1.125rem" fontWeight={500}>
                  {person.name}
                </Typography>
                <Typography fontSize="0.875rem" color="text.secondary">
                  {person.title}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography fontSize="0.75rem" color="text.secondary">
          <em>FIRST</em>
          <sup>®</sup> and <em>FIRST</em>
          <sup>®</sup> Tech Challenge, are registered trademarks of For Inspiration and Recognition
          of Science and Technology (<em>FIRST</em>), which is not overseeing, involved with, or
          responsible for this website.
        </Typography>
      </Container>
    </>
  );
};

export default About;
