import React, { useState, useEffect } from 'react'

export default function AddUpdateCountry({ type, getAxiosInstance, Toast, countryUp, getCountries }) {
    const [IsShowing, setIsShowing] = useState(false)
    const [country, setCountry] = useState("");
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(countryUp){
            setCountry(countryUp.name);
            setCode(countryUp.code)
        }
    }, [countryUp])

    const addCountry = () => {
        if(code.trim() === "") return Toast.fire({ icon: 'error', title: 'Country code required' })
        if(country.trim() === "") return Toast.fire({ icon: 'error', title: 'Country name required.' })
        
        setIsLoading(true);
        let link = "/admin/add-country"
        let params = { name: country, code }
        if(countryUp) {
            params = {
                id: countryUp._id,
                name: country,
                code
            }
            link = "/admin/update-country"
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
                    Toast.fire({ icon: 'success', title: `Country ${type === "add"?"added":"updated"} successfully.` })
                    handleClose()
                    getCountries()
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
        setCountry("")
        setCode("")
        // window.location.reload()
    }

    return (
        <>
            {type === "add" && <button type="button" class="btn btn-dark btn-sm ml-1" onClick={() => setIsShowing(true)}>
                <i className="fas fa-plus"></i> Add Country
            </button>}
            {type !== "add" && <button type="button" class="btn btn-success btn-sm ml-1" onClick={() => setIsShowing(true)}>
                <i className="fas fa-pen"></i>
            </button>}
            {IsShowing && <div className={`modal fade show`} id="modal-default" style={{ display: 'block', paddingRight: 17 }} aria-modal="true" role="dialog">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Country Modal</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={(e) => handleClose()}>
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <input className="form-control mt-1" id="country" placeholder={"Enter Country Name"} value={country} onChange={(e) => setCountry(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <input className="form-control mt-1" id="code" placeholder={"Enter Country Code"} value={code} onChange={(e) => setCode(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer justify-content-between">
                            <button type="button" className="btn btn-default" data-dismiss="modal" onClick={(e) => handleClose()}>Close</button>
                            <button type="button" className="btn btn-dark" onClick={(e) => addCountry()} disabled={isLoading}>{type === "add"?"Add Country":"Save changes"}</button>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}
