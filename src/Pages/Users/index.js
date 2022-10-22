import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2'
import AsyncSelect from 'react-select/async';
import getAxiosInstance from './../../Utils/axios'
import { getCountries, getStates, getCities, getBuildings, getFloors, getScreens, getIdList } from './../../Utils/api'

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

export default function Users() {
    const [users, setUsers] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchFilter, setSearchFilter] = useState("");
    const [limit, setLimit] = useState(20);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);

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
    const [screen, setScreen] = useState([]);
    const [inputScreen, setInputScreen] = useState("");

    const fetchCountryData = () => getCountries(inputCountry)
    const fetchStateData = () => getStates(inputState, getIdList(country))
    const fetchCityData = () => getCities(inputCity, getIdList(country), getIdList(state))
    const fetchBuildingData = () => getBuildings(inputBuilding, getIdList(country), getIdList(state), getIdList(city))
    const fetchFloorData = () => getFloors(inputFloor, getIdList(country), getIdList(state), getIdList(city), getIdList(building))
    const fetchScreenData = () => getScreens(inputScreen, getIdList(country), getIdList(state), getIdList(city), getIdList(building), getIdList(floor))

    const getUsers = () => { 
        let jsonData = {
            limit: limit,
            page: pageNumber * limit,
            search: searchFilter,
            country: getIdList(country),
            state: getIdList(state),
            city: getIdList(city),
            building: getIdList(building),
            floor: getIdList(floor),
            screen: getIdList(screen),
        };
        // converting (json --> form-urlencoded)
        const data = Object.keys(jsonData)
        .map((key) => `${key}=${encodeURIComponent(jsonData[key])}`)
        .join('&');

        getAxiosInstance()
        .post("/admin/users", data,{
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            .then((res) => {
                // Validating form
                setIsLoading(false);
                if(res.data.status === 'success'){
                    // console.log(res.data);
                    setTotalUsers(res.data.totalCount);
                    setUsers(res.data.result);
                }else if(res.data.status === "error") Toast.fire({ icon: 'error', title: res.data.message })
                else Toast.fire({ icon: 'error', title: "Cannot process request" })
            })
            .catch((err) => {
                setIsLoading(false);
                console.log(err);
            });
    }

    useEffect(() => {
        getUsers();
    }, [limit, pageNumber, country, state, city, building, floor, screen]);

    const changePage = ({ selected }) => setPageNumber(selected);

    const deleteUser = (id) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            html: '<h5>This user will be deleted?</h5>',
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
                .post("/admin/delete-user", data, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    })
                .then((res) => {
                    // Validating form
                    setIsLoading(false);
                    if(res.data.status === 'success'){
                        Toast.fire({ icon: 'success', title: "Successfully deleted user" })
                        getUsers();
                    }else{
                        console.log(res.data);
                        Toast.fire({ icon: 'error', title: "Unable to delete user" })
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

    const userStatus = (id, status) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            html: `<h5>This user will be ${status === 1? "activated": "deactivated"}?</h5>`,
            showCancelButton: true,
            confirmButtonText: `${status === 1? "Activate": "Deactivate"}`,
            confirmButtonColor: '#D14343',
        }).then((result) => {
            if (result.isConfirmed) {
                setIsLoading(true);

                const params = { 
                    id: id,
                    active: status
                }
        
                // converting (json --> form-urlencoded)
                const data = Object.keys(params)
                .map((key) => `${key}=${encodeURIComponent(params[key])}`)
                .join('&');

                getAxiosInstance()
                .post("/admin/simple-user-update", data, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    })
                .then((res) => {
                    // Validating form
                    setIsLoading(false);
                    if(res.data.status === 'success'){
                        Toast.fire({ icon: 'success', title: `Successfully ${status === 1? "activated": "deactivated"} user` })
                        getUsers();
                    }else{
                        console.log(res.data);
                        Toast.fire({ icon: 'error', title: `Unable to ${status === 1? "activate": "deactivate"} user` })
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
                                <h1 className="m-0">All Users</h1>
                            </div>
                            <div className="col-sm-6">
                                <button type="button" className="btn btn-dark float-right" onClick={(e) => { window.location.href = "/add-user" }}>Add New User</button>
                            </div>
                        </div>
                        <div className="row mb-2">
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
                                        setScreen([])
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
                                        setScreen([])
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
                                        setScreen([])
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
                                        setScreen([])
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
                                    onChange={(e) => {
                                        setFloor(e)
                                        setScreen([])
                                    }}
                                />
                            </div>
                            <div className="col-md-2">
                                <AsyncSelect 
                                    cacheOption
                                    isMulti
                                    placeholder="Select Screen"
                                    value={screen}
                                    getOptionLabel={e => e.name}
                                    getOptionValue={e => e._id}
                                    loadOptions={fetchScreenData}
                                    onInputChange={setInputScreen}
                                    onChange={setScreen}
                                />
                            </div>
                        </div>
                        <div className="row justify-content-center mt-3">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        {/* <h3 className="card-title">User List</h3> */}
                                        <div class="card-tools">
                                            <div className="input-group input-group-sm" style={{width: 250}}>
                                                <input type="text" name="table_search" className="form-control float-right" placeholder="Search" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} />
                                                <div className="input-group-append">
                                                    <button type="submit" className="btn btn-default" onClick={() => getUsers()}>
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
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Code</th>
                                                    <th>Contact Number</th>
                                                    <th>Locations assigned</th>
                                                    <th></th>
                                                    <th style={{width: 40}}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {isLoading && <tr style={{ textAlign: 'center' }}>
                                                    <td colSpan={8}>Loading Users ...</td>
                                                </tr>}
                                                {!isLoading && totalUsers === 0 && <tr style={{ textAlign: 'center' }}>
                                                    <td colSpan={8}>No Users Found</td>
                                                </tr>}
                                                {users?.map((user, i) => (
                                                    <tr key={i}>
                                                        <td>{i+1}.</td>
                                                        <td>{user.first_name} {user.last_name}</td>
                                                        <td>{user.email}</td>
                                                        <td>{user.employee_code}</td>
                                                        <td>{user.mobile}</td>
                                                        <td>{user.location.country?`${user.location.country[0].name} (${user.location.country[0].code})`:null}</td>
                                                        <td>{user.active === 1 ? "Active" : "Inactive"}</td>
                                                        <td>
                                                            <div style={{ display: 'flex' }}>
                                                                <button type="button" class="btn btn-success btn-sm ml-1" onClick={() => { window.location.href = "/edit-user/"+user._id }}>
                                                                    <i className="fas fa-pen"></i>
                                                                </button>
                                                                <button type="button" class="btn btn-danger btn-sm ml-1" onClick={() => deleteUser(user._id)}>
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                                {user.active === 1 ? 
                                                                    <button type="button" class="btn btn-danger btn-sm ml-1" onClick={() => userStatus(user._id, 0)}>
                                                                        <i className="fas fa-lock"></i>
                                                                    </button>
                                                                : 
                                                                    <button type="button" class="btn btn-success btn-sm ml-1" onClick={() => userStatus(user._id, 1)}>
                                                                        <i className="fas fa-unlock"></i>
                                                                    </button>
                                                                }
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="card-footer clearfix">
                                        {(totalUsers > limit)?
                                            <ReactPaginate 
                                                previousLabel={"«"}
                                                nextLabel={"»"}
                                                pageCount={Math.ceil(totalUsers / limit)}
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
