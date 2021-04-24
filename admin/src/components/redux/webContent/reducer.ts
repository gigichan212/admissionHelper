import { webContentActions } from "./action";
import { WebContentState } from "./state";
import produce from "immer";

// const initialState: WebContentState = {
//   data: {
//     normal: {
//       application_procedure:
//         "<ul><li>normal: 報名時準備所需文件﹕嬰幼兒之出生證明書檔案，此檔案的規格必須是.JPG 檔案格式，並不少於500KB及不多於2 MB，圖片解像度為 200 dpi 像素(普遍掃描器的標準規格) 。</li><li>在網上遞交報名表後，電腦屏幕上會顯示申請編號，即表示已成功遞交申請，並被安排於輪候名單中，請記下申請編號以便日後查詢。</li></ul>",
//       application_note: "<p>normal : 提示： 申請人可於2022年4月5日至5月5日修改資料。</p>",
//       confirmation_letter: "normal",
//       updated_at: "2021-04-12T04:28:48.498Z"
//     },
//     interim: {
//       application_procedure:
//         "<ul><li>interim: 報名時準備所需文件﹕嬰幼兒之出生證明書檔案，此檔案的規格必須是.JPG 檔案格式，並不少於500KB及不多於2 MB，圖片解像度為 200 dpi 像素(普遍掃描器的標準規格) 。</li><li>在網上遞交報名表後，電腦屏幕上會顯示申請編號，即表示已成功遞交申請，並被安排於輪候名單中，請記下申請編號以便日後查詢。</li></ul>",
//       application_note: "<p>interim: 提示： 申請人可於2022年4月5日至5月5日修改資料。</p>",
//       confirmation_letter: "interim",
//       updated_at: "2021-04-12T04:28:48.498Z"
//     },
//   },
// };

const initialState: WebContentState = {
  data: {
    normal: {},
    interim: {},
  },
};

export const webContentReducer = (
  state: WebContentState = initialState,
  action: webContentActions
): WebContentState => {
  switch (action.type) {
    case "@@webContent/editWebContent":
      return produce(state, (state) => {
        state.data.interim = { ...state.data.interim, ...action.data.interim };
        state.data.normal = { ...state.data.normal, ...action.data.normal };
      });
    case "@@webContent/updateWebContent":
      return produce(state, (state) => {
        state.data.interim = { ...state.data.interim, ...action.data.interim };
        state.data.normal = { ...state.data.normal, ...action.data.normal };
      });

    default:
      return state;
  }
};
