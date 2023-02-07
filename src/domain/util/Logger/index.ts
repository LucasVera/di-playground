import {
  ConsoleErrorTarget,
  ConsoleLogTarget,
  OtherConsoleTarget,
  LogTarget,
} from "./LogTarget"

interface ILogger {
  moduleName: string
  logMessage: (
    message: string,
    additionalInfoObj: object,
    logLevel: LogLevel
  ) => Promise<void[]>
}

export class Logger implements ILogger {
  public moduleName: string

  constructor(moduleName: string) {
    this.moduleName = moduleName
  }

  public logMessage(message: string, additionalInfoObj = {}, logLevel = LogLevel.INFO) {
    const targets: LogTarget[] = Logger.getLogTargets(logLevel)
    const logMsg = this.formatLogMessage(message, additionalInfoObj, logLevel)
    const promises = targets.map(target => target.saveInTarget(logMsg))
    return Promise.all(promises)
  }

  private formatLogMessage = (message: string, additionalInfoObj: object, logLevel: LogLevel): string => {
    const now = new Date().toISOString()
    const additionalInfo = JSON.stringify(additionalInfoObj)
    const level = logLevel.toUpperCase()
    return `${now} - ${level} - ${message} - Module name: ${this.moduleName} - ${additionalInfo}`
  }

  private static getLogTargets = (logLevel: LogLevel): LogTarget[] => {
    switch (logLevel) {
      case LogLevel.DEBUG:
        return [new ConsoleLogTarget()]

      case LogLevel.INFO:
        return [new ConsoleLogTarget(), new OtherConsoleTarget('./logs.txt')]

      case LogLevel.WARN:
        return [new ConsoleLogTarget(), new OtherConsoleTarget('./logs.txt')]

      case LogLevel.ERROR:
        return [new ConsoleErrorTarget(), new OtherConsoleTarget('./logs.txt')]

      case LogLevel.CRITICAL:
        return [new ConsoleErrorTarget(), new OtherConsoleTarget('./logs.txt')]

      default:
        throw new Error(`No log target found for log level "${logLevel}". Specify a valid log level`)
    }
  }
}

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
}
