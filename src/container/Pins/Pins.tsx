import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CreatePin, Feed, NavBar, Pindetails, Search } from '../../components';
import { userProps } from '../Home/Home.page';

interface pinsProps {
  user: userProps;
}
export const Pins = ({ user }: pinsProps) => {
  const [searched, setSearched] = useState('');

  return (
    <div className="px-2 md:px-5">
      <div className="bg-gray-50">
        <NavBar searched={searched} setSearched={setSearched} user={user} />
      </div>
      <div className="h-full">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/category/:categoryId" element={<Feed />} />
          <Route path="/pin-detail/:pinId" element={<Pindetails user={user} />} />
          <Route path="/create-pin" element={<CreatePin user={user} />} />
          <Route path="/search" element={<Search searched={searched} />} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </div>
    </div>
  );
};
