export interface User {
  id: number;
  username: string;
  password?: string;
  is_active?: boolean;
  created_at?: any;
  updated_at?: any;
  role: string;
  updated_user_id: string;
}

export interface Relationship {
  id: number | string;
  parent_type: string;
  chinese_name: string;
  english_name: string;
  occupation: string;
  office_address: string;
  office_phone: number;
  mobile: number;
}

export interface SchoolHistory {
  id: number | string;
  name: string;
  duration: string;
  grade: string;
  conduct_grade: string;
}

export interface Sibling {
  id: number | string;
  name: string;
  sex: string;
  school_name: string;
  grade: string;
}

// email
export interface InfoForEmail {
  category: string;
  applicationId: number;
  recipient: string;
  templateId: number;
  templateModel: {
    idWithPrefix: string;
    email: string;
    chinese_name: string;
    english_name: string;
    application_year: number;
    interview_date_time?: string;
    loginURL?: string;
    registration_url?: string;
  };
}

export interface sendEmailResultInterface {
  type: string;
  applicationId: number;
  To: string;
  SubmittedAt: string;
  MessageID: string;
  fail?: boolean;
}
