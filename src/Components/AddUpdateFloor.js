import React, { useState, useEffect } from 'react'
import AsyncSelect from 'react-select/async';

export default function AddUpdateFloor({ type, getAxiosInstance, Toast, floorUp, getCountries, getStates, getCities, getBuildings, getFloors }) {
    const [IsShowing, setIsShowing] = useState(false)
    const [floor, setFloor] = useState("");
    const [building, setBuilding] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [inputCountry, setInputCountry] = useState("");
    const [inputState, setInputState] = useState("");
    const [inputCity, setInputCity] = useState("");
    const [inputBuilding, setInputBuilding] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(floorUp){
            setFloor(floorUp.name);
            setBuilding(floorUp.building);
            setCity(floorUp.city);
            setState(floorUp.state);
            setCountry(floorUp.country)
        }
    }, [floorUp])

    const fetchCountryData = () => getCountries(inputCountry)
    const fetchStateData = () => getStates(inputState, country?._id)
    const fetchCityData = () => getCities(inputCity, country?._id, state?._id)
    const fetchBuildingData = () => getBuildings(inputBuilding, country?._id, state?._id, city?._id)

    const addFloor = () => {
        if(country === "" || !country) return Toast.fire({ icon: 'error', title: 'Country selection required' })
        if(state === "" || !state) return Toast.fire({ icon: 'error', title: 'State selection required' })
        if(city === "" || !city) return Toast.fire({ icon: 'error', title: 'City selection required' })
        if(building === "" || !building) return Toast.fire({ icon: 'error', title: 'Building selection required' })
        if(floor.trim() === "") return Toast.fire({ icon: 'error', title: 'Floor name required.' })
        
        setIsLoading(true);
        let link = "/admin/add-floor"
        let params = { 
            name: floor, 
            building: building?._id,
            city: city?._id,
            state: state?._id,
            country: country?._id 
        }
        if(floorUp) {
            params = {
                id: floorUp._id,
                name: floor,
                building: building?._id,
                city: city?._id,
                state: state?._id,
                country: country?._id
            }
            link = "/admin/update-floor"
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
                    Toast.fire({ icon: 'success', title: `Floor ${type === "add"?"added":"updated"} successfully.` })
                    handleClose()
                    getFloors()
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
        setFloor("")
        setBuilding("")
        setCity("")
        setState("")
        setCountry("")
        // window.location.reload()
    }

    return (
        <>
            {type === "add" && <button type="button" class="btn btn-dark btn-sm ml-1" onClick={() => setIsShowing(true)}>
                <i className="fas fa-plus"></i> Add Floor
            </button>}
            {type !== "add" && <button type="button" class="btn btn-success btn-sm ml-1" onClick={() => setIsShowing(true)}>
                <i className="fas fa-pen"></i>
            </button>}
            {IsShowing && <div className={`modal fade show`} id="modal-default" style={{ display: 'block', paddingRight: 17 }} aria-modal="true" role="dialog">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Floor Modal</h5>
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
                                            setBuilding("")
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
                                                setBuilding("")
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
                                            onChange={(e) => {
                                                setCity(e)
                                                setBuilding("")
                                            }}
                                        />
                                    </div>
                                    <div className="form-group mt-3">
                                        <AsyncSelect 
                                            cacheOption
                                            placeholder="Select Building"
                                            value={building}
                                            getOptionLabel={e => `${e.name}`}
                                            getOptionValue={e => e._id}
                                            loadOptions={fetchBuildingData}
                                            onInputChange={setInputBuilding}
                                            onChange={setBuilding}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input className="form-control mt-3" id="floor" placeholder={"Enter Floor Name"} value={floor} onChange={(e) => setFloor(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer justify-content-between">
                            <button type="button" className="btn btn-default" data-dismiss="modal" onClick={(e) => handleClose()}>Close</button>
                            <button type="button" className="btn btn-dark" onClick={(e) => addFloor()} disabled={isLoading}>{type === "add"?"Add Floor":"Save changes"}</button>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}
