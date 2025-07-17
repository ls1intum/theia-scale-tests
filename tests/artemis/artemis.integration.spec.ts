import { Page } from '@playwright/test';
import { test, expect } from '../../fixtures/theia.fixture';
import { ExercisePage } from '../../pages/artemis/ExercisePage';
import { IDEPage } from '../../pages/ide/IDEPage';
import { TheiaApp } from '../../pages/ide/theia-pom/theia-app';
import { TheiaWorkspace } from '../../pages/ide/theia-pom/theia-workspace';
import { ScorpioView } from '../../pages/ide/custom-pom/scorpio';

test.describe('Theia Artemis Integration', () => {
    test.describe.configure({ mode: 'serial' });
    
    let course: any;
    let exercise: any;
    let theiaPage: IDEPage;
    
    test.beforeAll(async ({ artemis }) => {
        await artemis.login(process.env.ARTEMIS_USER!, process.env.ARTEMIS_PWD!);
        course = await artemis.createSimpleCourse();
        exercise = await artemis.createTheiaEnabledExercise(course);
    });

    test('Creation of course and exercise is possible', async ({ }) => {
    });

    test('Theia IDE loads from Artemis', async ({ artemis, landingPage }) => {
        await artemis.login(process.env.ARTEMIS_USER!, process.env.ARTEMIS_PWD!);
        await artemis.page.goto(artemis.baseURL + `/courses/${course.id}/exercises/${exercise.id}`);
        const exercisePage = new ExercisePage(artemis.page, exercise.id);
        await exercisePage.startParticipation();

        const [redirect] = await Promise.all([artemis.page.context().waitForEvent('page'), exercisePage.openInOnlineIDE()]);
        landingPage.setPage(redirect);
        await landingPage.waitForReady();
        //await landingPage.login(process.env.ARTEMIS_USER!, process.env.ARTEMIS_PWD!);
        await landingPage.login(process.env.KEYCLOAK_USER!, process.env.KEYCLOAK_PWD!);
        await redirect.waitForURL(/.*#\/home\/project/); //signalizes that theia session is loading

        //Setup theiaPage for sequential tests
        const workspace = new TheiaWorkspace();
        workspace.setPath("/home/project");
        const theiaApp = new TheiaApp(redirect, workspace, false);
        theiaPage = new IDEPage(redirect, theiaApp, redirect.url());
        await theiaPage.waitForReady();
    });

    test('Student clones using Scorpio', async ({ }) => {
        const scorpioView = await theiaPage.theiaApp.openView(ScorpioView);
    });

    test('Student submits code using Scorpio', async ({ }) => {
    });

    test.skip('check result', async ({ artemis }) => {
        await artemis.page.goto(artemis.baseURL + `/courses/${course.id}/exercises/${exercise.id}`);
        const exercisePage = new ExercisePage(artemis.page, exercise.id);
        await exercisePage.checkResultScore('100%');
    });

    test.afterAll(async ({ artemis }) => {
        await artemis.login(process.env.ARTEMIS_USER!, process.env.ARTEMIS_PWD!);
        await artemis.deleteCourse(course.id);
    });

});
