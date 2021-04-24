// select options
export const levelMap = new Map([
  ["1", "小一"],
  ["2", "小二"],
  ["3", "小三"],
  ["4", "小四"],
  ["5", "小五"],
  ["6", "小六"],
]);

export const applicationStatusMap = new Map([
  ["pending", "處理中"],
  ["first_round_interview", "已進入第一輪面試"],
  ["second_round_interview", "已進入第二輪面試"],
  ["admitted", "取錄"],
  ["rejected", "拒絕"],
  ["invalid", "無效"],
]);

export const relationshipMap = new Map([
  ["father", "父親 Father"],
  ["mother", "母親 Mother"],
  ["guardian", "監護人 Guardian"],
]);

export const sexMap = new Map([
  ["M", "男 Male"],
  ["F", "女 Female"],
]);

export const yesNoMap = new Map([
  [true, "是 Yes"],
  [false, "否 No"],
]);

export const periodsEditMap = new Map([
  ["收生類別", "type"],
  ["收生年份", "application_year"],
  ["收生階段", "round"],
  ["開始日期", "start_date"],
  ["開始時間", "start_time"],
  ["結束日期", "end_date"],
  ["結束時間", "end_time"],
  ["家長修改期限", "end_deadline"],
  ["家長修改時限", "end_deadline_time"],
  ["最後修改時間", "updated_at"],
]);

export const periodsTableMap = new Map([
  ["狀態", "is_active"],
  ["收生類別", "type"],
  ["收生年份", "application_year"],
  ["收生階段", "round"],
  ["開始日期", "start_date"],
  ["結束日期", "end_date"],
  ["家長修改期限", "end_deadline"],
  ["最後修改時間", "updated_at"],
]);

export const periodStatusMap = new Map([
  [true, "已開放"],
  [false, "已過期"],
]);

export const applicationType = new Map([
  ["normal", "新生"],
  ["interim", "插班生"],
]);

export const round = new Map([
  ["1", "第一輪收生"],
  ["2", "第二輪收生"],
  ["3", "第三輪收生"],
  ["4", "第四輪收生"],
]);

//
const currentYear = new Date().getFullYear();

export const applicationYear = new Map([
  [currentYear, currentYear],
  [currentYear + 1, currentYear + 1],
  [currentYear + 2, currentYear + 2],
]);

export const periodIsActiveMap = new Map([
  [true, "有效"],
  [false, "已過期"],
]);

export const userRoleMap = new Map([
  ["admin", "管理員"],
  ["teacher", "老師"],
  ["parent", "家長"],
]);

export const emailStatusMap = new Map([
  ["failed", "失敗"],
  ["success", "成功"],
]);

export const emailCategoryMap = new Map([
  ["login", "登入通知"],
  ["confirmation", "申請確認信"],
  ["first round interview", "第一輪面試通知"],
  ["second round interview", "第二輪面試通知"],
  ["admitted", "成功入讀通知"],
]);

export const emailMap = new Map([
  ["發送狀態", "email_status"],
  ["類別", "category"],
  ["電郵編號", "message_id"],
  ["電郵", "email"],
  ["申請編號", "idWithPrefix"],
  ["收生類別", "application_type"],
  ["收生年份", "application_year"],
  ["收生階段", "round"],
  ["發送時間", "submitted_at"],
  ["發送失敗原因 （如有）", "fail_type"],
  ["發送失敗內容 （如有）", "fail_message"],
]);

export const navbarArray = [
  {
    link: "/overview",
    name: "總覽",
    icon: "fa fa-binoculars",
  },
  {
    link: "/application",
    name: "申請記錄",
    icon: "fa fa-file",
  },
  {
    link: "/email",
    name: "電郵發送記錄",
    icon: "fa fa-paper-plane",
  },
  {
    link: "/application-period",
    name: "申請時段設定",
    icon: "fa fa-hourglass",
  },
  {
    link: "/web-content",
    name: "網頁內容設定",
    icon: "fa fa-globe",
  },
  {
    link: "/account",
    name: "賬戶設定",
    icon: "fa fa-user",
  },
];

