import axios from "axios";
import Compressor from "compressorjs";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signIn } from "../authSlice";

export const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [icon, setIcon] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [cookies, setCookie] = useCookies();
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleNameChange = (e) => setName(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleIconChange = (e) => setIcon(e.target.value);
  const url = "https://ifrbzeaz2b.execute-api.ap-northeast-1.amazonaws.com";
  const onSignup = () => {
    console.log(url);

    const data = {
      name: name,
      email: email,
      password: password,
    };

    axios
      .post(`${url}/users`, data)
      .then((res) => {
        const token = res.data.token;
        dispatch(signIn());
        setCookie("token", token);

        new Compressor(icon, {
          quality: 0.4,
          success(result) {
            const formData = new FormData();
            formData.append("icon", result, result.name);
            console.log(formData.get("icon"));
            axios
              .post(`${url}/uploads`, formData, {
                headers: {
                  Authorization: `Bearer ${cookies.token}`,
                },
              })
              .then(() => {
                navigate("/");
              });
          },
          error(err) {
            console.log(err.message);
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
        <form className="signup-form">
          <label for="user">ユーザー名</label>
          <br />
          <input
            id="user"
            type="text"
            onChange={handleNameChange}
            className="name-input"
          />
          <br />
          <label for="emailadd">メールアドレス</label>
          <input
            type="email"
            id="emailadd"
            onChange={handleEmailChange}
            className="email-input"
          />
          <br />
          <label for="pass">パスワード</label>
          <input
            type="password"
            id="pass"
            onChange={handlePasswordChange}
            className="password-input"
          />
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
          <button type="button" onClick={onSignup} className="signup-button">
            作成する
          </button>
        </form>
      </main>
    </div>
  );
};
