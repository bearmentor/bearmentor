import { redirect } from "@remix-run/node"
import type { LoaderArgs } from "@remix-run/node"

import { requireUserSession } from "~/helpers"

export async function loader({ request }: LoaderArgs) {
  const { userData } = await requireUserSession(request)
  return redirect(`/${userData.username}`)
}
