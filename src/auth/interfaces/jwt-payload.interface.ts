export interface JwtPayload {
    id: string;
    sub?: number;
    iat?: number;
    exp?: number;
}