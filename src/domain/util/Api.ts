import axios from 'axios'

export interface IApi {
  baseUrl: string
  get: <T>(route: string) => Promise<T>
  post: <T>(route: string, body: object) => Promise<T>
  patch: <T>(route: string, body: object) => Promise<T>
}

export type ApiResponse<T> = {
  success: boolean
  data: T,
  error?: string
}

export default class AxiosApi implements IApi {
  baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  get<T>(route: string): Promise<T> {
    return this.callApi('get', route)
  }

  post<T>(route: string, body: object): Promise<T> {
    return this.callApi('post', route, body)
  }

  patch<T>(route: string, body: object): Promise<T> {
    return this.callApi('patch', route, body)
  }

  private async callApi<T>(
    methodName: 'get' | 'post' | 'put' | 'patch' | 'delete',
    route: string,
    body?: object
  ): Promise<T> {
    const url = `${this.baseUrl}${route}`
    let result: ApiResponse<T>
    if (body) {
      result = await axios[`${methodName}`](url, body)
    } else {
      result = await axios[`${methodName}`](url)
    }

    const { data, success, error } = result

    if (!success) throw new Error(error)

    return data
  }
}
