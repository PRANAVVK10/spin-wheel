import Cookie from 'cookie-universal'
const cookies = Cookie()
let tkn = cookies.get('accessToken')
let user = cookies.get('userID')

// console.log('tkn', tkn)
const send = async ({ method, path, params, data, token, cookie }) => {
    const opts = {
        method,
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            // Cache: 'no-cache',
        },
    }

    if (data) {
        // opts.headers['Content-Type'] = 'application/json';
        opts.body = JSON.stringify(data)
    }
    if (token) {
        opts.headers['Authorization'] = `Bearer ${token}`
    }

    else if (tkn) {
        opts.headers['Authorization'] = `Bearer ${tkn}`
    	opts.headers['User'] = `${user}`
    }


    let uri = new URL(`${import.meta.env.VITE_SERVER_URL}/v1/${path}`)

    if (params) {
        Object.keys(params).forEach((key) => uri.searchParams.append(key, params[key]))
    }
    const url = uri.toString()

    let response = await fetch(url, opts)
    let json = await response.text()
    if (!response.ok) {
        throw json
    }
    try {
        return JSON.parse(json)
    } catch (e) {
        return json
    }
}


export const get = (path, params, token) => {
    return send({ method: 'GET', path, params, token })
}

export const del = (path) => {
    return send({ method: 'DELETE', path })
}

export const post = (path, data) => {
    return send({ method: 'POST', path, data })
}

export const put = (path, data) => {
    return send({ method: 'PUT', path, data })
}
