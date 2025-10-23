import { test, expect } from "../../fixtures/theia.fixture";
import { ExercisePage } from "../../pages/artemis/ExercisePage";
import { IDEPage } from "../../pages/ide/IDEPage";
import { TheiaApp } from "../../pages/ide/theia-pom/theia-app";
import { TheiaWorkspace } from "../../pages/ide/theia-pom/theia-workspace";
import { ScorpioView } from "../../pages/ide/custom-pom/scorpio";
import { TheiaExplorerView } from "../../pages/ide/theia-pom/theia-explorer-view";
import { TheiaTextEditor } from "../../pages/ide/theia-pom/theia-text-editor";
import { deleteAll, pasteFromString } from "../../fixtures/utils/commands";
import { readFileSync } from "fs";
import path from "path";
import { TheiaVSCView } from "../../pages/ide/custom-pom/theia-vsc";
import {
  PreferenceIds,
  TheiaPreferenceView,
} from "../../pages/ide/theia-pom/theia-preference-view";

/* eslint-disable  @typescript-eslint/no-explicit-any */

//Change skip to describe to run the test
test.skip("Theia Artemis Integration - Scorpio", () => {
  test.describe.configure({ mode: "serial" });

  test.use({
    permissions: ["clipboard-write", "clipboard-read"],
  });

  let course: any;
  let exercise: any;
  let theiaURL: string;
  let courseRepositoryName: string;

  const bubbleSortTemplatePath = path.resolve(
    __dirname,
    "../../fixtures/utils/templates/exercise_solutions/BubbleSort.txt",
  );
  const bubbleSortTemplate = readFileSync(bubbleSortTemplatePath, "utf8");
  const mergeSortTemplatePath = path.resolve(
    __dirname,
    "../../fixtures/utils/templates/exercise_solutions/MergeSort.txt",
  );
  const mergeSortTemplate = readFileSync(mergeSortTemplatePath, "utf8");
  /*
  const sortStrategyTemplatePath = path.resolve(
    __dirname,
    "../../fixtures/utils/templates/exercise_solutions/SortStrategy.txt",
  );
  const sortStrategyTemplate = readFileSync(sortStrategyTemplatePath, "utf8");
  */

  test.beforeAll(async ({ artemis }) => {
    await artemis.login(process.env.ARTEMIS_USER!, process.env.ARTEMIS_PWD!);
    course = await artemis.createSimpleCourse();
    exercise = await artemis.createTheiaEnabledExercise(course);
    courseRepositoryName =
      course.shortName + exercise.shortName + "-" + process.env.ARTEMIS_USER!;
  });

  test.beforeAll("Theia IDE loads from Artemis", async ({ artemis }) => {
    test.slow();
    await artemis.login(process.env.ARTEMIS_USER!, process.env.ARTEMIS_PWD!);
    await artemis.page.goto(
      artemis.baseURL + `/courses/${course.id}/exercises/${exercise.id}`,
    );
    const exercisePage = new ExercisePage(artemis.page, exercise.id);
    await exercisePage.startParticipation();

    const [redirect] = await Promise.all([
      artemis.page.context().waitForEvent("page"),
      exercisePage.openInOnlineIDE(),
    ]);
    await redirect.waitForURL(/.*#\/home\/project/); //signalizes that theia session is loading

    //Setup theiaPage for sequential tests
    const workspace = new TheiaWorkspace();
    workspace.setPath("/home/project");
    const theiaApp = new TheiaApp(redirect, workspace, false);
    const theiaPage = new IDEPage(redirect, theiaApp, redirect.url());
    theiaURL = redirect.url();
    await theiaPage.waitForReady();
  });

  test.beforeEach(async ({ artemisTheia }) => {
    console.log("theiaURL", theiaURL);
    artemisTheia.page.goto(theiaURL);
    await artemisTheia.waitForReady();
    await artemisTheia.directAuthenticateScorpio();
  });

  test("Creation of course and exercise is possible", async () => {
    expect(course).toBeDefined();
    expect(exercise).toBeDefined();
  });

  test("Scorpio is installed", async ({ artemisTheia }) => {
    await artemisTheia.directAuthenticateScorpio();
    const scorpio = await artemisTheia.theiaApp.openView(ScorpioView);
    await scorpio.activate();
  });

  test("Scorpio shows Exercise Instructions", async ({ artemisTheia }) => {
    await artemisTheia.directAuthenticateScorpio();
    const scorpio = await artemisTheia.theiaApp.openView(ScorpioView);
    await scorpio.activate();
    //await page.locator('main').locator('submit-button').click();
    const frame = artemisTheia.page.frameLocator("iframe");
    await artemisTheia.page.evaluate(() => {
      const iframe = document.querySelector("iframe");
      if (iframe) iframe.removeAttribute("sandbox");
      iframe!.src = iframe!.src;
    });

    //await artemisTheia.page.pause();
    await artemisTheia.page.locator("submit-button").click();
    await frame.locator("main").waitFor({ state: "visible" });
    await artemisTheia.page
      .getByText("Sorting with the Strategy Pattern")
      .waitFor({ state: "visible" });
  });

  test("Cloning via Scoripio", async ({ artemisTheia }) => {
    await artemisTheia.directAuthenticateScorpio();
    const explorer = await artemisTheia.theiaApp.openView(TheiaExplorerView);
    const directoryNode =
      await explorer.existsDirectoryNode(courseRepositoryName);
    expect(directoryNode).toBe(true);
  });

  test("Student submits code", async ({ artemisTheia }) => {
    const preferences =
      await artemisTheia.theiaApp.openView(TheiaPreferenceView);
    const preferenceId = PreferenceIds.Explorer.CompactFolder;
    await preferences.setBooleanPreferenceById(preferenceId, false);
    await preferences.waitForModified(preferenceId);
    const autoSaveDelay = PreferenceIds.Files.AutoSaveDelay;
    await preferences.setStringPreferenceById(autoSaveDelay, "0");
    await preferences.waitForModified(autoSaveDelay);
    await writeIntoFile(
      "BubbleSort.java",
      bubbleSortTemplate,
      courseRepositoryName,
      artemisTheia,
    );
    await writeIntoFile(
      "MergeSort.java",
      mergeSortTemplate,
      courseRepositoryName,
      artemisTheia,
    );
    //await artemisTheia.createNewFile(`${courseRepositoryName}/src/de/test/SortStrategy.java`);
    //await writeIntoFile("SortStrategy.java", sortStrategyTemplate, courseRepositoryName, artemisTheia);
    const VSC = await artemisTheia.theiaApp.openView(TheiaVSCView);
    await VSC.commitAllandPush("Initial commit from Theia");
  });

  test("Check Result on Scorpio", async ({ artemis }) => {
    await artemis.login(process.env.ARTEMIS_USER!, process.env.ARTEMIS_PWD!);
    await artemis.page.goto(
      artemis.baseURL + `/courses/${course.id}/exercises/${exercise.id}`,
    );
    const exercisePage = new ExercisePage(artemis.page, exercise.id);
    await exercisePage.checkResultScore("15.4%");
  });

  test.afterAll(async ({ artemis }) => {
    await artemis.login(process.env.ARTEMIS_USER!, process.env.ARTEMIS_PWD!);
    await artemis.deleteCourse(course.id);
  });
});

async function writeIntoFile(
  fileName: string,
  content: string,
  courseRepositoryName: string,
  artemisTheia: IDEPage,
) {
  const editor = await artemisTheia.theiaApp.openEditor(
    `${courseRepositoryName}/src/de/test/${fileName}`,
    TheiaTextEditor,
  );
  await editor.activate();
  await editor.focus();
  await deleteAll(editor.page);
  await editor.activate();
  await editor.focus();
  await pasteFromString(editor.page, content);
  await editor.save();
}
