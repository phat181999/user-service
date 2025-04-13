export interface GoogleUser {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
    accessToken: string;
    refreshToken: string;
}
  

export interface GitHubUser {
    username: string;
    email: string;
    avatar: string;
    accessToken: string;
}
  

export interface GetUserLogin {
    access_token: string; 
    refresh_token: string;  
    expires_in: number;      
    refresh_expires_in: number; 
}
  