import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/database'
import Cookies from 'js-cookie';
import sha256 from 'crypto-js/sha256'

export class webAuth {

    EmailSignUp = async (email, pass) => {

        const response = await firebase.auth().createUserWithEmailAndPassword(email, pass);
        const user = response.user
        console.log(`RESPONSE :: ${user} `);
        return user
    }

    EmailLogin = async (email, pass) => {
        try {
            const response = await firebase.auth().signInWithEmailAndPassword(email, pass);
            const user = response.user
            // alert('Resp : ' + user);
            return user
        } catch (ex) {
            alert(ex)
        }
    }

    AnonymousLogin = async () => {
        const response = await firebase.auth().signInAnonymously();
        const Id = response.user.uid
        return { userId: Id }
    }

    googleLogin = async () => {
        var provider = new firebase.auth.GoogleAuthProvider()
        var result = await firebase.auth().signInWithPopup(provider)
        return result.user
    }

    setLoginSession = async (email, password) => {
        // executed after successful login
        var authSha = sha256(`${email}___${password}`)  // 3 underscores
        try {
            await firebase.database().ref(`sessions/${authSha}`).update({ email: email, password: password })
        } catch (ex) {
            alert(ex)
        }

        // alert('update successful')
        Cookies.set('sessionEncSha256', authSha)
        return { success: true }
    }

    getLoginSession = async () => {
        var loginInfo = {}
        var sha256 = Cookies.get('sessionEncSha256')

        await this.AnonymousLogin()

        var resp = await firebase.database().ref(`sessions/${sha256}`).once('value')
        loginInfo = resp.val()
        if (loginInfo) {
            let user
            if (!loginInfo.email) console.warn('login session has expired')
            if (!loginInfo.email) return { error: 'Session expired or not found' }
            if (loginInfo.email) user = await this.EmailLogin(loginInfo.email, loginInfo.password)
            return user
        } else {
            return { error: 'Session expired or not found' }
        }
    }

    removeLoginSession = (email, password) => {
        var authSha = sha256(`${email}___${password}`)  // 3 underscores
        firebase.database().ref(`/sessions/${authSha}`).remove()
    }
}
