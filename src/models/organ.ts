import {User} from "@/models/user";

export interface Organ {

  id: string

  orgName: string

  orgid: string

  orgcode: string

  superid: string

  users: User[]

  // ---

  layer?: number

  label?: string

  indentLabel?: string

  children?: Organ[]

  usersCount?: number
}
