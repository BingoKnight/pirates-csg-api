import config from "../common/config.js"

export function setCookie(res, key, value) {
    return res.cookie(key, value, { maxAge: 86400, domain: config.DOMAIN })
}

