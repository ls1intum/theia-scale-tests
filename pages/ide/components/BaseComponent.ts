import { Page } from '@playwright/test';

/**
 * Base class for all IDE components
 * Provides common functionality and properties
 */
export abstract class BaseComponent {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Wait for the component to be visible and ready
     */
    abstract waitForReady(): Promise<void>;
} 