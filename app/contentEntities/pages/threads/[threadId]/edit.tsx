import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getThread from "app/contentEntities/threads/queries/getThread"
import updateThread from "app/contentEntities/threads/mutations/updateThread"
import { ThreadForm, FORM_ERROR } from "app/contentEntities/threads/components/ThreadForm"

export const EditThread = () => {
  const router = useRouter()
  const threadId = useParam("threadId", "number")
  const [thread, { setQueryData }] = useQuery(
    getThread,
    { id: threadId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateThreadMutation] = useMutation(updateThread)

  return (
    <>
      <Head>
        <title>Edit Thread {thread.id}</title>
      </Head>

      <div>
        <h1>Edit Thread {thread.id}</h1>
        <pre>{JSON.stringify(thread, null, 2)}</pre>

        <ThreadForm
          submitText="Update Thread"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateThread}
          initialValues={thread}
          onSubmit={async (values) => {
            try {
              const updated = await updateThreadMutation({
                id: thread.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowThreadPage({ threadId: updated.id }))
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

const EditThreadPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditThread />
      </Suspense>

      <p>
        <Link href={Routes.ThreadsPage()}>
          <a>Threads</a>
        </Link>
      </p>
    </div>
  )
}

EditThreadPage.authenticate = true
EditThreadPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditThreadPage
