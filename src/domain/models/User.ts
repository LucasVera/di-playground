export default class User {
  email: string
  signUpProviderName: string
  signUpProviderId: string
  emailVerified: boolean
  status?: UserStatus
  name?: string
  id?: string | undefined
  createdAt?: string | undefined
  lastSignedInAt?: string
  accessJwt?: string

  constructor(
    email: string,
    signUpProviderName: string,
    signUpProviderId: string,
    emailVerified: boolean,
    status?: UserStatus,
    name?: string,
    id?: string,
    createdAt?: string,
    lastSignedInAt?: string,
    accessJwt?: string
  ) {
    this.email = email
    this.signUpProviderName = signUpProviderName
    this.signUpProviderId = signUpProviderId
    this.emailVerified = emailVerified
    this.status = status
    this.name = name
    this.id = id
    this.createdAt = createdAt
    this.lastSignedInAt = lastSignedInAt
    this.accessJwt = accessJwt
  }
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

