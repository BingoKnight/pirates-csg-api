import UserTable from '../schemas/user.js'


export async function registerUser(newUser) {
    const { username, email } = newUser
    return await UserTable.create({name: username, email})
        .catch(err => console.log(err))

}

export async function userList() {
    return await UserTable.find()
}

// TODO: update to be a better method than username lookup
export async function getUser(username) {
    return await UserTable.findOne({username})
}
