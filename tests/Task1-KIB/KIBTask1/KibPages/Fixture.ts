import { test as baseTest } from "@playwright/test";
import LoginPage from "./LoginPage";
import ProductPage from "./ProductPage";
import MandatoryDeatailsPage from "./MandatoryDeatilsPage";

type pages ={

    loginPage: LoginPage;
    productPage:ProductPage;
    mandatoryDeatailsPage:MandatoryDeatailsPage;


}

const testpages= baseTest.extend<pages>({

    loginPage: async ({page},use)=>{
        await use(new LoginPage(page))
    },
    
  productPage: async ({page},use)=>{
        await use(new ProductPage(page))
    },

      mandatoryDeatailsPage: async ({page},use)=>{
        await use(new MandatoryDeatailsPage(page))
    },
    

})

export const test= testpages;
export const expect= testpages.expect;