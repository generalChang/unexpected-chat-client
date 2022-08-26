import { message } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../_actions/user_actions";

function Auth(Component, option, adminRoute = null) {
  function AuthenticationCheck(props) {
    let user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(auth()).then((result) => {
        if (!result.payload.isAuth) {
          if (option) {
            message.warning("You have to sign in first!!");
            props.history.push("/login");
            return;
          }
        } else {
          if (result.payload.passwordReset) {
            //로그인을 했으나 비밀번호를 업데이트해주지 않았을때.
            props.history.push("/update/password");
            return;
          }

          if (!result.payload.emailCertificated) {
            //로그인은 되어있는데 아직 이메일 인증을 하지 않은상태.
            props.history.push("/email/certificate");
            return;
          }
          if (adminRoute && !result.payload.isAdmin) {
            props.history.push("/");
          } else {
            if (option === false) {
              props.history.push("/");
            }
          }
        }
      });
    }, []);

    return <Component {...props} user={user} />;
  }

  return AuthenticationCheck;
}

export default Auth;
