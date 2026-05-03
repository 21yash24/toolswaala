export function formatINR(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatINRCompact(amount) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`
  return formatINR(amount)
}

export function numberToWords(num) {
  if (num === 0) return 'Zero'
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

  function convert(n) {
    if (n < 20) return ones[n]
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '')
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + convert(n % 100) : '')
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '')
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '')
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '')
  }

  const rupees = Math.floor(num)
  const paise = Math.round((num - rupees) * 100)
  let result = convert(rupees) + ' Rupees'
  if (paise > 0) result += ' and ' + convert(paise) + ' Paise'
  result += ' Only'
  return result
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

export function formatDateLong(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

export function getFinancialYear(date = new Date()) {
  const d = new Date(date)
  const month = d.getMonth()
  const year = d.getFullYear()
  if (month >= 3) return `${year}-${(year + 1).toString().slice(2)}`
  return `${year - 1}-${year.toString().slice(2)}`
}

export function validateGSTIN(gstin) {
  const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
  return regex.test(gstin)
}

export function validateUPI(upiId) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/
  return regex.test(upiId)
}

export function validatePhone(phone) {
  const regex = /^(\+91)?[6-9]\d{9}$/
  return regex.test(phone.replace(/\s/g, ''))
}

export function getUsageCount(toolName) {
  const key = `tw_usage_${toolName}`
  const data = JSON.parse(localStorage.getItem(key) || '{"count":0,"month":""}')
  const currentMonth = new Date().toISOString().slice(0, 7)
  if (data.month !== currentMonth) return 0
  return data.count
}

export function incrementUsage(toolName) {
  const key = `tw_usage_${toolName}`
  const currentMonth = new Date().toISOString().slice(0, 7)
  const data = JSON.parse(localStorage.getItem(key) || '{"count":0,"month":""}')
  if (data.month !== currentMonth) {
    localStorage.setItem(key, JSON.stringify({ count: 1, month: currentMonth }))
    return 1
  }
  data.count += 1
  localStorage.setItem(key, JSON.stringify(data))
  return data.count
}

export function canUseFreeTier(toolName, limit = 5) {
  return getUsageCount(toolName) < limit
}

const API_BASE = import.meta.env.VITE_API_URL || ''

export async function apiPost(path, data) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res
}

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`)
  return res
}
