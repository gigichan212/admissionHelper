export const emailCategoryMapping = new Map([
  ["login", "login"],
  ["confirmation_email_template_id", "confirmation"],
  ["first_interview_email_template_id", "first round interview"],
  ["second_interview_email_template_id", "second round interview"],
  ["admitted_email_template_id", "admitted"],
]);

export const emailTemplateIdMapping: any = new Map([
  ["first_round_interview", "first_interview_email_template_id"],
  ["second_round_interview", "second_interview_email_template_id"],
  ["admitted", "admitted_email_template_id"],
]);
