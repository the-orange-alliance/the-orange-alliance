import {
  Autocomplete,
  AutocompleteChangeReason,
  AutocompleteProps,
  Box,
  CircularProgress,
  TextField
} from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslate } from '../../i18n/i18n';
import { SearchResult } from '@the-orange-alliance/api/lib/cjs/models';
import { useRouter } from 'next/router';
import TOAProvider from '../../providers/TOAProvider';

interface Option {
  key: string;
  label: string;
  type: 'divider' | 'team' | 'event';
}

interface SearchProps extends Partial<AutocompleteProps<Option, false, false, true>> {
  onBlur?: () => void;
}

const Search: React.FC<SearchProps> = ({ onBlur, ...props }) => {
  const t = useTranslate();
  const router = useRouter();
  const [results, setResults] = useState<SearchResult | null>(null);
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
    [onBlur]
  );

  const options = useMemo(
    () => [
      ...(results?.teams || []).map(team => ({
        key: team.teamKey,
        type: 'team' as const,
        label: team.teamNameShort
          ? `#${team.teamKey} ${team.teamNameShort}`
          : `Team #${team.teamKey}`
      })),
      ...(results?.events || []).map(event => ({
        key: event.eventKey,
        type: 'event' as const,
        label: event.fullEventName
      }))
    ],

    [t, results]
  );

  useEffect(() => {
    const down = (e: globalThis.KeyboardEvent): void => {
      if (e.key === '/' || (e.key === 'k' && e.metaKey)) {
        e.preventDefault();
        const input = document.querySelector('input#toa-search') as HTMLInputElement;
        input?.focus();
      }
    };

    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, []);

  return (
    <Autocomplete
      id="toa-search"
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
      onFocus={() => setIsFocused(true)}
      onBlur={() => {
        setInputValue('');
        setIsFocused(false);
        onBlur?.();
      }}
      onKeyDown={e => {
        if (e.key === 'Escape') {
          (e.target as HTMLInputElement).blur();
        }
      }}
      {...props}
      options={options}
      noOptionsText={t('general.search_no_results')}
      groupBy={option => option.type}
      open={isFocused && inputValue.length > 0 && results !== null}
      renderInput={params => (
        <TextField
          {...params}
          onChange={onSearchChange}
          sx={{ p: 0 }}
          variant="standard"
          InputProps={{
            ...params.InputProps,
            sx: {
              p: '0 !important',
              position: 'relative',
              '& input': {
                fontSize: {
                  base: '1rem',
                  sm: '0.875rem'
                },
                padding: '0.5rem 0.75rem !important',
                background: 'rgba(0, 0, 0, 0.04)',
                borderRadius: '0.5rem',
                my: 0.5,
                transition: 'all 0.2s ease-in-out',
                '&:focus': {
                  background: 'transparent',
                  boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.08)'
                }
              }
            },
            disableUnderline: true,
            placeholder: t('general.search_text_long'),
            endAdornment: !isFocused ? (
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
            ) : isLoading ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  position: 'absolute',
                  right: '1rem',
                  py: 0.5
                }}
              >
                <CircularProgress color={'secondary'} size={16} />
              </Box>
            ) : null
          }}
        />
      )}
      renderGroup={params => (
        <li>
          <Box
            sx={{
              top: 0,
              position: 'sticky',
              padding: '0.675em 0.875em',
              bgcolor: '#f9fafb',
              color: 'text.disabled',
              fontSize: '0.875rem',
              fontWeight: 500
            }}
          >
            {t(`general.${params.group}s`)}
          </Box>
          <Box component="ul" py={1} px={1}>
            {params.children}
          </Box>
        </li>
      )}
      renderOption={({ className, ...props }, option) => {
        return (
          <Box
            component="li"
            {...props}
            sx={{
              px: '0.75em',
              py: '0.375em',
              fontSize: {
                base: '1rem',
                sm: '0.875rem'
              },
              borderRadius: '0.375rem',
              cursor: 'pointer',
              listStyle: 'none',
              '&.Mui-focused': {
                bgcolor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            {option.label}
          </Box>
        );
      }}

      //   renderOption={(props, item) => {
      //     if (item.type === 'divider') {
      //       return (
      //         <Box
      //           sx={{
      //             display: 'flex',
      //             alignItems: 'center',
      //             px: 1.5,
      //             py: 0.5,
      //             fontSize: '0.875rem',
      //             fontWeight: 500,
      //             color: 'rgba(0, 0, 0, 0.6)'
      //           }}
      //         >
      //           {item.label}
      //         </Box>
      //       );
      //     }
      //     return (
      //       <Box
      //         sx={{
      //           display: 'flex',
      //           alignItems: 'center',
      //           px: 1.5,
      //           py: 0.5,
      //           fontSize: '0.875rem',
      //           color: 'rgba(0, 0, 0, 0.8)'
      //         }}
      //       >
      //         {item.label}
      //       </Box>
      //     );
      //   }}
    />
  );
};

export default Search;
