import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getThread from "app/contentEntities/threads/queries/getThread"
import deleteThread from "app/contentEntities/threads/mutations/deleteThread"

export const Thread = () => {
  const router = useRouter()
  const threadId = useParam("threadId", "number")
  const [deleteThreadMutation] = useMutation(deleteThread)
  const [thread] = useQuery(getThread, { id: threadId })

  return (
    <>
      <Head>
        <title>Thread {thread.id}</title>
      </Head>

      <div>
        <h1>Thread {thread.id}</h1>
        <pre>{JSON.stringify(thread, null, 2)}</pre>

        <Link href={Routes.EditThreadPage({ threadId: thread.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteThreadMutation({ id: thread.id })
              router.push(Routes.ThreadsPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowThreadPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.ThreadsPage()}>
          <a>Threads</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Thread />
      </Suspense>
    </div>
  )
}

ShowThreadPage.authenticate = true
ShowThreadPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowThreadPage
