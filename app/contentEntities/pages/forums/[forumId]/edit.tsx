import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getForum from "app/contentEntities/forums/queries/getForum"
import updateForum from "app/contentEntities/forums/mutations/updateForum"
import { ForumForm, FORM_ERROR } from "app/contentEntities/forums/components/ForumForm"

export const EditForum = () => {
  const router = useRouter()
  const forumId = useParam("forumId", "number")
  const [forum, { setQueryData }] = useQuery(
    getForum,
    { id: forumId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateForumMutation] = useMutation(updateForum)

  return (
    <>
      <Head>
        <title>Edit Forum {forum.id}</title>
      </Head>

      <div>
        <h1>Edit Forum {forum.id}</h1>
        <pre>{JSON.stringify(forum, null, 2)}</pre>

        <ForumForm
          submitText="Update Forum"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateForum}
          initialValues={forum}
          onSubmit={async (values) => {
            try {
              const updated = await updateForumMutation({
                id: forum.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowForumPage({ forumId: updated.id }))
            } catch (error) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditForumPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditForum />
      </Suspense>

      <p>
        <Link href={Routes.ForumsPage()}>
          <a>Forums</a>
        </Link>
      </p>
    </div>
  )
}

EditForumPage.authenticate = true
EditForumPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditForumPage
