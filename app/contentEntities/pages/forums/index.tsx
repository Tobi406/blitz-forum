import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getForums from "app/contentEntities/forums/queries/getForums"

const ITEMS_PER_PAGE = 100

export const ForumsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ forums, hasMore }] = usePaginatedQuery(getForums, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {forums.map((forum) => (
          <li key={forum.id}>
            <Link href={Routes.ShowForumPage({ forumId: forum.id })}>
              <a>{forum.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const ForumsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Forums</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewForumPage()}>
            <a>Create Forum</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <ForumsList />
        </Suspense>
      </div>
    </>
  )
}

ForumsPage.authenticate = true
ForumsPage.getLayout = (page) => <Layout>{page}</Layout>

export default ForumsPage
