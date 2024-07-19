import type { APIRoute, InferGetStaticPropsType } from 'astro'

import OG from '../../../../components/OpenGraph/OG'
import { PNG } from '../../../../components/OpenGraph/createImage'
import fs from 'fs/promises'
import { getCollection } from 'astro:content'
import matter from 'gray-matter'

export async function getStaticPaths() {
  const blog = await getCollection('posts')
  const blogData = await getBlogFrontmatterCollection()
  return blog.map((post) => {
    const postData = blogData.find((data) => data.title === post.data.title)
    return {
      params: {
        lang: post.slug.split('/').shift(),
        post: post.slug.split('/').pop()
      },
      props: {
        title: post.data.title,
        heroImage: postData?.heroImage?.replace('../../../images/blog/', '')
      }
    }
  })
}

type Props = InferGetStaticPropsType<typeof getStaticPaths>

export const GET: APIRoute = async function get({ props, params }) {
  console.log(params)
  const { title, heroImage } = props as Props
  const png = await PNG(OG(title, heroImage))
  return new Response(png, {
    headers: {
      'Content-Type': 'image/png'
    }
  })
}

const getBlogFrontmatterCollection = async () => {
  const contentDirEn = 'src/content/posts/en'
  const contentDirEs = 'src/content/posts/es'
  const filesEn = await fs.readdir(contentDirEn)
  const filesEs = await fs.readdir(contentDirEs)
  const mdEn = filesEn.filter((file) => file.endsWith('.md'))
  const mdEs = filesEs.filter((file) => file.endsWith('.md'))

  const frontmatterEs = mdEs.map(async (file) => {
    const contentEs = await fs.readFile(`${contentDirEs}/${file}`, 'utf-8')
    const { data: dataEs } = matter(contentEs)
    return dataEs
  })
  const frontmatterEn = mdEn.map(async (file) => {
    const contentEn = await fs.readFile(`${contentDirEn}/${file}`, 'utf-8')
    const { data: dataEn } = matter(contentEn)
    return dataEn
  })

  return Promise.all([...frontmatterEn, ...frontmatterEs])
}
