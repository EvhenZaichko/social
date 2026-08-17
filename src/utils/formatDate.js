// Короткий, твиттер-подобный формат даты поста.
// Свежее -> относительно ("5 мин", "3 ч"), старое -> "31 июл" / "31 июл 2025".
export function formatPostDate(input) {
    if (!input) return ''
    const d = new Date(input)
    if (isNaN(d.getTime())) return ''

    const diffSec = Math.floor((Date.now() - d.getTime()) / 1000)

    if (diffSec < 60)     return 'just now'
    if (diffSec < 3600)   return `${Math.floor(diffSec / 60)} min`
    if (diffSec < 86400)  return `${Math.floor(diffSec / 3600)} h`
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)} d`

    const sameYear = d.getFullYear() === new Date().getFullYear()
    return d.toLocaleDateString('ENG', {
        day: 'numeric',
        month: 'short',
        ...(sameYear ? {} : { year: 'numeric' }),
    })
}


