import config from "../common/config.js"

export function setCookie(res, key, value) {
    return res.cookie(key, value, { maxAge: 60 * 60 * 24 * 7 * 1000, domain: config.DOMAIN })
}

