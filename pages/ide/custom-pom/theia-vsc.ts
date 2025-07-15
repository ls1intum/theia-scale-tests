import { ElementHandle, expect } from '@playwright/test';
import { TheiaApp } from '../theia-pom/theia-app';
import { TheiaDialog } from '../theia-pom/theia-dialog';
import { TheiaMenuItem } from '../theia-pom/theia-menu-item';
import { TheiaRenameDialog } from '../theia-pom/theia-rename-dialog';
import { TheiaTreeNode } from '../theia-pom/theia-tree-node';
import { TheiaView } from '../theia-pom/theia-view';
import { elementContainsClass, normalizeId, OSUtil, urlEncodePath } from '../theia-pom/util';

const TheiaVSCViewData = {
    tabSelector: '#shell-tab-scm-view-container',
    viewSelector: '#scm-view-container--scm-view',
    viewName: 'Source Control'
};

export class TheiaVSCView extends TheiaView {

    constructor(app: TheiaApp) {
        super(TheiaVSCViewData, app);
    }

    override async activate(): Promise<void> {
        await super.activate();
        const viewElement = await this.viewElement();
        await viewElement?.waitForSelector('.theia-scm-main-container');
    }

    async commit(message: string): Promise<void> {
        await this.page.locator('.theia-scm-main-container').locator('.theia-scm-input-message').fill(message);
        const commitButton = await this.page.locator('.theia-sidepanel-toolbar').locator('.codicon-check');
        await commitButton.click();
        const commitDialog = await this.page.waitForSelector('div[class="dialogBlock"]');
        await commitDialog.press('Enter');
    }

    async pull(): Promise<void> {
        const pullButton = await this.page.locator('.theia-scm-main-container').locator('.theia-scm-pull-button');
        await pullButton.click();
    }

    async push(): Promise<void> {
        const pushButton = await this.page.locator('.theia-scm-main-container').locator('.theia-scm-push-button');
        await pushButton.click();   
    }

    async pushAll(): Promise<void> {
        const pushAllButton = await this.page.locator('.theia-scm-main-container').locator('.theia-scm-push-all-button');
        await pushAllButton.click();
    }

}
