import { test as setup, chromium } from "@playwright/test";
import { LandingPage } from "../../pages/landing/LandingPage";
import { TestInfo } from "@playwright/test";
import fs from "fs";
import path from "path";

/**
 * @remarks
 * This function is used to start the instance and get the IDE URL.
 * @tag slow (starting the instance takes a while)
 * @description This function automates the starting process for the LandingPage UI.
 */
setup("Get IDE URL for C", async (_, testInfo) => {
  setup.slow();
  await setupIDE("C", testInfo);
});

setup("Get IDE URL for Java", async (_, testInfo) => {
  setup.slow();
  await setupIDE("Java", testInfo);
});

setup("Get IDE URL for Python", async (_, testInfo) => {
  setup.slow();
  await setupIDE("Python", testInfo);
});

setup("Get IDE URL for Rust", async (_, testInfo) => {
  setup.slow();
  await setupIDE("Rust", testInfo);
});

setup("Get IDE URL for OCaml", async (_, testInfo) => {
  setup.slow();
  await setupIDE("Ocaml", testInfo);
});

setup("Get IDE URL for JavaScript", async (_, testInfo) => {
  setup.slow();
  await setupIDE("Javascript", testInfo);
});

async function setupIDE(language: string, testInfo: TestInfo) {
  const browser = await chromium.launch();
  let context;

  if (testInfo.project.name !== "local") {
    context = await browser.newContext({
      storageState: ".auth/keycloak_user.json",
    });
  } else {
    context = await browser.newContext();
  }

  const page = await context.newPage();

  if (testInfo.project.name !== "local") {
    const landingPage = new LandingPage(page);
    await page.goto("/");
    await landingPage.launchLanguage(language);
    await page.waitForURL(/.*#\/home\/project/);
  } else {
    await page.goto(`/`);
    await page.waitForURL(/.*#\/home\/project/);
  }

  await page.waitForLoadState("domcontentloaded");

  const ideURL = page.url();
  const testDataDir = path.join(process.cwd(), "test-data/functional");
  if (!fs.existsSync(testDataDir)) {
    fs.mkdirSync(testDataDir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(testDataDir, "ide-url-" + language.toLowerCase() + ".txt"),
    ideURL,
  );

  await context.close();
  await browser.close();
}
