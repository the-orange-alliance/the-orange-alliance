import type { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Link,
  Stack,
  Typography
} from '@mui/material';
import { PlayCircleOutline, QueryBuilder } from '@mui/icons-material';
import { useTranslate } from '@/i18n/i18n';
import { fetchMatchData, IRawMatchProps, useMatchData } from '@/lib/page-helpers/match-helper';
import { getEventDescription, readableDate } from '@/lib/utils/common';
import SingleMatchTable from '@/components/ui/single-match-table';
import MatchDetailsCard from '@/components/pages/match/match-details-card';
import SEO from '@/components/seo';
import { Event, Match } from '@the-orange-alliance/api/lib/cjs/models';
import { createOpengraphImageUrl } from '@/lib/opengraph';

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
      <Container sx={{ py: 6 }}>
        <Typography variant="h1">{match.matchName}</Typography>
        <NextLink href={`/events/${match.event.eventKey}`} passHref legacyBehavior>
          <Link
            component="a"
            fontSize="1.25rem"
            fontWeight={500}
            color="text.secondary"
            pt={0.5}
            underline="none"
          >
            {match.event.divisionName
              ? match.event.eventName + ' - ' + match.event.divisionName
              : match.event.eventName}
          </Link>
        </NextLink>
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                {match.redScore === -1 &&
                  match.blueScore === -1 &&
                  match.scheduledTime &&
                  match.scheduledTime !== '0000-00-00 00:00:00' && (
                    <Typography variant="body1">
                      <QueryBuilder />
                      {t('pages.match.scheduled_time')}: {readableDate(match.scheduledTime)}
                    </Typography>
                  )}
                {match.videoURL ? (
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <PlayCircleOutline sx={{ fontSize: '1em' }} />
                    <Link
                      href={match.videoURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="secondary"
                    >
                      Watch Match
                    </Link>
                  </Stack>
                ) : (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    color="text.secondary"
                    mb={2}
                  >
                    <PlayCircleOutline sx={{ fontSize: '1em' }} />
                    <Typography>{t('pages.match.no_video')}</Typography>
                  </Stack>
                )}

                <SingleMatchTable match={match} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <MatchDetailsCard match={match} />
            </Card>
          </Grid>
        </Grid>
      </Container>
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
      console.error('Error generating OpenGraph image for match ' + match.matchKey, err);
    }

    return { props };
  } catch (err) {
    return { notFound: true };
  }
};

export default MatchPage;
