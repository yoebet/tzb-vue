import {User} from "@/models/user";

export interface Department {

  orgId: string

  orgName: string

  users: User[]
}
