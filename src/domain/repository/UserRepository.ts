import User, { UserStatus } from "../models/User"
import { IApi } from "../util/Api"

export interface IUserRepository {
  getByPk: (pk: string | number) => Promise<GetUserDto | null>
  create: (dto: CreateUserDto) => Promise<GetUserDto>
  update: (dto: UpdateUserDto) => Promise<GetUserDto>
}

export type CreateUserDto = {
  email: string,
  emailVerified: boolean,
  providerName: string,
  providerType: string,
  providerUserId: string,
  providerDateCreated: string,
  lastSignedAt?: string,
}

export type UpdateUserDto = Partial<CreateUserDto> & { email: string }

export type GetUserDto = {
  id: string,
  email: string,
  emailVerified: boolean,
  createdAt: string,
  signUpProviderName: string,
  signUpProviderId: string,
  lastSignedIn: string,
  status: UserStatus,
  name?: string,
}

export const getUserDtosToUsers = (getUserDtos: GetUserDto[]): User[] => getUserDtos.map(dto => ({
  email: dto.email,
  emailVerified: dto.emailVerified,
  signUpProviderId: dto.signUpProviderId,
  signUpProviderName: dto.signUpProviderName,
  status: dto.status,
  createdAt: dto.createdAt,
  id: dto.id,
  lastSignedInAt: dto.lastSignedIn,
  name: dto.name,
}))

export class UserApiRepository implements IUserRepository {
  private api: IApi

  constructor(api: IApi) {
    this.api = api
  }

  getByPk(pk: string | number): Promise<GetUserDto | null> {
    return this.api.get(`/user/${pk}`)
  }

  create(dto: CreateUserDto): Promise<GetUserDto> {
    return this.api.post('/user', dto)
  }

  update(dto: UpdateUserDto): Promise<GetUserDto> {
    return this.api.patch(`/user/${dto.email}`, dto)
  }
}
