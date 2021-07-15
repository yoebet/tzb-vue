import {Department} from "@/models/department";

export async function getDepartments(): Promise<Department[]> {
  const response = await fetch('/api/user-organs')
  const deps: Department[] = await response.json()
  return Promise.resolve(deps)
}
