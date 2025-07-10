import { check } from "k6";
import { generateCustomId } from "../helpers/utils.js";
import { createUserPayload } from "../payloads/userPayload.js";
import { postRequest, safeParse } from "../helpers/httpApiUtils.js";

export function createUser() {
  const res = postRequest("/members/create", createUserPayload());
  const body = safeParse(res.body);

  check(res, {
    "✅ user created": (r) => [200, 201].includes(r.status),
    "✅ has token and otp": () => !!body?.token && !!body?.otpCode,
  });

  return { token: body?.token, otp: body?.otpCode };
}

export function verifyUser(token, otp) {
  const res = postRequest("/members/verify", { OTPCode: otp }, token);
  const body = safeParse(res.body);

  check(res, {
    "✅ verified": (r) => [200, 201].includes(r.status),
    "✅ has new token": () => !!body?.token,
  });

  return { token: body?.token };
}

export function setOrResetPin(token) {
  const { id, code } = generateCustomId();
  const res = postRequest(
    "/members/setpin",
    {
      device_uuid: id,
      login_pin: code,
    },
    token
  );

  const body = safeParse(res.body);

  check(res, {
    "✅ pin set/reset": (r) => [200, 201].includes(r.status),
    "✅ has accessToken": () => !!body?.accessToken,
  });

  return { token: body?.accessToken, device_uuid: id, login_pin: code };
}

export function login(token, device_uuid, login_pin) {
  const res = postRequest(
    "/members/login",
    {
      device_uuid,
      login_pin,
    },
    token
  );

  const body = safeParse(res.body);

  check(res, {
    "✅ login success": (r) => [200, 201].includes(r.status),
    "✅ has token": () => !!body?.accessToken,
  });

  return { token: body?.accessToken ,id:body?.data?._id};
}

export function memberLookup(token, { phone = null, email = null }) {
  const payload = phone ? { phoneNumber: phone } : { email };
  const res = postRequest("/members/member-lookup", payload, token);
  const body = safeParse(res.body);
  const data = body?.data;

  const isFound = phone ? data?.phoneNumber === phone : data?.email === email;

  check(res, {
    "✅ member lookup success": (r) => [200, 201].includes(r.status),
    [`✅ member ${phone ? 'phone' : 'email'} matches`]: () => isFound === true,
  });

  return isFound;
}

export function loadMondy(token,currency,amount) {
  const payload={
    currency:currency,
    amount:amount
  }
  const res = postRequest("/members/fill-temp-wallet",payload,token);
  const body = safeParse(res.body);

  check(res, {
    "✅ money is loaded to the wallet": (r) => [200, 201].includes(r.status),
    [`✅ has balance ${body?.data?.balance}`]:()=>!!body?.data?.balance
  });
}
