import { AwardRecipient } from "@the-orange-alliance/api/lib/models";

export function sort(items: AwardRecipient[]) {
  items.sort(function (a, b) {
    return a.award.displayOrder > b.award.displayOrder ? 1 : b.award.displayOrder > a.award.displayOrder ? -1 : 0;
  });
  return items;
}
