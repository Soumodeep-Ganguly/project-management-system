import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2'
import AsyncSelect from 'react-select/async';
import getAxiosInstance from './../../Utils/axios'
import { getCountries, getStates, getIdList } from './../../Utils/api'
import AddUpdateCity from '../../Components/AddUpdateCity';

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

export default function City() {
    const [cities, setCities] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchFilter, setSearchFilter] = useState("");
    const [limit, setLimit] = useState(20);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalCities, setTotalCities] = useState(0);

    // Location
    const [country, setCountry] = useState([]);
    const [inputCountry, setInputCountry] = useState("");
    const [state, setState] = useState([]);
    const [inputState, setInputState] = useState("");

    const fetchCountryData = () => getCountries(inputCountry)
    const fetchStateData = () => getStates(inputState, getIdList(country))

    const getCities = () => { 
        let jsonData = {
            limit: limit,
            page: pageNumber * limit,
            search: searchFilter,
            country: getIdList(country),
            state: getIdList(state),
        };
        // converting (json --> form-urlencoded)
        const data = Object.keys(jsonData)
        .map((key) => `${key}=${encodeURIComponent(jsonData[key])}`)
        .join('&');

        getAxiosInstance()
        .post("/admin/cities", data,{
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            .then((res) => {
                // Validating form
                setIsLoading(false);
                if(res.data.status === 'success'){
                    // console.log(res.data);
                    setTotalCities(res.data.totalCount);
                    setCities(res.data.result);
                }else if(res.data.status === "error") Toast.fire({ icon: 'error', title: res.data.message })
                else Toast.fire({ icon: 'error', title: "Cannot process request" })
            })
            .catch((err) => {
                setIsLoading(false);
                console.log(err);
            });
    }

    useEffect(() => {
        getCities();
    }, [limit, pageNumber, country, state]);

    const changePage = ({ selected }) => setPageNumber(selected);

    const deleteCity = (id) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            html: '<h5>This city will be deleted?</h5>',
            showCancelButton: true,
            confirmButtonText: `Delete`,
            confirmButtonColor: '#D14343',
        }).then((result) => {
            if (result.isConfirmed) {
                setIsLoading(true);

                const params = { id: id }
        
                // converting (json --> form-urlencoded)
                const data = Object.keys(params)
                .map((key) => `${key}=${encodeURIComponent(params[key])}`)
                .join('&');

                getAxiosInstance()
                .post("/admin/delete-city", data, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    })
                .then((res) => {
                    // Validating form
                    setIsLoading(false);
                    if(res.data.status === 'success'){
                        Toast.fire({ icon: 'success', title: "Successfully deleted city" })
                        getCities();
                    }else{
                        console.log(res.data);
                        Toast.fire({ icon: 'error', title: "Unable to delete city" })
                    }
                })
                .catch((err) => {
                    Toast.fire({ icon: 'error', title: "Unexpected Error" })
                    setIsLoading(false);
                    console.log(err);
                });
            }
        })
    }

    return (
        <div>
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-3">
                            <div className="col-sm-6">
                                <h1 className="m-0">City</h1>
                            </div>
                            <div className="col-sm-6">
                                <div className="float-right">
                                    <AddUpdateCity 
                                        type={"add"}
                                        getAxiosInstance={getAxiosInstance}
                                        Toast={Toast}
                                        getCities={getCities}
                                        getStates={getStates}
                                        getCountries={getCountries}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md-8"></div>
                            <div className="col-md-2">
                                <AsyncSelect 
                                    cacheOption
                                    isMulti
                                    placeholder="Select Country"
                                    value={country}
                                    getOptionLabel={e => `${e.name} (${e.code})`}
                                    getOptionValue={e => e._id}
                                    loadOptions={fetchCountryData}
                                    onInputChange={setInputCountry}
                                    onChange={(e) => {
                                        setCountry(e)
                                        setState([])
                                    }}
                                />
                            </div>
                            <div className="col-md-2">
                                <AsyncSelect 
                                    cacheOption
                                    isMulti
                                    placeholder="Select State"
                                    value={state}
                                    getOptionLabel={e => e.name}
                                    getOptionValue={e => e._id}
                                    loadOptions={fetchStateData}
                                    onInputChange={setInputState}
                                    onChange={setState}
                                />
                            </div>
                        </div>
                        <div className="row justify-content-center mt-3">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <div class="card-tools">
                                            <div className="input-group input-group-sm" style={{width: 250}}>
                                                <input type="text" name="table_search" className="form-control float-right" placeholder="Search" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} />
                                                <div className="input-group-append">
                                                    <button type="submit" className="btn btn-default" onClick={() => getCities()}>
                                                        <i className="fas fa-search" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th style={{width: 10}}>#</th>
                                                    <th>ID</th>
                                                    <th>City</th>
                                                    <th>State</th>
                                                    <th>Country</th>
                                                    <th style={{width: 40}}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {isLoading && <tr style={{ textAlign: 'center' }}>
                                                    <td colSpan={6}>Loading Cities ...</td>
                                                </tr>}
                                                {!isLoading && totalCities === 0 && <tr style={{ textAlign: 'center' }}>
                                                    <td colSpan={6}>No Cities Found</td>
                                                </tr>}
                                                {cities?.map((city, i) => (
                                                    <tr key={i}>
                                                        <td>{i+1}.</td>
                                                        <td>{city.id}</td>
                                                        <td>{city.name}</td>
                                                        <td>{city.state?.name}</td>
                                                        <td>{city.country?.name}</td>
                                                        <td>
                                                            <div style={{ display: 'flex' }}>
                                                                {/* <AddUpdateCity 
                                                                    type={"update"}
                                                                    getAxiosInstance={getAxiosInstance}
                                                                    Toast={Toast}
                                                                    getCities={getCities}
                                                                    cityUp={city}
                                                                /> */}
                                                                <button type="button" class="btn btn-danger btn-sm ml-1" onClick={() => deleteCity(city._id)}>
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="card-footer clearfix">
                                        {(totalCities > limit)?
                                            <ReactPaginate 
                                                previousLabel={"«"}
                                                nextLabel={"»"}
                                                pageCount={Math.ceil(totalCities / limit)}
                                                onPageChange={changePage}
                                                containerClassName={"pagination pagination-sm m-0 float-right"}
                                                pageClassName={"page-item"}
                                                pageLinkClassName={"page-link"}
                                                // previousClassName={"previous"}
                                                previousLinkClassName={"page-link"}
                                                // nextClassName={"next"}
                                                nextLinkClassName={"page-link"}
                                                disabledClassName={"disabled"}
                                                activeClassName={"active"}
                                            />
                                        :null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
