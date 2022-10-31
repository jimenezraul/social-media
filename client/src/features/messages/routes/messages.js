import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../../features/users/userSlice';
const { MessageList } = require('../../../components/MessageList');

export const Messages = () => {
  const user = useAppSelector(selectUser).user;
  const data = {
    getMembers: [
      {
        _id: '60f1c1b0b9b1a8a0b0b0b0b0',
        members: [
          {
            _id: '635b528058eeff1e09394969',
            given_name: 'Raul',
            family_name: 'Jimenez',
            profileUrl: '',
          },
          {
            _id: '635b528058eeff1e09394968',
            given_name: 'John',
            family_name: 'Doe',
            profileUrl: '',
          },
        ],
        messages: [
          {
            _id: '60f1c1b0b9b1a8a0b0b0b0b1',
            sender: {
              _id: '635b528058eeff1e09394969',
              given_name: 'Raul',
              family_name: 'Jimenez',
              profileUrl: '',
            },
            text: 'Hello',
            media: [],
            createdAt: '2021-07-19T21:00:00.000Z',
            status: 'delivered',
          },
          {
            _id: '60f1c1b0b9b1a8a0b0b0b0b2',
            sender: {
              _id: '635b528058eeff1e09394968',
              given_name: 'John',
              family_name: 'Doe',
              profileUrl: '',
            },
            text: 'Hello',
            media: [],
            createdAt: '2021-07-19T21:00:00.000Z',
            status: 'delivered',
          },
        ],
      },
      {
        _id: '60f1c1b0b9b1a8a0b0b0b0b3',
        members: [
          {
            _id: '635b528058eeff1e09394969',
            given_name: 'Raul',
            family_name: 'Jimenez',
            profileUrl: '',
          },
          {
            _id: '635b528058eeff1e09394964',
            given_name: 'Tom',
            family_name: 'Smith',
            profileUrl: '',
          },
        ],
        messages: [
          {
            _id: '60f1c1b0b9b1a8a0b0b0b0b4',
            sender: {
              _id: '635b528058eeff1e09394969',
              given_name: 'Raul',
              family_name: 'Jimenez',
              profileUrl: '',
            },
            text: 'Hello',
            media: [],
            createdAt: '2021-07-19T21:00:00.000Z',
            status: 'delivered',
          },
          {
            _id: '60f1c1b0b9b1a8a0b0b0b0b5',
            sender: {
              _id: '635b528058eeff1e09394964',
              given_name: 'Tom',
              family_name: 'Smith',
              profileUrl: '',
            },
            text: 'Hello',
            media: [],
            createdAt: '2021-07-19T21:00:00.000Z',
            status: 'delivered',
          },
        ],
      },
    ],
  };

  const members = data.getMembers.map((member) => {
    const otherMember = member.members.find((m) => m._id !== user._id);
    return otherMember;
  });

  console.log(members);
  // const { data, loading, error } = useQuery(GET_MESSAGES, {
  //   fetchPolicy: 'network-only',
  // });

  // if (loading) return <Loading />;
  // if (error) return <Error error={error} />;
  console.log(data.getMembers);
  return (
    <div className="container mx-auto">
      <div className="flex flex-row justify-center">
        <div className="p-1 flex flex-col space-y-2 w-full md:w-4/12 text-white">
          {members.map((member) => (
            <MessageList key={member._id} {...member} />
          ))}
        </div>
        <div className="p-1 w-full md:w-8/12 bg-blue-300">
          <h1 className="title">Messages</h1>
        </div>
      </div>
    </div>
  );
};
