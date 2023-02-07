import { Logger } from "./Logger"

export interface IPubSub {
  subscribers: { [eventName: string]: Subscriber[] }
  subscribe: (subscriber: Omit<Subscriber, 'id'>) => Unsubscribe
  publish: (eventName: string, payload: object) => void
}

export type Subscriber = {
  id: string,
  eventName: string
  callback: (payload: object) => any,
}
export type Unsubscribe = {
  unsubscribe: () => void
}

export class CustomPubSub implements IPubSub {
  private readonly logger = new Logger('Custom PubSub Implementation Class')

  subscribers: { [eventName: string]: Subscriber[] }

  constructor() {
    this.subscribers = {}
  }

  subscribe(subscriberInput: Omit<Subscriber, 'id'>): Unsubscribe {
    const {
      callback,
      eventName,
    } = subscriberInput
    if (!Array.isArray(this.subscribers[eventName])) this.subscribers[eventName] = []

    const subscriberId = `${new Date().valueOf()}-${(Math.random() * 10000).toFixed(0)}`

    const subscriber: Subscriber = {
      eventName,
      callback,
      id: subscriberId,
    }

    this.subscribers[eventName].push(subscriber)

    return {
      unsubscribe: () => {
        const subscriberIndex = this.subscribers[eventName].findIndex(sub => sub.id === subscriberId)
        if (subscriberIndex === -1) return

        this.subscribers[eventName].splice(subscriberIndex, 1)
      }
    }
  }

  publish(eventName: string, payload: object) {
    if (!Array.isArray(this.subscribers[eventName])) {
      this.logger.logMessage(`No subscribers in event name ${eventName}`)
      return
    }

    this.subscribers[eventName].forEach(({ callback }) => callback(payload))
  }
}
