import { FrameLocator, Locator } from "@playwright/test";
import { TheiaApp } from "../theia-pom/theia-app";
import { TheiaView } from "../theia-pom/theia-view";

const TheiaScorpioViewData = {
  tabSelector:
    "#shell-tab-plugin-view-container\\:workbench\\.view\\.extension\\.artemis-sidebar-view",
  viewSelector:
    "#plugin-view-container\\:workbench\\.view\\.extension\\.artemis-sidebar-view",
  viewName: "Scorpio",
};

export class ScorpioView extends TheiaView {
  constructor(app: TheiaApp) {
    super(TheiaScorpioViewData, app);
  }

  override async activate(): Promise<void> {
    await super.activate();
    const viewElement = await this.viewElement();
    await viewElement?.waitForSelector(".webview");
  }

  async authenticateScorpio(username: string, password: string): Promise<void> {
    const loginButton = await this.getLoginButton();
    await loginButton.click();
    await this.page
      .locator(".dialogBlock")
      .getByRole("button", { name: "Allow" })
      .click();
    const quickInputWidget = await this.getQuickInputWidget();
    await quickInputWidget.fill(username);
    await quickInputWidget.press("Enter");
    await quickInputWidget.fill(password);
    await quickInputWidget.press("Enter");
    await this.page.getByText("Courses").waitFor({ state: "visible" });
  }

  async getScorpioView(): Promise<FrameLocator> {
    return await this.page
      .locator("iframe")
      .contentFrame()
      .locator("#active-frame")
      .contentFrame();
  }

  async getLoginButton(): Promise<Locator> {
    return await (
      await this.getScorpioView()
    ).getByRole("button", { name: "Login" });
  }

  async getQuickInputWidget(): Promise<Locator> {
    return await this.page
      .locator(".quick-input-widget")
      .getByRole("combobox", { name: "input" });
  }
}
