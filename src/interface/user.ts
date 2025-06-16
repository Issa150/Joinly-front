// export interface UserLoginInterface {
//     email: string;
//     firstname : string;
// }

export interface SigninFormInterface {
    email: string;
    password: string;
}

// l'interface ci-dessous est utilisé dans la page "my_profile"
export interface UserProfileType {
    // id: number;
    firstname: string;
    lastname: string;
    role: string;
    email: string;
    // activatedNotification: string | null;
    profileImg: string ;
}