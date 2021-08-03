import {User} from "@/models/user";

export interface Organ {

  id: string

  orgName: string

  orgid: string

  orgcode: string

  users: User[]
}
