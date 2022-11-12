import {
  AppBar,
  Autocomplete,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { RefObject, useEffect, useRef, useState } from 'react';
import { useTranslate } from '../../i18n/i18n';
import { useAppContext } from '../../lib/toa-context';
import { Team, Event, SearchResult } from '@the-orange-alliance/api/lib/cjs/models';
import { useRouter } from 'next/router';
import TOAProvider from '../../providers/TOAProvider';
import { useTheme } from '@mui/material/styles';
import { Search } from '@mui/icons-material';

interface NavbarProps {
  title: string;
  isDrawerOpen: boolean;
  handleDrawerToggle?: () => void;
}

const Navbar = ({ title, isDrawerOpen, handleDrawerToggle }: NavbarProps) => {
  const t = useTranslate();
  const data = useAppContext();
  const theme = useTheme();
  const router = useRouter();
  const [results, setResults] = useState<SearchResult>(new SearchResult());
  const [loading, setLoading] = useState<boolean>(false);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [hideSearchMobile, setHideSearchMobile] = useState<boolean>(isSmallScreen);
  const searchTextRef = useRef<any>();

  let searchTimeout: any = null;

  useEffect(() => {
    // if small screen changes, hide search
    if (isSmallScreen && !hideSearchMobile) setHideSearchMobile(true);
  }, [isSmallScreen]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSearchChange = (e: any) => {
    // Clear any set timeouts
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Start a new timeout to perform the search
    searchTimeout = setTimeout(() => {
      TOAProvider.getAPI()
        .search(e.target.value)
        .then(res => {
          setResults(res);
        });
    }, 300);
  };

  const onSearchKeypress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      if (results.teams.length > 0) {
        onSearchSelect(null, {
          name: '',
          divider: false,
          team_key: results.teams[0].teamKey,
          event_key: null
        });
      } else if (results.events.length > 0) {
        onSearchSelect(null, {
          name: '',
          divider: false,
          team_key: null,
          event_key: results.events[0].eventKey
        });
      }
    }
  };

  const onSearchSelect = (
    e: any,
    val:
      | { name: string; divider: boolean; event_key: string | null; team_key: string | null }
      | string
      | null
  ) => {
    if (!val) return;
    if (typeof val === 'string') return;
    if (val.team_key) {
      if (router.query.team_key && router.query.team_key === val.team_key) return;
      setLoading(true);
      router.push({ pathname: `/teams/${val.team_key}` }).then(() => {
        setLoading(false);
        if (isSmallScreen && !hideSearchMobile) setHideSearchMobile(true);
      });
    } else if (val.event_key) {
      if (router.query.event_key && router.query.event_key === val.event_key) return;
      setLoading(true);
      router.push({ pathname: `/events/${val.event_key}/rankings` }).then(() => {
        setLoading(false);
        if (isSmallScreen && !hideSearchMobile) setHideSearchMobile(true);
      });
    }
  };

  const handleShowSearch = (e: any) => {
    if (isSmallScreen) {
      setHideSearchMobile(!hideSearchMobile);
    } else if (!isSmallScreen && hideSearchMobile) {
      setHideSearchMobile(false);
    }
  };

  const calcName = (team: Team) => {
    if (team.teamNameShort && team.teamNameShort.trim().length > 0) {
      return `${team.teamKey} - ${team.teamNameShort}`;
    } else {
      return `Team #${team.teamKey}`;
    }
  };

  return (
    <AppBar elevation={0} position="fixed" sx={{ zIndex: 1201 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label={isDrawerOpen ? 'Close drawer' : 'Open drawer'}
          edge="start"
          onClick={handleDrawerToggle || undefined}
          sx={{ display: handleDrawerToggle ? 'flex' : 'none', mr: 2 }}
          size="large"
        >
          <MenuIcon />
        </IconButton>
        {(hideSearchMobile || !isSmallScreen) && (
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
        )}
        {hideSearchMobile && isSmallScreen && (
          <IconButton
            color="inherit"
            aria-label={'Show Search'}
            edge="start"
            onClick={handleShowSearch}
            size="large"
          >
            <Search />
          </IconButton>
        )}
        {(!isSmallScreen || !hideSearchMobile) && (
          <Autocomplete
            freeSolo
            disabled={loading}
            sx={{ width: '350px' }}
            getOptionLabel={l => {
              return typeof l === 'string' ? l : l.name ?? '';
            }}
            filterOptions={l => l}
            getOptionDisabled={l => l.divider}
            options={
              [
                { name: 'Teams', divider: true },
                ...results.teams.map((t: Team) => ({
                  name: calcName(t),
                  divider: false,
                  team_key: t.teamKey,
                  event_key: null
                })),
                { name: 'Events', divider: true, event_key: null, team_key: null },
                ...results.events.map((e: Event) => ({
                  name: `${e.eventName}`,
                  divider: false,
                  event_key: e.eventKey,
                  team_key: null
                }))
              ] as {
                name: string;
                divider: boolean;
                event_key: string | null;
                team_key: string | null;
              }[]
            }
            onKeyPress={onSearchKeypress}
            onChange={onSearchSelect}
            renderInput={params => (
              <TextField
                {...params}
                inputRef={searchTextRef}
                onChange={onSearchChange}
                onBlur={handleShowSearch}
                InputProps={{
                  ...params.InputProps,
                  placeholder: t('general.search_text_long'),
                  endAdornment: loading ? (
                    <InputAdornment position={'end'}>
                      <CircularProgress color={'secondary'} size={25} />
                    </InputAdornment>
                  ) : (
                    params.InputProps.endAdornment
                  )
                }}
              />
            )}
          />
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
