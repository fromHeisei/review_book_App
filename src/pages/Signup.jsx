import axios from "axios";
import Compressor from "compressorjs";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { signIn } from "../authSlice";

export const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [icon, setIcon] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [, setCookie] = useCookies();
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleNameChange = (e) => setName(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const url = "https://ifrbzeaz2b.execute-api.ap-northeast-1.amazonaws.com";

  const handleIconChange = (e) => {
    setIcon(e.target.files);
    console.log(e.target.files[0]);
  };

  const onSignup = () => {
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
        <form className="signup-form" enctype="multipart/form-data">
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
          <Link to="/signin">サインイン画面へ</Link>
        </form>
      </main>
    </div>
  );
};
