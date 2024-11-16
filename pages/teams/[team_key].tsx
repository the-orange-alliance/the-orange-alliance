import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import NextImage from 'next/image';
import {
  Typography,
  Card,
  CardContent,
  Divider,
  Box,
  Select,
  MenuItem,
  SelectChangeEvent,
  LinearProgress,
  Tab,
  Tabs,
  Fab,
  ImageList,
  ImageListItem,
  Grid,
  useTheme,
  List,
  ListItem,
  CardHeader,
  Link,
  Container
} from '@mui/material';
import {
  Book,
  Create,
  Explore as RegionIcon,
  Flare as RookieIcon,
  FlashOn as OprIcon,
  GitHub,
  Hotel as InactiveIcon,
  YouTube,
  LocationOn as LocationIcon,
  Public as WebsiteIcon,
  EmojiEventsOutlined as TrophyIcon
} from '@mui/icons-material';
import { useTranslate } from '@/i18n/i18n';
import { fetchTeamData, IRawTeamProps, useTeamData } from '@/lib/page-helpers/team-helper';
import { getLocationString, getSeasonString, readableDate } from '@/lib/utils/common';
import { CURRENT_SEASON } from '@/constants';
import { Season, Team } from '@the-orange-alliance/api/lib/cjs/models';
import MatchTable from '@/components/ui/match-table';
import { useAppContext } from '@/lib/toa-context';
import { createOpengraphImageUrl } from '@/lib/opengraph';
import SEO from '@/components/seo';
import MyTOAFavorite, { myTOAType } from '@/components/ui/mytoa-favorite-button';

import ListItemButton from '@mui/material/ListItemButton';

