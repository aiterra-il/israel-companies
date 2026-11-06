export type Tone = 'active' | 'caution' | 'ended' | 'unknown'
export type Violation = 'none' | 'warning' | 'violator'

export interface Company {
  number: string
  name: string
  englishName: string
  type: string
  typeLabel: string
  status: string
  tone: Tone
  subStatuses: string[]
  violation: Violation
  description: string
  purpose: string
  founded: string
  government: boolean
  limitedLiability: boolean
  lastReportYear: number | null
  address: { street: string; city: string; zip: string; country: string }
  careOf: string
  poBox: string
}

export interface CorporatePrefix {
  prefix: string
  label: string
  english: string
}

export type NumberCheck =
  | { valid: true; number: string }
  | {
      valid: false
      reason: 'empty' | 'not-digits' | 'length' | 'checksum' | 'not-a-company'
      message: string
      entity?: CorporatePrefix | null
    }

export interface StatusEntry {
  status: string
  tone: Tone
  text: string
}

export interface RequestOptions {
  signal?: AbortSignal
  timeoutMs?: number
  fetch?: typeof fetch
}

export interface SearchOptions extends RequestOptions {
  limit?: number
}

export type LookupErrorCode = 'invalid-number' | 'network' | 'timeout' | 'blocked' | 'server' | 'format'

export declare class CompanyLookupError extends Error {
  code: LookupErrorCode
}

export declare const COMPANIES_RESOURCE_ID: string
export declare const DATA_API: string
export declare const DATASET_URL: string
export declare const COMPANY_PREFIXES: string[]
export declare const corporatePrefixes: CorporatePrefix[]
export declare const statusCatalog: StatusEntry[]
export declare const violationCatalog: Record<'violator' | 'warning', { label: string; text: string }>

export declare function isValidIsraeliId(value: string | number): boolean
export declare function entityOf(number: string | number): CorporatePrefix | null
export declare function checkCompanyNumber(value: string | number): NumberCheck
export declare function statusInfo(status: string): StatusEntry
export declare function typeInfo(type: string): { label: string; english: string }
export declare function cleanText(value: unknown): string
export declare function toCompany(record: Record<string, unknown>): Company
export declare function buildNameQuery(raw: string): { field: string; tsquery: string } | null
export declare function getCompany(number: string | number, options?: RequestOptions): Promise<Company | null>
export declare function searchCompanies(name: string, options?: SearchOptions): Promise<Company[]>
export declare function getDataDate(options?: RequestOptions): Promise<Date | null>
