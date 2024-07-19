import { defineCollection, z } from 'astro:content'

const postCollection = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.date(),
      draft: z.boolean(),
      tags: z.array(z.string()),
      language: z.string(),
      heroImage: image().refine((img) => img.width >= 1080, {
        message: 'Cover image must be at least 1080 pixels wide!'
      }),
      keywords: z.array(z.string())
    })
})

const projectCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    href: z.string(),
    language: z.string()
  })
})

export const collections = {
  posts: postCollection,
  projects: projectCollection
}
