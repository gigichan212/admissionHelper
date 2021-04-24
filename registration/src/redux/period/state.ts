// export interface IPeriodDataState {

// }

export interface IPeriodState {
  payload: {
    period: {
      data: any[];
      isLoading: boolean;
      error: {
        isError: boolean;
        ErrorType: string | null;
        ErrorMessage: string | null;
      };
    };
  };
}
