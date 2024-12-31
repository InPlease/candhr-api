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
  accept_terms_conditions
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
};

export const getRoleQuery = (id: number): string => {
  return `SELECT name FROM roles WHERE id = ${id} LIMIT 1;`;
};

export const createVerificationCode = (idType: string) => {
  return `INSERT INTO verification_codes (${idType}, verification_code, verification_type_id) VALUES (?, ?, ?);`;
};

export const userExistsQuery = `
SELECT 1 FROM recruiters 
WHERE email = ? OR phone_number = ?
LIMIT 1;
`;

export const getCreatedAtVerificationCode = (
  column: string,
  uuid: string,
  code: string,
  type: number,
) => {
  return `SELECT created_at FROM verification_codes WHERE ${column} = "${uuid}" AND verification_code = ${code} AND verification_type_id = ${type};`;
};

export const deleteVerificationCode = (
  column: string,
  uuid: string,
  code: string,
) => {
  return `DELETE FROM verification_codes WHERE ${column} = "${uuid}" AND verification_code = ${code};`;
};

export const deleteExpiredCodes = `DELETE FROM verification_codes
WHERE expires_at < CURRENT_TIMESTAMP;`;

export const checkIfCodeExistByUuidAndType = (column: string) => {
  return `SELECT 1 FROM verification_codes WHERE verification_type_id = ? AND ${column} = ?;`;
};
