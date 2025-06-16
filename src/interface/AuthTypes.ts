export interface SignUpFormInterface {
    lastname: string;
    firstname: string;
    email: string;
    role: "PARTICIPANT" | "ORGANIZER";
    password: string;
    confirmPassword: string;
}


export interface LoginSuccessResponse  {
    accessToken: string;
    refreshToken: string;
}

export interface NotActivatedAccountResType {
    message: string;
    email: string;
    error: string;
}

export type LoginResponse = LoginSuccessResponse | NotActivatedAccountResType;