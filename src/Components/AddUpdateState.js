import React, { useState, useEffect } from 'react'
import AsyncSelect from 'react-select/async';

export default function AddUpdateState({ type, getAxiosInstance, Toast, stateUp, getCountries, getStates }) {
    const [IsShowing, setIsShowing] = useState(false)
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(stateUp){
            setState(stateUp.name);
            setCountry(stateUp.country)
        }
    }, [stateUp])

    const fetchData = () => getCountries(inputValue)

    const addState = () => {
        if(country === "" || !country) return Toast.fire({ icon: 'error', title: 'Country selection required' })
        if(state.trim() === "") return Toast.fire({ icon: 'error', title: 'State name required.' })
        
        setIsLoading(true);
        let link = "/admin/add-state"
        let params = { name: state, country: country?._id }
        if(stateUp) {
            params = {
                id: stateUp._id,
                name: state,
                country: country?._id
            }
            link = "/admin/update-state"
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
                    Toast.fire({ icon: 'success', title: `State ${type === "add"?"added":"updated"} successfully.` })
                    handleClose()
                    getStates()
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
        setState("")
        setCountry("")
        // window.location.reload()
    }

    return (
        <>
            {type === "add" && <button type="button" class="btn btn-dark btn-sm ml-1" onClick={() => setIsShowing(true)}>
                <i className="fas fa-plus"></i> Add State
            </button>}
            {type !== "add" && <button type="button" class="btn btn-success btn-sm ml-1" onClick={() => setIsShowing(true)}>
                <i className="fas fa-pen"></i>
            </button>}
            {IsShowing && <div className={`modal fade show`} id="modal-default" style={{ display: 'block', paddingRight: 17 }} aria-modal="true" role="dialog">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">State Modal</h5>
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
                                        loadOptions={fetchData}
                                        onInputChange={setInputValue}
                                        onChange={setCountry}
                                    />
                                    <div className="form-group">
                                        <input className="form-control mt-3" id="state" placeholder={"Enter State Name"} value={state} onChange={(e) => setState(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer justify-content-between">
                            <button type="button" className="btn btn-default" data-dismiss="modal" onClick={(e) => handleClose()}>Close</button>
                            <button type="button" className="btn btn-dark" onClick={(e) => addState()} disabled={isLoading}>{type === "add"?"Add State":"Save changes"}</button>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}
