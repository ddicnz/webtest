import { CognitoUserPool } from 'amazon-cognito-identity-js'

export const cognitoConfig = {
  userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'ap-southeast-2_VdDTcERww',
  clientId: import.meta.env.VITE_COGNITO_APP_CLIENT_ID || '2vujod0mbap7281u119visqv75',
}

export const userPool = new CognitoUserPool({
  UserPoolId: cognitoConfig.userPoolId,
  ClientId: cognitoConfig.clientId,
})

export function getCurrentCognitoSession() {
  return new Promise((resolve, reject) => {
    const currentUser = userPool.getCurrentUser()
    if (!currentUser) {
      reject(new Error('当前登录已失效，请重新登录'))
      return
    }

    currentUser.getSession((error, session) => {
      if (error || !session?.isValid()) {
        reject(error || new Error('当前登录已失效，请重新登录'))
        return
      }
      resolve(session)
    })
  })
}
