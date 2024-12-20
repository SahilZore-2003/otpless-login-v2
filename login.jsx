import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { CONST } from "../config";
import { useAxios } from "../config/axios";
import { signInSuccess } from "../redux/slices/userSlice";

export default function Login() {

  const [otplessUser, setOtplessUser] = useState(null);
  const axiosInstance = useAxios()
  const dispatch = useDispatch()
  const initOTPless = (callback) => {
    const otplessInit = Reflect.get(window, "otplessInit");

    const loadScript = () => {
      const isScriptLoaded = document.getElementById("otpless-sdk");
      if (isScriptLoaded) return;

      const script = document.createElement("script");
      script.id = "otpless-sdk";
      script.type = "text/javascript";
      script.src = "https://otpless.com/v4/auth.js";
      script.setAttribute("data-appid", "B4QBS1LNQ67LKQMLTA7P");
      document.body.appendChild(script);
    };

    otplessInit ? otplessInit() : loadScript();

    Reflect.set(window, "otpless", callback);
  };



  const handleLogin = async (user) => {
    try {
      const res = await axiosInstance.post(
        CONST.uri.auth.OTPLESS_LOGIN,
        {},

        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (res.status === 201) {
        dispatch(signInSuccess(res.data));
      }
    } catch (error) {
      console.log(error);
      toast.error("Login Failed");
    }
  };

  useEffect(() => {
    const callback = (otplessUser) => {
      console.log("🚀 ~ callback ~ otplessUser:", otplessUser)
      if (otplessUser?.idToken) {
        setOtplessUser(otplessUser);
        handleLogin(otplessUser);
      }
    };
    initOTPless(callback);
  }, []);

  return <div id="otpless-login-page"></div>;
}
