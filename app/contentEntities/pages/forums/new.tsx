import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createForum from "app/contentEntities/forums/mutations/createForum"
import { ForumForm, FORM_ERROR } from "app/contentEntities/forums/components/ForumForm"

const NewForumPage: BlitzPage = () => {
  const router = useRouter()
  const [createForumMutation] = useMutation(createForum)

  return (
    <div>
      <h1>Create New Forum</h1>

      <ForumForm
        submitText="Create Forum"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateForum}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const forum = await createForumMutation(values)
            router.push(Routes.ShowForumPage({ forumId: forum.id }))
          } catch (error) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.ForumsPage()}>
          <a>Forums</a>
        </Link>
      </p>
    </div>
  )
}

NewForumPage.authenticate = true
NewForumPage.getLayout = (page) => <Layout title={"Create New Forum"}>{page}</Layout>

export default NewForumPage
