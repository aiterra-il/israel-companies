import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  buildNameQuery,
  checkCompanyNumber,
  cleanText,
  getCompany,
  isValidIsraeliId,
  searchCompanies,
  toCompany,
} from './index.js'

const LIVE = process.env.LIVE === '1'

test('israeli id checksum', () => {
  assert.equal(isValidIsraeliId('520000118'), true)
  assert.equal(isValidIsraeliId('52-000011-8'), true)
  assert.equal(isValidIsraeliId('520000119'), false)
  assert.equal(isValidIsraeliId('000000000'), false)
})

test('company number check explains what is wrong', () => {
  assert.deepEqual(checkCompanyNumber('520000118'), { valid: true, number: '520000118' })
  assert.equal(checkCompanyNumber('').reason, 'empty')
  assert.equal(checkCompanyNumber('12345').reason, 'length')
  assert.equal(checkCompanyNumber('520000119').reason, 'checksum')
  assert.equal(checkCompanyNumber('123456782').reason, 'not-a-company')
})

test('registry text is cleaned', () => {
  assert.equal(cleanText('בנק הפועלים בע~מ'), 'בנק הפועלים בע״מ')
})

test('name query drops the ltd suffix and prefix-matches the last word', () => {
  assert.deepEqual(buildNameQuery('טבע תעשיות בע"מ'), { field: 'שם חברה', tsquery: 'טבע & תעשיות:*' })
  assert.equal(buildNameQuery('Teva Ltd').field, 'שם באנגלית')
  assert.equal(buildNameQuery('א'), null)
})

test('record mapping', () => {
  const company = toCompany({
    'מספר חברה': 520000118,
    'שם חברה': 'בנק הפועלים בע~מ',
    'סוג תאגיד': 'ישראלית חברה ציבורית',
    'סטטוס חברה': 'פעילה',
    'מפרה': 'מפרה',
    'תאריך התאגדות': '15/05/1921',
    'מגבלות': 'מוגבלת',
  })
  assert.equal(company.typeLabel, 'חברה ציבורית')
  assert.equal(company.founded, '1921-05-15')
  assert.equal(company.tone, 'caution')
  assert.equal(company.limitedLiability, true)
})

test('live lookup by number', { skip: !LIVE }, async () => {
  const company = await getCompany('520000118')
  assert.equal(company.name, 'בנק הפועלים בע״מ')
})

test('live search by name', { skip: !LIVE }, async () => {
  const companies = await searchCompanies('טבע תעשיות פרמצבטיות')
  assert.ok(companies.some((company) => company.number === '520013954'))
})
