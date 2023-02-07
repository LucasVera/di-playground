import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth"
import { Auth, Hub } from "aws-amplify"
import { EventNames, IAuthProvider, ProviderSignInResult } from "../../domain/models/Auth"
import User from "../../domain/models/User"
import { IPubSub, Unsubscribe } from "../../domain/util/PubSub"

export type CognitoSignInData = {
  username: string,
  signInUserSession: {
    idToken: {
      jwtToken: string,
      payload: {
        sub: string,
        email_verified: boolean,
        identities: {
          userId: string,
          providerName: string,
          providerType: string,
          dateCreated: string
        }[]
        email: string,
      },
    },
    accessToken: {
      jwtToken: string,
      payload: {
        sub: string,
        exp: number,
        iat: number,
      }
    }
  },
}

export const cognitoUsersToUsers = (cognitoUsers: CognitoSignInData[]): User[] => cognitoUsers.map(cognitoUser => ({
  email: cognitoUser.signInUserSession.idToken.payload.email,
  emailVerified: cognitoUser.signInUserSession.idToken.payload.email_verified,
  createdAt: cognitoUser.signInUserSession.idToken.payload.identities[0].dateCreated,
  id: cognitoUser.signInUserSession.idToken.payload.identities[0].userId,
  signUpProviderId: cognitoUser.signInUserSession.idToken.payload.identities[0].userId,
  signUpProviderName: cognitoUser.signInUserSession.idToken.payload.identities[0].providerType,
  accessJwt: cognitoUser.signInUserSession.accessToken.jwtToken,
}))

type HubPayload = {
  event: string
  data?: any
  message?: string
}
function waitForEvent(eventName: string): Promise<HubPayload> {
  return new Promise((resolve, reject) => {

  })
}

export class GoogleAuthProvider implements IAuthProvider {
  type: string
  name: string
  authEventsPubSub: IPubSub

  constructor(authEventsPubSub: IPubSub) {
    this.name = 'Google'
    this.type = CognitoHostedUIIdentityProvider.Google
    this.authEventsPubSub = authEventsPubSub
  }

  signOut = async (): Promise<Unsubscribe> => {
    Auth.signOut()

    const cognitoEventName = 'signOut'
    const domainEventName = EventNames.SIGN_OUT

    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case cognitoEventName:
          this.authEventsPubSub.publish(domainEventName, payload)
          break
      }
    })

    return { unsubscribe }
  }

  signIn = async (): Promise<ProviderSignInResult> => {
    Auth.federatedSignIn({
      provider: this.type as CognitoHostedUIIdentityProvider
    })

    const { data } = await waitForEvent('signIn')

    const cognitoSignInData: CognitoSignInData = data
    const { payload: identityPayload } = cognitoSignInData.signInUserSession.idToken
    const { payload: { exp, iat, }, jwtToken: jwt, } = cognitoSignInData.signInUserSession.accessToken
    const [identity] = identityPayload.identities

    return {
      dateCreated: identity.dateCreated,
      userEmail: identityPayload.email,
      emailVerified: identityPayload.email_verified,
      userId: identity.userId,
      username: cognitoSignInData.username,
      token: {
        jwt,
        exp: exp,
        iat: iat
      }
    }
  }

  private addListenerToPubSub(eventName: string) {
    Hub.listen('auth', ({ payload }) => {
      console.log('arrived event from hub', payload)
      const { event } = payload
      switch (event) {
        case eventName:
          this.authEventsPubSub.publish(eventName, payload)
          return payload

        default:
          throw new Error(`No ${eventName} event received. Event received: ${event}. Data: ${JSON.stringify(payload.data)}`)
      }
    })
  }
}
