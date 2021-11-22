import * as React from "react";
import { ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { IApplicationState } from "shared";
import { AwardRecipient } from "@the-orange-alliance/api/lib/esm/models";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { sort } from "../../../util/award-utils";
import IconOne from "@mui/icons-material/LooksOneOutlined";
import IconTwo from "@mui/icons-material/LooksTwoOutlined";
import IconThree from "@mui/icons-material/Looks3Outlined";
import IconTrophy from "@mui/icons-material/EmojiEventsOutlined";

const translation = "pages.event.subpages.awards.";

const AwardsTab = () => {
  const { t } = useTranslation();

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

  const { eventCode } = useParams<{ eventCode: string }>();
  const dispatch = useDispatch();
  //   function loadEventAwards() {
  //     getEventAwards(eventCode).then((awards: AwardRecipient[]) => {
  //       dispatch(setEventAwards(awards));
  //     });
  //   }
  const awardsList = useSelector((state: IApplicationState) => state.currentEvent.awards);
  const sortedAwards = sort(awardsList);

  function isNewList(i: number) {
    return i > 0 ? getHeader(sortedAwards[i]) !== getHeader(sortedAwards[i - 1]) : true;
  }
  return (
    <div>
      {sortedAwards.map((award, i) => {
        if (isNewList(i)) {
          return (
            <>
              <AwardHeader title={getHeader(award)}></AwardHeader>
              <AwardCell awardRecipient={award}></AwardCell>
            </>
          );
        } else {
          return <AwardCell awardRecipient={award}></AwardCell>;
        }
      })}
    </div>
  );
};

function Icon(index: number) {
  if (index === 1) {
    return <IconOne />;
  } else if (index === 2) {
    return <IconTwo />;
  } else if (index === 3) {
    return <IconThree />;
  }
  return <IconTrophy />;
}

function AwardCell({ awardRecipient }: { awardRecipient: AwardRecipient }) {
  const { t } = useTranslation();
  const level = parseInt(awardRecipient.awardKey.replace(/\D/g, ""));
  return (
    <ListItem component='a' button href={`/teams/${awardRecipient.teamKey}`}>
      <ListItemIcon>{Icon(level)}</ListItemIcon>
      <ListItemText
        primary={`${t("general.team")} #${awardRecipient.teamKey} - ${awardRecipient.team.teamNameShort}`}
      ></ListItemText>
    </ListItem>
  );
}

function AwardHeader({ title }: { title: string }) {
  return (
    <ListItem>
      <ListItemText
        primary={title}
        primaryTypographyProps={{
          variant: "button"
        }}
      ></ListItemText>
    </ListItem>
  );
}

export default AwardsTab;
