import getAxiosInstance from './axios'

export async function getCountries(search) {
    try {
        let jsonData = { limit: 10, page: 0, search };
        // converting (json --> form-urlencoded)
        const params = Object.keys(jsonData)
        .map((key) => `${key}=${encodeURIComponent(jsonData[key])}`)
        .join('&');

        let { data } = await getAxiosInstance().post("/admin/countries", params,{
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
        // console.log("RES ", data.result)
        return data.result
    } catch (err) {
        return []
    }
}

export async function getStates(search, country) { 
    try {
        let jsonData = { limit: 10, page: 0, search, country };
        // converting (json --> form-urlencoded)
        const params = Object.keys(jsonData)
        .map((key) => `${key}=${encodeURIComponent(jsonData[key])}`)
        .join('&');

        let { data } = await getAxiosInstance().post("/admin/states", params,{
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
        // console.log("RES ", data.result)
        return data.result
    } catch (err) {
        return []
    }
}

export async function getCities(search, country, state) {
    try {
        let jsonData = { limit: 10, page: 0, search, country, state };
        // converting (json --> form-urlencoded)
        const params = Object.keys(jsonData)
        .map((key) => `${key}=${encodeURIComponent(jsonData[key])}`)
        .join('&');

        let { data } = await getAxiosInstance().post("/admin/cities", params,{
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
        // console.log("RES ", data.result)
        return data.result
    } catch (err) {
        return []
    }
}

export async function getBuildings(search, country, state, city) {
    try {
        let jsonData = { limit: 10, page: 0, search, country, state, city };
        // converting (json --> form-urlencoded)
        const params = Object.keys(jsonData)
        .map((key) => `${key}=${encodeURIComponent(jsonData[key])}`)
        .join('&');

        let { data } = await getAxiosInstance().post("/admin/buildings", params,{
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
        // console.log("RES ", data.result)
        return data.result
    } catch (err) {
        return []
    }
}

export async function getFloors(search, country, state, city, building) {
    try {
        let jsonData = { limit: 10, page: 0, search, country, state, city, building };
        // converting (json --> form-urlencoded)
        const params = Object.keys(jsonData)
        .map((key) => `${key}=${encodeURIComponent(jsonData[key])}`)
        .join('&');

        let { data } = await getAxiosInstance().post("/admin/floors", params,{
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
        // console.log("RES ", data.result)
        return data.result
    } catch (err) {
        return []
    }
}

export async function getScreens(search, country, state, city, building, floor) {
    try {
        let jsonData = { limit: 10, page: 0, search, country, state, city, building, floor };
        // converting (json --> form-urlencoded)
        const params = Object.keys(jsonData)
        .map((key) => `${key}=${encodeURIComponent(jsonData[key])}`)
        .join('&');

        let { data } = await getAxiosInstance().post("/admin/screens", params,{
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
        // console.log("RES ", data.result)
        return data.result
    } catch (err) {
        return []
    }
}

export function getIdList(data) {
    try {
        if(!data || data.length === 0) return ""
        let ids = []
        for(let i = 0; i < data.length; i++) {
            ids.push(data[i]._id)
        }
        return ids.join(",")
    } catch (err) {
        return ""
    }
}

export function validateEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};