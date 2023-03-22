import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signOut } from "../authSlice";
import "./Home.css";

export const Home = () => {
  const auth = useSelector((state) => state.auth.isSignIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userIcon, setUserIcon] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [cookies, removeCookie] = useCookies();
  const url = "https://ifrbzeaz2b.execute-api.ap-northeast-1.amazonaws.com";

  const handleSignOut = () => {
    dispatch(signOut());
    removeCookie("token");
    navigate("/signin");
  };
  useEffect(() => {
    axios
      .get(`${url}/users`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setUserName(res.data.name);
        setUserIcon(res.data.iconUrl);
      })
      .catch((err) => {
        setErrorMessage(`ユーザ情報の取得に失敗しました。${err}`);
      });
  });
  return (
    <div className="user-info">
      <div>{errorMessage}</div>
      <h1>ユーザプロフィール</h1>
      <h2>ユーザ名：{userName}</h2>
      <p>
        <img src={userIcon} alt="ユーザアイコン" />
      </p>
      {auth ? (
        <button onClick={handleSignOut} className="sign-out-button">
          サインアウト
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};
