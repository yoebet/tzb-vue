import {Department} from "@/models/department";
import {API_BASE_PATH} from "@/config";

export async function getDepartments(): Promise<Department[]> {
  const response = await fetch(API_BASE_PATH + '/api/user-organs')
  const deps: Department[] = await response.json()
  return Promise.resolve(deps)
}
