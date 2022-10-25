import { FriendRequest } from '../../../components/FriendRequest';
import { useQuery } from '@apollo/client';
import { GET_ALL_USER } from './api/queries';
import { useState } from 'react';

import { Search } from '../../../components/Search';

export const SearchForFriends = () => {
  const { data, loading, error } = useQuery(GET_ALL_USER);
  const [search, setSearch] = useState('');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  if (!data) return <p>No data</p>;

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
  };

  const filteredUsers = data.users.filter((user: User) => {
    return user.fullName.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className='container mx-auto'>
      <div className='flex flex-col justify-center items-center w-full'>
        <div className='w-full max-w-md px-2'>
          <Search handleSearch={handleSearch} />
          {filteredUsers.map((user: User, index: any) => (
            <FriendRequest key={index} {...user} />
          ))}
        </div>
      </div>
    </div>
  );
};
