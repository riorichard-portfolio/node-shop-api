export interface AuthUsecase {
    /**
    * @returns JWT token if login successful, null otherwise
    */
    login(email: string, password: string): Promise<string | null>
    /**
    * @returns [success status, detail message] - [true, "Registration successful"] or [false, "Error description"]
    */
    register(email: string, password: string, fullName: string): Promise<[boolean, string]>
    /**
    * @returns [newToken, detail] - [new JWT token if successful, operation detail message]
    */
    refreshToken(oldToken: string): Promise<[string | null, string]>
}