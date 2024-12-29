export const createUserQuery = (tableName: string): string => {
  return `
  INSERT INTO ${tableName}(
  id,
  name,
  last_name,
  email,
  phone_number,
  password,
  birth_date,
  role_id,
  accept_terms_conditions,
  created_at,
  updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
};

export const getRoleQuery = (id: number): string => {
  return `SELECT name FROM roles WHERE id = ${id} LIMIT 1;`;
};

export const createVerificationCode = (idType: string) => {
  return `INSERT INTO verification_codes (${idType}, verification_code) VALUES (?, ?)`;
};
