import { connection } from "../database";
import { Employee } from "../schemas/employee/types";

export async function findById(id: number) {
  const result = await connection.query<Employee, [number]>("SELECT * FROM employees WHERE id=$1", [
    id,
  ]);

  return result.rows[0];
}
