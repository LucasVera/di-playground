export interface LogTarget {
  type: LogTargetType,
  saveInTarget: (msg: string) => Promise<void>
}

export enum LogTargetType {
  CONSOLE = 'console',
  FILE = 'file',
  // In the future, cloud-based logger
}

export class ConsoleLogTarget implements LogTarget {
  type = LogTargetType.CONSOLE

  async saveInTarget(msg: string): Promise<void> {
    console.log(msg)
  }
}

export class ConsoleErrorTarget implements LogTarget {
  type = LogTargetType.CONSOLE

  async saveInTarget(msg: string): Promise<void> {
    console.error(msg)
  }
}

export class OtherConsoleTarget implements LogTarget {
  type = LogTargetType.FILE
  private filePath: string

  constructor(filePath: string) {
    this.filePath = filePath
  }

  saveInTarget = async (msg: string): Promise<void> => new Promise((resolve) => {
    console.log('File path', this.filePath, msg)
    resolve()
  })
}
