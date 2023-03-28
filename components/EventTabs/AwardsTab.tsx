import { Fragment } from 'react';
import NextLink from 'next/link';
import { Box, ListItemText, ListItemIcon, ListItemButton, Typography } from '@mui/material';
import type { AwardRecipient } from '@the-orange-alliance/api/lib/cjs/models';
import { useTranslate } from '../../i18n/i18n';
import { getAwardHeader, sortAwards } from '../../lib/utils/award';

interface AwardsTabProps {
  awards: AwardRecipient[];
}

const AwardsTab: React.FC<AwardsTabProps> = ({ awards }) => {
  const t = useTranslate();

  const sortedAwards = sortAwards(awards);

  return (
    <Box sx={{ mx: 2, pb: 2 }}>
      {sortedAwards.map((award, i) => {
        const isNewAward =
          i === 0 || getAwardHeader(award, t) !== getAwardHeader(sortedAwards[i - 1], t);

        const text = [
          award.receiverName,
          award.teamKey
            ? `${t('general.team')} #${award.teamKey} - ${award.team.teamNameShort}`
            : null
        ]
          .filter(Boolean)
          .join(', ');

        return (
          <Fragment key={award.awardKey}>
            {isNewAward && (
              <Typography
                sx={{
                  fontWeight: 500,
                  px: 2,
                  mt: 2.5,
                  mb: 1
                }}
              >
                {getAwardHeader(award, t)}
              </Typography>
            )}
            <NextLink href={`/teams/${award.teamKey}`} passHref>
              <ListItemButton component="a" dense>
                <ListItemIcon
                  sx={{
                    fontSize: '0.875rem',
                    minWidth: '2em'
                  }}
                >
                  {award.awardKey.replace(/\D/g, '')}.
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </NextLink>
          </Fragment>
        );
      })}
    </Box>
  );
};

export default AwardsTab;
