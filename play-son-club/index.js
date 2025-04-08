process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import cron from "node-cron";
import { PlaySonClubSite } from "./play.son.club.js";

cron.schedule("* * * * *", async () => {
  let site = new PlaySonClubSite();
  let token = await site.singIn("tienbip12345", "qweqwe123");
  console.log(`Login successfully.\nToken: ${token}`);

  let amount = 500000;
  let bankInfo = await site.getBankInfo(token, amount);
  console.log(bankInfo);
});
