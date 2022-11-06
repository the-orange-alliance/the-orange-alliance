import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
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
  ListItem
} from '@mui/material';
import {
  Book,
  Celebration,
  Create,
  Explore,
  Facebook,
  Flag,
  Flare,
  FlashOn,
  GitHub,
  Hotel,
  Public,
  Room,
  YouTube
} from '@mui/icons-material';
import { useTranslate } from '../../i18n/i18n';
import { fetchTeamData, IRawTeamProps, useTeamData } from '../../lib/page-helpers/team-helper';
import { getSeasonString, readableDate } from '../../lib/utils/common';
import { CURRENT_SEASON } from '../../constants';
import { Season } from '@the-orange-alliance/api/lib/cjs/models';
import MatchesTable from '../../components/MatchTable/MatchTable';
import { useAppContext } from '../_app';

const TeamPage: NextPage<IRawTeamProps> = props => {
  const { seasons } = useAppContext();
  const { team, wlt, topOpr, cad, github, images, notebook, reveal, matches } = useTeamData(props);
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

  const getUrl = () => {
    let website = team.website;
    website = website.substring(website.indexOf(':') + 3); // Taking off the http/s
    if (website.endsWith('/') || website.endsWith('?') || website.endsWith('#')) {
      // Taking off unnecessary chars
      website = website.substring(0, website.length - 1);
    }

    return website.startsWith('www.') ? website.substring(4, website.length) : website;
  };

  const pushNewFilter = (season: Season) => {
    setFetching(true);
    setSelectedSeason(season);
    const query = {} as any;
    if (season && season.seasonKey !== CURRENT_SEASON) query.season_key = season.seasonKey;
    router.push({ pathname: `/teams/${team.teamKey}`, query: query }).then(() => {
      setFetching(false);
    });
  };

  const scrollToEvent = (id: string) => {
    if (!document) return;
    const element = document.getElementById(id);
    if (element) {
      window.scroll({
        behavior: 'smooth',
        left: 0,
        top: element.getBoundingClientRect().top - 85
      });
    }
  };

  return (
    <>
      <Box sx={{ margin: 2 }}>
        <Typography variant="h4">Team #{team.teamNumber}</Typography>
        {/* // TODO: myTOA
          <div className="col-12 col-md-3">
          <button mdc-button primary (click)="toggleTeam()" className="align-self-end black" style="text-transform:initial; height: auto; padding: 7px">
          <mdc-icon *ngIf="favorite" className="mr-1 ml-1">favorite</mdc-icon>
          <mdc-icon *ngIf="!favorite" className="mr-1 ml-1">favorite_border</mdc-icon>
        {{(favorite ? 'general.remove_from_mytoa' : 'general.add_to_mytoa') | translate}}
          </button>
          </div>
        */}
      </Box>

      <Grid container direction={'row'} spacing={2} sx={{ margin: 2, width: '95%' }}>
        {/* Nav */}
        <Grid item xs={12} md={3}>
          <Card sx={{ position: 'sticky', top: '70px' }}>
            <CardContent>
              {team.rookieYear && team.rookieYear > 0 && (
                <Box>
                  <Select
                    fullWidth
                    value={seasons.findIndex(s => s.seasonKey === selectedSeason.seasonKey)}
                    variant={'standard'}
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
                  {team.events.length > 0 && (
                    <List>
                      <ListItem
                        button
                        onClick={() => scrollToEvent('info')}
                        sx={{ fontWeight: 500 }}
                      >
                        {t('pages.team.team_info')}
                      </ListItem>
                      <ListItem
                        button
                        onClick={() => scrollToEvent('event-results')}
                        sx={{ fontWeight: 500 }}
                      >
                        {t('pages.team.event_results')}
                      </ListItem>
                      <ListItem sx={{ pt: 0, pr: 0 }}>
                        <List>
                          {team.events.map(event => (
                            <ListItem
                              button
                              key={event.eventKey}
                              sx={{ fontSize: '0.875rem', px: 1.5 }}
                              onClick={() => scrollToEvent(event.eventKey)}
                            >
                              {event.divisionName
                                ? event.eventName + ' - ' + event.divisionName + ' Division'
                                : event.eventName}
                            </ListItem>
                          ))}
                        </List>
                      </ListItem>
                    </List>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Team Information */}
        <Grid item xs={12} md={9}>
          <Card id={'info'} sx={{ marginBottom: 5 }}>
            {fetching && <LinearProgress />}
            <CardContent>
              <Box>
                {/* team logo <div className="team-logo m-2"></div>*/}
                <Box>
                  <Typography variant={'h5'}>
                    <b>
                      #{team.teamNumber} - {team.teamNameShort}
                    </b>
                  </Typography>
                  <Typography sx={{ paddingTop: 1 }} variant={'subtitle2'}>
                    {team.teamNameLong}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Box sx={{ paddingTop: 2 }}>
                <Box sx={{ marginBottom: 1 }}>
                  <Explore sx={{ marginRight: 1 }} color={'primary'} />
                  <Typography display={'inline'} variant={'body1'}>
                    {t('pages.team.part_of_region').replace('{{ regionKey }}', team.regionKey)}{' '}
                  </Typography>
                </Box>

                <Box sx={{ marginBottom: 1 }}>
                  <Room sx={{ marginRight: 1 }} color={'primary'} />
                  <Typography display={'inline'} style={{ textTransform: 'capitalize' }}>
                    <a
                      rel={'noreferrer'}
                      style={{ color: theme.palette.text.primary }}
                      href={`
                    https://www.google.com/maps/search/?api=1&query=${(
                      team.city +
                      ', ' +
                      (team.stateProv ? team.stateProv + ', ' : '') +
                      team.country
                    ).replace(' ', '+')}`}
                      target="_blank"
                    >
                      {team.city +
                        ', ' +
                        (team.stateProv ? team.stateProv + ', ' : '') +
                        team.country}
                    </a>
                  </Typography>
                </Box>

                {team.website && getUrl().startsWith('facebook.com/') && (
                  <Box sx={{ marginBottom: 1 }}>
                    <Facebook sx={{ marginRight: 1 }} color={'primary'} />
                    <Typography display={'inline'}>
                      Facebook:{' '}
                      <a style={{ color: theme.palette.text.primary }} href={team.website}>
                        {getUrl().replace('www.facebook.com/', '')}
                      </a>
                    </Typography>
                  </Box>
                )}

                {team.website && !getUrl().startsWith(' facebook.com/') && (
                  <Box sx={{ marginBottom: 1 }}>
                    <Public sx={{ marginRight: 1 }} color={'primary'} />
                    <Typography display={'inline'}>
                      {t('pages.team.website')}: <a href={team.website}>{getUrl()}</a>
                    </Typography>
                  </Box>
                )}

                {team.rookieYear && team.rookieYear !== 0 && (
                  <Box sx={{ marginBottom: 1 }}>
                    <Flare sx={{ marginRight: 1 }} color={'primary'} />
                    <Typography display={'inline'}>
                      {t('pages.team.rookie_year')}: {team.rookieYear}
                    </Typography>
                  </Box>
                )}

                {wlt && false && (
                  <Box sx={{ marginBottom: 1 }}>
                    <Flag sx={{ marginRight: 1 }} color={'primary'} />
                    <Typography display={'inline'}>
                      <b>
                        {wlt.wins}-{wlt.losses}-{wlt.ties}
                      </b>{' '}
                      (W-L-T) {getSeasonString(selectedSeason)} season
                    </Typography>
                  </Box>
                )}

                {topOpr && topOpr.opr && (
                  <Box sx={{ marginBottom: 1 }}>
                    <FlashOn sx={{ marginRight: 1 }} color={'primary'} />
                    <Typography display={'inline'}>
                      <b>{topOpr.opr}</b> Top OPR
                    </Typography>{' '}
                    <p className="nav-item text-primary clickable"> (Jump)</p>
                  </Box>
                )}

                {lastActive && lastActive.seasonKey !== CURRENT_SEASON && (
                  <Box sx={{ marginBottom: 1 }}>
                    <Hotel sx={{ marginRight: 1 }} color={'primary'} />
                    <Typography display={'inline'}>
                      {t('pages.team.last_active')}: {getSeasonString(lastActive)}
                    </Typography>
                  </Box>
                )}

                {team.awards && selectedSeason && selectedSeason.description && (
                  <Box sx={{ marginBottom: 1 }}>
                    <Celebration sx={{ marginRight: 1 }} color={'primary'} />
                    <Typography display={'inline'}>
                      {t('pages.team.awards_in_season')
                        .replace('{{ awards }}', team.awards.length)
                        .replace('{{ season }}', selectedSeason.description)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Team Events/Robot */}
          <Card id={'event-results'}>
            {/* Nav Tabs */}
            <Tabs
              value={tab}
              onChange={(e, val) => setTab(val)}
              variant="fullWidth"
              scrollButtons="auto"
              className={'mb-2 mt-0'}
            >
              <Tab label={t('pages.team.event_results')} />
              {(github || reveal || cad || notebook || images.length > 0) && (
                <Tab label={t('pages.team.robot_profile.title')} />
              )}
            </Tabs>

            <CardContent>
              {/* Team Event Data*/}
              {tab === 0 &&
                team.events.map(event => (
                  <Card
                    id={event.eventKey}
                    key={event.eventKey}
                    sx={{ marginBottom: 3 }}
                    style={{ border: '1px solid rgba(0, 0, 0, 0.15)' }}
                  >
                    <CardContent>
                      <Box>
                        <a
                          style={{ color: theme.palette.text.primary }}
                          href={`/events/${event.eventKey}/rankings`}
                        >
                          <Typography variant={'h5'}>
                            <b>
                              {event.divisionName
                                ? event.eventName + ' - ' + event.divisionName + ' Division'
                                : event.eventName}
                            </b>
                          </Typography>
                        </a>
                        <Typography variant={'subtitle2'}>
                          {event.city}, {event.stateProv ? event.stateProv + ', ' : ''}
                          {event.country} on {readableDate(event.startDate)}
                        </Typography>
                        <Divider className={'mb-4'} />
                        {event.rankings[0] && (
                          <Typography variant={'body2'} className={'mb-1 mt-1'}>
                            <b>Qual Rank #{event.rankings[0].rank}</b> with a record of{' '}
                            <b>
                              {event.rankings[0].wins}-{event.rankings[0].losses}-
                              {event.rankings[0].ties}
                            </b>
                            {event.rankings[0] && (
                              <a>
                                {' '}
                                and an OPR of <b>{event.rankings[0].opr}</b>
                              </a>
                            )}
                          </Typography>
                        )}
                        {event.awards.map(award => (
                          <Typography
                            className={'mt-1 mb-1'}
                            variant={'body2'}
                            key={award.awardKey}
                          >
                            <Celebration sx={{ marginRight: 1 }} fontSize={'inherit'} />
                            {award.award.awardDescription}
                          </Typography>
                        ))}
                        {event.matches.length > 0 && (
                          <MatchesTable
                            event={event}
                            forceSmall
                            disableSingleTeamTeam
                            disableSelection
                          />
                        )}
                        {event.matches.length < 1 && <Typography variant={'body1'} />}
                      </Box>
                    </CardContent>
                  </Card>
                ))}

              {/* Team 'Robot' Page */}
              {tab === 1 && (
                <Box>
                  {(github || cad || notebook) && (
                    <Typography variant={'h6'} className="mb-1">
                      {team.teamNameShort} ❤️ Open Source
                    </Typography>
                  )}
                  {github && (
                    <Box className={'m-2'}>
                      <Fab
                        href={github.mediaLink}
                        target={'_blank'}
                        className={'text-white'}
                        style={{ backgroundColor: `#24292e` }}
                        variant={'extended'}
                      >
                        <GitHub className={'me-2'} />
                        GitHub
                      </Fab>
                    </Box>
                  )}
                  {cad && (
                    <Box className={'m-2'}>
                      <Fab
                        href={cad.mediaLink}
                        target={'_blank'}
                        className={'text-white'}
                        style={{ backgroundColor: `#9c27b0` }}
                        variant={'extended'}
                      >
                        <Create className={'me-2'} />
                        CAD Design
                      </Fab>
                    </Box>
                  )}
                  {notebook && (
                    <Box className={'m-2'}>
                      <Fab
                        href={notebook.mediaLink}
                        target={'_blank'}
                        className={'text-white'}
                        style={{ backgroundColor: `#0097a7` }}
                        variant={'extended'}
                      >
                        <Book className={'me-2'} />
                        {t('pages.team.robot_profile.engineering_notebook')}
                      </Fab>
                    </Box>
                  )}
                  {reveal && (
                    <Box className={'m-2'}>
                      <Fab
                        href={reveal.mediaLink}
                        target={'_blank'}
                        className={'text-white'}
                        style={{ backgroundColor: `#b71c1c` }}
                        variant={'extended'}
                      >
                        <YouTube className={'me-2'} />
                        {t('pages.team.robot_profile.engineering_notebook')}
                      </Fab>
                    </Box>
                  )}
                  {(github || cad || notebook) && images.length > 0 && (
                    <Divider className={'mb-3 mt-3'} />
                  )}
                  {images.length > 0 && (
                    <Box className={'m-2'}>
                      <Typography variant={'h6'}>{t('pages.team.robot_profile.photos')}</Typography>
                      <ImageList variant={'masonry'}>
                        {images.map(m => (
                          <ImageListItem className={'w-100'} key={m.mediaKey}>
                            <NextImage src={m.mediaLink} alt={'Team Media Image'} />
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
      </Grid>
    </>
  );
};

export default TeamPage;

export const getServerSideProps: GetServerSideProps = async ({ params, query }) => {
  try {
    const teamKey = String(params?.team_key);
    const seasonKey = query.season_key ? String(query.season_key) : CURRENT_SEASON;
    return { props: await fetchTeamData(teamKey, seasonKey) };
  } catch (err) {
    return { notFound: true };
  }
};
