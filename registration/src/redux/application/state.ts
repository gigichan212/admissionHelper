import { LegacyRef } from "react";

export interface IEducationState {
  id?: string;
  name: string;
  duration: string;
  grade: string;
  conduct_grade: string;
}

export interface IParentState {
  id?: string;
  parent_type: string;
  chinese_name: string;
  english_name: string;
  occupation: string;
  office_address: string;
  office_phone: number | null;
  mobile: number | null;
}

export interface ISiblingState {
  id?: string;
  name: string;
  sex: string;
  school_name: string;
  grade: string;
}

export interface IApplicationDataState {
  end_deadline?: Date;
  idWithPrefix: number | null;
  created_at: string | null;
  recent_photo_preview_only?: string;
  depositSlips: {
    deposit_slip: string;
  }[];
  application_status?: string;
  interview_date_time?: string;
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
  email2: string;
  phone: number | null;
  address: string;
  have_sibling: string;
  remarks: string;
  recent_photo: any;
  slips: string;
  education: IEducationState[];
  parent: IParentState[];
  sibling: ISiblingState[];
}

export interface IApplicationState {
  payload: {
    application: {
      data: IApplicationDataState;
      recentPhoto: {
        selectedImage: null | FileList;
      };
      showModalImage: {
        isShow: boolean;
        modalImage: string | null;
      };
      isLoading: boolean;
      resetForm: boolean;
      fromStep1: boolean;
      fromStep2: boolean;
      isUpdated: boolean;
      error: {
        isError: boolean;
        ErrorType: string | null;
        ErrorMessage: string | null;
      };
    };
  };
}
