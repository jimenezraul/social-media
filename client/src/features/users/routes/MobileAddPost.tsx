import { AddPost } from '../../../components/AddPost';
import { GET_ME } from '../../../utils/queries';
import { useQuery } from '@apollo/client';

const MobileAddPost = () => {
  const { data, loading, error } = useQuery(GET_ME);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  if (!data) return <p>Not found</p>;

  return (
    <div className="w-full px-2">
      <AddPost me={data.me} />
    </div>
  );
};

export default MobileAddPost;
