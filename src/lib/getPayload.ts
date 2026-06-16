import { getPayload as _getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '@payload-config'

const emptyResult = { docs: [], totalDocs: 0, totalPages: 0, page: 1, pagingCounter: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null }

const stubPayload = {
  find: async () => emptyResult,
  findByID: async () => null,
  findGlobal: async () => ({}),
} as unknown as Payload

export async function getPayload() {
  if (!process.env.PAYLOAD_SECRET) return stubPayload
  try {
    return await _getPayload({ config })
  } catch {
    return stubPayload
  }
}
