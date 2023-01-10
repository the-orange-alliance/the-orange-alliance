import type { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';
import { Box, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { PlayCircleOutline, QueryBuilder } from '@mui/icons-material';
import { useTranslate } from '../../i18n/i18n';
import { fetchMatchData, IRawMatchProps, useMatchData } from '../../lib/page-helpers/match-helper';
import { getEventDescription, readableDate } from '../../lib/utils/common';
import SimpleMatchTable from '../../components/SimpleMatchTable';
import MatchDetailsCard from '../../components/MatchDetails/MatchDetailsCard';
import SEO from '../../components/seo';
import { Event, Match } from '@the-orange-alliance/api/lib/cjs/models';
import { createOpengraphImageUrl } from '../../lib/opengraph';

const MatchPage: NextPage<IRawMatchProps> = props => {
  const { match, ogImage } = useMatchData(props);
  const t = useTranslate();

  return (
    <>
      <SEO
        title={`${match.matchName} - ${match.event.fullEventName}`}
        description={`Match results for ${match.matchName} at the ${new Date(
          match.event.startDate
        ).getFullYear()} ${match.event.fullEventName} in ${getEventDescription(match.event)}.`}
        ogImage={ogImage}
        url={`/matches/${match.matchKey}`}
      />
      <Box sx={{ m: 1 }}>
        <Typography variant={'h4'}>{match.matchName}</Typography>
        <Typography variant={'subtitle1'}>
          <NextLink href={`/events/${match.event.eventKey}/rankings`}>
            <a className="text-black">
              {match.event.divisionName
                ? match.event.eventName + ' - ' + match.event.divisionName
                : match.event.eventName}
            </a>
          </NextLink>
        </Typography>
        <Grid container direction={'row'} spacing={2}>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <Typography variant={'h5'}>{t('pages.match.match_info')}</Typography>
                <Divider />
                {match.redScore === -1 &&
                  match.blueScore === -1 &&
                  match.scheduledTime &&
                  match.scheduledTime !== '0000-00-00 00:00:00' && (
                    <Typography variant={'body1'}>
                      <QueryBuilder />
                      {t('pages.match.scheduled_time')}: {readableDate(match.scheduledTime)}
                    </Typography>
                  )}
                {!match.videoURL /* TODO: Link to suggestions tab eventually*/ && (
                  <>
                    <PlayCircleOutline sx={{mb: "-7px"}} />
                    <Typography sx={{display: "inline"}} variant={'body1'}>
                      {t('pages.match.no_video')}
                    </Typography>
                  </>
                )}
                <SimpleMatchTable match={match} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={8}>
            <Card>
              <MatchDetailsCard match={match} />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const props = await fetchMatchData(String(query.match_key));

    const match = new Match().fromJSON(props.match);
    const event = new Event().fromJSON(props.event);

    try {

      props.ogImage = createOpengraphImageUrl({
        title: match.matchName,
        description1: event.fullEventName,
        description2: getEventDescription(event)
      });

    } catch (err) {
      console.error("Error generating OpenGraph image for match " + match.matchKey, err);
    }

    return { props };
  } catch (err) {
    return { notFound: true };
  }
};

export default MatchPage;
