import { v4 as uuidv4 } from 'uuid'

import UserTable from '../schemas/user.js'


export async function registerUser(newUser) {
    return await UserTable.create(newUser)
}

export async function userList() {
    return await UserTable.find()
}

export async function getUserByUsername(username) {
    return await UserTable.findOne({ username }).select('+password')
}

export async function getUserByEmail(email) {
    return await UserTable.findOne({ email })
}

export async function updateUserToken(userId) {
    const token = uuidv4()
    await UserTable.updateOne({ _id: userId }, { token }, { upsert: true }).exec()
    return token
}

export async function getUserByToken(token) {
    return await UserTable.findOne({ token })
}

export async function deleteUserToken(user) {
    return await UserTable.updateOne({ _id: user._id }, { token: null }, { upsert: true }).exec()
}

