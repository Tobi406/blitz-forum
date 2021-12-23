import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes, useQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import getThreads from "app/contentEntities/threads/queries/getThreads"
import getPosts from "app/contentEntities/posts/queries/getPosts"
import getUser from "app/permissions/queries/users/getUser"

const ITEMS_PER_PAGE = 100

export const ThreadsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ threads, hasMore }] = usePaginatedQuery(getThreads, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {threads.map((thread) => (
          <li key={thread.id}>
            <Link href={Routes.ShowThreadPage({ threadId: thread.id })}>
              <a>{thread.title}</a>
            </Link>
            {JSON.stringify(thread)}
            {/* Not quite working I think... we should split this up into multiple components */}
            <ul>
              {( () => {
                const [{ posts }] = useQuery(getPosts, {
                  where: {
                    threadId: thread.id,
                  },
                });
                return posts.map(post => <li key={post.id}><code>{JSON.stringify(post)}</code>
                  {( () => {
                    const [user] = useQuery(getUser, {
                      id: post.userId,
                    });
                    return `${user.name} commented ${post.content}`;
                  } )()}
                </li>)
              })()}
            </ul>
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

const ThreadsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Threads</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewThreadPage()}>
            <a>Create Thread</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <ThreadsList />
        </Suspense>
      </div>
    </>
  )
}

ThreadsPage.authenticate = true
ThreadsPage.getLayout = (page) => <Layout>{page}</Layout>

export default ThreadsPage
