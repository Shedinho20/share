import React, { useRef, useEffect, useState } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { SideBar, Spinner, UserProfile } from '../../components';
import logo from '../../Assets/logo.png';
import { userQuery } from '../../utils/data';
import { client } from '../../client';
import { Pins } from '../Pins/Pins';
import { getUser } from '../../utils/getUser';

export interface userProps {
  image: string;
  userName: string;
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
}

export const HomePage = () => {
  const [toggledSidebar, setToggledSidebar] = useState(false);
  const [user, setUser] = useState<userProps | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const userInfo = getUser();

  useEffect(() => {
    const query = userQuery(userInfo?.googleId);
    client.fetch(query).then(data => {
      setUser(data[0]);
      if (!data[0]) {
        navigate('/login', { replace: true });
      }
    });
  }, []);

  useEffect(() => {
    scrollRef.current?.scroll(0, 0);
  }, []);

  if (!user) {
    return <Spinner />;
  }

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial">
        <SideBar user={user} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu fontSize={40} className="cursor-pointer" onClick={() => setToggledSidebar(true)} />
          <Link to="/">
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user.image} alt="profile-pic" className="w-12 h-12 rounded-lg" referrerPolicy="no-referrer" />
          </Link>
        </div>
        {toggledSidebar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle fontSize={30} className="cursor-pointer" onClick={() => setToggledSidebar(false)} />
            </div>
            <SideBar closeToggle={setToggledSidebar} user={user && user} />
          </div>
        )}
      </div>

      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user} />} />
        </Routes>
      </div>
    </div>
  );
};
