import axios from "axios";
export class PlayIwinBioSite {
  constructor() {}
  generateVietnameseUsername() {
    // Common Vietnamese first names and last names (simplified)
    const firstNames = [
      "Nguyen",
      "Tran",
      "Le",
      "Pham",
      "Hoang",
      "Vu",
      "Dang",
      "Bui",
      "Do",
      "Duong",
    ];
    const middleNames = [
      "Van",
      "Thi",
      "Quang",
      "Minh",
      "Duc",
      "Huy",
      "Khanh",
      "Phuong",
      "Thanh",
      "Tuan",
    ];
    const lastNames = [
      "Hao",
      "Linh",
      "Nam",
      "Anh",
      "Dung",
      "Hoa",
      "Mai",
      "Lan",
      "Nhi",
      "Truc",
    ];

    // Get random elements
    const randomFirst =
      firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomMiddle =
      middleNames[Math.floor(Math.random() * middleNames.length)];
    const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
    const randomNumber = Math.floor(Math.random() * 1000); // Up to 999

    // Combine elements with Vietnamese naming pattern
    const patterns = [
      `${randomFirst}${randomMiddle}${randomLast}${randomNumber}`,
      `${randomFirst}${randomLast}${randomMiddle}${randomNumber}`,
      `${randomLast}${randomFirst}${randomNumber}`,
      `${randomFirst}${randomNumber}${randomLast}`,
    ];

    // Select random pattern and convert to lowercase
    const username =
      patterns[Math.floor(Math.random() * patterns.length)].toLowerCase();

    return username;
  }

  generateSecurePassword() {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";

    // Ensure at least one of each
    let password =
      lowercase[Math.floor(Math.random() * lowercase.length)] + // lowercase
      uppercase[Math.floor(Math.random() * uppercase.length)] + // uppercase
      numbers[Math.floor(Math.random() * numbers.length)]; // number

    const allChars = lowercase + uppercase + numbers;

    // Fill remaining 5 characters
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      password += allChars[randomIndex];
    }

