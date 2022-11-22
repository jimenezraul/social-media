const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const {
  ApolloServerPluginInlineTrace,
} = require('@apollo/server/plugin/inlineTrace');
const { createServer } = require('http');
const {
  ApolloServerPluginDrainHttpServer,
} = require('@apollo/server/plugin/drainHttpServer');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');

const path = require('path');
const cors = require('cors');

const { authMiddleware, credentials } = require('./utils/auth');

const db = require('./config/connection');

const { typeDefs, resolvers } = require('./schemas');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const PORT = process.env.PORT || 3001;

const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  csrfPrevention: true,
  cache: 'bounded',
  plugins: [
    ApolloServerPluginInlineTrace(),
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(credentials);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`);
    else next();
  });
}

const startApolloServer = async () => {
  await server.start();
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: authMiddleware,
    })
  );
  db.once('open', () => {
    httpServer.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}`);
    });
  });
};

startApolloServer(typeDefs, resolvers);
