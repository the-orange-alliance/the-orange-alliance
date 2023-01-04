import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { CircularProgress, Fab, Tooltip } from "@mui/material";
import { useState } from "react";
import { useTranslate } from "../i18n/i18n";
import { useAppContext } from "../lib/toa-context";
import TOAUser from "../lib/TOAUser";
import { addToFavorite, removeFromFavorite } from "../providers/FirebaseProvider";


export enum myTOAType {
    event = "event",
    team = "team",
}

interface IProps {
    type: myTOAType;
    dataKey: string;
}

const fabStyle = {
    position: 'fixed',
    bottom: '1rem',
    right: '1rem',
    zIndex: 1000,
}

const MyTOAFavorite = ({ type, dataKey: key }: IProps) => {

    const { user, setUser } = useAppContext();

    const t = useTranslate();
    const [isFav, setIsFav] = useState<boolean>(!!(type === myTOAType.event ? user?.favoriteEvents?.includes(key) : user?.favoriteTeams?.includes(key)));
    const [loading, setLoading] = useState(false);

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

    return (
        <>
            {user &&
                <Tooltip title={isFav ? t('general.remove_from_mytoa') : t('general.add_to_mytoa')}>
                    <Fab sx={fabStyle} color="primary" aria-label={isFav ? "remove from myTOA" : "add to myTOA"} onClick={() => toggleFav(isFav, user)}>
                        {!loading && !isFav && <FavoriteBorder />}
                        {!loading && isFav && <Favorite />}
                        {loading && <CircularProgress sx={{ color: "black" }} />}
                    </Fab>
                </Tooltip>
            }
        </>
    )
}


export default MyTOAFavorite;