import { v4 as uuidv4 } from 'uuid'

import UserTable from '../schemas/user.js'


export async function registerUser(newUser) {
    return await UserTable.create(newUser)
}

export async function userList() {
    return await UserTable.find()
}

export async function getUserByUsername(username) {
    return await UserTable.findOne({ _queryUsername: username.toLowerCase() }).select('+password')
}

export async function getFullUser(user) {
    return await UserTable.findOne({ _id: user._id }).select('+password')
}

export async function getUserByEmail(email) {
    return await UserTable.findOne({ email })
}

export async function updateUserToken(user) {
    const token = uuidv4()
    await UserTable.updateOne({ _id: user._id }, { token }, { upsert: true }).exec()
    return token
}

export async function getUserByToken(token) {
    return await UserTable.findOne({ token })
}

// export async function deleteUserToken(user) {
//     return await UserTable.updateOne({ _id: user._id }, { token: undefined }, { upsert: true }).exec()
// }

export async function updateUserPassword(user, password) {
    return await UserTable.updateOne({ _id: user._id }, { password }, { upsert: true }).exec()
}

export async function updateUserEmail(user, email) {
    return await UserTable.updateOne({ _id: user._id }, { email }, { upsert: true }).exec()
}

