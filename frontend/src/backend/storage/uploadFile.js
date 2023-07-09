import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'
import Cookies from 'js-cookie';
import sha256 from 'crypto-js/sha256.js'
// import fetch from 'node-fetch'

export class Storage {

    uploadImage = async (picPath, type, image) => {

        if (!image || !picPath) console.error(`file path or file data is missing`)
        if (!image || !picPath) return { error: 'file path or file data is missing', success: false }

        var ref = firebase.storage().ref(picPath)

        var metadata = { contentType: type, public: true }

        await ref.put(image, metadata)
        var downloadUrl = await ref.getDownloadURL()
        console.log('Download Url :: ' + downloadUrl)
        return ({ downloadLink: downloadUrl, success: true })

    }







}




