import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner, MasonryLayout } from '..';
import { client } from '../../client';
import { feedQuery, searchQuery } from '../../utils/data';

export interface pin {
  destination: string;
  image: { asset: Record<string, string> };
  postedBy: { _id: string; image: string; userName: string };
  save: any[];
  _id: string;
}
export const Feed = () => {
  const [loading, setLoading] = useState(true);
  const { categoryId } = useParams();
  const [pins, setPins] = useState<pin[]>([]);

  useEffect(() => {
    if (categoryId) {
      setLoading(true);
      const query = searchQuery(categoryId);
      client.fetch(query).then(data => {
        setPins(data);
        setLoading(false);
      });
    } else {
      setLoading(true);
      client.fetch(feedQuery).then(data => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [categoryId]);

  const message = categoryId || 'new';
  if (loading) {
    return <Spinner message={`Hang on! We are adding ${message} ideas to your feed`} />;
  }

  if (pins.length > 0) {
    return <MasonryLayout pins={pins} />;
  }

  return <div>No pin available.</div>;
};
