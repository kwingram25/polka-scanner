import { Layout } from './components/Layout';
import { ApiContextProvider } from './contexts/ApiContext';
import { EventsContextProvider } from './contexts/EventsContext';

export default function App(): JSX.Element {
  return (
    <ApiContextProvider>
      <EventsContextProvider>
        <Layout />
      </EventsContextProvider>
    </ApiContextProvider>
  );
}
