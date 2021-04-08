import dotenv from 'dotenv'
dotenv.config()
const admin = require('firebase-admin');
const {firestore} = require('firebase-admin')


admin.initializeApp({
    credential: admin.credential.cert({
        type: process.env.TYPE,
        project_id: process.env.PROJECT_ID,
        private_key_id: process.env.PRIVATE_KEY_ID,
        private_key: process.env.PRIVATE_KEY,
        client_email: process.env.CLIENT_EMAIL,
        client_id: process.env.CLIENT_ID,
        auth_uri: process.env.AUTH_URI,
        token_uri: process.env.TOKEN_URI,
        auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    }
    )
});

// admin.initializeApp({
//     credential: admin.credential.cert({
//         type: "service_account",
//         project_id: "iotbaseonfabric",
//         private_key_id: "323a168fd4bde94b37630917940719c89be25a25",
//         private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5hwp/XybeYkgM\ng1LWK+lns7lPAEwm4MyIAtrk5Guki7e9Tgck9SOosPNZFSte/RD5IywFUJBR06Hi\ntmm/EHz/MbowFEl9evi6xAF0k3rkk3XGl/VhM7Un88xXXJtYw7+cFIThUDm7VpvE\ngsD3L5pH9GRaBGcsKj0+nfXSz0BMLxqkaAXC+d8gX1YGLvaEzY64bxEK4nT2KGTF\nQ2mEwen7BLbVVvNJiQzv+y3yo/WIKFA99Vu26OMc17PtkhZYJq4TJ+m5zGgaj+8V\nYs+DcUTtOmxtHFX+zFyC05E6xkbEnh4xV6UB4TFMqrG60N8X3hVJ+F11QA7ChO4I\nW6bv4Y/VAgMBAAECggEAO17kNJuSGDNyZBK4dRJLWKTShd4OAJkKyvHC8+HHMrqF\ne56XObP7C9ZIobbdEMJCZr/jK/Y6oPztPtxqHbscjRvwPceYNwAdzcLAxnoVp0Ur\nOPjTDR6bd+QUfdaEXhUSYdPNLD9coj9WjL3dG51PrXwfixECpUcFH180Vhh9toMG\n1qUhfVU1qIIy7BnT+1dqzpyPgaqEUsKnNALOg6cCAoTI9ctAJZuaDGk8qMSmUEO3\nuYZWcthkZoTxal21xASL8zkmE9nXzlsrIt+2ziN9oJxgv1vlY8sAspnu1DiuNHy3\nBHqPQ/IYn1NC8QBmvQ5ev1TM34l19EQvErtrkCqAVwKBgQDi00aYr0LozkUSCUmf\n7sammooBifbTigGtBmn9IzNSawl+A7v7ciZMh0nNLQlVISVoD96XgI9uRwULLAPs\nQKxmDrS0CGw3emTH+ojFn8Lr9GVrdRGwshWpPqsVdEtK+fq+apDHt9W2FuI2XuZ6\nylgAz/zF0/E6i5I1ArwlRLXwRwKBgQDRY/G0Ciq0NsYp9cU0Jki/HWua1muY3MMh\nvQGKIoQ27f3tCkPhwWeszJMqidygO4gUXt186xFqvdhfZDeTh0EnzR3wFeWcWfHy\ngCk7YdyZxl1HSAXNhIROVfpcu36V2nVvX7wrJ3jD0Kj99wf3EuahH3vGpTENKT6k\njYFm2yjJAwKBgQDRAST34+afZhG3AN/agsaBFb08lcfePDg3GsXm/tx3gTGJ8B7z\nHsezlKWobWtACf7R2G2e5FNFpiM7nB8xPpaco8hWa7xrklfy/SOyFfgiO1yIm6Ll\nUfMrtBco+bO3LoihlMg7f2VpF8TxnJh7ZJ+agAvGrfiFnb3nItIC9UFAWQKBgFn8\nrtJmECY06AL+aYrY7SidNzJq9gDS11V3ieLYpKOKsjcd00CBQtIDdTex2cxO6VN/\n1YYq6+hIwGV2h1/yn7DAOR6F+pCwIwfJxm6LxyebFVld/YhubAHSd29E8MjsAs4j\ngZW2N/NHiGjkslqfl9gk1KfxNFxonlBPtA4FH8kLAoGAYddH3oY+j+AU0+eN3MV6\nvR3XDklxVg1luWaIT61EppWHubt2sTEXLLz1e9PDi0DGUD1yp4DVXmOUxwI8dpka\ngS85eh9w3veoq24gCCbzMeFMHuGnfaR6c7X/IisvvFRi9jJQmqMhAzVNrMmDI2nK\nQvgUyDfp2N/fIR73RBHSgZM=\n-----END PRIVATE KEY-----\n",
//         client_email: "firebase-adminsdk-d5laq@iotbaseonfabric.iam.gserviceaccount.com",
//         client_id: "111804486971291738056",
//         auth_uri: "https://accounts.google.com/o/oauth2/auth",
//         token_uri: "https://oauth2.googleapis.com/token",
//         auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//         client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-d5laq%40iotbaseonfabric.iam.gserviceaccount.com"
//     }
//     )
// });

export const firebase = admin
export const db = admin.firestore();
// export const auth = admin.auth()