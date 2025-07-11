import { ElementHandle } from '@playwright/test';
import { TheiaApp } from '../theia-pom/theia-app';
import { TheiaDialog } from '../theia-pom/theia-dialog';
import { TheiaMenuItem } from '../theia-pom/theia-menu-item';
import { TheiaRenameDialog } from '../theia-pom/theia-rename-dialog';
import { TheiaTreeNode } from '../theia-pom/theia-tree-node';
import { TheiaView } from '../theia-pom/theia-view';
import { elementContainsClass, normalizeId, OSUtil, urlEncodePath } from '../theia-pom/util';

const TheiaSearchViewData = {
    tabSelector: '#shell-tab-search-view-container',
    viewSelector: '#search-view-container--search-in-workspace',
    viewName: 'Search'
};

export class TheiaSearchView extends TheiaView {

    constructor(app: TheiaApp) {
        super(TheiaSearchViewData, app);
    }

    override async activate(): Promise<void> {
        await super.activate();
        const viewElement = await this.viewElement();
        await viewElement?.waitForSelector('.theia-TreeContainer');
    }

    async search(searchTerm: string): Promise<void> {
        await this.page.locator('#theia-left-content-panel').locator('.search-field-container').locator('#search-input-field').fill(searchTerm);
        await this.page.keyboard.press('Enter');
    }

}
