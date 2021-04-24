export interface WebContentState {
  data: {
    normal:
      | {
          application_procedure: string;
          application_note: string;
          confirmation_letter: string;
          updated_at: string;
        }
      | {};
    interim:
      | {
          application_procedure: string;
          application_note: string;
          confirmation_letter: string;
          updated_at: string;
        }
      | {};
  };
}
