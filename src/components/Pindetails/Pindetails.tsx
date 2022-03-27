import React, { useEffect, useState } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { useParams, Link } from 'react-router-dom';
import { client, urlFor } from '../../client';
import { userProps } from '../../container/Home/Home.page';
import { pinDetailQuery, pinDetailMorePinQuery } from '../../utils/data';
import { MasonryLayout } from '../MasonryLayout/MasonryLayout';
import { Spinner } from '../Spinner/Spinner';
import { v4 as uuid } from 'uuid';
import { pin } from '../Feed/Feed';

type PindetailsProps = {
  user: userProps;
};

type postedBy = {
  _id: string;
  image: string;
  userName: string;
};

type comment = {
  _key: string;
  comment: string;
  postedBy: postedBy;
};
export interface pinDatail {
  about: string;
  category: string;
  comments: comment[];
  destination: string;
  image: { asset: { url: string } };
  postedBy: postedBy;
  save: postedBy[];
  title: string;
  _id: string;
}

export const Pindetails = ({ user }: PindetailsProps) => {
  const { pinId } = useParams();
  const [pins, setPins] = useState<pin[]>([]);
  const [pinDetail, setPinDetail] = useState<pinDatail>();
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId as string);

    if (query) {
      client.fetch(`${query}`).then(data => {
        setPinDetail(data[0]);
        console.log(data[0]);
        if (data[0]) {
          const query1 = pinDetailMorePinQuery(data[0]);
          client.fetch(query1).then(res => {
            setPins(res);
          });
        }
      });
    }
  };

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId as string)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [{ comment, _key: uuid(), postedBy: { _type: 'postedBy', _ref: user._id } }])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment('');
          setAddingComment(false);
        });
    }
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  if (!pinDetail) {
    return <Spinner message="Showing pin" />;
  }

  return (
    <>
      {pinDetail && (
        <div className="flex xl:flex-row flex-col m-auto bg-white" style={{ maxWidth: '1500px', borderRadius: '32px' }}>
          <div className="flex justify-center items-center md:items-start flex-initial">
            <img
              className="rounded-t-3xl rounded-b-lg"
              src={pinDetail.image && urlFor(pinDetail.image).url()}
              alt="user-post"
            />
          </div>
          <div className="w-full p-5 flex-1 xl:min-w-620">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <a
                  href={`${pinDetail.image.asset.url}?dl=`}
                  download
                  className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100">
                  <MdDownloadForOffline />
                </a>
              </div>
              <a href={pinDetail.destination} target="_blank" rel="noreferrer">
                {pinDetail.destination?.slice(8)}
              </a>
            </div>
            <div>
              <h1 className="text-4xl font-bold break-words mt-3">{pinDetail.title}</h1>
              <p className="mt-3">{pinDetail.about}</p>
            </div>
            <Link
              to={`/user-profile/${pinDetail.postedBy._id}`}
              className="flex gap-2 mt-5 items-center bg-white rounded-lg ">
              <img src={pinDetail.postedBy.image} className="w-10 h-10 rounded-full" alt="user-profile" />
              <p className="font-bold">{pinDetail.postedBy.userName}</p>
            </Link>
            <h2 className="mt-5 text-2xl">Comments</h2>
            <div className="max-h-370 overflow-y-auto">
              {pinDetail.comments?.map((item: comment) => (
                <div className="flex gap-2 mt-5 items-center bg-white rounded-lg" key={item._key}>
                  <img src={item.postedBy.image} className="w-10 h-10 rounded-full cursor-pointer" alt="user-profile" />
                  <div className="flex flex-col">
                    <p className="font-bold">{item.postedBy.userName}</p>
                    <p>{item.comment}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap mt-6 gap-3">
              <Link to={`/user-profile/${user._id}`}>
                <img src={user.image} className="w-10 h-10 rounded-full cursor-pointer" alt="user-profile" />
              </Link>
              <input
                className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
              <button
                type="button"
                className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                onClick={addComment}>
                {addingComment ? 'Doing...' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
      {pins?.length > 0 && <h2 className="text-center font-bold text-2xl mt-8 mb-4">More like this</h2>}
      {pins ? <MasonryLayout pins={pins} /> : <Spinner message="Loading more pins" />}
    </>
  );
};
