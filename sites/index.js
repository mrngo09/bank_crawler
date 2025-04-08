import { PlayIwinBioSite } from "./play.iwin.bio.js";

let site = new PlayIwinBioSite();
let condition = true;

do {
  let { username, xtoken } = await site.register();
  if (username && xtoken) {
    await site.updateUsername(
      `${username.slice(0, 6)}${Math.floor(100 + Math.random() * 900)}`,
      xtoken
    );
    let condition = true;
    do {
      let amount = Math.floor(100000 + Math.random() * 900000);
      let bankInfo = await site.deposit(xtoken, amount, "SHB");
      if (bankInfo == `He thong bao tri.`) {
        condition = false;
      }
      console.log(bankInfo);
    } while (condition);
  }
  if (!username) {
    condition = false;
    console.log("need to change proxy");
  }
} while (condition);

// let token = await site.signIn(username, password);
// let listCode = await site.getBankCode(token)
