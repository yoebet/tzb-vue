import {User} from "@/models/user";

export interface Department {

  orgId: number

  orgName: string

  users: User[]
}
