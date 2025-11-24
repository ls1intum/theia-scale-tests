import { test as base } from "@playwright/test";
import { TheiaApp } from "../pages/ide/theia-pom/theia-app";
import { TheiaWorkspace } from "../pages/ide/theia-pom/theia-workspace";
import { IDEPage } from "../pages/ide/IDEPage";
import { ArtemisPage } from "../pages/artemis/ArtemisPage";
import { LandingPage } from "../pages/landing/LandingPage";
import fs from "fs";
import path from "path";

interface TheiaFixtures {
  landingPage: LandingPage;
  cApp: IDEPage;
  javaApp: IDEPage;
  pythonApp: IDEPage;
  ocamlApp: IDEPage;
  rustApp: IDEPage;
  jsApp: IDEPage;
  artemis: ArtemisPage;
  artemisTheia: IDEPage;
}

export const test = base.extend<TheiaFixtures>({
  landingPage: async ({ browser }, use) => {
    const page = await browser.newPage();
    await page.goto("/");
    const landingPage = new LandingPage(page);

    await use(landingPage);

    await page.close();
  },
  cApp: async ({ browser }, use) => {
    const urlPath = path.join(
      process.cwd(),
      "test-data/functional",
      "ide-url-c.txt",
    );
    const ideURL = fs.readFileSync(urlPath, "utf8");
    const page = await browser.newPage();
    const workspace = new TheiaWorkspace();
    workspace.setPath("/home/project");
    const theiaApp = new TheiaApp(page, workspace, false);
    const idePage = new IDEPage(page, theiaApp, ideURL);
    await page.goto(ideURL);
    await theiaApp.waitForShellAndInitialized();

    await use(idePage);
    await page.close();
  },
  javaApp: async ({ browser }, use) => {
    const urlPath = path.join(
      process.cwd(),
      "test-data/functional",
      "ide-url-java-17.txt",
    );
    const ideURL = fs.readFileSync(urlPath, "utf8");
    const page = await browser.newPage();
    const workspace = new TheiaWorkspace();
    workspace.setPath("/home/project");
    const theiaApp = new TheiaApp(page, workspace, false);
    const javaApp = new IDEPage(page, theiaApp, ideURL);
    await page.goto(ideURL);
    await theiaApp.waitForShellAndInitialized();

    await use(javaApp);
    await page.close();
  },
  pythonApp: async ({ browser }, use) => {
    const urlPath = path.join(
      process.cwd(),
      "test-data/functional",
      "ide-url-python.txt",
    );
    const ideURL = fs.readFileSync(urlPath, "utf8");
    const page = await browser.newPage();
    const workspace = new TheiaWorkspace();
    workspace.setPath("/home/project");
    const theiaApp = new TheiaApp(page, workspace, false);
    const pythonApp = new IDEPage(page, theiaApp, ideURL);
    await page.goto(ideURL);
    await theiaApp.waitForShellAndInitialized();

    await use(pythonApp);
    await page.close();
  },
  ocamlApp: async ({ browser }, use) => {
    const urlPath = path.join(
      process.cwd(),
      "test-data/functional",
      "ide-url-ocaml.txt",
    );
    const ideURL = fs.readFileSync(urlPath, "utf8");
    const page = await browser.newPage();
    const workspace = new TheiaWorkspace();
    workspace.setPath("/home/project");
    const theiaApp = new TheiaApp(page, workspace, false);
    const ocamlApp = new IDEPage(page, theiaApp, ideURL);
    await page.goto(ideURL);
    await theiaApp.waitForShellAndInitialized();

    await use(ocamlApp);
    await page.close();
  },
  rustApp: async ({ browser }, use) => {
    const urlPath = path.join(
      process.cwd(),
      "test-data/functional",
      "ide-url-rust.txt",
    );
    const ideURL = fs.readFileSync(urlPath, "utf8");
    const page = await browser.newPage();
    const workspace = new TheiaWorkspace();
    workspace.setPath("/home/project");
    const theiaApp = new TheiaApp(page, workspace, false);
    const rustApp = new IDEPage(page, theiaApp, ideURL);
    await page.goto(ideURL);
    await theiaApp.waitForShellAndInitialized();

    await use(rustApp);
    await page.close();
  },
  jsApp: async ({ browser }, use) => {
    const urlPath = path.join(
      process.cwd(),
      "test-data/functional",
      "ide-url-javascript.txt",
    );
    const ideURL = fs.readFileSync(urlPath, "utf8");
    const page = await browser.newPage();
    const workspace = new TheiaWorkspace();
    workspace.setPath("/home/project");
    const theiaApp = new TheiaApp(page, workspace, false);
    const jsApp = new IDEPage(page, theiaApp, ideURL);
    await page.goto(ideURL);
    await theiaApp.waitForShellAndInitialized();

    await use(jsApp);
    await page.close();
  },
  artemis: async ({ browser }, use) => {
    const artemisURL = process.env.ARTEMIS_URL!;
    const page = await browser.newPage();
    const artemisApp = new ArtemisPage(page, artemisURL);
    await page.goto(artemisURL);

    await use(artemisApp);
    await page.close();
  },
  artemisTheia: async ({ browser }, use) => {
    const page = await browser.newPage();
    const workspace = new TheiaWorkspace();
    workspace.setPath("/home/project");
    const theiaApp = new TheiaApp(page, workspace, false);
    const artemisTheia = new IDEPage(
      page,
      theiaApp,
      process.env.LANDINGPAGE_URL!,
    );

    await use(artemisTheia);
    await page.close();
  },
});

export { expect } from "@playwright/test";
