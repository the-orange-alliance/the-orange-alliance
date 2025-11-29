import { useEffect, useState } from 'react';
import {
  Card,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography
} from '@mui/material';
import { Region, Season } from '@the-orange-alliance/api/lib/cjs/models';
import { useRouter } from 'next/router';
import { getRegionString, getSeasonString } from '@/lib/utils/common';
import { useTranslate } from '@/i18n/i18n';
import { CURRENT_SEASON } from '@/constants';
import { useAppContext } from '@/lib/toa-context';

interface IProps {
  forceReload?: boolean;
  fetching?: boolean;
  onRegionChange?: (region: Region) => void;
  onSeasonChange?: (season: Season) => void;
}

const FiltersCard = ({ fetching, forceReload, onSeasonChange, onRegionChange }: IProps) => {
  const router = useRouter();
  const t = useTranslate();
  const { regions, seasons } = useAppContext();
  const [selectedSeasonKey, setSelectedSeasonKey] = useState<string>(CURRENT_SEASON);
  const [selectedRegionKey, setSelectedRegionKey] = useState<string>('all');
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);

  useEffect(() => {
    const query = router.query as any;
    if (query.season) {
      setSelectedSeasonKey(query.season as string);
    }
    if (query.region) {
      setSelectedRegionKey(query.region as string);
    }
  }, [router.query]);

  useEffect(() => {
    if (!router.isReady) return;
    const query = {} as any;
    if (selectedSeasonKey !== CURRENT_SEASON) {
      query.season = selectedSeasonKey;
    }
    if (selectedRegionKey !== 'all') {
      query.region = selectedRegionKey;
    }

    setIsPageLoading(true);
    router
      .push({ query: query }, undefined, { shallow: !forceReload })
      .then(() => setIsPageLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSeasonKey, selectedRegionKey, forceReload]);

  useEffect(() => {
    const season = seasons.find(s => s.seasonKey === selectedSeasonKey)!;
    onSeasonChange?.(season);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seasons, selectedSeasonKey]);

  useEffect(() => {
    const region = regions.find(r => r.regionKey === selectedRegionKey)!;
    onRegionChange?.(region);
  }, [onRegionChange, regions, selectedRegionKey]);

  return (
    <Card sx={{ mt: 4 }}>
      {(fetching || isPageLoading) && <LinearProgress />}
      <Typography sx={{ margin: 2 }} variant="subtitle2">
        {t('pages.events.filter')}
      </Typography>
      <Divider />
      <Grid container p={2} spacing={2} maxWidth="sm">
        <Grid size={6}>
          <FormControl size="small" fullWidth>
            <InputLabel id="season-select-label">Season</InputLabel>
            <Select
              labelId="season-select-label"
              label="Season"
              value={selectedSeasonKey}
              onChange={(event: SelectChangeEvent) => setSelectedSeasonKey(event.target.value)}
            >
              {seasons.map(season => (
                <MenuItem key={season.seasonKey} value={season.seasonKey}>
                  {getSeasonString(season)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={6}>
          <FormControl size="small" fullWidth>
            <InputLabel id="region-select-label">Region</InputLabel>
            <Select
              labelId="region-select-label"
              label="Region"
              value={selectedRegionKey}
              onChange={(event: SelectChangeEvent) => setSelectedRegionKey(event.target.value)}
            >
              {regions.map(region => (
                <MenuItem key={region.regionKey} value={region.regionKey}>
                  {getRegionString(region)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Card>
  );
};

export default FiltersCard;
