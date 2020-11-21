class UserSession {

    userId: number
    socket: any

    public static async asyncConstructor(userId: number, socket: any) {

        // Fetch data to validate user

        const session = new UserSession(userId, socket)

        return session
    }

    public get valid() {

        // Have the user submit a token to authenticate their channel connection

        return true
    }

    private constructor(userId: number, socket: any) {
        this.userId = userId
        this.socket = socket
    }
}

export default UserSession