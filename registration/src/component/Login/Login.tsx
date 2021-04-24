import React, { useEffect } from "react";
// redux
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../store";
import { login, sendLoginEmailSuccessFinished } from "../../redux/auth/actions";
// react-hook-form
import { useForm } from "react-hook-form";
// Css
import styles from "../../assets/scss/LoginPage.module.scss";
import { Form, Input } from "reactstrap";
// Component
import Banner from "../Banner";
import InputComponent from "../formElement/InputComponent";
import LoadingComponent from "../general/Loading";

// form interface
export interface ILoginForm {
  applicationIdWithPrefix: string;
  applicationEmail: string;
}

function Login(props: { type: string }) {
  const dispatch = useDispatch();
  // Get isLoading from store
  const { isLoading, loginEmailSent } = useSelector((state: IRootState) => {
    return state.auth;
  });

  // Get error from store
  const { isError, ErrorType, ErrorMessage } = useSelector(
    (state: IRootState) => {
      return state.auth.error;
    }
  );
  // Set form registration
  const { register, handleSubmit, errors, trigger } = useForm<ILoginForm>({
    defaultValues: {
      applicationIdWithPrefix: "",
      applicationEmail: "",
    },
    mode: "onBlur",
  });

  // Handle form submit
  const onSubmit = (data: ILoginForm) => {
    dispatch(login(data.applicationIdWithPrefix, data.applicationEmail));
  };
  // Error alert
  useEffect(() => {
    if (!isLoading && isError) {
      if (ErrorType === "LOGIN_FAILED_MISSING_CONTENT") {
        alert(
          `請填寫以下資料 Please fill in below information: \n${ErrorMessage}`
        );
      } else if (ErrorType === "LOGIN_FAILED_UNAUTHORIZED") {
        alert(
          `用戶不存在，請檢查申請編號/ 電郵是否正確。 \nUser doesn't exist. If you have any questions, please contact administrator for questions.`
        );
      } else {
        alert(`發生錯誤，請重試。 \nError occurs, please try again.`);
      }
    }
  }, [isLoading, ErrorType, isError]);

  // alert sent login email
  useEffect(() => {
    if (loginEmailSent) {
      alert(
        "已發送登入確認電郵。請檢查郵箱，使用電郵內的連結登入。 \nPlease check your mail box and through the URL given to login."
      );
      dispatch(sendLoginEmailSuccessFinished(false));
    }
    {
    }
  }, [loginEmailSent]);

  // Loading Handling
  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <>
      <Banner type={props.type} />
      <section className={`container`}>
        <h3 style={{ textAlign: "center" }}>登入</h3>
        <Form
          onSubmit={handleSubmit(onSubmit)}
          className={`${styles.loginForm}`}
        >
          <InputComponent
            label="申請編號"
            name="applicationIdWithPrefix"
            register={register}
            type="number"
            rules={{ required: true }}
            errors={errors}
            trigger={trigger}
          />
          <InputComponent
            label="電郵"
            name="applicationEmail"
            register={register}
            type="text"
            rules={{
              required: true,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message:
                  "請輸入有效的電郵地址。Please enter a valid e-mail address",
              },
            }}
            errors={errors}
            trigger={trigger}
          />

          <Input
            type="submit"
            className={`${styles.loginSubmit} submit`}
            value="登入"
          />
        </Form>
      </section>
    </>
  );
}

export default Login;
