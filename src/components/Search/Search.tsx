import React, { useEffect, useState } from 'react';
import { client } from '../../client';
import { searchQuery, feedQuery } from '../../utils/data';
import { pin } from '../Feed/Feed';
import { MasonryLayout } from '../MasonryLayout/MasonryLayout';
import { Spinner } from '../Spinner/Spinner';

type SearchProps = {
  searched: string;
};

export const Search = ({ searched }: SearchProps) => {
  const [pins, setPins] = useState<pin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (searched !== '') {
      setLoading(true);
      const query = searchQuery(searched.toLowerCase());
      client.fetch(query).then(data => {
        setPins(data);
        setLoading(false);
      });
    } else {
      client.fetch(feedQuery).then(data => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [searched]);

  return (
    <div>
      {loading && <Spinner message="Searching pins" />}
      {pins.length !== 0 && <MasonryLayout pins={pins} />}
      {pins.length === 0 && searched !== '' && !loading && (
        <div className="mt-10 text-center text-xl ">No Pins Found!</div>
      )}
    </div>
  );
};
