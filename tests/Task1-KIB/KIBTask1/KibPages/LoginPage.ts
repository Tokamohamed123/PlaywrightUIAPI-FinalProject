import basePage from "./basePage";

export default class LoginPage extends basePage{
  /////////Locatores//////////////////
 private readonly Enterpassword = this.page.locator("//input[@id='password']");
  //  //Xpath

 private readonly ClickEnterButton = this.page.locator(
  "//button[@type='submit']" );

  ////////////////////////////////Functions////////////////////
 async EnterPassword() {
    // Explicit Wait
    await this.Enterpassword.waitFor({ state: 'visible', timeout: 10000 });
    await this.enterTextToElement(this.Enterpassword,"Test123");
    
  }

async ClickEnterBtn() {
  // explicit Wait
  await this.ClickEnterButton.waitFor({ state: 'visible', timeout: 10000 });
  await this.clickOnElement(this.ClickEnterButton);

 
  }
}