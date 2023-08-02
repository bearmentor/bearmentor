import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, type V2_MetaFunction } from "@remix-run/react"
import { parse } from "@conform-to/zod"
import { badRequest } from "remix-utils"

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { authenticator } from "~/services"
import { formatTitle, getRedirectTo } from "~/utils"
import { useRedirectTo } from "~/hooks"
import { Layout, UserAuthLoginForm } from "~/components"
import { model } from "~/models"
import { schemaUserLogin } from "~/schemas"

export const meta: V2_MetaFunction = () => {
  return [
    { title: formatTitle("Login") },
    {
      name: "description",
      content: "Login to your 🐻 Bearmentor user account.",
    },
  ]
}

export const loader = ({ request }: LoaderArgs) => {
  return authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  })
}

/**
 * Form is inside UserAuthForm for complete form UI and UX
 */
export default function Route() {
  const { searchParams } = useRedirectTo()

  return (
    <Layout hasFooter={false}>
      <div className="relative grid h-screen flex-col items-center justify-center px-4 lg:max-w-none lg:grid-cols-2 lg:px-0">
        <section className="mx-auto flex w-full max-w-md flex-col space-y-8 lg:p-8">
          <section className="flex flex-col space-y-4">
            <h2>Login</h2>
            <p className="inline-flex flex-wrap gap-1 text-muted-foreground">
              New to Bearmentor?{" "}
              <Link
                to={{ pathname: "/register", search: searchParams.toString() }}
                className="hover-opacity font-bold text-brand"
              >
                Create an account
              </Link>
            </p>
          </section>

          <UserAuthLoginForm />
        </section>

        <section className="relative hidden h-full flex-col bg-stone-900 p-10 text-white lg:flex lg:items-end">
          <Link to="/" className="hidden lg:block">
            <h1 className="flex items-center gap-2 text-2xl">
              <img src="/images/bear-rounded.png" alt="Bear" className="h-10" />
              <span className="text-brand">Bearmentor</span>
            </h1>
          </Link>

          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2 text-right">
              <p className="text-lg font-semibold">
                &ldquo;The mentors from 🐻 Bearmentor are helpful
                professionals.&rdquo;
              </p>
              <footer>— Somebody</footer>
            </blockquote>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export const action = async ({ request }: ActionArgs) => {
  const clonedRequest = request.clone()
  const formData = await clonedRequest.formData()

  const submission = parse(formData, { schema: schemaUserLogin })
  if (!submission.value || submission.intent !== "submit") {
    return badRequest(submission)
  }

  const result = await model.user.mutation.login(submission.value)
  if (result.error) {
    return json({ ...submission, error: result.error })
  }

  return authenticator.authenticate("form", request, {
    successRedirect: getRedirectTo(request) || "/dashboard",
  })
}
