import { prisma } from "@/lib/prisma"
import SettingsClient from "./settings-client"

export default async function SettingsPage() {
  let user = await prisma.user.findFirst({
    include: {
      settings: true,
    },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "أحمد محمود",
        email: "user@masroofi.local",
        password: "default",
      },
      include: {
        settings: true,
      },
    })
  }

  return <SettingsClient user={user} />
}