export const advanceSearchMap = new Map([
  ["申請編號", "id"],
  ["中文姓名", "chinese_name"],
  ["英文姓名", "english_name"],
  ["出生證明書號碼", "birth_cert_num"],
  ["電郵", "email"],
  ["家長中文姓名", "parent_chinese_name"],
  ["家長英文姓名", "parent_english_name"],
]);

export const screenSizeMap = new Map([
  ["xLarge", 1200],
  ["large", 992],
  ["medium", 768],
  ["small", 576],
  ["iPadPro", 1027],
]);

// excel title mapping
export const excelTitleMap = new Map([
  ["idWithPrefix", "申請編號"],
  ["email", "	電郵"],
  ["chinese_name", "中文姓名"],
  ["english_name", "英文姓名"],
  ["date_of_birth", "出生日期"],
  ["place_of_birth", "出生地點"],
  ["birth_cert_num", "出生證明書號碼"],
  ["address", "住址"],
  ["sex", "姓別"],
  ["nationality", "國藉"],
  ["religion", "宗教"],
  ["phone", "住宅電話"],
  ["remarks", "附註"],
  ["have_sibling", "是否有兄弟姊妹"],
  ["first_round_score", "第一輪面試分數"],
  ["first_round_remarks", "第一輪面試備註"],
  ["second_round_score", "第二輪面試分數"],
  ["second_round_remarks", "第二輪面試備註"],
  ["school_remarks", "學校備註"],
  ["interview_date_time", "面試日期及時間"],
  ["application_status", "申請狀態"],
  ["level", "申請年級"],
  ["type", "收生類別"],
  ["school1", "以前就讀學校1"],
  ["duration1", "就讀期間1"],
  ["grade1", "班級1"],
  ["conduct_grade1", "操行等第1"],
  ["school2", "以前就讀學校2"],
  ["duration2", "就讀期間2"],
  ["grade2", "班級2"],
  ["conduct_grade2", "操行等第2"],
  ["school3", "以前就讀學校3"],
  ["duration3", "就讀期間3"],
  ["grade3", "班級3"],
  ["conduct_grade3", "操行等第3"],
  ["parent_type1", "與申請人關係1"],
  ["parent_chinese_name1", "家長中文姓名1"],
  ["parent_english_name1", "家長英文姓名1"],
  ["parent_occupation1", "家長職業1"],
  ["parent_office_address1", "家長辦事處地址1"],
  ["parent_office_phone1", "家長辦事處電話1"],
  ["parent_mobile1", "家長手提電話1"],
  ["parent_type2", "與申請人關係2"],
  ["parent_chinese_name2", "家長中文姓名2"],
  ["parent_english_name2", "家長英文姓名2"],
  ["parent_occupation2", "家長職業2"],
  ["parent_office_address2", "家長辦事處地址2"],
  ["parent_office_phone2", "家長辦事處電話2"],
  ["parent_mobile2", "家長手提電話2"],
  ["parent_type3", "與申請人關係3"],
  ["parent_chinese_name3", "家長中文姓名3"],
  ["parent_english_name3", "家長英文姓名3"],
  ["parent_occupation3", "家長職業3"],
  ["parent_office_address3", "家長辦事處地址3"],
  ["parent_office_phone3", "家長辦事處電話3"],
  ["parent_mobile3", "家長手提電話3"],
  ["sibling_name1", "兄弟姊妹姓名1"],
  ["sibling_sex1", "兄弟姊妹姓別1"],
  ["sibling_school_name1", "兄弟姊妹就讀學校1"],
  ["sibling_grade1", "兄弟姊妹班級1"],
  ["sibling_name2", "兄弟姊妹姓名2"],
  ["sibling_sex2", "兄弟姊妹姓別2"],
  ["sibling_school_name2", "兄弟姊妹就讀學校2"],
  ["sibling_grade2", "兄弟姊妹班級2"],
  ["created_at", "創建時間"],
  ["updated_at", "最後修改時間"],
]);
