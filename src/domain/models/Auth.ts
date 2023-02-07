import { IPubSub, Unsubscribe } from "../util/PubSub"

export interface IAuthProvider {
  type: string,
  name: string,
  authEventsPubSub: IPubSub
  signIn: () => Promise<ProviderSignInResult>
  signOut: () => Promise<Unsubscribe>
}
export type ProviderSignInResult = {
  username: string,
  userId: string,
  userEmail: string,
  emailVerified: boolean,
  dateCreated: string,
  token: AccessToken,
  unsubscribe: Unsubscribe,
}
export type AccessToken = {
  jwt: string,
  exp: number,
  iat: number,
}

export enum EventNames {
  SIGN_IN = 'signIn',
  SIGN_OUT = 'signOut',
}
