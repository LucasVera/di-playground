import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth'
import { Auth } from 'aws-amplify'
import { Navigate } from 'react-router-dom'
import useAuth from '../../common/hooks/useAuth'
import styles from './Home.module.css'

export default function Home() {
  const { user, isFetchingAuth, signIn } = useAuth()

  if (isFetchingAuth) return <p>Loading...</p>

  if (user?.email) return <Navigate to='/' />

  return (
    <div className={styles.container}>
      <div className={styles.boxContainer}>
        <p className={styles.title}>Unknown Neian</p>
        <p className={styles.welcomeText}></p>
        <div className={styles.buttonContainer}>
          <button onClick={() => signIn()}>Google sign in</button>
        </div>
      </div>
    </div>
  )
}
