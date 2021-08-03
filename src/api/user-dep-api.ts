import {Organ} from "@/models/organ";
import {API_BASE_PATH} from "@/config";

export async function getDpCu(): Promise<Organ[]> {
  const response = await fetch('/dp/iService/beafService/userinfo')
  const dcu = await response.json()
  // console.log('dcu: ' + dcu)
  return Promise.resolve(dcu)
}

export async function getCu(): Promise<Organ[]> {
  const response = await fetch(API_BASE_PATH + '/api/t/cu')
  const cu = await response.json()
  // console.log('cu: ' + cu)
  return Promise.resolve(cu)
}

export async function getDepartments(): Promise<Organ[]> {
  const response = await fetch(API_BASE_PATH + '/api/user-organs')
  const deps: Organ[] = await response.json()
  return Promise.resolve(deps)
}
