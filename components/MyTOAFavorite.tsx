import { Favorite, FavoriteBorder, NotificationsActive, NotificationsOff, YoutubeSearchedFor } from "@mui/icons-material";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { Action, Fab } from "react-tiny-fab";
import { useTranslate } from "../i18n/i18n";
import { useAppContext } from "../lib/toa-context";
import TOAUser from "../lib/TOAUser";
import { addToFavorite, removeFromFavorite, setNotifications } from "../providers/FirebaseProvider";


export enum myTOAType {
    event = "event",
    team = "team",
}

interface IProps {
    type: myTOAType;
    dataKey: string;
}

const MyTOAFavorite = ({ type, dataKey: key }: IProps) => {

    const { user, setUser } = useAppContext();

    const calcIsFav = () => !!(type === myTOAType.event ? user?.favoriteEvents?.includes(key) : user?.favoriteTeams?.includes(key))
    const calcNotiEnabled = () => !!(user && ((type === myTOAType.event && user.notifyEvents.includes(key)) || (type === myTOAType.team && user.notifyTeams.includes(key))));

    const t = useTranslate();
    const [isFav, setIsFav] = useState<boolean>(calcIsFav());
    const [loading, setLoading] = useState<boolean>(false);
    const [notiEnabled, setNotiEnabled] = useState<boolean>(calcNotiEnabled());
    const theme = useTheme();


    // Update things when user updates
    useEffect(() => {
        if(user) {
            setIsFav(calcIsFav());
            setNotiEnabled(calcNotiEnabled());
        }
    }, [user]);

    const toggleFav = (fav: boolean, user: TOAUser) => {
        //  Check if user is logged in
        if (!user) return;

        // Set Loading
        setLoading(true);

        // Add or remove from firebase
        const promise = fav ? removeFromFavorite(key, type) : addToFavorite(key, type);

        // Update DB
        promise.then(() => {
            // Revove from and update global user object
            if (type === myTOAType.event && fav) { // Remove event from favorites
                const favEvents = user.favoriteEvents.filter((eventKey) => eventKey !== key);
                setUser(new TOAUser().fromJSON({ ...user.toJSON(), favorite_events: favEvents }));
            } else if (type === myTOAType.event && !fav) { // Add event to favorites
                if (!user.favoriteEvents.includes(key)) user.favoriteEvents.push(key);
                setUser(new TOAUser().fromJSON({ ...user.toJSON() }));
            } else if (type === myTOAType.team && fav) { // Remove team from favorites
                const favTeams = user.favoriteTeams.filter((eventKey) => eventKey !== key);
                setUser(new TOAUser().fromJSON({ ...user.toJSON(), favorite_teams: favTeams }));
            } else if (type === myTOAType.team && !fav) { // Add team to favorites
                if (!user.favoriteTeams.includes(key)) user.favoriteTeams.push(key);
                setUser(new TOAUser().fromJSON({ ...user.toJSON() }));
            }

            // Update state
            setLoading(false);
            setIsFav(!fav);
        });
    }

    const toggleNotifications = (enabled: boolean, user: TOAUser) => {
        //  Check if user is logged in
        if (!user) return;

        // Set Loading
        setLoading(true);

        // Add or remove from firebase, then update our local user model
        setNotifications(type, key, !enabled).then(() => {
            // Revove from and update global user object
            if (type === myTOAType.event && enabled) { // Remove event from notifications
                const notifyEvents = user.notifyEvents.filter((eventKey) => eventKey !== key);
                setUser(new TOAUser().fromJSON({ ...user.toJSON(), notify_events: notifyEvents }));
            } else if (type === myTOAType.event && !enabled) { // Add event to notifications
                if (!user.notifyEvents.includes(key)) user.notifyEvents.push(key);
                setUser(new TOAUser().fromJSON({ ...user.toJSON() }));
            } else if (type === myTOAType.team && enabled) { // Remove team from notifications
                const notifyTeams = user.notifyTeams.filter((eventKey) => eventKey !== key);
                setUser(new TOAUser().fromJSON({ ...user.toJSON(), notify_teams: notifyTeams }));
            } else if (type === myTOAType.team && !enabled) { // Add team to notifications
                if (!user.notifyTeams.includes(key)) user.notifyTeams.push(key);
                setUser(new TOAUser().fromJSON({ ...user.toJSON() }));
            }

            // Update state
            setLoading(false);
            setNotiEnabled(!enabled);
        });
    }

    return (
        <>
            {user &&
                <Fab
                    icon={isFav ? <Favorite /> : <FavoriteBorder />}
                    onClick={() => toggleFav(isFav, user)}
                    text={isFav ? t("general.remove_from_mytoa") : t("general.add_to_mytoa")}
                    mainButtonStyles={{ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}
                >
                    {isFav &&
                        <Action
                            text={t(notiEnabled ? "general.disable_notifications" : "general.enable_notifications")}
                            onClick={() => toggleNotifications(notiEnabled, user)}
                            style={{ backgroundColor: theme.palette.primary.light, color: theme.palette.primary.contrastText }}
                        >
                            {notiEnabled ? <NotificationsActive /> : <NotificationsOff />}
                        </Action>
                    }
                </Fab>
            }
        </>
    )
}


export default MyTOAFavorite;