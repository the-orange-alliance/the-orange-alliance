import { NextPage } from 'next';
import { useTranslate } from '../i18n/i18n';
import { Card, CardContent, Grid, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import AboutPerson from '../lib/models/AboutPerson';
import AboutCard from '../components/About/AboutCard';
import { Box } from '@mui/system';

const Legal: NextPage = props => {
  const t = useTranslate();
  const theme = useTheme();
  const [tab, setTab] = useState<number>(0);

  const people: AboutPerson[] = [
    {
      name: 'Alexander Fera',
      title: 'Co-Founder, Board Member, and Executive Director',
      description:
        'Alex is the Founder and CEO of The Orange Alliance. He is the Lead\n' +
        '            <i>FIRST</i> Technical Advisor for <i>FIRST</i> in Michigan, <i>FIRST</i> Tech Challenge\n' +
        '            and <i>FIRST</i> Robotics Competition. Alex helps to manage the day to day operations of\n' +
        '            TOA. He is also the owner of his own IT Consulting Firm,\n' +
        '            <a href="https://fera.group/" target="_blank">Fera Group, LLC</a>, based in Western\n' +
        '            Michigan. Alex is a 10 year volunteer with <i>FIRST</i> and he is an alum and mentor of\n' +
        '            <a href="https://www.thebluealliance.com/team/503" target="_blank"\n' +
        '              ><i>FIRST</i> Robotics Team 503</a\n' +
        '            >.',
      imgName: 'alex.jpg',
      github: 'https://github.com/afera15',
      linkedIn: 'https://www.linkedin.com/in/alexfera/'
    },
    {
      name: 'Keith Moore',
      title: 'Co-Creator',
      description:
        'Keith is a co-founder of The Orange Alliance. He is the head programming mentor for\n' +
        '            <a href="https://www.thebluealliance.com/team/503" target="_blank"\n' +
        '              ><i>FIRST</i> Robotics Team 503</a\n' +
        '            >, which helped develop the prototype for TOA. Keith focused on the overall architecture\n' +
        '            and design of TOA concept. He has also developed support documents for the\n' +
        '            <i>FIRST</i> Tech Challenge Android control system and is often seen sporting his bright\n' +
        '            orange CSA hat at <i>FIRST</i> competitions across Michigan. In his spare time, Keith is\n' +
        '            Chief Technology Officer for a large Michigan financial services company.',
      imgName: 'keith.jpg'
    },
    {
      name: 'Kyle Flynn',
      title: 'Board Member and Chief Technology Officer',
      description:
        'Kyle is one of the original developers for The Orange Alliance. He develops and\n' +
        '            maintains the\n' +
        '            <a href="https://github.com/orange-alliance/event-management-system" target="_blank">\n' +
        '              Event Management System\n' +
        '            </a>\n' +
        '            that has been used for Michigan <i>FIRST</i> Tech Challenge, <i>FIRST</i> Global, and\n' +
        '            <i>FIRST</i> Robotics Competition off-season events. Kyle is a <i>FIRST</i> alumnus and\n' +
        '            volunteers as a <i>FIRST</i> Technical Advisor. Kyle graduated from Grand Valley State\n' +
        '            University where he studied Computer Science and Mathematics.',
      imgName: 'kyle.jpg',
      github: 'https://github.com/kyle-flynn',
      linkedIn: 'https://www.linkedin.com/in/kyle-flynn-a48719136'
    },
    {
      name: 'Soren Zaiser',
      title: 'Board Member and Principal Software Engineer',
      description:
        'Soren is the lead developer for The Orange Alliance and manages the API and back end of\n' +
        '            The Orange Alliance. Soren is the Lead A/V Coordinator for <i>FIRST</i> Tech Challenge\n' +
        '            in Michigan and helps run A/V for <i>FIRST</i> Robotics Competition in Michigan. Soren\n' +
        '            is the owner of SPZ Productions, a small video production company based in mid-Michigan.\n' +
        '            He also mentors\n' +
        '            <a href="/teams/5954" target="_blank"\n' +
        '              ><i>FIRST</i> Tech Challenge Team 5954</a>\n' +
        '            , and was the Lead Student Programmer on\n' +
        '            <a href="https://www.thebluealliance.com/team/1322" target="_blank"\n' +
        '              ><i>FIRST</i> Robotics Competition Team 1322</a\n' +
        '            >. Soren has been volunteering in <i>FIRST</i> for over 8 years.',
      imgName: 'soren.jpg',
      github: 'https://github.com/Techno11',
      linkedIn: 'https://www.linkedin.com/in/spzproductions'
    },
    {
      name: 'Nathan Satterfield',
      title: 'Board Member and Chief Operating Officer',
      description:
        ' Nathan is the Chief Operating Officer of The Orange Alliance and helps manage various\n' +
        '            day to day tasks. Nathan’s main role involves handling data uploading and coordination\n' +
        '            with regional partners. Nathan is a host on First Updates Now for <i>FIRST</i> Tech\n' +
        '            Challenge coverage. He is an alumni of\n' +
        '            <a href="https://theorangealliance.org/teams/3507"\n' +
        '              ><i>FIRST</i> Tech Challenge Team 3507</a\n' +
        '            >\n' +
        '            and has been a volunteer for the past 5 years. Nathan is currently studying Business at\n' +
        '            the University of Michigan.',
      imgName: 'nathan.jpg',
      github: 'https://github.com/Nate2019',
      linkedIn: 'https://www.linkedin.com/in/nathan-satterfield-730a38165/'
    },
    {
      name: 'Ofek Ashery',
      title: 'Lead Developer',
      description:
        'Ofek is one of the core infastructure developers for The Orange Alliance. Ofek is involved in developing the iOS and\n' +
        '            Android applications as well as maintaining The Orange Alliance’s DataSync. Ofek has\n' +
        '            been volunteering for <i>FIRST</i> for several years and is on\n' +
        '            <a href="https://www.thebluealliance.com/team/1937" target="_blank"\n' +
        '              ><i>FIRST</i> Robotics Competition Team 1937</a\n' +
        '            >. He is currently in high school and lives in Israel.',
      imgName: 'ofek.jpg',
      github: 'https://github.com/ofekashery',
      linkedIn: 'https://www.linkedin.com/in/ofekashery'
    },
    {
      name: 'Dominic Hupp',
      title: 'Developer',
      description:
        'Dominic is a developer for The Orange Alliance. He mainly works on TOA Text along with\n' +
        '            other projects. He is on\n' +
        '            <a href="/teams/15692" target="_blank"\n' +
        '              ><i>FIRST</i> Tech Challenge Team 15692</a\n' +
        '            >. Dom is currently a high school student and lives in Ohio.',
      imgName: 'dominic.jpg',
      github: 'https://github.com/Huppdo',
      linkedIn: 'https://www.linkedin.com/in/dominic-hupp-3b051716a'
    },
    {
      name: 'Noah Holoubek',
      title: 'Developer & Security Engineer',
      description:
        'Noah is a developer and security engineer for The Orange Alliance. He is on\n' +
        '            <a href="https://theorangealliance.org/teams/13426" target="_blank"\n' +
        '              ><i>FIRST</i> Tech Challenge Team 13426</a\n' +
        '            >\n' +
        '            and volunteers at <i>FIRST</i> Tech Challenge events and is the lead A/V coordinator for\n' +
        '            Nebraska FLL. He has been involved with <i>FIRST</i> for over 7 years. Noah is currently\n' +
        '            in high school and lives in Nebraska.',
      imgName: 'noah.jpg',
      github: 'https://github.com/nholo1332',
      linkedIn: 'https://www.linkedin.com/in/noah-holoubek-3116a9171'
    }
  ];

  return (
    <>
      <Card sx={{ m: 2 }}>
        <CardContent>
          <Typography sx={{ p: 8, pt: 0 }} variant={'h3'} align={'center'} className="about-header">
            <b>About Us</b>
          </Typography>

          <p>
            The Orange Alliance is the largest provider of <i>FIRST</i> Tech Challenge Data. We are
            a site run by the <i>FIRST</i> community. If you would like to help out, have any
            questions, or have suggests feel free to reach out to us through{' '}
            <a href="https://discord.gg/MdfDBhC" target="_blank" rel={'noreferrer'}>
              Discord
            </a>{' '}
            or contact us at{' '}
            <a href="mailto:contact@theorangealliance.org" target="_blank" rel={'noreferrer'}>
              contact@theorangealliance.org
            </a>
          </p>
          <p>
            The Orange Alliance was inspired by{' '}
            <a href="http://thebluealliance.com/" target="_blank" rel={'noreferrer'}>
              The Blue Alliance
            </a>
            , but we are not affiliated.
          </p>

          <h3 className="pt-3">
            <i>FIRST</i>
          </h3>
          <p>
            <i>
              <a href="https://www.firstinspires.org/" target="_blank" rel={'noreferrer'}>
                FIRST
              </a>
            </i>{' '}
            (For Inspiration and Recognition of Science and Technology) is a non-profit organization
            with the mission of inspiring young people to be science and technology leaders. With
            programs that involve students from kindergarten through high school, <i>FIRST</i> has
            become a world-wide phenomenon with teams from all six inhabited continents.
          </p>
        </CardContent>
      </Card>

      <Box sx={{ m: 2 }}>
        <Typography sx={{ fontWeight: 500, mb: 3, mt: 7 }} variant={'h5'}>
          Meet the <b style={{ color: theme.palette.primary.main }}>Team</b> behind{' '}
          <b style={{ color: theme.palette.primary.main }}>The Orange Alliance</b>
        </Typography>
        <Grid container direction={'row'} spacing={2}>
          {people.map(p => (
            <Grid item key={p.name} xs={12} md={6} lg={4}>
              <AboutCard person={p} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default Legal;
