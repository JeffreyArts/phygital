export interface StrapiHTTPHeader {
    "Content-Type": string;
    "Authorization"?: string;
}

export interface StrapiUser {
    id: number;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface StrapiAuthenticationError {
    message: string;
    type: string;
    details?: any;
}