    // Shuffle the password
    password = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    return password;
  }

  async register(proxy = null) {
    let condition = true;
    do {
      let username = this.generateVietnameseUsername();
      let password = this.generateSecurePassword();
      let url = "https://getquayaybiai.gwyqinbg.com/user/register.aspx";
      let dataOrigin = {
        fullname: username,
        username: username,
        password: password,
        app_id: "iwin.club",
        avatar: "Avatar_22",
        os: "Windows",
        device: "Computer",
        browser: "chrome",
        fg: "f2f173036e9900e84791b71eec0f5468",
        aff_id: "iwin",
        version: "2.31.1",
      };
      let data = JSON.stringify(dataOrigin);
      let config = {
        maxBodyLength: Infinity,
        headers: {
          authority: "getquayaybiai.gwyqinbg.com",
          accept: "*/*",
          "accept-language":
            "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
          "content-type": "text/plain;charset=UTF-8",
          origin: "https://play.iwin.bio",
          referer: "https://play.iwin.bio/",
          "sec-ch-ua":
            '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        },
      };

      let response = await axios
        .post(url, data, { ...config, httpAgent: proxy })
        .then((response) => {
          if ((response.data.status = "OK" && response.data.code == 200)) {
            condition == false;
            return {
              xtoken: response.data.data[0].session_id,
              username,
              password,
            };
          }
          if (
            response.data.code == 257 &&
            response.data.message ==
              "Bạn đã đăng ký quá nhiều tài khoản, vui lòng thử lại sau."
          ) {
            condition = false;
            console.log(
              "Bạn đã đăng ký quá nhiều tài khoản, vui lòng thử lại sau.\nCần đổi proxy. "
            );

            return {
              username: null,
              xtoken: null,
              password: null,
            };
          }
          if (
            response.data.message == "Tài khoản đã tồn tại" &&
            response.data.code == 409
          ) {
            console.log("Tài khoản đã tồn tại, đang tạo tài khoản khác.");
          }
        })
        .catch((error) => {
          console.log(error);
        });
      return response;
    } while (condition);
  }

  async updateUsername(username, xtoken, proxy = null) {
    let url = "https://getquayaybiai.gwyqinbg.com/user/update.aspx";
    let data = JSON.stringify({
      fullname: username,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      headers: {
        authority: "getquayaybiai.gwyqinbg.com",
        accept: "*/*",
        "accept-language":
          "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
        "content-type": "application/json",
        origin: "https://play.iwin.bio",
        referer: "https://play.iwin.bio/",
        "sec-ch-ua":
          '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "x-token": `${xtoken}`,
      },
      data: data,
    };

    let response = await axios
      .post(url, data, { ...config, httpAgent: proxy })
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
    return response;
  }

  async signIn(username, password, proxy = null) {
    let url = "https://getquayaybiai.gwyqinbg.com/user/login.aspx";
    let dataOrigin = {
      username: username,
      password: password,
      app_id: "iwin.club",
      os: "Windows",
      device: "Computer",
      browser: "chrome",
      fg: "8f2777955068b42039855089b9c77513",
      aff_id: "iwin",
      version: "2.31.1",
    };
    let data = JSON.stringify(dataOrigin);
    let config = {
      maxBodyLength: Infinity,
      headers: {
        authority: "getquayaybiai.gwyqinbg.com",
        accept: "*/*",
        "accept-language":
          "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
        "content-type": "text/plain;charset=UTF-8",
        origin: "https://play.iwin.bio",
        referer: "https://play.iwin.bio/",
        "sec-ch-ua":
          '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Cookie: "ci_session=0dlgeb7fllkno304ptu7jlmosvs1fojg",
      },
    };

    let response = await axios
      .post(url, data, { ...config, httpAgent: proxy })

      .then((response) => {
        if (response.data.data[0].session_id != null)
          console.log(`Login Successfully.`);
        return response.data.data[0].session_id;
      })
      .catch((error) => {
        console.log(error);
      });
    return response;
  }

  async getBankCode(token, proxy = null) {
    let url =
      "https://baymentgwapy.gwyqinbg.com/payment/bnp?xtoken=ee19ad3888b75bd46e98bc26e7cdb86f";
    let config = {
      maxBodyLength: Infinity,
      headers: {
        authority: "baymentgwapy.gwyqinbg.com",
        accept: "*/*",
        "accept-language":
          "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
        "content-length": "0",
        "content-type": "application/json",
        origin: "https://play.iwin.bio",
        referer: "https://play.iwin.bio/",
        "sec-ch-ua":
          '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "x-token": `${token}`,
      },
    };

    await axios
      .post(url, null, { ...config, httpAgent: proxy })
      .then((response) => {
        console.log(JSON.stringify(response.data.rows));
        return response.data.rows;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async deposit(token, amount = 500000, bankCode = "BIDV", proxy = null) {
    let data = JSON.stringify({
      amount: amount,
      bank_code: bankCode,
    });
    let url = `https://baymentgwapy.gwyqinbg.com/payment/np?xtoken=${token}`;
    let config = {
      maxBodyLength: Infinity,
      headers: {
        authority: "baymentgwapy.gwyqinbg.com",
        accept: "*/*",
        "accept-language":
          "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
        "content-type": "application/json",
        origin: "https://play.iwin.bio",
        referer: "https://play.iwin.bio/",
        "sec-ch-ua":
          '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "x-token": `${token}`,
      },
    };

    let response = await axios
      .post(url, data, { ...config, httpAgent: proxy })
      .then((response) => {
        if (response.data.rows) {
          let res = response.data.rows;
          let data = {
            account_no: res.account_no,
            account_name: res.account_name,
            bank_name: res.bank_name,
          };
          return data;
        }
        if (response.data.code == 400) {
          return {
            message: `This account have suspended. Please login another account.`,
          };
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return response;
  }
}
