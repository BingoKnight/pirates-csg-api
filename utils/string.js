export function capitalize(str) {
    return str.split(' ').map(val =>
        val.charAt(0).toUpperCase() + val.slice(1)
    ).join(' ')
}

