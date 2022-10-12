export const policies = {
  typePolicies: {
    Post: {
      fields: {
        likes: {
          merge(existing = [], incoming: any) {
            return incoming;
          },
        },
      },
      User: {
        fields: {
          posts: {
            merge(existing = [], incoming: any) {
              return incoming;
            },
          },
        },
      },
      Query: {
        fields: {
          posts: {
            keyArgs: false,
            merge(existing = [], incoming: any) {
              return [...existing, ...incoming];
            },
          },
          user: {
            keyArgs: false,
            merge(existing = [], incoming: any) {
              return [...existing, ...incoming];
            },
          },
          users: {
            keyArgs: false,
            merge(existing = [], incoming: any) {
              return [...existing, ...incoming];
            },
          },
          feed: {
            keyArgs: false,
            merge(existing = [], incoming: any) {
              return [...incoming];
            },
          },
        },
      },
    },
  },
};
