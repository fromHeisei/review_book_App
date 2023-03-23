import axios from "axios";
import Compressor from "compressorjs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { signIn } from "../authSlice";

export const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [icon, setIcon] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [, setCookie] = useCookies();
  const url = "https://ifrbzeaz2b.execute-api.ap-northeast-1.amazonaws.com";

  const handleIconChange = (e) => {
    setIcon(e.target.files);
    console.log(e.target.files[0]);
  };

  const onSubmit = (data) => {
    axios
      .post(`${url}/users`, data)
      .then((res) => {
        const token = res.data.token;
        dispatch(signIn());
        setCookie("token", token);

        const file = icon[0];
        console.log(file);
        new Compressor(file, {
          quality: 0.6,
          success(result) {
            const file = new FormData();
            console.log(result);
            file.append("icon", result);

            axios
              .post(`${url}/uploads`, file, {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${token}`,
                },
              })
              .then(() => {
                navigate("/");
              })
              .catch((err) => {
                setErrorMessage(`画像アップロードに失敗しました. ${err}`);
              });
          },
        });
      })
      .catch((err) => {
        setErrorMessage(`サインアップに失敗しました。${err} `);
      });
  };
  return (
    <div>
      <main className="signup">
        <h2>新規アカウント作成</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="user">ユーザー名</label>
          <br />
          <input
            id="user"
            type="text"
            placeholder="username"
            className="name-input"
            {...register("name", {
              required: {
                value: true,
                message: "入力が必須の項目です",
              },
            })}
          />
          <br />
          <label htmlFor="emailadd">メールアドレス</label>
          <input
            type="email"
            id="emailadd"
            placeholder="email"
            className="email-input"
            {...register("email", {
              required: {
                value: true,
                message: "入力が必須の項目です。",
              },
            })}
          />
          {errors.email && <div>入力が必須の項目です。</div>}
          <br />
          <label for="pass">パスワード</label>
          <input
            type="password"
            id="pass"
            placeholder="password"
            className="password-input"
            {...register("password", {
              required: {
                value: true,
                message: "入力が必須の項目です。",
              },
              minLength: {
                value: 8,
                message: "8文字以上にしてください。",
              },
            })}
          />
          {errors.password && <div>入力が必須の項目です。</div>}
          <br />
          <label for="profile">プロフィール画像</label>
          <input
            type="file"
            id="profile"
            accept="image/png, image/jpeg"
            onChange={handleIconChange}
            className="icon-input"
          />
          <br />
          <button type="submit" className="signup-button">
            作成する
          </button>
        </form>

        <Link to="/signin">サインイン画面へ</Link>
      </main>
    </div>
  );
};
