import { useEffect, useState } from "react"
import User from "../../domain/models/User"
import { UserService } from "../../domain/services/UserService"
import { UserApiRepository } from "../../domain/repository/UserRepository"
import AxiosApi from "../../domain/util/Api"
import { GoogleAuthProvider } from "../aws/cognito"
import { Logger } from "../../domain/util/Logger"

const {
  USER_API_URL = 'http://localhost:3000'
} = process.env

const userService = new UserService(
  new UserApiRepository(new AxiosApi(USER_API_URL)),
  new GoogleAuthProvider()
)
const logger = new Logger('useAuth hook')
export default function useAuth() {
  const [user, setUser] = useState({} as User)
  const [isFetchingAuth, setIsFetchingAuth] = useState(true)

  const getCurrentUser = () => {
    setIsFetchingAuth(true)
    const signedInUser = userService.getSignedInUser()
    setUser(signedInUser ?? {} as User)
    setIsFetchingAuth(false)
  }

  const signOut = async () => {
    setIsFetchingAuth(true)
    await userService.signOut()
    setUser({} as User)
    setIsFetchingAuth(false)
  }

  const signIn = async () => {
    setIsFetchingAuth(true)
    const user = await userService.signIn()
    setUser(user)
    setIsFetchingAuth(false)
  }

  useEffect(() => {
    const unsubscribe = Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
          setUser(cognitoUserToUser(data))
          break
        case 'signOut':
          setUser({} as User)
          break
        case 'customOAuthState':
          logMessage('custom oauth state', data)
          break
        default:
          logMessage('unknow event', event)
      }
    })

    getCurrentUser()
  }, [])

  return { user, isFetchingAuth, signOut, signIn }
}
