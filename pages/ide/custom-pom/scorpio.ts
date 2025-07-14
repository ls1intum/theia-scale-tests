import { TheiaApp } from '../theia-pom/theia-app';
import { TheiaView } from '../theia-pom/theia-view';

const TheiaScorpioViewData = {
    tabSelector: '#shell-tab-plugin-view-container:workbench.view.extension.artemis-sidebar-view',
    viewSelector: '#plugin-view-container:workbench.view.extension.artemis-sidebar-view',
    viewName: 'Artemis'
};

export class ScorpioView extends TheiaView {

    constructor(app: TheiaApp) {
        super(TheiaScorpioViewData, app);
    }

    override async activate(): Promise<void> {
        await super.activate();
        const viewElement = await this.viewElement();
        await viewElement?.waitForSelector('.webview');
    }

    



}
