import jwt from 'jsonwebtoken';


export const genarateTokens = (user: any) => {
    const accessToken = jwt.sign(
        { data: user },
        process.env.SECRET_TOKEN as any,
        { expiresIn: '1h' } 
    );
    return accessToken;
}


export const refreashToken = (user: any) => {
    const refreashTokens = jwt.sign(
        { data: user },
        process.env.REFRESH_TOKEN_SECRET as any,
        { expiresIn: '7d' } 
    );
    return refreashTokens;
}