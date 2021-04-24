import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useRouter from "use-react-router";
import { loginFromEmail } from "../../redux/auth/actions";
import { IRootState } from "../../store";
import ErrorComponent from "../general/Error";

export default function LoginRequest() {
  const dispatch = useDispatch();
  // router handling
  const router = useRouter<{ token?: string }>();
  const loginToken = router.match.params.token;
  const { isError } = useSelector((state: IRootState) => state.auth.error);
  useEffect(() => {
    if (!loginToken) {
      return;
    }
    dispatch(loginFromEmail(loginToken));
  }, [dispatch]);
  if (isError) {
    return <ErrorComponent type="Internal Server Error" />;
  }

  return <p>Currently redirect to login page. 正在登入，請稍等。</p>;
}
