// import { teacherMapping } from "../components/application/ApplicationDetails";
import { applicationStatusMap, levelMap, relationshipMap, sexMap, yesNoMap } from "./Mapping";

// calculate minimum date for birth of date (5 years from now)
const newDate: Date = new Date();
// fill "0" if month is less than 10
let thisMonth: number = newDate.getMonth() + 1;
let thisMonthString = String(thisMonth);
if (thisMonth < 10) {
  thisMonthString = "0" + thisMonthString;
}
const currentFullDate = `${newDate.getFullYear() - 5}-${thisMonthString}-${newDate.getDate()}`;

// application form header and fields
export const sectionHeader = [
  {
    id: 0,
    header: "申請時段資料",
    content: [
      {
        label: "收生時段",
        name: "application_period",
        type: "AsyncSelect",
        required: true,
      },
    ],
  },
  {
    id: 1,
    header: "申請資料",
    content: [
      {
        label: "申請編號",
        name: "idWithPrefix",
        type: "text",
        required: false,
        readOnly: true,
      },
      {
        label: "申請狀態",
        name: "application_status",
        type: "select",
        required: true,
        options: Array.from(applicationStatusMap),
      },
      {
        label: "申請年級 Level Applied",
        name: "level",
        type: "select",
        required: true,
        options: Array.from(levelMap),
      },
    ],
  },
  {
    id: 2,
    header: "基本資料 Basic Information",
    content: [
      {
        label: "中文姓名 Name in Chinese",
        name: "chinese_name",
        type: "text",
        required: true,
        pattern: {
          value: /^[\u4E00-\u9FFF\s]+/,
          message: "只接受中文 Chinese only",
        },
      },
      {
        label: "英文姓名 Name in English",
        name: "english_name",
        type: "text",
        required: true,
        pattern: {
          value: /^[0-9A-Za-z\s+-]*$/,
          message: "只接受英文 English only",
        },
      },
      {
        label: "姓別 Sex",
        name: "sex",
        type: "select",
        required: true,
        options: Array.from(sexMap),
      },
      {
        label: "宗教 Religion",
        name: "religion",
        type: "text",
        required: false,
      },
      {
        label: "國藉 Nationality",
        name: "nationality",
        type: "text",
        required: true,
      },
      {
        label: "出生證明書號碼 Birth Certificate No.",
        name: "birth_cert_num",
        type: "text",
        required: true,
      },
    ],
  },
  {
    id: 3,
    header: "出生資料 Birth Information",
    content: [
      {
        label: "出生日期 Date of Birth",
        name: "date_of_birth",
        type: "date",
        required: true,
        max: currentFullDate,
      },
      {
        label: "出生地點 Place of Birth",
        name: "place_of_birth",
        type: "text",
        required: true,
      },
    ],
  },
  {
    id: 4,
    header: "聯絡資料 Contact Information",
    content: [
      {
        label: "電郵 Email address",
        name: "email",
        type: "email",
        required: true,
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
          message: "請輸入有效的電郵地址 Please enter a valid e-mail address",
        },
      },
      {
        label: "住宅電話 Residential phone no.",
        name: "phone",
        type: "tel",
        required: true,
        pattern: {
          value: /^\d*$/,
          message: "只接受數字 Number only",
        },
        minLength: {
          value: 8,
          message: "只接受8至15位的數字 Range between 8- 15 is accepted.",
        },
        maxLength: {
          value: 15,
          message: "只接受8至15位的數字 Range between 8- 15 is accepted.",
        },
      },
      {
        label: "住址 Address",
        name: "address",
        type: "textarea",
        required: true,
        placeholder: "建議填寫中文 Chinese is suggested",
      },
    ],
  },
  {
    id: 5,
    header: "以往就讀資料 Education History",
    content: [
      { label: "編號（無需填寫）", name: "id", type: "string", required: false, readOnly: true },
      {
        label: "以前就讀學校 School(s) attended",
        name: "name",
        type: "text",
      },
      {
        label: "就讀期間 Duration",
        name: "duration",
        type: "text",
      },
      { label: "班級 Grade", name: "grade", type: "text" },
      {
        label: "操行等第 Conduct grade",
        name: "conduct_grade",
        type: "text",
      },
    ],
  },
  {
    id: 6,
    header: "家長或監護人資料 Parent/ Guardian's Information",
    content: [
      { label: "編號（無需填寫）", name: "id", type: "string", required: false, readOnly: true },
      {
        label: "與申請人關係 Relationship with the Applicant",
        name: "parent_type",
        type: "select",
        options: Array.from(relationshipMap),
      },
      {
        label: "中文姓名 Name in Chinese",
        name: "chinese_name",
        type: "text",
        pattern: {
          value: /^[\u4E00-\u9FFF\s]+/,
          message: "只接受中文 Chinese only",
        },
      },
      {
        label: "英文姓名 Name in English",
        name: "english_name",
        type: "text",
        pattern: {
          value: /^[0-9A-Za-z\s+-]*$/,
          message: "只接受英文 English only",
        },
      },
      {
        label: "職業 Occupation",
        name: "occupation",
        type: "text",
      },
      {
        label: "辦事處地址 Office address",
        name: "office_address",
        type: "textarea",
      },
      {
        label: "辦事處電話 Office tel. no.",
        name: "office_phone",
        type: "tel",
        pattern: {
          value: /^\d*$/,
          message: "只接受數字 Number only",
        },
        minLength: {
          value: 8,
          message: "只接受8至15位的數字 Range between 8- 15 is accepted.",
        },
        maxLength: {
          value: 15,
          message: "只接受8至15位的數字 Range between 8- 15 is accepted.",
        },
      },
      {
        label: "手提電話 Mobile tel. no.",
        name: "mobile",
        type: "tel",
        pattern: {
          value: /^\d*$/,
          message: "只接受數字 Number only",
        },
        minLength: {
          value: 8,
          message: "只接受8至15位的數字 Range between 8- 15 is accepted.",
        },
        maxLength: {
          value: 15,
          message: "只接受8至15位的數字 Range between 8- 15 is accepted.",
        },
      },
    ],
  },
  {
    id: 7,
    header: "兄弟姊妹資料 Brother and Sister's Information",
    preContent: {
      label: "是否有兄弟姊妹？ Does applicant have brother(s) or sister(s)",
      name: "have_sibling",
      type: "select",
      options: Array.from(yesNoMap),
      required: true,
    },
    content: [
      { label: "編號（無需填寫）", name: "id", type: "string", required: false, readOnly: true },
      { label: "姓名 Name", name: "name", type: "text" },
      {
        label: "姓別 Sex",
        name: "sex",
        type: "select",
        options: Array.from(sexMap),
      },
      {
        label: "就讀學校 Name of school attending",
        name: "school_name",
        type: "text",
      },
      { label: "班級 Grade", name: "grade", type: "text" },
    ],
  },
  {
    id: 8,
    header: "其他資料 Other Information",
    content: [
      {
        label: "附註 Remarks",
        name: "remarks",
        type: "textarea",
        required: false,
        maxLength: {
          value: 500,
          message: "最多接受500個字元 Character limit is 500 characters.",
        },
      },
      { label: "近照 Recent Photo", name: "recent_photo", type: "file", required: true },
      { label: "入數紙 Upload Deposit Slip", name: "slips", type: "files", required: false },
    ],
  },
];

export const formInternalRemark = [
  {
    id: 1,
    header: "面試時間",
    content: [
      {
        label: "是次面試負責老師",
        name: "interviewer",
        type: "select",
        required: false,
      },
      {
        label: "是次面試日期",
        name: "interview_date",
        type: "date",
        required: false,
      },
      {
        label: "是次面試時間",
        name: "interview_time",
        type: "time",
        required: false,
      },
    ],
  },
  {
    id: 2,
    header: "第一輪面試",
    content: [
      {
        label: "第一輪面試分數",
        name: "first_round_score",
        type: "number",
        required: false,
      },
      {
        label: "第一輪面試備註",
        name: "first_round_remarks",
        type: "textarea",
        required: false,
      },
    ],
  },
  {
    id: 3,
    header: "第二輪面試",
    content: [
      {
        label: "第二輪面試分數",
        name: "second_round_score",
        type: "number",
        required: false,
      },
      {
        label: "第二輪面試備註",
        name: "second_round_remarks",
        type: "textarea",
        required: false,
      },
    ],
  },
  {
    id: 4,
    header: "其他",
    content: [
      {
        label: "一般備註",
        name: "school_remarks",
        type: "textarea",
        required: false,
      },
    ],
  },
];
