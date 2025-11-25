import { Page } from "@playwright/test";
import { LandingPage } from "../../../../pages/landing/LandingPage";
import { virtualStudent } from "../VirtualStudents";
import dotenv from "dotenv";
import path from "path";

/* eslint-disable  @typescript-eslint/no-explicit-any */

dotenv.config({
  path: path.resolve(__dirname, "../../../../../playwright.env"),
});

const numUsers = parseInt(process.env.NUM_INSTANCES!, 10);

export const config = {
  target: process.env.LANDINGPAGE_URL!,
  engines: {
    playwright: {
      launchOptions: {
        slowMo: 500,
        headless: false,
      },
      contextOptions: {
        permissions: ["clipboard-write", "clipboard-read"],
      },
      defaultNavigationTimeout: 300000,
    },
  },
  phases: [{ duration: 1, arrivalRate: numUsers }],
};

export const scenarios = [
  {
    engine: "playwright",
    testFunction: runVirtualStudent,
  },
];

async function runVirtualStudent(
  page: Page,
  vuContext: any,
  events: any,
  test: any,
) {
  const { step } = test;
  console.log("Starting virtual student");

  await step("Artillery: Waiting for theia to be loaded", async () => {
    await page.goto(process.env.LANDINGPAGE_URL!);
    const landingPage = new LandingPage(page);
    await landingPage.login(
      process.env.KEYCLOAK_USER!,
      process.env.KEYCLOAK_PWD!,
    );
    await landingPage.launchLanguage("java-17");
    await page.waitForURL(/.*#\/home\/project/);
  });

  await virtualStudent(page, test);
}
