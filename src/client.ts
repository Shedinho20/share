import sanityClient from '@sanity/client';
import ImageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const client = sanityClient({
  projectId: process.env.REACT_APP_SANITY_ID,
  dataset: 'production',
  apiVersion: '2021-11-16',
  useCdn: true,
  token: process.env.REACT_APP_SANITY_TOKEN
});

const builder = ImageUrlBuilder(client);

export const urlFor = (src: SanityImageSource) => builder.image(src);
