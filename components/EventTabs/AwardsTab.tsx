import * as React from "react";
import {ListItem, ListItemText, ListItemIcon} from "@mui/material";
import {AwardRecipient, Event} from "@the-orange-alliance/api/lib/cjs/models";
import IconOne from "@mui/icons-material/LooksOneOutlined";
import IconTwo from "@mui/icons-material/LooksTwoOutlined";
import IconThree from "@mui/icons-material/Looks3Outlined";
import IconTrophy from "@mui/icons-material/EmojiEventsOutlined";
import {useTranslate} from "../../i18n/i18n";
import {sort} from "../../util/award-utils";

const translation = "pages.event.subpages.awards.";

interface IProps {
  event: Event
}

const AwardsTab = (props: IProps) => {
  const t = useTranslate();
  const {awards} = props.event;

  function getHeader(awardRecipient: AwardRecipient) {
    const key = awardRecipient.awardKey;
    if (key.startsWith("INS")) {
      return t(translation + "award_names.inspire");
    } else if (key.startsWith("THK")) {
      return t(translation + "award_names.think");
    } else if (key.startsWith("CNT")) {
      return t(translation + "award_names.connect");
    } else if (key.startsWith("INV")) {
      return t(translation + "award_names.innovate");
    } else if (key.startsWith("DSN")) {
      return t(translation + "award_names.design");
    } else if (key.startsWith("MOT")) {
      return t(translation + "award_names.motivate");
    } else if (key.startsWith("CTL")) {
      return t(translation + "award_names.control");
    } else if (key.startsWith("PRM")) {
      return t(translation + "award_names.promote");
    } else if (key.startsWith("CMP")) {
      return t(translation + "award_names.compass");
    } else if (key.startsWith("JUD")) {
      return t(translation + "award_names.judges");
    } else if (key.startsWith("WIN")) {
      return t(translation + "award_names.win");
    } else if (key.startsWith("FIN")) {
      return t(translation + "award_names.finalist");
    } else if (key.startsWith("DNSSF")) {
      return t(translation + "award_names.deans_final");
    } else if (key.startsWith("DNSF")) {
      return t(translation + "award_names.deans");
    } else {
      return awardRecipient.awardName + "s";
    }
  }

  const sortedAwards = sort(awards);

  function isNewList(i: number) {
    return i > 0 ? getHeader(sortedAwards[i]) !== getHeader(sortedAwards[i - 1]) : true;
  }

  return (
    <div>
      {sortedAwards.map((award, i) => {
        if (isNewList(i)) {
          return (
            <React.Fragment key={award.awardKey + '-' + award.teamKey}>
              <AwardHeader title={getHeader(award)}/>
              <AwardCell awardRecipient={award}/>
            </React.Fragment>
          );
        } else {
          return <AwardCell key={award.awardKey + '-' + award.teamKey} awardRecipient={award}/>;
        }
      })}
    </div>
  );
}
;

const Icon = (index: number) => {
  if (index === 1) {
    return <IconOne/>;
  } else if (index === 2) {
    return <IconTwo/>;
  } else if (index === 3) {
    return <IconThree/>;
  }
  return <IconTrophy/>;
}

const AwardCell = ({awardRecipient}: {awardRecipient: AwardRecipient}) =>{
  const t = useTranslate();
  const level = parseInt(awardRecipient.awardKey.replace(/\D/g, ""));
  return (
    <ListItem component='a' button href={`/teams/${awardRecipient.teamKey}`}>
      <ListItemIcon>{Icon(level)}</ListItemIcon>
      <ListItemText
        primary={`${t("general.team")} #${awardRecipient.teamKey} - ${awardRecipient.team.teamNameShort}`}
      />
    </ListItem>
  );
}

const AwardHeader = ({title}:{title: string}) =>{
  return (
    <ListItem>
      <ListItemText
        primary={title}
        primaryTypographyProps={{
          variant: "button"
        }}
      />
    </ListItem>
  );
}

export default AwardsTab;
