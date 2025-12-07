const weights = [2,3,4,5,6,7,8,9,2,3,4,5]

function normalize(input) {
  let s = String(input).trim().toUpperCase()
  s = s.replace(/^CN/, '')
  return s
}

function computeCheckDigit(number12) {
  if (!/^\d{12}$/.test(number12)) return null
  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += Number(number12[i]) * weights[i]
  }
  const remainder = sum % 11
  if (remainder === 10) return 'X'
  return String(remainder)
}

function verify(appNo) {
  const s = normalize(appNo)
  const m = s.match(/^(\d{12})\.(\d|X)$/)
  if (!m) {
    return { input: appNo, valid: false, reason: 'format_invalid' }
  }
  const number12 = m[1]
  const given = m[2]
  const calc = computeCheckDigit(number12)
  const typeDigit = number12[4]
  const typeValid = ['1','2','3','8','9'].includes(typeDigit)
  return {
    input: appNo,
    normalized: `${number12}.${given}`,
    calc,
    given,
    match: calc === given,
    typeDigit,
    typeValid
  }
}

function main() {
  const inputs = process.argv.slice(2)
  if (inputs.length === 0) {
    console.log('Usage: node scripts/verify-cn-patent.cjs <CN2024xxxxxxx.x> ...')
    process.exit(1)
  }
  const results = inputs.map(verify)
  console.log(JSON.stringify(results, null, 2))
}

main()
