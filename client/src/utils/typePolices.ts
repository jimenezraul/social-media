export const policies = {
  typePolicies: {
    Post: {
      fields: {
        likes: {
          merge(existing = [], incoming: any) {
            return incoming;
          },
        },
        comments: {
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
        friends: {
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
    Messages: {
      fields: {
        messages: {
          merge(existing = [], incoming: any) {
            return incoming;
          },
        },
      },
    },
    Query: {
      fields: {
        feed: {
          merge(existing = [], incoming: any) {
            return incoming;
          },
        },
        post: {
          merge(existing = [], incoming: any) {
            return incoming;
          },
        },
        notificationsByUser: {
          merge(existing = [], incoming: any) {
            return incoming;
          },
        },
      },
    },
  },
};
