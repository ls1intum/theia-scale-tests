import { test, expect } from '../../fixtures/theia.fixture';
import { ExercisePage } from '../../pages/artemis/ExercisePage';
import { TheiaExplorerView } from '../../pages/ide/theia-pom/theia-explorer-view';
import { TheiaTerminal } from '../../pages/ide/theia-pom/theia-terminal';
import { TheiaTextEditor } from '../../pages/ide/theia-pom/theia-text-editor';

const testPrefix = 'Artemis-';

test.describe('Theia Artemis Integration', { tag: '@sequential' }, () => {
    let course: any;
    let exercise: any;
    
    test.beforeAll(async ({ artemis }) => {
        await artemis.login(process.env.ARTEMIS_USER!, process.env.ARTEMIS_PWD!);
        course = await artemis.createSimpleCourse();
        console.log(course);
        exercise = await artemis.createTheiaEnabledExercise(course);
        console.log(exercise);
    });

    test('Creation of course and exercise is possible', async ({ }) => {
    });

    test('Theia IDE loads from Artemis', async ({ artemis, landingPage }) => {
        await artemis.login(process.env.ARTEMIS_USER!, process.env.ARTEMIS_PWD!);
        await artemis.page.goto(artemis.baseURL + '/courses/' + course.id + '/exercises/' + exercise.id);
        const exercisePage = new ExercisePage(artemis.page, exercise.id);
        await exercisePage.startParticipation();

        const [theiaPage] = await Promise.all([artemis.page.context().waitForEvent('page'), exercisePage.openInOnlineIDE()]);
        landingPage.setPage(theiaPage);
        await landingPage.waitForReady();
        //await landingPage.login(process.env.ARTEMIS_USER!, process.env.ARTEMIS_PWD!);
        await landingPage.login(process.env.KEYCLOAK_USER!, process.env.KEYCLOAK_PWD!);
        await theiaPage.waitForURL(/.*#\/home\/project/); //signalizes that theia session is loading
        // Theia should be loaded now
        // TODO
    });

    test.afterAll(async ({ artemis }) => {
        await artemis.login(process.env.ARTEMIS_USER!, process.env.ARTEMIS_PWD!);
        await artemis.deleteCourse(course.id);
    });

});
