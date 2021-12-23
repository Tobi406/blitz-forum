import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createThread from "app/contentEntities/threads/mutations/createThread"
import { ThreadForm, FORM_ERROR } from "app/contentEntities/threads/components/ThreadForm"

const NewThreadPage: BlitzPage = () => {
  const router = useRouter()
  const [createThreadMutation] = useMutation(createThread)

  return (
    <div>
      <h1>Create New Thread</h1>

      <ThreadForm
        submitText="Create Thread"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateThread}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const thread = await createThreadMutation(values)
            router.push(Routes.ShowThreadPage({ threadId: thread.id }))
          } catch (error) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.ThreadsPage()}>
          <a>Threads</a>
        </Link>
      </p>
    </div>
  )
}

NewThreadPage.authenticate = true
NewThreadPage.getLayout = (page) => <Layout title={"Create New Thread"}>{page}</Layout>

export default NewThreadPage
