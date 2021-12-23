import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getForum from "app/contentEntities/forums/queries/getForum"
import deleteForum from "app/contentEntities/forums/mutations/deleteForum"

export const Forum = () => {
  const router = useRouter()
  const forumId = useParam("forumId", "number")
  const [deleteForumMutation] = useMutation(deleteForum)
  const [forum] = useQuery(getForum, { id: forumId })

  return (
    <>
      <Head>
        <title>Forum {forum.id}</title>
      </Head>

      <div>
        <h1>Forum {forum.id}</h1>
        <pre>{JSON.stringify(forum, null, 2)}</pre>

        <Link href={Routes.EditForumPage({ forumId: forum.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteForumMutation({ id: forum.id })
              router.push(Routes.ForumsPage())
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

const ShowForumPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.ForumsPage()}>
          <a>Forums</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Forum />
      </Suspense>
    </div>
  )
}

ShowForumPage.authenticate = true
ShowForumPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowForumPage
