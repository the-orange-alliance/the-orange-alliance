import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Autocomplete,
  AutocompleteChangeReason,
  AutocompleteProps,
  Backdrop,
  Box,
  CircularProgress,
  Popper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import EventIcon from '@mui/icons-material/EventOutlined';
import TeamIcon from '@mui/icons-material/PeopleOutlineOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { SearchResult } from '@the-orange-alliance/api/lib/cjs/models';
import TOAProvider from '../providers/TOAProvider';
import { useTranslate } from '../i18n/i18n';
import { getEventDescription } from '../lib/utils/common';
import theme from '../lib/theme';

interface Option {
  key: string;
  label: string;
  description?: string;
  type: 'divider' | 'team' | 'event';
}

interface SearchProps extends Partial<AutocompleteProps<Option, false, false, true>> {
  onFocus?: () => void;
  onBlur?: () => void;
  showIcon?: boolean;
  showDescription?: boolean;
  maxResults?: number;
  watchGlobalCommand?: boolean;
  variant?: 'standard' | 'navbar';
}

const Search: React.FC<SearchProps> = ({
  onFocus,
  onBlur,
  showIcon,
  showDescription,
  maxResults = 12,
  watchGlobalCommand = false,
  variant = 'standard',
  ...props
}) => {
  const t = useTranslate();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const searchTimeout = useRef<NodeJS.Timeout | undefined>();

  const onSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear any set timeouts
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Start a new timeout to perform the search
    searchTimeout.current = setTimeout(() => {
      setIsLoading(true);
      TOAProvider.getAPI()
        .search(e.target.value)
        .then(setResults)
        .finally(() => setIsLoading(false));
    }, 300);
  }, []);

  const onSearchSelect = useCallback(
    (e: React.SyntheticEvent, item: Option | string | null, reason: AutocompleteChangeReason) => {
      setIsLoading(false);
      (e.target as HTMLInputElement).blur();
      onBlur?.();

      if (!item || typeof item === 'string') return;

      if (item.type === 'team') {
        router.push(`/teams/${item.key}`);
      } else if (item.type === 'event') {
        router.push(`/events/${item.key}/rankings`);
      }
    },
    [onBlur] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const options = useMemo(
    () =>
      results
        ? results.slice(0, maxResults).map(item =>
            item.type === 'team'
              ? {
                  key: item.teamKey,
                  type: 'team' as const,
                  label: item.teamNameShort
                    ? `#${item.teamKey} ${item.teamNameShort}`
                    : `Team #${item.teamKey}`,
                  description: `${item.city}, ${item.stateProv ? item.stateProv + ', ' : ''}${
                    item.country
                  }`
                }
              : {
                  key: item.eventKey,
                  type: 'event' as const,
                  label: item.fullEventName,
                  description: getEventDescription(item)
                }
          )
        : [],
    [t, results] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    if (watchGlobalCommand) {
      const down = (e: globalThis.KeyboardEvent): void => {
        if (e.key === '/' || (e.key === 'k' && e.metaKey)) {
          e.preventDefault();
          const input = document.querySelector('input#toa-search') as HTMLInputElement;
          input?.focus();
        }
      };

      window.addEventListener('keydown', down);
      return () => window.removeEventListener('keydown', down);
    }
  }, [watchGlobalCommand]);

  useEffect(() => {
    if (watchGlobalCommand && router.query.q) {
      const query = router.query.q as string;
      if (!isNaN(parseInt(query))) {
        router.replace(`/teams/${query}`);
      } else {
        const input = document.querySelector('input#toa-search') as HTMLInputElement;
        input?.focus();
        setInputValue(query);
        onSearchChange({ target: { value: query } } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  }, [watchGlobalCommand, router.query.q]); // eslint-disable-line react-hooks/exhaustive-deps

  const isOpen = isFocused && inputValue.length > 0 && results !== null;

  return (
    <>
      <Autocomplete
        id={watchGlobalCommand ? 'toa-search' : undefined}
        getOptionLabel={item => (typeof item === 'string' ? item : item.label)}
        getOptionDisabled={item => item.type === 'divider'}
        filterOptions={item => item}
        inputValue={inputValue}
        value={null}
        autoHighlight
        onInputChange={(e, newInputValue, r) => {
          if (r === 'input') {
            setInputValue(newInputValue);
          } else if (r === 'reset') {
            setInputValue('');
          }
        }}
        onChange={onSearchSelect}
        onFocus={() => {
          setIsFocused(true);
          onFocus?.();
        }}
        onBlur={() => {
          setInputValue('');
          setIsFocused(false);
          setResults([]);
          onBlur?.();
        }}
        onKeyDown={e => {
          if (e.key === 'Escape') {
            (e.target as HTMLInputElement).blur();
          }
        }}
        disablePortal
        {...props}
        options={options}
        noOptionsText={t('general.search_no_results')}
        open={isOpen}
        openOnFocus
        sx={{
          ...props.sx,
          zIndex: isFocused ? 1306 : undefined,
          '& + .MuiAutocomplete-popper': {
            zIndex: 1306,
            '& .MuiPaper-root': {
              boxShadow: variant === 'navbar' ? undefined : 'none',
              borderRadius:
                variant === 'navbar' ? '0.375rem' : isOpen ? '0 0 0.5rem 0.5rem' : '0.75rem'
            },
            '& .MuiAutocomplete-noOptions': {
              fontSize: '0.875rem'
            }
          }
        }}
        PopperComponent={props => (
          <Popper
            {...props}
            placement="bottom"
            popperOptions={{
              modifiers: [
                {
                  name: 'flip',
                  enabled: false
                }
              ]
            }}
          />
        )}
        renderInput={params => (
          <TextField
            {...params}
            onChange={onSearchChange}
            sx={{ p: 0 }}
            variant="standard"
            InputProps={{
              ...params.InputProps,
              sx: {
                zIndex: isFocused ? 1306 : undefined,
                p: '0 !important',
                position: 'relative',
                '& input': {
                  fontSize: {
                    base: '1rem',
                    sm: variant === 'navbar' ? '0.875rem' : undefined
                  },
                  padding:
                    variant === 'navbar' ? '0.5em 0.875em !important' : '0.75em 1.25em !important',
                  paddingLeft: variant === 'navbar' || isFocused ? undefined : '2.75em !important',
                  background: variant === 'navbar' ? 'rgba(0, 0, 0, 0.04)' : '#fff',
                  boxShadow:
                    variant === 'navbar'
                      ? 'none'
                      : isOpen
                      ? 'inset 0px -1px 0px rgba(0,0,0,0.12)'
                      : 3,
                  borderRadius:
                    variant === 'navbar'
                      ? '0.5rem'
                      : isOpen
                      ? '0.5rem 0.5rem 0 0'
                      : isFocused
                      ? '0.5rem'
                      : '1rem',
                  my: variant === 'navbar' ? 0.5 : undefined,
                  transition: 'all 0.2s ease-in-out',
                  '&:focus': {
                    background: variant === 'navbar' ? 'transparent' : undefined,
                    boxShadow: {
                      sm: variant === 'navbar' ? '0 0 0 1px rgba(0, 0, 0, 0.08)' : undefined
                    }
                  }
                }
              },
              disableUnderline: true,
              placeholder: t('general.search_text_long'),
              startAdornment:
                variant !== 'navbar' ? (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      position: 'absolute',
                      left: '1em',
                      py: 0.5,
                      opacity: isFocused ? 0 : 1,
                      transition: 'opacity 0.2s ease-in-out'
                    }}
                  >
                    <SearchIcon sx={{ color: 'text.disabled', fontSize: '1.25em' }} />
                  </Box>
                ) : null,
              endAdornment:
                !isFocused && watchGlobalCommand ? (
                  <Box
                    sx={{
                      display: {
                        xs: 'none',
                        md: 'block'
                      },
                      position: 'absolute',
                      right: '0.75em',
                      py: 0.5
                    }}
                  >
                    <Box
                      sx={{
                        px: 0.875,
                        borderRadius: '0.25em',
                        fontSize: '0.875em',
                        fontWeight: 500,
                        border: '1px solid',
                        borderColor: 'rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      /
                    </Box>
                  </Box>
                ) : isLoading && isFocused ? (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      position: 'absolute',
                      right: '1rem',
                      py: 0.5
                    }}
                  >
                    <CircularProgress color="inherit" size={16} />
                  </Box>
                ) : null
            }}
          />
        )}
        renderOption={({ className, ...props }, option) => {
          return (
            <Box
              key={option.key}
              component="li"
              {...props}
              sx={{
                display: 'flex',
                px: '0.75em',
                py: '0.375em',
                mx: '0.5em',
                fontSize:
                  variant === 'navbar'
                    ? {
                        base: '1rem',
                        sm: '0.875rem'
                      }
                    : '0.875rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                listStyle: 'none',
                '&.Mui-focused': {
                  bgcolor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              {showIcon && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    ml: '0.25em',
                    mr: '1em',
                    color: 'text.disabled'
                  }}
                >
                  {option.type === 'team' ? (
                    <TeamIcon sx={{ fontSize: '1.25em' }} />
                  ) : option.type === 'event' ? (
                    <EventIcon sx={{ fontSize: '1.25em' }} />
                  ) : null}
                </Box>
              )}
              <Box flex={1} sx={{ overflow: 'hidden' }}>
                <Typography fontSize="1em" fontWeight={showDescription ? 500 : undefined} noWrap>
                  {option.label}
                </Typography>
                {showDescription && (
                  <Typography color="GrayText" fontSize="0.875em" noWrap>
                    {option.description}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        }}
      />
      {variant !== 'navbar' && (
        <Backdrop
          open={isFocused}
          sx={{
            zIndex: 1305,
            backgroundColor: 'rgba(0, 0, 0, 0.36)'
          }}
        />
      )}
    </>
  );
};

export default Search;
