//Form Label
export const educationLabelMapping = new Map([
  ["以前就讀學校 School(s) attended", "name"],
  ["就讀期間 Duration", "duration"],
  ["班級 Grade", "grade"],
  ["操行等第 Conduct grade", "conduct_grade"],
]);
export const parentLabelMapping = new Map([
  ["與申請人關係 parent_type with the Applicant", "parent_type"],
  ["中文姓名 Name in Chinese", "chinese_name"],
  ["英文姓名 Name in English", "english_name"],
  ["職業 Occupation", "occupation"],
  ["辦事處地址 Office address", "office_address"],
  ["辦事處電話 Office tel. no.", "office_phone"],
  ["手提電話 Mobile tel. no.", "mobile"],
]);

export const siblingLabelMapping = new Map([
  ["姓名 Name", "name"],
  ["姓別 Sex", "sex"],
  ["就讀學校 Name of school attending", "school_name"],
  ["班級 Grade", "grade"],
]);

// Option Choice
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

export const screenSizeMap = new Map([
  ["xLarge", 1200],
  ["large", 992],
  ["medium", 768],
  ["small", 576],
  ["iPadPro", 1027],
]);
