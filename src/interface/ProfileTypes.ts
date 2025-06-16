export interface UpdateProfileType {
    firstname?: string;
    lastname?: string;
    role?: Role | undefined;
    image?: string | null; // Optional image field
}

export interface SimpleProfileType {
    firstname: string;
    role: Role ;
    profileImg: string ; 
}

export enum Role {
    PARTICIPANT = 'PARTICIPANT',
    ORGANIZER = 'ORGANIZER'
}


export interface ChangePasswordType {
    oldPassword: string;
    newPassword: string;
}


export interface ChangeEmailType {
    newEmail: string;
    password: string;
}