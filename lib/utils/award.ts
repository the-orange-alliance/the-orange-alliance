import { AwardRecipient } from '@the-orange-alliance/api/lib/cjs/models';

export function sortAwards(awards: AwardRecipient[]) {
  const list = [...awards];
  list.sort(function (a, b) {
    return a.award.displayOrder > b.award.displayOrder
      ? 1
      : b.award.displayOrder > a.award.displayOrder
      ? -1
      : 0;
  });
  return list;
}

export function getAwardHeader(awardRecipient: AwardRecipient, t: any) {
  const key = awardRecipient.awardKey;
  const translation = 'pages.event.subpages.awards.';
  if (key.startsWith('INS')) {
    return t(translation + 'award_names.inspire');
  } else if (key.startsWith('THK')) {
    return t(translation + 'award_names.think');
  } else if (key.startsWith('CNT')) {
    return t(translation + 'award_names.connect');
  } else if (key.startsWith('INV')) {
    return t(translation + 'award_names.innovate');
  } else if (key.startsWith('DSN')) {
    return t(translation + 'award_names.design');
  } else if (key.startsWith('MOT')) {
    return t(translation + 'award_names.motivate');
  } else if (key.startsWith('CTL')) {
    return t(translation + 'award_names.control');
  } else if (key.startsWith('PRM')) {
    return t(translation + 'award_names.promote');
  } else if (key.startsWith('CMP')) {
    return t(translation + 'award_names.compass');
  } else if (key.startsWith('JUD')) {
    return t(translation + 'award_names.judges');
  } else if (key.startsWith('WIN')) {
    return t(translation + 'award_names.win');
  } else if (key.startsWith('FIN')) {
    return t(translation + 'award_names.finalist');
  } else if (key.startsWith('DNSSF')) {
    return t(translation + 'award_names.deans_final');
  } else if (key.startsWith('DNSF')) {
    return t(translation + 'award_names.deans');
  } else {
    return awardRecipient.awardName + 's';
  }
}
