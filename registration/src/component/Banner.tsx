import { useEffect, useState } from "react";

function Banner(props: { type?: string; year?: string }) {
  // Changing Banner Text
  const [bannerText, setBannerText] = useState("");
  const [bannerEngText, setBannerEngText] = useState("");
  useEffect(() => {
    if (props.type === "selecting") {
      setBannerText("入學申請");
      setBannerEngText("Admission");
    } else if (props.type === "normal") {
      setBannerText(`${props.year}年度小一入學申請`);
      setBannerEngText(`Primary One Admission for year ${props.year}`);
    } else if (props.type === "interim") {
      setBannerText(`${props.year}年度插班生入學申請`);
      setBannerEngText(`Interim Admission for year ${props.year}`);
    } else if (props.type === "editSelecting") {
      setBannerText("修改資料/ 上傳入數紙");
      setBannerEngText("Modify Application/ Upload Deposit Slip");
    } else if (props.type === "editForm") {
      setBannerText("修改/檢視資料");
      setBannerEngText("Modify Application");
    } else if (props.type === "uploadDepositSlip") {
      setBannerText("上傳入數紙");
      setBannerEngText("Upload Deposit Slip");
    } else if (props.type === "checkResult") {
      setBannerText("查詢結果");
      setBannerEngText("Application Status");
    } else {
      setBannerText("發生錯誤");
      setBannerEngText("Oh! Error occurs");
    }
  }, [props.type]);
  return (
    <section className="banner">
      <h1>
        {bannerText}
        <br />

        {bannerEngText}
      </h1>
    </section>
  );
}

export default Banner;
