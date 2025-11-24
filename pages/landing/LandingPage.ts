import { Locator, Page } from "@playwright/test";

/**
 * A class which encapsulates the landing page of Theia with UI selectors.
 */
export class LandingPage {
  page: Page;

  readonly languageCLocator: Locator;
  readonly languageJavaLocator: Locator;
  readonly languageJSLocator: Locator;
  readonly languageOcamlLocator: Locator;
  readonly languagePythonLocator: Locator;
  readonly languageRustLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.languageCLocator = this.page.getByRole("button", { name: "Launch C" });
    this.languageJavaLocator = this.page.getByRole("button", {
      name: "Launch Java",
      exact: true,
    });
    this.languageJSLocator = this.page.getByRole("button", {
      name: "Launch Javascript",
    });
    this.languageOcamlLocator = this.page.getByRole("button", {
      name: "Launch Ocaml",
    });
    this.languagePythonLocator = this.page.getByRole("button", {
      name: "Launch Python",
    });
    this.languageRustLocator = this.page.getByRole("button", {
      name: "Launch Rust",
    });
  }

  async waitForReady() {
    await this.page.locator("img").waitFor();
  }

  async clickLoginButton() {
    return this.page.getByTestId("loginButton").click();
  }

  async login(username: string, password: string) {
    await this.clickLoginButton();
    await this.page.getByRole("textbox", { name: "Username" }).fill(username);
    await this.page.getByRole("textbox", { name: "Password" }).fill(password);
    await this.page.getByRole("button", { name: "Sign in" }).click();
  }

  async logout() {
    await this.page.getByTestId("logoutButton").click();
  }

  async launchLanguage(language: string) {
    const languageButton = await this.page
      .getByTestId(`launch-app-${language}-latest`);
    await languageButton.click();
  }

  retrieveAllLanguageLocators() {
    return [
      this.languageCLocator,
      this.languageJavaLocator,
      this.languageJSLocator,
      this.languageOcamlLocator,
      this.languagePythonLocator,
      this.languageRustLocator,
    ];
  }

  setPage(page: Page) {
    this.page = page;
  }
}
