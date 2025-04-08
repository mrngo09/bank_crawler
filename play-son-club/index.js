process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { PlaySonClubSite } from "./play.son.club.js";
let site = new PlaySonClubSite();
let token = await site.singIn("tienbip12345", "qweqwe123");
console.log(`Login successfully.\nToken: ${token}`);

let amount = 500000;
let bankInfo = await site.getBankInfo(token, amount);
console.log(bankInfo);
