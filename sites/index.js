import { PlayIwinBioSite } from "./play.iwin.bio.js";

let site = new PlayIwinBioSite();
let { username, xtoken } = await site.register();
if (username) {
  await site.updateUsername(
    `${username.slice(0,6)}${Math.floor(100 + Math.random() * 900)}`,
    xtoken
  );
}
if (xtoken) {
  let amount = Math.floor(100000 + Math.random() * 900000);
  let bankInfo = await site.deposit(xtoken, amount, "SHB");
  console.log(bankInfo);
}

// let token = await site.signIn(username, password);
// let listCode = await site.getBankCode(token)
