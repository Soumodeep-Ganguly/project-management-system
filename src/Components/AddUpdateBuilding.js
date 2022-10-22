import React, { useState, useEffect } from 'react'
import AsyncSelect from 'react-select/async';

export default function AddUpdateBuilding({ type, getAxiosInstance, Toast, buildingUp, getCountries, getStates, getCities, getBuildings }) {
    const [IsShowing, setIsShowing] = useState(false)
    const [building, setBuilding] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [inputCountry, setInputCountry] = useState("");
    const [inputState, setInputState] = useState("");
    const [inputCity, setInputCity] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(buildingUp){
            setBuilding(buildingUp.name);
            setCity(buildingUp.city);
            setState(buildingUp.state);
            setCountry(buildingUp.country)
        }
    }, [buildingUp])

    const fetchCountryData = () => getCountries(inputCountry)
    const fetchStateData = () => getStates(inputState, country?._id)
    const fetchCityData = () => getCities(inputCity, country?._id, state?._id)

    const addBuilding = () => {
        if(country === "" || !country) return Toast.fire({ icon: 'error', title: 'Country selection required' })
        if(state === "" || !state) return Toast.fire({ icon: 'error', title: 'State selection required' })
        if(city === "" || !city) return Toast.fire({ icon: 'error', title: 'City selection required' })
        if(building.trim() === "") return Toast.fire({ icon: 'error', title: 'Building name required.' })
        
        setIsLoading(true);
        let link = "/admin/add-building"
        let params = { 
            name: building, 
            city: city?._id,
            state: state?._id,
            country: country?._id 
        }
        if(buildingUp) {
            params = {
                id: buildingUp._id,
                name: building,
                city: city?._id,
                state: state?._id,
                country: country?._id
            }
            link = "/admin/update-building"
        }

        const data = Object.keys(params)
            .map((key) => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');

        getAxiosInstance()
            .post(link, data,{
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
            .then((res) => {
                // Validating form
                setIsLoading(false);
                // console.log(res.data)
                if(res.data.status === 'success'){
                    Toast.fire({ icon: 'success', title: `Building ${type === "add"?"added":"updated"} successfully.` })
                    handleClose()
                    getBuildings()
                } else if (res.data.status === "error") Toast.fire({ icon: 'error', title: res.data.message })
                else Toast.fire({ icon: 'error', title: 'Cannot Process Request' })
            })
            .catch((err) => {
                setIsLoading(false);
                if(err.response.status === 401) Toast.fire({ icon: 'error', title: 'Unauthorized Access' })
                console.log(err);
            });
    }

    function handleClose() {
        setIsShowing(false)
        setBuilding("")
        setCity("")
        setState("")
        setCountry("")
        // window.location.reload()
    }

    return (
        <>
            {type === "add" && <button type="button" class="btn btn-dark btn-sm ml-1" onClick={() => setIsShowing(true)}>
                <i className="fas fa-plus"></i> Add Building
            </button>}
            {type !== "add" && <button type="button" class="btn btn-success btn-sm ml-1" onClick={() => setIsShowing(true)}>
                <i className="fas fa-pen"></i>
            </button>}
            {IsShowing && <div className={`modal fade show`} id="modal-default" style={{ display: 'block', paddingRight: 17 }} aria-modal="true" role="dialog">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Building Modal</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={(e) => handleClose()}>
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-12">
                                    <AsyncSelect 
                                        cacheOption
                                        defaultOptions
                                        placeholder="Select Country"
                                        value={country}
                                        getOptionLabel={e => `${e.name} (${e.code})`}
                                        getOptionValue={e => e._id}
                                        loadOptions={fetchCountryData}
                                        onInputChange={setInputCountry}
                                        onChange={(e) => {
                                            setCountry(e)
                                            setState("")
                                            setCity("")
                                        }}
                                    />
                                    <div className="form-group mt-3">
                                        <AsyncSelect 
                                            cacheOption
                                            placeholder="Select State"
                                            value={state}
                                            getOptionLabel={e => `${e.name}`}
                                            getOptionValue={e => e._id}
                                            loadOptions={fetchStateData}
                                            onInputChange={setInputState}
                                            onChange={(e) => {
                                                setState(e)
                                                setCity("")
                                            }}
                                        />
                                    </div>
                                    <div className="form-group mt-3">
                                        <AsyncSelect 
                                            cacheOption
                                            placeholder="Select City"
                                            value={city}
                                            getOptionLabel={e => `${e.name}`}
                                            getOptionValue={e => e._id}
                                            loadOptions={fetchCityData}
                                            onInputChange={setInputCity}
                                            onChange={setCity}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input className="form-control mt-3" id="building" placeholder={"Enter Building Name"} value={building} onChange={(e) => setBuilding(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer justify-content-between">
                            <button type="button" className="btn btn-default" data-dismiss="modal" onClick={(e) => handleClose()}>Close</button>
                            <button type="button" className="btn btn-dark" onClick={(e) => addBuilding()} disabled={isLoading}>{type === "add"?"Add Building":"Save changes"}</button>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}
