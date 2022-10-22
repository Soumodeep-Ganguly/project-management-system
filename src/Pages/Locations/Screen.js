import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2'
import AsyncSelect from 'react-select/async';
import getAxiosInstance from './../../Utils/axios'
import { getCountries, getStates, getCities, getBuildings, getFloors, getIdList } from './../../Utils/api'
import AddUpdateScreen from '../../Components/AddUpdateScreen';

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

export default function Screen() {
    const [screens, setScreens] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchFilter, setSearchFilter] = useState("");
    const [limit, setLimit] = useState(20);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalScreens, setTotalScreens] = useState(0);

    // Location
    const [country, setCountry] = useState([]);
    const [inputCountry, setInputCountry] = useState("");
    const [state, setState] = useState([]);
    const [inputState, setInputState] = useState("");
    const [city, setCity] = useState([]);
    const [inputCity, setInputCity] = useState("");
    const [building, setBuilding] = useState([]);
    const [inputBuilding, setInputBuilding] = useState("");
    const [floor, setFloor] = useState([]);
    const [inputFloor, setInputFloor] = useState("");

    const fetchCountryData = () => getCountries(inputCountry)
    const fetchStateData = () => getStates(inputState, getIdList(country))
    const fetchCityData = () => getCities(inputCity, getIdList(country), getIdList(state))
    const fetchBuildingData = () => getBuildings(inputBuilding, getIdList(country), getIdList(state), getIdList(city))
    const fetchFloorData = () => getFloors(inputFloor, getIdList(country), getIdList(state), getIdList(city), getIdList(building))

    const getScreens = () => { 
        let jsonData = {
            limit: limit,
            page: pageNumber * limit,
            search: searchFilter,
            country: getIdList(country),
            state: getIdList(state),
            city: getIdList(city),
            building: getIdList(building),
            floor: getIdList(floor),
        };
        // converting (json --> form-urlencoded)
        const data = Object.keys(jsonData)
        .map((key) => `${key}=${encodeURIComponent(jsonData[key])}`)
        .join('&');

        getAxiosInstance()
        .post("/admin/screens", data,{
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            .then((res) => {
                // Validating form
                setIsLoading(false);
                if(res.data.status === 'success'){
                    // console.log(res.data);
                    setTotalScreens(res.data.totalCount);
                    setScreens(res.data.result);
                }else if(res.data.status === "error") Toast.fire({ icon: 'error', title: res.data.message })
                else Toast.fire({ icon: 'error', title: "Cannot process request" })
            })
            .catch((err) => {
                setIsLoading(false);
                console.log(err);
            });
    }

    useEffect(() => {
        getScreens();
    }, [limit, pageNumber, country, state, city, building, floor]);

    const changePage = ({ selected }) => setPageNumber(selected);

    const deleteScreen = (id) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            html: '<h5>This screen will be deleted?</h5>',
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
                .post("/admin/delete-screen", data, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    })
                .then((res) => {
                    // Validating form
                    setIsLoading(false);
                    if(res.data.status === 'success'){
                        Toast.fire({ icon: 'success', title: "Successfully deleted screen" })
                        getScreens();
                    }else{
                        console.log(res.data);
                        Toast.fire({ icon: 'error', title: "Unable to delete screen" })
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
                                <h1 className="m-0">Screen</h1>
                            </div>
                            <div className="col-sm-6">
                                <div className="float-right">
                                    <AddUpdateScreen 
                                        type={"add"}
                                        getAxiosInstance={getAxiosInstance}
                                        Toast={Toast}
                                        getScreens={getScreens}
                                        getFloors={getFloors}
                                        getBuildings={getBuildings}
                                        getCities={getCities}
                                        getStates={getStates}
                                        getCountries={getCountries}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md-2"></div>
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
                                        setCity([])
                                        setBuilding([])
                                        setFloor([])
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
                                    onChange={(e) => {
                                        setState(e)
                                        setCity([])
                                        setBuilding([])
                                        setFloor([])
                                    }}
                                />
                            </div>
                            <div className="col-md-2">
                                <AsyncSelect 
                                    cacheOption
                                    isMulti
                                    placeholder="Select City"
                                    value={city}
                                    getOptionLabel={e => e.name}
                                    getOptionValue={e => e._id}
                                    loadOptions={fetchCityData}
                                    onInputChange={setInputCity}
                                    onChange={(e) => {
                                        setCity(e)
                                        setBuilding([])
                                        setFloor([])
                                    }}
                                />
                            </div>
                            <div className="col-md-2">
                                <AsyncSelect 
                                    cacheOption
                                    isMulti
                                    placeholder="Select Building"
                                    value={building}
                                    getOptionLabel={e => e.name}
                                    getOptionValue={e => e._id}
                                    loadOptions={fetchBuildingData}
                                    onInputChange={setInputBuilding}
                                    onChange={(e) => {
                                        setBuilding(e)
                                        setFloor([])
                                    }}
                                />
                            </div>
                            <div className="col-md-2">
                                <AsyncSelect 
                                    cacheOption
                                    isMulti
                                    placeholder="Select Floor"
                                    value={floor}
                                    getOptionLabel={e => e.name}
                                    getOptionValue={e => e._id}
                                    loadOptions={fetchFloorData}
                                    onInputChange={setInputFloor}
                                    onChange={setFloor}
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
                                                    <button type="submit" className="btn btn-default" onClick={() => getScreens()}>
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
                                                    <th>Screen</th>
                                                    <th>Floor</th>
                                                    <th>Building</th>
                                                    <th>City</th>
                                                    <th>State</th>
                                                    <th>Country</th>
                                                    <th style={{width: 40}}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {isLoading && <tr style={{ textAlign: 'center' }}>
                                                    <td colSpan={9}>Loading Screens ...</td>
                                                </tr>}
                                                {!isLoading && totalScreens === 0 && <tr style={{ textAlign: 'center' }}>
                                                    <td colSpan={9}>No Screens Found</td>
                                                </tr>}
                                                {screens?.map((screen, i) => (
                                                    <tr key={i}>
                                                        <td>{i+1}.</td>
                                                        <td>{screen.id}</td>
                                                        <td>{screen.name}</td>
                                                        <td>{screen.floor?.name}</td>
                                                        <td>{screen.building?.name}</td>
                                                        <td>{screen.city?.name}</td>
                                                        <td>{screen.state?.name}</td>
                                                        <td>{screen.country?.name}</td>
                                                        <td>
                                                            <div style={{ display: 'flex' }}>
                                                                {/* <AddUpdateScreen 
                                                                    type={"update"}
                                                                    getAxiosInstance={getAxiosInstance}
                                                                    Toast={Toast}
                                                                    getScreens={getScreens}
                                                                    screenUp={screen}
                                                                /> */}
                                                                <button type="button" class="btn btn-danger btn-sm ml-1" onClick={() => deleteScreen(screen._id)}>
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
                                        {(totalScreens > limit)?
                                            <ReactPaginate 
                                                previousLabel={"«"}
                                                nextLabel={"»"}
                                                pageCount={Math.ceil(totalScreens / limit)}
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
