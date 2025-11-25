import { TheiaApp } from "../../../pages/ide/theia-pom/theia-app";
import { sleep } from "../../../fixtures/utils/commands";
import { TheiaTerminal } from "../../../pages/ide/theia-pom/theia-terminal";
import { buildProject } from "./VirtualStudents";
import {
  commit,
  editBubbleSort,
  editClient,
  editContext,
  editMergeSort,
  editPolicy,
  editSortStrategy,
  openAboutPage,
  useTerminal,
} from "./Scenarios";

/**
 * This function is used to edit the BubbleSort.java file.
 * @param theiaApp The TheiaApp instance
 */
export async function determinsticRun(theiaApp: TheiaApp) {
  const terminal = await theiaApp.openTerminal(TheiaTerminal);
  await buildProject(terminal);
  await sleep(1000);
  await editBubbleSort(theiaApp);
  await sleep(1000);
  await buildProject(terminal);
  await sleep(1000);
  await editMergeSort(theiaApp);
  await sleep(1000);
  await buildProject(terminal);
  await sleep(1000);
  await commit(theiaApp);
  await sleep(1000);
  await editClient(theiaApp);
  await sleep(1000);
  await useTerminal(theiaApp);
  await sleep(1000);
  await editContext(theiaApp);
  await sleep(1000);
  await buildProject(terminal);
  await sleep(1000);
  await editPolicy(theiaApp);
  await sleep(1000);
  await buildProject(terminal);
  await sleep(1000);
  await editSortStrategy(theiaApp);
  await sleep(1000);
  await buildProject(terminal);
  await sleep(1000);
  await commit(theiaApp);
  await sleep(1000);
  await openAboutPage(theiaApp);
  await sleep(1000);
}
