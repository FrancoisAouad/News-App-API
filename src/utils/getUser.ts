import jwt from 'jsonwebtoken';
export function getUser(authHeader: string) {
    //split auth header to get bearer token
    const token: any = authHeader.split(' ')[1];
    //verify the token and decoded it using
    const decoded: any = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
    //get the id field from the decoded token
    const id: string = decoded.aud;
    //return the id value
    return id;
}
