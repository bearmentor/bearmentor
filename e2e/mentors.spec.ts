import { expect, test } from "@playwright/test"

import { DataUser, dataUsers } from "~/data"

import { MentorsPage } from "./pages/mentors.page"

test.describe("Bearmentor Mentors page E2E Test", () => {
  let mentorsPage: MentorsPage

  test.beforeEach(async ({ page }) => {
    mentorsPage = new MentorsPage(page)
    await mentorsPage.open()
    await expect(page).toHaveURL("/mentors")
    await expect(page).toHaveTitle(/Bearmentor/)
  })

  test("user should be able to see mentors list", async () => {
    // Filtering users with "MENTOR" tag and extracting their names
    const mentorNames: string[] = dataUsers
      .filter((user: DataUser) => user.tags?.includes("MENTOR"))
      .map((user: DataUser) => user.name)
    await expect(mentorsPage.mentorListName).toHaveText(mentorNames)
  })

  test("user should be able to search a mentor", async () => {
    await mentorsPage.searchMentor("haidar")
    await expect(mentorsPage.mentorListName).toHaveText("M Haidar Hanif")
  })
})
