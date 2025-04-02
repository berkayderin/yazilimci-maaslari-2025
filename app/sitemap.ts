import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://yazilimci-maaslari-2025.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    }
  ]
} 