const TeamPage: NextPage<IRawTeamProps> = props => {
  const { seasons } = useAppContext();
  const { team, wlt, topOpr, cad, github, images, notebook, reveal } = useTeamData(props);
  const t = useTranslate();
  const router = useRouter();
  const theme = useTheme();
  const querySeason =
    router.query.season_key && !Array.isArray(router.query.season_key)
      ? seasons.find(s => s.seasonKey === router.query.season_key) ?? seasons[0]
      : seasons[0];
  const lastActive = team.lastActive
    ? seasons.find(s => s.seasonKey === team.lastActive)
    : undefined;

  const [selectedSeason, setSelectedSeason] = useState<Season>(querySeason);
  const [fetching, setFetching] = useState<boolean>(false);
  const [tab, setTab] = useState<number>(0);

  const pushNewFilter = (season: Season) => {
    setFetching(true);
    setSelectedSeason(season);
    const query = {} as any;
    if (season && season.seasonKey !== CURRENT_SEASON) query.season_key = season.seasonKey;
    router.push({ pathname: `/teams/${team.teamKey}`, query: query }).then(() => {
      setFetching(false);
    });
  };

  const scrollToEvent = (eventKey: string) => {
    if (!document) return;
    const element = document.getElementById(eventKey.toLowerCase());
    if (element) {
      window.scrollTo({
        behavior: 'smooth',
        left: 0,
        top: element.offsetTop - 85
      });
    }
  };

  return (
    <>
      <SEO
        title={`Team #${team.teamNumber}`}
        description={`Team information and results for FIRST Tech Challenge Team ${
          team.teamNumber
        } ${team.teamNameShort} from ${team.city}, ${team.stateProv ? team.stateProv + ', ' : ''}${
          team.country
        }.`}
        url={`/teams/${team.teamKey}`}
        ogImage={props.ogImage}
      />
      <Container sx={{ py: 6 }}>
        <Typography variant="h1">
          Team #{team.teamNumber} - {team.teamNameShort}
        </Typography>
        {team.teamNameLong && (
          <Typography fontSize="1.25rem" fontWeight={500} color="text.secondary" pt={0.5}>
            {team.teamNameLong}
          </Typography>
        )}

        <Box mt={2} ml={1} id="info">
          <Typography sx={{ mb: 1 }} fontSize="0.875rem" fontWeight={500}>
            <LocationIcon fontSize="inherit" sx={{ mr: 1, position: 'relative', top: '0.125em' }} />
            From{' '}
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${getLocationString(team)}`}
              color="secondary"
              target="_blank"
              rel="noreferrer"
            >
              {getLocationString(team)}
            </Link>
          </Typography>
          <Typography sx={{ mb: 1 }} fontSize="0.875rem" fontWeight={500}>
            <RegionIcon fontSize="inherit" sx={{ mr: 1, position: 'relative', top: '0.125em' }} />
            {t('pages.team.part_of_region').replace('{{ regionKey }}', team.regionKey)}{' '}
          </Typography>
          {team.rookieYear && (
            <Typography sx={{ mb: 1 }} fontSize="0.875rem" fontWeight={500}>
              <RookieIcon fontSize="inherit" sx={{ mr: 1, position: 'relative', top: '0.125em' }} />
              {t('pages.team.rookie_year')}: {team.rookieYear}
            </Typography>
          )}

          {team.website && (
            <Typography sx={{ mb: 1 }} fontSize="0.875rem" fontWeight={500}>
              <WebsiteIcon
                fontSize="inherit"
                sx={{ mr: 1, position: 'relative', top: '0.125em' }}
              />
              <Link href={team.website} color="secondary" target="_blank" rel="noreferrer">
                {t('pages.team.view_website')}
              </Link>
            </Typography>
          )}

          {topOpr && (
            <Typography sx={{ mb: 1 }} fontSize="0.875rem" fontWeight={500}>
              <OprIcon fontSize="inherit" sx={{ mr: 1, position: 'relative', top: '0.125em' }} />
              Top OPR: {topOpr?.opr?.toFixed(2) ?? 0} (
              <Link
                href={'#' + topOpr.eventKey}
                color="secondary"
                onClick={() => scrollToEvent(topOpr.eventKey)}
              >
                {team.events.find(e => e.eventKey === topOpr.eventKey)?.eventName}
              </Link>
              )
            </Typography>
          )}

          {lastActive && lastActive.seasonKey !== CURRENT_SEASON && (
            <Typography sx={{ mb: 1 }} fontSize="0.875rem" fontWeight={500}>
              <InactiveIcon
                fontSize="inherit"
                sx={{ mr: 1, position: 'relative', top: '0.125em' }}
              />
              {t('pages.team.last_active')}: {getSeasonString(lastActive)}
            </Typography>
          )}
        </Box>

        <Grid container direction="row" spacing={2} mt={4}>
          {/* Team Information */}
          <Grid item xs={12} md={9}>
            {/* Team Events/Robot */}
            <Card id="event-results">
              {/* Nav Tabs */}
              {(github || reveal || cad || notebook || images.length > 0) && (
                <Tabs
                  value={tab}
                  onChange={(e, val) => setTab(val)}
                  variant="fullWidth"
                  scrollButtons="auto"
                  className="mb-2 mt-0"
                >
                  <Tab label={t('pages.team.event_results')} />
                  <Tab label={t('pages.team.robot_profile.title')} />
                </Tabs>
              )}

              <CardContent>
                {/* Team Event Data*/}
                {tab === 0 &&
                  team.events.map(event => (
                    <Card
                      id={event.eventKey.toLowerCase()}
                      key={event.eventKey}
                      sx={{ mb: 3 }}
                      variant="outlined"
                    >
                      <CardHeader
                        title={
                          <NextLink href={`/events/${event.eventKey}`} passHref>
                            <Link fontSize="1.25rem" underline="none">
                              {event.fullEventName}
                            </Link>
                          </NextLink>
                        }
                        subheader={`${event.city}, ${event.stateProv ? event.stateProv + ', ' : ''}
                    ${event.country} on ${readableDate(event.startDate)}`}
                      />
                      <CardContent sx={{ pt: 0 }}>
                        {event.rankings[0] && (
                          <Typography variant="body2" mb={1}>
                            <b>Qual Rank #{event.rankings[0].rank}</b> with a record of{' '}
                            <b>
                              {event.rankings[0].wins}-{event.rankings[0].losses}-
                              {event.rankings[0].ties}
                            </b>
                            {event.rankings[0] && (
                              <a>
                                {' '}
                                and an OPR of <b>{event.rankings[0]?.opr?.toFixed(2) || 0}</b>
                              </a>
                            )}
                          </Typography>
                        )}
                        {event.awards.map(award => (
                          <Typography key={award.awardKey} variant="body2" mb={1}>
                            <TrophyIcon
                              sx={{
                                fontSize: '1.125em',
                                marginRight: 1,
                                verticalAlign: 'middle'
                              }}
                            />
                            {award.award.awardDescription}
                            {award.receiverName ? ` (${award.receiverName})` : ''}
                          </Typography>
                        ))}
                        {event.matches.length > 0 && <MatchTable event={event} hideHeader />}
                        {event.matches.length < 1 && <Typography variant="body1" />}
                      </CardContent>
                    </Card>
                  ))}

                {/* No Events this season */}
                {tab === 0 && team.events.length < 1 && (
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {team.lastActive && team.lastActive !== CURRENT_SEASON
                      ? t('pages.team.not_registered')
                      : t('pages.team.no_results')}
                  </Typography>
                )}

                {/* Team 'Robot' Page */}
                {tab === 1 && (
                  <Box>
                    {(github || cad || notebook) && (
                      <Typography variant="h6" className="mb-1">
                        {team.teamNameShort} ❤️ Open Source
                      </Typography>
                    )}
                    {github && (
                      <Box className="m-2">
                        <Fab
                          href={github.mediaLink}
                          target="_blank"
                          className="text-white"
                          style={{ backgroundColor: `#24292e` }}
                          variant="extended"
                        >
                          <GitHub className="me-2" />
                          GitHub
                        </Fab>
                      </Box>
                    )}
                    {cad && (
                      <Box className="m-2">
                        <Fab
                          href={cad.mediaLink}
                          target="_blank"
                          className="text-white"
                          style={{ backgroundColor: `#9c27b0` }}
                          variant="extended"
                        >
                          <Create className="me-2" />
                          CAD Design
                        </Fab>
                      </Box>
                    )}
                    {notebook && (
                      <Box className="m-2">
                        <Fab
                          href={notebook.mediaLink}
                          target="_blank"
                          className="text-white"
                          style={{ backgroundColor: `#0097a7` }}
                          variant="extended"
                        >
                          <Book className="me-2" />
                          {t('pages.team.robot_profile.engineering_notebook')}
                        </Fab>
                      </Box>
                    )}
                    {reveal && (
                      <Box className="m-2">
                        <Fab
                          href={reveal.mediaLink}
                          target="_blank"
                          className="text-white"
                          style={{ backgroundColor: `#b71c1c` }}
                          variant="extended"
                        >
                          <YouTube className="me-2" />
                          {t('pages.team.robot_profile.engineering_notebook')}
                        </Fab>
                      </Box>
                    )}
                    {(github || cad || notebook) && images.length > 0 && (
                      <Divider className="mb-3 mt-3" />
                    )}
                    {images.length > 0 && (
                      <Box className="m-2">
                        <Typography variant="h6">{t('pages.team.robot_profile.photos')}</Typography>
                        <ImageList variant="masonry">
                          {images.map(m => (
                            <ImageListItem className="w-100" key={m.mediaKey}>
                              <NextImage src={m.mediaLink} alt="Team Media Image" />
                            </ImageListItem>
                          ))}
                        </ImageList>
                      </Box>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Nav */}
          <Grid item xs={12} md={3}>
            <Card sx={{ position: 'sticky', top: '5rem', px: 2, py: 3 }}>
              {team.rookieYear && (
                <Box>
                  <Select
                    fullWidth
                    value={seasons.findIndex(s => s.seasonKey === selectedSeason.seasonKey)}
                    variant="standard"
                    onChange={(val: SelectChangeEvent<number>) =>
                      pushNewFilter(seasons[val.target.value as number])
                    }
                  >
                    {seasons.map((season, i) => (
                      <MenuItem value={i} key={season.seasonKey}>
                        {season.description}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              )}

              {team.events.length > 0 && (
                <List dense>
                  <ListItemButton onClick={() => scrollToEvent('info')} sx={{ fontWeight: 500 }}>
                    {t('pages.team.team_info')}
                  </ListItemButton>
                  <ListItemButton
                    onClick={() => scrollToEvent('event-results')}
                    sx={{ fontWeight: 500 }}
                  >
                    {t('pages.team.event_results')}
                  </ListItemButton>
                  <ListItem sx={{ pt: 0, pr: 0 }}>
                    <List dense>
                      {team.events.map(event => (
                        <ListItemButton
                          key={event.eventKey}
                          sx={{ fontSize: '0.875rem', px: 1.5 }}
                          onClick={() => scrollToEvent(event.eventKey)}
                        >
                          {event.divisionName
                            ? event.eventName + ' - ' + event.divisionName + ' Division'
                            : event.eventName}
                        </ListItemButton>
                      ))}
                    </List>
                  </ListItem>
                </List>
              )}
            </Card>
          </Grid>
        </Grid>

        {/* myTOA */}
        <MyTOAFavorite dataKey={team.teamKey} type={myTOAType.team} />
      </Container>
    </>
  );
};

export default TeamPage;

export const getServerSideProps: GetServerSideProps = async ({ params, query }) => {
  try {
    const teamKey = String(params?.team_key);
    const seasonKey = query.season_key ? String(query.season_key) : CURRENT_SEASON;
    const props = await fetchTeamData(teamKey, seasonKey);

    const team = new Team().fromJSON(props.team);

    try {
      props.ogImage = createOpengraphImageUrl({
        title: `#${team.teamNumber} ${team.teamNameShort}`,
        description: `${team.city}, ${team.stateProv ? team.stateProv + ', ' : ''}${team.country}`
      });
    } catch (err) {
      console.error('Failed to create opengraph image for team ' + team.teamKey, err);
    }

    return { props };
  } catch (err) {
    console.log(err);
    return { notFound: true };
  }
};
