import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { signIn } from "../authSlice";
import { Navigate, useNavigate, Link } from "react-router-dom";

export const Signin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [, setCookie] = useCookies();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth.isSignIn);
  const url = "https://ifrbzeaz2b.execute-api.ap-northeast-1.amazonaws.com";

  const onSignIn = (data) => {
    axios
      .post(`${url}/signin`, data)
      .then((res) => {
        setCookie("token", res.data.token);
        dispatch(signIn());
        navigate("/");
      })
      .catch((err) => {
        setErrorMessage(`サインインに失敗しました。${err}`);
      });
  };
  if (auth) return <Navigate to="/" />;

  return (
    <div>
      <main className="signin">
        <h2>サインイン</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="signin-form" onSubmit={handleSubmit(onSignIn)}>
          <label className="email-label">メールアドレス</label>
          <br />
          <input
            type="email"
            className="email-input"
            placeholder="email"
            {...register("email", {
              required: {
                value: true,
                message: "入力が必須の項目です。",
              },
            })}
          />
          {errors.email && <div>入力が必須の項目です</div>}
          <br />
          <label className="password-label">パスワード</label>
          <br />
          <input
            type="password"
            className="password-input"
            placeholder="password"
            {...register("password", {
              required: {
                value: true,
                message: "入力が必須の項目です。",
              },
              minLength: {
                value: 8,
                message: "8文字以上入力してください",
              },
            })}
          />
          {errors.password && <div>入力が必須の項目です</div>}
          <br />
          <button type="submit" className="signin-button" onClick={onSignIn}>
            サインイン
          </button>
        </form>
        <Link to="/signup">新規作成</Link>
      </main>
    </div>
  );
};
