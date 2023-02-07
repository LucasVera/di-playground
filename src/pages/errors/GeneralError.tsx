import { Link } from 'react-router-dom'

export default function GeneralError() {
  return (
    <>
      <h1>Unexpected Error :(</h1>
      <Link to='/'>Go to home</Link>
    </>
  )
}
