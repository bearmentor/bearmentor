import { json, redirect } from "@remix-run/node"
import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData, useNavigation, useParams } from "@remix-run/react"
import { parse } from "@conform-to/zod"
import { badRequest, notFound } from "remix-utils"
import invariant from "tiny-invariant"

import { prisma } from "~/libs"
import { createCacheHeaders, delay } from "~/utils"
import { useRootLoaderData } from "~/hooks"
import { AvatarAuto, Badge, Button, Layout, NotFound, Time } from "~/components"
import { model } from "~/models"
import { schemaBroadcastDelete } from "~/schemas"

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.id, "Broadcast ID not found")

  const broadcast = await prisma.broadcast.findFirst({
    where: { id: params.id },
    include: {
      images: true,
      tags: true,
      user: { include: { avatars: { select: { url: true } } } },
    },
  })
  if (!broadcast) return notFound({ broadcast: null })

  return json({ broadcast }, { headers: createCacheHeaders(request, 3) })
}

export default function BroadcastsRoute() {
  const params = useParams()
  const { userSession } = useRootLoaderData()
  const { broadcast } = useLoaderData<typeof loader>()

  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  if (!broadcast) {
    return (
      <Layout className="px-4 sm:px-8">
        <NotFound>
          <h2>
            This broadcast{" "}
            <span className="text-red-500">"{params.username}"</span> is not
            found
          </h2>
          <p className="text-muted-foreground">
            The broadcast may be broken or have been removed.
          </p>
        </NotFound>
      </Layout>
    )
  }

  const isOwner = userSession?.id === broadcast.userId

  return (
    <Layout className="flex justify-center p-4 sm:p-8">
      <div className="mb-40 w-full max-w-xl space-y-6">
        <header className="gap-2 space-y-4">
          <section className="space-y-2">
            <h1 className="flex">
              <Link
                to={`/${broadcast.user.username}/broadcasts/${broadcast.id}`}
                className="hover-opacity"
              >
                {broadcast.title}
              </Link>
            </h1>
            <p>{broadcast.description}</p>
          </section>
        </header>

        <section className="space-y-2">
          <div>
            <Link
              to={`/${broadcast.user.username}`}
              className="hover-opacity flex items-center gap-2"
            >
              <AvatarAuto className="h-10 w-10" user={broadcast.user} />
              <div className="space-y-0">
                <h6>{broadcast.user.name}</h6>
                <p className="text-sm text-muted-foreground">
                  @{broadcast.user.username}
                </p>
              </div>
            </Link>
          </div>

          <Time>{broadcast.updatedAt}</Time>
        </section>

        {broadcast.body && (
          <div className="space-y-4">
            <p className="prose dark:prose-invert whitespace-pre-wrap">
              {broadcast.body}
            </p>
          </div>
        )}

        {broadcast.tags?.length > 0 && (
          <div className="space-y-4">
            <ul className="flex flex-wrap gap-1 sm:gap-2">
              {broadcast.tags.map(tag => {
                return (
                  <li key={tag.id}>
                    <Badge size="sm" variant="secondary">
                      {tag.name}
                    </Badge>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        <section>
          {!userSession?.id && (
            <Button asChild>
              <Link
                to={`/login?redirectTo=/${broadcast.user.username}/broadcasts/${broadcast.id}`}
              >
                Login to Contact
              </Link>
            </Button>
          )}

          {userSession?.id && !isOwner && (
            <Button>
              Contact {broadcast.user.nick || broadcast.user.name}
            </Button>
          )}
        </section>
      </div>
    </Layout>
  )
}

export const action = async ({ request }: ActionArgs) => {
  await delay()
  const formData = await request.formData()
  const submission = parse(formData, { schema: schemaBroadcastDelete })
  if (!submission.value || submission.intent !== "submit") {
    return badRequest(submission)
  }
  const isDeleted = await model.broadcast.mutation.deleteById(submission.value)
  if (!isDeleted) return null
  return redirect(`/broadcasts`)
}
