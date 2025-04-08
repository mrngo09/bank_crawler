process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { PlayIwinBioSite } from "./play.iwin.bio.js";
import { HttpsProxyAgent } from "https-proxy-agent";
import cron from "node-cron";
let site = new PlayIwinBioSite();
import BankInfoRepository from "../db/repo/bankInfoRepository.js";
const bankInfoRepository = new BankInfoRepository();

cron.schedule("* * * * *", async () => {
  try {
    let index = 0;
    console.log("Change proxy: index");
    const proxy = new HttpsProxyAgent({
      host: "127.0.0.1", // Replace with your proxy host (e.g., 'proxy.example.com')
      port: "8080", // Replace with your proxy port (e.g., 8080)
      // auth: "username:password", // Optional: Replace with proxy credentials if needed
    });
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
          const banks = ["BIDV", "VCB", "SHB"];
          let randomIndex = Math.random() * banks.length;

          let bankInfo = await site.deposit(xtoken, amount, banks[randomIndex]);
          if (bankInfo.message) {
            console.log(
              `This account have suspended. Please login another account.`
            );
            condition = false;
          }
          let obj = await bankInfoRepository.findByAccountNo(
            bankInfo.account_no
          );
          if (obj.message == "Bank info not found") {
            var response = await bankInfoRepository.create({
              account_number: bankInfo.account_no,
              account_name: bankInfo.account_name,
              bank_name: bankInfo.bank_name,
            });
            console.log(response);
          }
        } while (condition);
        index++;
      }
    } while (index == 5);
  } catch (err) {
    logger.error(`Cron job failed: ${err.message}`);
  }
});
