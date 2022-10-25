import { Button } from '../CustomButton';
import { Link } from 'react-router-dom';

interface isLastEl extends Friends {
  isLastEl: boolean;
  onClick: (friendId: string) => void;
}

export const FriendsList = ({
  _id,
  profileUrl,
  given_name,
  family_name,
  isLastEl,
  onClick,
}: isLastEl) => {
  return (
    <div className='flex flex-wrap justify-center items-center'>
      <Link to={`/profile/${_id}`} className="w-7/12 flex md:w-1/2 xl:w-7/12 xl:mr-3">
        <div className='w-full flex'>
          <img
            className='w-12 h-12 rounded-full object-cover mr-3 border-2 border-slate-500 bg-gradient-to-r from-blue-600 to to-red-500'
            src={`${profileUrl}`}
            alt=''
            referrerPolicy='no-referrer'
          />
          <h1 className='text-md font-semibold flex justify-center items-center'>
            {given_name} {family_name}
          </h1>
        </div>
      </Link>
      <Button
        onClick={() => onClick(_id)}
        name='UNFRIEND'
        className='text-sm bg-red-700 hover:bg-red-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
      />
      {!isLastEl && <div className='w-full mt-6 mb-6 h-px bg-slate-500'></div>}
    </div>
  );
};
