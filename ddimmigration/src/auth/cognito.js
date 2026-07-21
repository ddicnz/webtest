import { CognitoUserPool } from 'amazon-cognito-identity-js'

export const cognitoConfig = {
  userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'ap-southeast-2_VdDTcERww',
  clientId: import.meta.env.VITE_COGNITO_APP_CLIENT_ID || '2vujo0bmap7281u119visqv75',
}

export const userPool = new CognitoUserPool({
  UserPoolId: cognitoConfig.userPoolId,
  ClientId: cognitoConfig.clientId,
})

