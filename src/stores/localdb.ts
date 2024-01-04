import { defineStore } from "pinia"
import PouchDB from "pouchdb-browser"
import _ from "lodash"
const db = new PouchDB("local-db")


export const localDB = defineStore({
    id: "localDB",
    state: () => ({
        updated: 0,
        document: {
            _id: "main",
            _rev: ""
        }
    }),
    actions: {
        update() {
            return new Promise((resolve, reject) => {
                const doc = _.merge({},_.pick( this.document, ["_id", "_rev"]))
                db.put(doc).then((res) => {
                    this.document._rev = res.rev
                    resolve(this.document)
                    this.updated++
                }).catch(reject)
            })
        },
        load() {
            return new Promise((resolve, reject) => {
                db.allDocs({
                    include_docs: true,
                    attachments: true
                }).then((result) => {
                    if (result.rows.length >= 1) {
                        _.merge(this.document,_.pick( result.rows[0].doc, ["_id", "_rev"]))
                    }
                    return resolve(this.document)
                }).catch(reject)

            })
        },
    },
    getters: {
    }
}) as any 

export default localDB