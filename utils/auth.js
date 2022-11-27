import passport from 'passport'

export function auth() {
    return passport.authenticate('bearer', { session: false })
}

