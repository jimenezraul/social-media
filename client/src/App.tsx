import { BrowserRouter as Router} from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import AppRoutes from './routes';

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
      <AppRoutes />
      </Router>
    </ApolloProvider>
  );
}

export default App;
