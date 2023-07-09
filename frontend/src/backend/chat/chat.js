import axios from 'axios'
import { toast } from 'react-toastify';
import { domain } from '../../constants/constants';


export const interact = async (me, partner) => {

    let data = JSON.stringify({
        "me": me,
        "partner": partner
    })

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${domain}/chat/onInteractionForChat?`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    }

    try {
        const resp = await axios.request(config)
        return resp.data
    } catch (ex) {
        toast(ex.toString())
    }

}