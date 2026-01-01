export interface ILogin{
email:string;
password:string
}
export interface IRegister{
    phoneNumber:string,
    email:string,
    password:string,
    confirmPassword:string,
    country:string,
    profileImage:File|null,
    userName:string,
    role?:string
}