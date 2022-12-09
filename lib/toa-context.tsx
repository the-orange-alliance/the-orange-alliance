import { createContext, useContext } from 'react';
import TOAAppContext from './models/AppContext';

const TOAAppContext = createContext<TOAAppContext>({} as TOAAppContext);
export const useAppContext = () => useContext(TOAAppContext);

const TOAAppContextProvider = TOAAppContext.Provider;

export default TOAAppContextProvider;
