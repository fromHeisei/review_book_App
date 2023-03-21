import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export const Home = () => {
  const [userName, setUserName] = useState("");
  const [userIcon, setUserIcon] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [cookies] = useCookies();
  const url = "https://ifrbzeaz2b.execute-api.ap-northeast-1.amazonaws.com";

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
    </div>
  );
};
