import {User} from "@/models/user";

export interface Organ {

  id: string

  orgName: string

  orgid: string

  orgcode: string

  superid: string

  users: User[]

  // ---

  label?: string

  children?: Organ[]

  usersCount?: number
}
