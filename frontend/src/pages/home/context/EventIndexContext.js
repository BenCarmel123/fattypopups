import { createContext, useContext } from 'react';

const EventIndexContext = createContext(0);

export const useEventIndex = () => useContext(EventIndexContext);
export default EventIndexContext;