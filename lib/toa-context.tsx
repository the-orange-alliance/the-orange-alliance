import { createContext, useContext } from 'react';
import { League, Region, Season } from '@the-orange-alliance/api/lib/cjs/models';
import TOAUser from './models/toa-user';

export interface IAppContext {
  seasons: Season[];
  regions: Region[];
  leagues: League[];
  isAuthLoaded: boolean;
  user: TOAUser | null;
  setUser: (user: TOAUser | null) => void;
}

const TOAAppContext = createContext<IAppContext>({} as IAppContext);

export const useAppContext = () => useContext(TOAAppContext);

const TOAAppContextProvider = TOAAppContext.Provider;

export default TOAAppContextProvider;
