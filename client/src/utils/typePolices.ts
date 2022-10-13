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

    Comment: {
      fields: {
        likes: {
          merge(existing = [], incoming: any) {
            return incoming;
          },
        },
      },
    },
  },
};
