export const ROUND_DETAILS = Object.freeze({
  1: "1",
  2: "2",
  3: "3",
  4: "4",
});

export const STATUS_DETAILS = Object.freeze({
  1: "pending",
  2: "first_round_interview",
  3: "second_round_interview",
  4: "admitted",
  5: "rejected",
  6: "invalid",
});

export const APPLICATION_LEVEL_DETAILS = Object.freeze({
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
});

export const USER_ROLE_DETAILS = Object.freeze({
  1: "admin",
  2: "teacher",
  3: "parent",
});

export const APPLICATION_TYPE = Object.freeze({
  1: {
    type: "normal",
    applicationProcedure:
      "<ul><li>報名時準備所需文件﹕嬰幼兒之出生證明書檔案，此檔案的規格必須是.JPG 檔案格式，並不少於500KB及不多於2 MB，圖片解像度為 200 dpi 像素(普遍掃描器的標準規格) 。</li><li>在網上遞交報名表後，電腦屏幕上會顯示申請編號，即表示已成功遞交申請，並被安排於輪候名單中，請記下申請編號以便日後查詢。</li></ul>",
    applicationNote: "<p>提示： 申請人可於2022年5月5日至5月18日修改資料。</p>",
    confirmationLetter: `
    請於2021年10月1日至2021年10月30日帶備以下文件到　敝校作報名和核對之用：
    <br />
    <ul>
      <li>
        網上申請確認書及報名表，並附上近照【相片尺寸40毫米(闊)乘50毫米(高)】。
      </li>
      <li>學生出生證明文件正本及副本。</li>
      <li>如已領洗之天主教學生，請交領洗紙正本及副本。</li>
    </ul>
    <br />
    <br />`,
  },
  2: {
    type: "interim",
    applicationProcedure:
      "<ul><li>報名時準備所需文件﹕嬰幼兒之出生證明書檔案，此檔案的規格必須是.JPG 檔案格式，並不少於500KB及不多於2 MB，圖片解像度為 200 dpi 像素(普遍掃描器的標準規格) 。</li><li>在網上遞交報名表後，電腦屏幕上會顯示申請編號，即表示已成功遞交申請，並被安排於輪候名單中，請記下申請編號以便日後查詢。</li></ul>",
    applicationNote: "<p>提示： 申請人可於2021年5月5日至5月18日修改資料。</p>",
    confirmationLetter: `
    請於2021年10月26日至2020年10月30日帶備以下文件到　敝校作報名和核對之用：
    <br />
    <ul>
      <li>
        網上申請確認書及報名表，並附上近照【相片尺寸40毫米(闊)乘50毫米(高)】。
      </li>
      <li>學生出生證明文件正本及副本。</li>
      <li>如已領洗之天主教學生，請交領洗紙正本及副本。</li>
    </ul>
    <br />
    <br />`,
  },
});
