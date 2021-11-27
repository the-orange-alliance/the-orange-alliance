import { useEffect, SyntheticEvent, useState } from 'react';
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  LinearProgress,
  TextField,
  Typography
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import { Region, Season } from '@the-orange-alliance/api/lib/cjs/models';
import { useRouter } from 'next/router';
import { getSeasonString } from '../lib/utils/common';
import { useTranslate } from '../i18n/i18n';
import { CURRENT_SEASON } from '../constants';

const useStyles = makeStyles((theme: Theme) => ({
  filterSelect: {
    width: '30px'
  }
}));

interface IProps {
  seasons: Season[];
  regions: Region[];
  route: string;
}

interface AutoComplete<T> {
  label: string;
  parent: T;
}

const FilterCard = (props: IProps) => {
  const classes = useStyles();
  const router = useRouter();
  const t = useTranslate();

  const { seasons, regions, route } = props;

  const [localRegions, setLocalRegions] = useState<AutoComplete<Region>[]>([]);
  const [localSeasons, setLocalSeasons] = useState<AutoComplete<Season>[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<AutoComplete<Region>>();
  const [selectedSeason, setSelectedSeason] = useState<AutoComplete<Season>>();
  const [fetching, setFetching] = useState<boolean>(false);

  useEffect(() => {
    // Set Region and create region dropdown options
    let tempRegion = { label: regions[0].description, parent: regions[0] };
    setLocalRegions(
      regions.map((r: Region) => {
        const temp = { label: getRegionString(r), parent: r };
        if (r.regionKey === router.query.region_key) tempRegion = temp;
        return temp;
      })
    );
    setSelectedRegion(tempRegion);

    // Set Season and create season dropdown options
    let tempSeason = { label: getSeasonString(seasons[0]), parent: seasons[0] };
    setLocalSeasons(
      seasons.map((s: Season) => {
        const temp = { label: getSeasonString(s), parent: s };
        if (s.seasonKey === router.query.season_key) tempSeason = temp;
        return temp;
      })
    );
    setSelectedSeason(tempSeason);
  }, []);

  const getRegionString = (region: Region) => {
    if (region.regionKey === 'all') return region.description;
    return `${region.regionKey.toUpperCase()} - ${region.description}`;
  };

  const onSelectSeason = (event: any, val: AutoComplete<Season> | null) => {
    if (!val) return;
    if (selectedSeason && val.parent.seasonKey === selectedSeason.parent.seasonKey) return;
    pushNewFilter(val.parent, selectedRegion?.parent);
  };

  const onSelectRegion = (event: any, val: AutoComplete<Region> | null) => {
    if (!val) return;
    if (selectedRegion && val.parent.regionKey === selectedRegion.parent.regionKey) return;
    pushNewFilter(selectedSeason?.parent, val.parent);
  };

  const pushNewFilter = (season?: Season, region?: Region) => {
    const query = {} as any;
    if (season && season.seasonKey !== CURRENT_SEASON) query.season_key = season.seasonKey;
    if (region && region.regionKey !== 'all') query.region_key = region.regionKey;

    const seasonTestData = query.season_key ?? CURRENT_SEASON;
    const regionTestData = query.region_key ?? 'all';

    // Make sure we're not pushing to the same route we're already at
    if (
      seasonTestData !== selectedSeason?.parent.seasonKey ||
      regionTestData !== selectedRegion?.parent.regionKey
    ) {
      setFetching(true);
      router.push({ pathname: route, query: query }).then(() => {
        setFetching(false);
        setSelectedSeason(
          query.season_key
            ? localSeasons.find(s => s.parent.seasonKey === query.season_key)
            : localSeasons[0]
        );
        setSelectedRegion(
          query.region_key
            ? localRegions.find(r => r.parent.regionKey === query.region_key)
            : localRegions[0]
        );
      });
    }
  };

  const clearFilters = () => {
    pushNewFilter();
  };

  return (
    <Card>
      {fetching && <LinearProgress />}
      <Typography className={'ms-3 mt-2 mb-1'} variant="h6" gutterBottom>
        {t('pages.events.filter')}
      </Typography>
      <Divider />
      <Grid container>
        <Grid item xs={6} p={2}>
          <Autocomplete
            key={selectedSeason?.label}
            disablePortal
            id="seasons-filter"
            options={localSeasons}
            value={selectedSeason}
            isOptionEqualToValue={(a, b) => a.parent.seasonKey === b.parent.seasonKey}
            defaultValue={selectedSeason}
            onChange={onSelectSeason}
            renderInput={params => (
              <TextField {...params} variant={'standard'} label={t('pages.events.filter_season')} />
            )}
          />
        </Grid>
        <Grid item xs={6} p={2}>
          <Autocomplete
            key={selectedRegion?.label}
            disablePortal
            id="regions-filter"
            options={localRegions}
            value={selectedRegion}
            isOptionEqualToValue={(a, b) => a.parent.regionKey === b.parent.regionKey}
            defaultValue={selectedRegion}
            onChange={onSelectRegion}
            renderInput={params => (
              <TextField {...params} variant={'standard'} label={t('pages.events.filter_region')} />
            )}
          />
        </Grid>
      </Grid>
      <Divider />
      <Button fullWidth onClick={clearFilters}>
        {t('pages.events.clear_filter')}
      </Button>
    </Card>
  );
};

export default FilterCard;
