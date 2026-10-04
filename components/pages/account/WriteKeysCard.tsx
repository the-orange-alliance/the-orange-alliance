import { useEffect, useMemo, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { toast } from 'sonner';
import { Event } from '@the-orange-alliance/api/lib/cjs/models';
import { useTranslate } from '@/i18n/i18n';
import { useAppContext } from '@/lib/toa-context';
import TOAProvider from '@/providers/toa-provider';
import { CURRENT_SEASON } from '@/constants';
import {
  fetchWriteKeys,
  requestWriteKey,
  WriteKey,
  WriteKeyStatus
} from '@/providers/firebase-provider';
import SideCard from './SideCard';

// Same keys as TOA-API utils/write-keys.ts WRITE_SCOPES.
const SCOPES = [
  'match_video',
  'event_matches',
  'event_rankings',
  'event_awards',
  'event_teams',
  'event_media',
  'event_info'
] as const;

const STATUS_COLOR: Record<WriteKeyStatus, 'warning' | 'success' | 'default' | 'error'> = {
  pending: 'warning',
  active: 'success',
  expired: 'default',
  rejected: 'error',
  revoked: 'default'
};

// A key works until 7 days after the event's last day (TOA-API keyExpiry).
const stillOpen = (e: Event) => {
  const last = e.endDate || e.startDate;
  if (!last) return false;
  return Date.now() < new Date(last).getTime() + 8 * 86400000;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

const WriteKeysCard = () => {
  const t = useTranslate();
  const { user } = useAppContext();
  const [keys, setKeys] = useState<WriteKey[] | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [event, setEvent] = useState<Event | null>(null);
  const [scopes, setScopes] = useState<string[]>(['match_video']);
  const [purpose, setPurpose] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchWriteKeys()
      .then(setKeys)
      .catch(() => setKeys([]));
    TOAProvider.getAPI()
      .getEvents({ season_key: CURRENT_SEASON })
      .then(list => setEvents(list.filter(stillOpen)))
      .catch(() => setEvents([]));
  }, [user]);

  const options = useMemo(
    () => [...events].sort((a, b) => a.eventName.localeCompare(b.eventName)),
    [events]
  );

  if (!user) return null;

  const toggleScope = (scope: string) =>
    setScopes(s => (s.includes(scope) ? s.filter(x => x !== scope) : [...s, scope]));

  const submit = () => {
    if (!event) return;
    setSending(true);
    requestWriteKey(event.eventKey, scopes, purpose)
      .then(key => {
        setKeys(k => [key, ...(k ?? [])]);
        setEvent(null);
        setPurpose('');
      })
      .catch(err => toast.error(err.message))
      .finally(() => setSending(false));
  };

  const copy = (value: string) =>
    navigator.clipboard
      .writeText(value)
      .then(() => toast.success(t('pages.account.write_keys.copied')));

  return (
    <SideCard title="pages.account.write_keys.title">
      {keys === null ? null : keys.length === 0 ? (
        <Typography color="text.secondary">{t('pages.account.write_keys.empty')}</Typography>
      ) : (
        <Stack spacing={2} divider={<Divider />}>
          {keys.map(key => (
            <Box key={key.id}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                <Typography fontWeight={500} sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                  {key.event_name ?? key.event_key}
                </Typography>
                <Chip
                  size="small"
                  color={STATUS_COLOR[key.status]}
                  label={t(`pages.account.write_keys.status.${key.status}`)}
                />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {key.event_key}
                {key.expires_at && key.status === 'active'
                  ? ` · ${t('pages.account.write_keys.expires')} ${formatDate(key.expires_at)}`
                  : ''}
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={0.5} mt={1}>
                {key.scopes.map(s => (
                  <Chip
                    key={s}
                    size="small"
                    variant="outlined"
                    label={t(`pages.account.write_keys.scopes.${s}`)}
                  />
                ))}
              </Stack>
              {key.api_key && key.status === 'active' && (
                <Stack direction="row" alignItems="center" gap={1} mt={1}>
                  <code className="write-key">{key.api_key}</code>
                  <Tooltip title={t('pages.account.write_keys.copy')}>
                    <IconButton
                      size="small"
                      aria-label={t('pages.account.write_keys.copy')}
                      onClick={() => copy(key.api_key!)}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              )}
            </Box>
          ))}
        </Stack>
      )}

      <Typography fontWeight={500} mt={3} mb={1}>
        {t('pages.account.write_keys.request')}
      </Typography>
      <Autocomplete
        options={options}
        value={event}
        onChange={(_, value) => setEvent(value)}
        getOptionLabel={e => `${e.eventName} (${e.eventKey})`}
        isOptionEqualToValue={(a, b) => a.eventKey === b.eventKey}
        renderInput={params => (
          <TextField {...params} label={t('pages.account.write_keys.event')} size="small" />
        )}
      />
      <FormGroup sx={{ mt: 1 }}>
        {SCOPES.map(scope => (
          <FormControlLabel
            key={scope}
            control={
              <Checkbox
                size="small"
                checked={scopes.includes(scope)}
                onChange={() => toggleScope(scope)}
              />
            }
            label={t(`pages.account.write_keys.scopes.${scope}`)}
          />
        ))}
      </FormGroup>
      <TextField
        fullWidth
        size="small"
        sx={{ mt: 1 }}
        label={t('pages.account.write_keys.purpose')}
        value={purpose}
        inputProps={{ maxLength: 300 }}
        onChange={e => setPurpose(e.target.value)}
      />
      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 2 }}
        disabled={!event || scopes.length === 0 || sending}
        onClick={submit}
      >
        {t('pages.account.write_keys.request')}
      </Button>
      <style jsx>{`
        .write-key {
          display: inline-block;
          min-width: 0;
          color: #2563eb;
          background: #eff6ff;
          line-height: 1.2;
          overflow-wrap: anywhere;
          padding: 0.25rem 0.5rem;
          border-radius: 0.5rem;
        }
      `}</style>
    </SideCard>
  );
};

export default WriteKeysCard;
