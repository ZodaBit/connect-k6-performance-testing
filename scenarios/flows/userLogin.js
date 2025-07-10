import { group, sleep } from "k6";
import { createUser, verifyUser, setOrResetPin, login, memberLookup } from "../../services/userService.js";

export function userLogin() {
  group("🔐 User Login Flow", () => {
    let token = "";
    let otp = "";
    let device_uuid = "";
    let login_pin = "";
    const phone = "+251918422026";

    group("🧾 Create User", () => {
      const res = createUser();
      token = res.token;
      otp = res.otp;
    });

    group("✅ Verify User", () => {
      if (token && otp) {
        const res = verifyUser(token, otp);
        token = res.token;
      } else {
        console.warn("⚠️ Skipping verification: token or otp missing.");
      }
    });

    group("🔑 Set or Reset PIN", () => {
      if (token) {
        const res = setOrResetPin(token);
        token = res.token;
        device_uuid = res.device_uuid;
        login_pin = res.login_pin;
      } else {
        console.warn("⚠️ Skipping PIN set: token missing.");
      }
    });

    group("🚪 Login User", () => {
      if (token && device_uuid && login_pin) {
        console.log("device login", device_uuid);
        console.log("login pin", login_pin);
        const res = login(token, device_uuid, login_pin);
        token = res.token;
      } else {
        console.warn("⚠️ Skipping login: required data missing.");
      }
    });

    group("📞 Member Lookup", () => {
      if (token) {
        memberLookup(token, { phone });
      } else {
        console.warn("⚠️ Skipping lookup: token missing.");
      }
    });

    sleep(1); // Simulate user think time
  });
}
