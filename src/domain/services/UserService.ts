import { EventNames, IAuthProvider } from "../models/Auth"
import User from "../models/User"
import { getUserDtosToUsers, IUserRepository } from "../repository/UserRepository"
import { Unsubscribe } from "../util/PubSub"

type SignOutEventPayload = {}
type SignInEventPayload = {}

export interface IUserService {
  repository: IUserRepository
  authProvider: IAuthProvider
  signIn: () => Promise<User>
  signOut: () => Promise<Unsubscribe>
  getSignedInUser: () => User | undefined
  setSignedInUser: (user: User | undefined) => void
}

export class UserService implements IUserService {
  repository: IUserRepository
  authProvider: IAuthProvider

  private _signedInUser: User | undefined

  constructor(repository: IUserRepository, authProvider: IAuthProvider) {
    this.repository = repository
    this.authProvider = authProvider
  }

  getSignedInUser(): User | undefined {
    return this._signedInUser
  }
  setSignedInUser(user: User | undefined): void {
    this._signedInUser = user
  }

  async signIn(): Promise<User> {
    const {
      dateCreated,
      emailVerified,
      token,
      userEmail,
      userId,
    } = await this.authProvider.signIn()

    const dto = await this.repository.getByPk(userEmail)
    if (dto) {
      await this.repository.update({
        email: userEmail,
        lastSignedAt: new Date().toISOString()
      })

      const user = getUserDtosToUsers([dto])[0]
      user.accessJwt = token.jwt
      return user
    }

    const newUserDto = await this.repository.create({
      email: userEmail,
      emailVerified,
      providerDateCreated: dateCreated,
      providerName: this.authProvider.name,
      providerType: this.authProvider.type,
      providerUserId: userId,
      lastSignedAt: new Date().toISOString()
    })

    const user = getUserDtosToUsers([newUserDto])[0]
    user.accessJwt = token.jwt
    this.setSignedInUser(user)

    return user
  }

  async signOut(): Promise<Unsubscribe> {
    const unsubscribe = await this.authProvider.signOut()
    this.authProvider.authEventsPubSub.subscribe({
      callback: (_payload: SignOutEventPayload) => {
        this.setSignedInUser(undefined)
      },
      eventName: EventNames.SIGN_OUT
    })

    return unsubscribe
  }
}
