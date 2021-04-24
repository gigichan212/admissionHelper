export interface EducationState {
  id?: string;
  name: string;
  duration: string;
  grade: string;
  conduct_grade: string;
}

export interface ParentState {
  id?: string;
  parent_type: string;
  chinese_name: string;
  english_name: string;
  occupation: string;
  office_address: string;
  office_phone: number | null;
  mobile: number | null;
}

export interface SiblingState {
  id?: string;
  name: string;
  sex: string;
  school_name: string;
  grade: string;
}

export interface ApplicationDataState {
  id: number | null;
  idWithPrefix: number | null;
  created_at: string | null;
  updated_at: string | null;
  updated_user_role: string | null;
  updated_user: string | null;
  recent_photo_preview_only?: string;
  application_period: { value: number; label: string };
  application_status: string;
  depositSlips: {
    deposit_slip: string;
  }[];
  level: string;
  chinese_name: string;
  english_name: string;
  sex: string;
  religion: string;
  nationality: string;
  birth_cert_num: string;
  date_of_birth: string;
  place_of_birth: string;
  email: string;
  phone: number | null;
  address: string;
  have_sibling: boolean;
  remarks: string;
  recent_photo: string;
  slips: string;
  education: EducationState[];
  parent: ParentState[];
  sibling: SiblingState[];
  interviewer: { value: number; label: string };
  interview_date: string;
  interview_time: string;
  interview_date_time: string;
  first_round_score: number | null;
  first_round_remarks: string;
  second_round_score: number | null;
  second_round_remarks: string;
  school_remarks: string;
}

export interface ApplicationState {
  payload: {
    record: {
      selected: number[];
      sortBy: string;
      offset?: number | null;
      limit: number;
      isLoading?: boolean;
      recordCount: number | null;
      record: any[];
      excelRecord: any[];
      currentPage: number;
      error: {
        isError: boolean;
        ErrorType: string | null;
        ErrorMessage: string | null;
      };
      isUpdated?: boolean;
      searchQuery?: {};
      isUpdatedEmail?: boolean;
      emailRecordCount?: number;
      failEmailRecordCount?: number;
      failEmailRecord?: string[];
    };
    singleRecord: {
      record: any;
      isAddApplicationLoading: boolean;
      isLoading: boolean;
      imageIsLoading: boolean;
      isAdded: boolean;
      isUpdated: boolean;
      showModalImage: {
        isShow: boolean;
        modalImage: string | null;
      };
      error: {
        isError: boolean;
        ErrorType: string | null;
        ErrorMessage: string | null;
      };
    };
    container: {
      searchBar: {
        isShow: boolean;
      };
      interviewerModal: {
        isShow: boolean;
      };
      batchUpdate: {
        isShow: boolean;
        isLoading?: boolean;
      };
      email: {
        isShow: boolean;
      };
      excel: {
        isShow: boolean;
      };
    };
  };
}
