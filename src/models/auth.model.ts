export interface SignUpDataModel {
  id: string;
  name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  birth_date: Date;
  role_id?: number;
  accept_terms_conditions: number;
  create_at: Date;
  update_at: Date;
  language: string;
}

export interface CheckIfUserExitModel {
  email: string;
  phone_number: string;
}
