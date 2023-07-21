import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://3mpower.xyz',
      lastModified: new Date(),
    },
    {
      url: 'https://3mpower.xyz/community',
      lastModified: new Date(),
    },
  ];
}
