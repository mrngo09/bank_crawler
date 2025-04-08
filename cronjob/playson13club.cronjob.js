process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { Solver } from "@2captcha/captcha-solver";
const solver = new Solver("62405416d5d94b6a27b152407496d81e"); // Thay bằng API Key của bạn
import axios from "axios";
import puppeteer from "puppeteer";
import * as fs from "fs";
import { getPosition } from "../utils/getPosition.js";
function imageToBase64(filepath) {
  try {
    // Read the image file as binary data
    const imageData = fs.readFileSync(filepath);

    // Convert binary data to Base64
    const base64String = Buffer.from(imageData).toString("base64");

    // Optionally, you can include the MIME type (e.g., 'data:image/jpeg;base64,')
    const mimeType = "image/png"; // Adjust based on your image type (e.g., 'image/png')
    const dataUri = `data:${mimeType};base64,${base64String}`;

    return dataUri; // or just return base64String if you don't need the MIME type
  } catch (error) {
    console.error("Error converting image to Base64:", error);
    throw error;
  }
}

async function downloadImage(url, filepath) {
  try {
    // Fetch the image data from the URL
    const response = await axios.get(url, { responseType: "arraybuffer" });

    // Save the image to the specified filepath
    fs.writeFileSync(filepath, Buffer.from(response.data));

    console.log("Image saved successfully!");
  } catch (error) {
    console.error("Error downloading the image:", error);
  }
}
function readJsonFile(filePath) {
  try {
    // Đọc tệp JSON
    const data = fs.readFile(filePath, "utf8");

    // Chuyển đổi chuỗi JSON thành object
    const jsonData = JSON.stringify(data);

    return jsonData;
  } catch (err) {
    console.error("Lỗi:", err.message);
  }
}

async function solveCaptchaFromImage(path) {
  try {
    // Đọc dữ liệu từ tệp JSON ảnh CAPTCHA
    const data = imageToBase64(path);
    const result = await solver.imageCaptcha({
      body: data,
      numeric: 0,
      phrase: 0,
      regsense: 0,
      lang: "en",
      hintText: "Enter text in image. Note: Case sensitive.",
    });
    console.log("Kết quả captcha:", result.data);
    return result.data;
  } catch (err) {
    console.error("Lỗi:", err);
  }
}

const browser = await puppeteer.launch({
  headless: false,
  slowMo: 250,
  devtools: true,
});
await browser.deleteCookie();
const page = await browser.newPage();
page.setGeolocation({});
await page.setViewport({ width: 800, height: 600 });
await page.goto("https://play.son.club/", { waitUntil: "load" });
console.log("Starting scraping https://play.son13.club/...");

// let captchaV2Url = "https://portal.taison01.com/api/account/captchav2";
let captchaV2Url = "data:image/png;base64";

// page.on("response", async (response) => {
//   try {
//     const request = response.request();
//     const url = request.url();
//     // const method = request.method();

//     if (url.includes(captchaV2Url)) {
//       const response = await axios.get(url, { responseType: "arraybuffer" });

//       // Save the image data to a file as PNG
//       fs.writeFileSync("./resources/captchav2.png", Buffer.from(response.data));
//       //   let base64Image = url.split(";base64,").pop();
//       //   console.log(base64Image);

//       //   const buffer = Buffer.from(base64Image, "base64");
//       //   fs.writeFileSync("./resources/captchav2.png", buffer);
//       //   fs.writeFileSync("captchav2.json", JSON.stringify(base64Image, null, 2));
//       //   await page.screenshot({
//       //     fullPage: true,
//       //     path: "./resources/captchav2.png",
//       //   });
//       await solveCaptchaFromImage("./resources/captchav2.png");
//       //   if (method === "OPTIONS") {
//       //     console.log("Skipping preflight request");
//       //     return;
//       //   }
//       // Lấy body của response
//       // //   const body = await response.buffer().catch((err) => {
//       // //     console.error(`Failed to get body for ${url}:`, err);
//       // //     return null;
//       // //   });
//       //   if (body) {
//       //     console.log("Response Body:", body.toString("utf8"));
//       //     base64Data = body.toString("utf8")[1];
//       //     //   .replace(/^data:image\/\w+;base64,/, "");
//       //     const buffer = Buffer.from(base64Data, "base64");
//       //     fs.writeFileSync("./resources/captchav2.png", buffer);
//       //     fs.writeFileSync(
//       //       "captchav2.json",
//       //       JSON.stringify(JSON.parse(body.toString("utf8")), null, 2)
//       //     );
//       //   } else {
//       //     console.log("No body available for this response");
//       //   }
//     }
//   } catch (error) {
//     console.error("Error in response handler:", error);
//   }

//   // // console.log(base64Data);
// });

await page.mouse.click(400, 560, { button: "left" }); // Di chuyển chuột đến tọa độ popup form đăng ký(Register form)
await page.mouse.click(370, 230, { button: "left" }); // Di chuyển chuột đến tọa độ popup form đăng ký(username)
await page.mouse.click(370, 270, { button: "left" }); // Di chuyển chuột đến tọa độ popup form đăng ký(psw)
await page.mouse.click(370, 320, { button: "left" }); // Di chuyển chuột đến tọa độ popup form đăng ký(re-psw)
await page.mouse.click(370, 370, { button: "left" }); // Di chuyển chuột đến tọa độ popup form đăng ký(captcha code)
await page.mouse.click(370, 410, { button: "left" }); // Di chuyển chuột đến tọa độ popup form đăng ký(btn confirm)
// await getPosition(page);
// await page.mouse.click(520, 570, { button: "left" }); // Di chuyển chuột đến tọa độ mở popup login
// await page.mouse.click(500, 250, { button: "left" }); // Di chuyển chuột đến tọa độ input username
// await page.keyboard.type("admin123");
// await page.mouse.click(500, 300, { button: "left" }); // Di chuyển chuột đến tọa độ mở input password
// await page.keyboard.type("admin123");
// await page.mouse.click(500, 350, { button: "left" }); // Di chuyển chuột đến tọa độ button login

// async function signUpAutomation(page) {}
