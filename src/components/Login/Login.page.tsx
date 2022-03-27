import React, { useState } from 'react';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import logo from '../../Assets/logowhite.png';
import { client } from '../../client';

export const LoginPage = () => {
  const [isLoading, setLoading] = useState(false);

  const btnStyle = 'bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none ';
  const navigate = useNavigate();
  //Todo: check type from  google AUTH
  const responseGoogle = (res: any) => {
    setLoading(true);
    const profile = res.profileObj;
    localStorage.setItem('user', JSON.stringify(profile));

    const { name, googleId, imageUrl } = profile;

    const doc = {
      _id: googleId,
      _type: 'user',
      userName: name,
      image: imageUrl
    };

    client.createIfNotExists(doc).then(() => {
      navigate('/', { replace: true });
    });
  };

  const responseGoogleError = (res: any) => {
    console.log(res);
  };
  return (
    <div className="flex justify-start items-center flex-col  h-screen">
      <div className="relative w-full h-full">
        <video
          src={require('../../Assets/share.mp4')}
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} alt="logo" width="130px" />
          </div>
          <div className="shadow-2xl">
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_API_TOKEN as string}
              render={renderProps => (
                <button
                  onClick={renderProps.onClick}
                  id={isLoading ? 'loading' : ''}
                  type="button"
                  className={btnStyle}>
                  <FcGoogle className="mr-4" />
                  Sign in with Google
                </button>
              )}
              onSuccess={responseGoogle}
              onFailure={responseGoogleError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
