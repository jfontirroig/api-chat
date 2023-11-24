/* @flow */

import sqlite3 from 'sqlite3'
import logger from 'winston'
const path = require('path')

export const MessageRecord = {}

const CREATE_MESSAGE = `CREATE TABLE message (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  messageUuid TEXT NOT NULL,
  messageUserId TEXT NOT NULL,
  messageTypeContract TEXT NOT NULL,
  messageNumberContract TEXT NOT NULL,
  messageDateTime TEXT NOT NULL,
  messageChat TEXT NOT NULL
 );`

 const CREATE_MESSAGE_INDEX = `CREATE INDEX message_index ON message(id);`
 const CREATE_MESSAGE_INDEX2 = `CREATE INDEX message_index2 ON message(id,messageTypeContract,messageNumberContract);`
 const CREATE_MESSAGE_INDEX3 = `CREATE INDEX message_index3 ON message(messageUuid);`

 const api_PAGE_SIZE = 100

function dbRun(db: sqlite3.Database, cmd: string, args ? : Array < Object > ): Promise < void > {
    if (!args) {
        args = []
    }
    return new Promise((resolve, reject) => {
        db.run(cmd, args, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

function dbAll(db: sqlite3.Database, cmd: string, args ? : Array < Object > ): Promise < Array < Object >> {
    if (!args) {
        args = []
    }
    return new Promise((resolve, reject) => {
        db.all(cmd, args, (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
}

function isInMemory(dbPath: string) {
    return dbPath.includes(':memory:')
}

export class RegistrarDB {
    dbLocation: string
    db: sqlite3.Database

    constructor(dbLocation: string) {
        if (isInMemory(dbLocation)) {
            this.dbLocation = dbLocation
        } else {
            const dbPath = path.resolve(__dirname, dbLocation)
            this.dbLocation = dbPath
        }
    }

    initialize(): Promise < void > {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.dbLocation, sqlite3.OPEN_READWRITE, (errOpen) => {
                if (errOpen) {
                    logger.warn(`No database found ${this.dbLocation}, creating`)
                    this.db = new sqlite3.Database(
                        this.dbLocation, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (errCreate) => {
                            if (errCreate) {
                                reject(`Failed to load database ${this.dbLocation}`)
                            } else {
                                logger.warn('Creating tables...')
                                this.checkTablesAndCreate()
                                    .then(() => resolve())
                            }
                        })
                } else {
                    return this.checkTablesAndCreate()
                        .then(() => resolve())
                }
            })
        })
    }

    async checkTablesAndCreate(): Promise < void > {
        const needsCreation = await this.tablesExist()
        if (needsCreation.length === 0) {
            return
        } else {
            logger.info(`Creating ${needsCreation.length} tables.`)
            await this.createTables(needsCreation)
        }
    }

    tablesExist() {
        return dbAll(this.db, 'SELECT name FROM sqlite_master WHERE type = "table"')
            .then(results => {
                const tables = results.map(x => x.name)
                const toCreate = []
                if (tables.indexOf('message') < 0) {
                    toCreate.push(CREATE_MESSAGE)
                    toCreate.push(CREATE_MESSAGE_INDEX)
                    toCreate.push(CREATE_MESSAGE_INDEX2)
                    toCreate.push(CREATE_MESSAGE_INDEX3)
                }

                return toCreate
            })
    }

    async createTables(toCreate: Array < string > ): Promise < void > {
        for (const createCmd of toCreate) {
            await dbRun(this.db, createCmd)
        }
    }

    async insertDB(messageUuid: string, messageUserId: string, messageTypeContract: string, messageNumberContract: string, messageDateTime: string, messageChat: string): Promise < void > {
        const dbCmd = 'INSERT INTO message ' +
            '(messageUuid,messageUserId,messageTypeContract,messageNumberContract,messageDateTime,messageChat) VALUES (?,?,?,?,?,?)'
        const dbArgs = [messageUuid,messageUserId,messageTypeContract,messageNumberContract,messageDateTime,messageChat]
        return await dbRun(this.db, dbCmd, dbArgs)
    }

    async selectDB(id: number, messageTypeContract: string,messageNumberContract: string): Promise < MessageRecord[] > {
        const dbCmd = 'SELECT id,messageUuid,messageUserId,messageTypeContract,messageNumberContract,messageDateTime,messageChat' +
            ' FROM message WHERE id > ? and messageUserId = ? and messageNumberContract = ?'
        const dbArgs = [id,messageTypeContract,messageNumberContract]
        const results: {
            id: number,
            messageUuid: string,
            messageUserId: string,
            messageTypeContract: string,
            messageNumberContract: string,
            messageDateTime: string,
            messageChat: string
        }[] = await dbAll(this.db, dbCmd, dbArgs)
        return results.map(x => {
            const out = {
                id: x.id,
                messageUuid: x.messageUuid,
                messageUserId: x.messageUserId,
                messageTypeContract: x.messageTypeContract,
                messageNumberContract: x.messageNumberContract,
                messageDateTime: x.messageDateTime,
                messageChat: x.messageChat
            }
            return out
        })
    }

    async deleteDB(messageUuid: string ): Promise < void > {
        const dbCmd = 'DELETE FROM message WHERE messageUuid = ?'
        const dbArgs = [messageUuid]
        return await dbRun(this.db, dbCmd, dbArgs)
    }

    shutdown(): Promise < void > {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
            this.db = undefined
        })
    }
}
