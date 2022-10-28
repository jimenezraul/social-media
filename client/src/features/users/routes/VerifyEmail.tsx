import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { VERIFY_EMAIL } from '../../../utils/mutations';

export const VerifyEmail = () => {
  const token = new URLSearchParams(window.location.search).get('token');
  const [data, setData] = useState<{ message: string; verified: boolean }>({
    message: '',
    verified: false,
  });
  const [verifyEmail] = useMutation(VERIFY_EMAIL);

  useEffect(() => {
    const verify = async () => {
      const { data } = await verifyEmail({ variables: { token } });
      const { message, success } = data.verifyUser;
      setData({ message, verified: success });
    };

    if (token && !data.message) {
      verify();
    }
  }, [data, token, verifyEmail]);

  if (!data.verified) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
       <h1 className="text-3xl font-semibold text-white">{data.message}</h1>
       <i className="mt-5  text-red-600 bg-white border-2 rounded-full text-7xl  fa-regular fa-circle-xmark"></i>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 justify-center items-center">
      <h1 className="text-3xl font-semibold text-white">{data.message}</h1>
      <i className="mt-5 text-green-600 bg-white border-2 rounded-full text-7xl fa-regular fa-circle-check"></i>
    </div>
  );
};
