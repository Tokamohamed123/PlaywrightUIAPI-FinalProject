

import basePage from "./basePage";

export default class LoginPage extends basePage{
  /////////Locatores//////////////////
 private readonly Enterpassword = this.page.locator("//input[@id='password']");
  //  //Xpath

 private readonly ClickEnterButton = this.page.locator(
  "//button[@type='submit']" );

  //////////////////////////////////Functions////////////////////
 async EnterPassword() {
    await this.enterTextToElement(this.Enterpassword,"Test123");
    
  }

async ClickEnterBtn() {
  await this.clickOnElement(this.ClickEnterButton);

 
  }
}



