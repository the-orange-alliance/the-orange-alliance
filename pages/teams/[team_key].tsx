import * as React from 'react';
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
  ImageListItem
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
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage
} from 'next';
import { getTeamData, IRawTeamProps, parseTeamProps } from '../../lib/PageHelpers/teamHelper';
import { getSeasonString, readableDate } from '../../util/common-utils';
import { CURRENT_SEASON } from '../../constants';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Season } from '@the-orange-alliance/api/lib/cjs/models';
import Link from 'next/link';
import NextImg from 'next/image';
import { MatchesTab } from '../../components/EventTabs';

const TeamPage: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const t = useTranslate();
  const router = useRouter();

  const { team, wlt, topOpr, seasons, cad, github, images, notebook, reveal, matches } =
    parseTeamProps(props as IRawTeamProps);
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
    website = website.substr(website.indexOf(':') + 3); // Taking off the http/s
    if (website.endsWith('/') || website.endsWith('?') || website.endsWith('#')) {
      // Taking off unnecessary chars
      website = website.substr(0, website.length - 1);
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

  return (
    <>
      <div className="row">
        <h2 className="col-md-9 col-12">Team #{team.teamNumber}</h2>
        {/* // TODO: myTOA
          <div className="col-12 col-md-3">
          <button mdc-button primary (click)="toggleTeam()" className="align-self-end black" style="text-transform:initial; height: auto; padding: 7px">
          <mdc-icon *ngIf="favorite" className="mr-1 ml-1">favorite</mdc-icon>
          <mdc-icon *ngIf="!favorite" className="mr-1 ml-1">favorite_border</mdc-icon>
        {{(favorite ? 'general.remove_from_mytoa' : 'general.add_to_mytoa') | translate}}
          </button>
          </div>
        */}
      </div>

      {/* Nav */}
      <div className="row mt-3">
        <div className="col-12 col-md-3 pb-5 pe-md-3 d-none d-md-block">
          <Card className="">
            <CardContent className="w-100 p-3">
              {team.rookieYear && team.rookieYear > 0 && (
                <Box>
                  <Select
                    className={'w-100'}
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
                    <ul className="nav flex-column mt-2" style={{ padding: '0 12px!important' }}>
                      <li>
                        <a className={'link'} rel={'noreferrer'} style={{ cursor: 'pointer' }}>
                          {t('pages.team.team_info')}
                        </a>
                      </li>
                      <li className="nav-item mt-1">
                        {t('pages.team.event_results')}
                        <ul className="nav flex-column p-0">
                          <li className="nav-item text-primary">
                            {team.events.map(event => (
                              <a
                                key={event.eventKey}
                                rel={'noreferrer'}
                                className="nav-link"
                                style={{ cursor: 'pointer' }}
                              >
                                {event.divisionName
                                  ? event.eventName + ' - ' + event.divisionName + ' Division'
                                  : event.eventName}
                              </a>
                            ))}
                          </li>
                        </ul>
                      </li>
                    </ul>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Team Information */}
        <div className="col-12 col-md-9">
          <Card>
            {fetching && <LinearProgress />}
            <CardContent>
              <div className="d-flex align-items-center mb-1">
                {/* team logo <div className="team-logo m-2"></div>*/}
                <div>
                  <Typography variant={'h5'}>
                    #{team.teamNumber} - {team.teamNameShort}
                  </Typography>
                  <div className=" toa-card-subtitle pt-0">{team.teamNameLong}</div>
                </div>
              </div>

              <Divider />

              <Box className="pt-3">
                <Box className={'mb-2'}>
                  <Explore className={'me-1'} color={'primary'} />
                  <Typography display={'inline'} variant={'body1'}>
                    {t('pages.team.part_of_region').replace('{{ regionKey }}', team.regionKey)}{' '}
                  </Typography>
                </Box>

                <Box className={'mb-2'}>
                  <Room className={'me-1'} color={'primary'} />
                  <Typography display={'inline'} style={{ textTransform: 'capitalize' }}>
                    <a
                      rel={'noreferrer'}
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
                  <Box className={'mb-2'}>
                    <Facebook className={'me-1'} color={'primary'} />
                    <Typography display={'inline'}>
                      Facebook:{' '}
                      <a href={team.website}>{getUrl().replace('www.facebook.com/', '')}</a>
                    </Typography>
                  </Box>
                )}

                {team.website && !getUrl().startsWith(' facebook.com/') && (
                  <Box className={'mb-2'}>
                    <Public className={'me-1'} color={'primary'} />
                    <Typography display={'inline'}>
                      {t('pages.team.website')}: <a href={team.website}>{getUrl()}</a>
                    </Typography>
                  </Box>
                )}

                {team.rookieYear && team.rookieYear !== 0 && (
                  <Box className={'mb-2'}>
                    <Flare className={'me-1'} color={'primary'} />
                    <Typography display={'inline'}>
                      {t('pages.team.rookie_year')}: {team.rookieYear}
                    </Typography>
                  </Box>
                )}

                {wlt && false && (
                  <Box className={'mb-2'}>
                    <Flag className={'me-1'} color={'primary'} />
                    <Typography display={'inline'}>
                      <b>
                        {wlt.wins}-{wlt.losses}-{wlt.ties}
                      </b>{' '}
                      (W-L-T) {getSeasonString(selectedSeason)} season
                    </Typography>
                  </Box>
                )}

                {topOpr && topOpr.opr && (
                  <Box className={'mb-2'}>
                    <FlashOn className={'me-1'} color={'primary'} />
                    <Typography display={'inline'}>
                      <b>{topOpr.opr}</b> Top OPR
                    </Typography>{' '}
                    <p className="nav-item text-primary clickable"> (Jump)</p>
                  </Box>
                )}

                {lastActive && lastActive.seasonKey !== CURRENT_SEASON && (
                  <Box className={'mb-2'}>
                    <Hotel className={'me-1'} color={'primary'} />
                    <Typography display={'inline'}>
                      {t('pages.team.last_active')}: {getSeasonString(lastActive)}
                    </Typography>
                  </Box>
                )}

                {team.awards && selectedSeason && selectedSeason.description && (
                  <Box className={'mb-2'}>
                    <Celebration className={'me-1'} color={'primary'} />
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
          <Card className={'mt-md-5 mt-3 mb-1 pt-0'}>
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
                    key={event.eventKey}
                    className={'mb-4'}
                    style={{ border: '1px solid rgba(0, 0, 0, 0.15)' }}
                  >
                    <CardContent>
                      <Box>
                        <Link href={`/events/${event.eventKey}/rankings`}>
                          <Typography variant={'h5'}>
                            <b>
                              {event.divisionName
                                ? event.eventName + ' - ' + event.divisionName + ' Division'
                                : event.eventName}
                            </b>
                          </Typography>
                        </Link>
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
                            <Celebration className={'me-1'} fontSize={'inherit'} />
                            {award.award.awardDescription}
                          </Typography>
                        ))}
                        {event.matches.length > 0 && (
                          <MatchesTab event={event} forceSmall disableSingleTeamTeam />
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
                            <NextImg src={m.mediaLink} alt={'Team Media Image'} />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default TeamPage;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    const seasonKey =
      context.query.season_key && typeof context.query.season_key === 'string'
        ? context.query.season_key
        : CURRENT_SEASON;
    return { props: await getTeamData(context.params?.team_key + '', seasonKey) };
  } catch (err) {
    return {
      redirect: {
        destination: '/', // TODO: Redirect to 404 page
        permanent: false
      }
    };
  }
};
