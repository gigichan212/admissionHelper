import React from "react";
import Banner from "../Banner";
import NoticeComponent from "./Notice";

export default function ErrorComponent(props: { type: string }) {
  return (
    <>
      <Banner type={props.type} />
      {props.type === "404 Not Found" ? (
        <NoticeComponent
          cht="你所找的頁面可能已被刪除"
          eng="404 Not Found Error"
        />
      ) : (
        <NoticeComponent cht="伺服器錯誤" eng="500 Internal Server Error" />
      )}
    </>
  );
}
