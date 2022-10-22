import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2'
import AsyncSelect from 'react-select/async';
import getAxiosInstance from './../../Utils/axios'
import { getCountries, getStates, getCities, getBuildings, getFloors, getScreens, getIdList, validateEmail } from './../../Utils/api'

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

export default function Add() {
    const [isLoading, setIsLoading] = useState(false);
    let { userID } = useParams()

    // User Details
    const [FirstName, setFirstName] = useState("")
    const [LastName, setLastName] = useState("")
    const [Address, setAddress] = useState("")
    const [Email, setEmail] = useState("")
    const [EmployeeCode, setEmployeeCode] = useState("")
    const [ContactNumber, setContactNumber] = useState("")
    const [Password, setPassword] = useState("")

    // Permissions
    const [UserManagement, setUserManagement] = useState(false)
    const [MessageManagement, setMessageManagement] = useState(false)
    const [ReportManagement, setReportManagement] = useState(false)
    const [MetaDataManagement, setMetaDataManagement] = useState(false)

    // Assign Location
    const [AssignLevel, setAssignLevel] = useState(0)
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

    const reset = () => {
        setFirstName("")
        setLastName("")
        setAddress("")
        setEmail("")
        setEmployeeCode("")
        setContactNumber("")
        setPassword("")
        setUserManagement(false)
        setMessageManagement(false)
        setReportManagement(false)
        setMetaDataManagement(false)
        setAssignLevel(0)
        setCountry([])
        setState([])
        setCity([])
        setBuilding([])
        setFloor([])
        setScreen([])
        setInputCountry("")
        setInputState("")
        setInputCity("")
        setInputBuilding("")
        setInputFloor("")
        setInputScreen("")
    }

    const saveUser = () => {
        let isEmail = validateEmail(Email)
        if(FirstName.trim() === "") return Toast.fire({ icon: 'error', title: 'First Name required' })
        if(LastName.trim() === "") return Toast.fire({ icon: 'error', title: 'Last Name required' })
        if(Address.trim() === "") return Toast.fire({ icon: 'error', title: 'Address/Location required' })
        if(Email.trim() === "") return Toast.fire({ icon: 'error', title: 'Email required' })
        if(!isEmail) return Toast.fire({ icon: 'error', title: 'Invalid email address' })
        if(EmployeeCode.trim() === "") return Toast.fire({ icon: 'error', title: 'Employee Code required' })
        if(ContactNumber.trim() === "") return Toast.fire({ icon: 'error', title: 'Contact Number required' })
        if(!userID && Password.trim() === "") return Toast.fire({ icon: 'error', title: 'Password required' })
        if(!UserManagement && !MessageManagement && !ReportManagement && !MetaDataManagement) return Toast.fire({ icon: 'error', title: 'Atleast one permission required' })
        if(AssignLevel === 0) return Toast.fire({ icon: 'error', title: 'Level needs to be assigned' })
        if(AssignLevel > 0 && country.length === 0) return Toast.fire({ icon: 'error', title: 'Country need to be assigned' })
        if(AssignLevel > 1 && state.length === 0) return Toast.fire({ icon: 'error', title: 'State need to be assigned' })
        if(AssignLevel > 2 && city.length === 0) return Toast.fire({ icon: 'error', title: 'City need to be assigned' })
        if(AssignLevel > 3 && building.length === 0) return Toast.fire({ icon: 'error', title: 'Building need to be assigned' })
        if(AssignLevel > 4 && floor.length === 0) return Toast.fire({ icon: 'error', title: 'Floor need to be assigned' })
        if(AssignLevel > 5 && screen.length === 0) return Toast.fire({ icon: 'error', title: 'Screen need to be assigned' })
        
        setIsLoading(true);
        let link = "/admin/add-user"
        let params = { 
            first_name: FirstName,
            last_name: LastName,
            address: Address,
            email: Email,
            employee_code: EmployeeCode,
            mobile: ContactNumber,
            password: Password,
            'permissions.user_management': UserManagement,
            'permissions.message_management': MessageManagement,
            'permissions.report_management': ReportManagement,
            'permissions.meta_data_management': MetaDataManagement,
            assign_level: AssignLevel,
            'location.country': getIdList(country),
            'location.state': getIdList(state),
            'location.city': getIdList(city),
            'location.building': getIdList(building),
            'location.floor': getIdList(floor),
            'location.screen': getIdList(screen)
        }
        if(userID) {
            params['id'] = userID
            link = "/admin/update-user"
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
                    Toast.fire({ icon: 'success', title: `User ${userID?"updated":"added"} successfully.` })
                    if(!userID) reset()
                } else if (res.data.status === "error") Toast.fire({ icon: 'error', title: res.data.message })
                else Toast.fire({ icon: 'error', title: 'Cannot Process Request' })
            })
            .catch((err) => {
                setIsLoading(false);
                if(err.response.status === 401) Toast.fire({ icon: 'error', title: 'Unauthorized Access' })
                console.log(err);
            });
    }

    useEffect(() => {
        if(userID) {
            let params = { id: userID }
    
            const data = Object.keys(params)
                .map((key) => `${key}=${encodeURIComponent(params[key])}`)
                .join('&');
    
            getAxiosInstance()
                .post("/admin/user", data,{
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    })
                .then((res) => {
                    if(res.data.status === 'success'){
                        // console.log(res.data)
                        let result = res.data.result
                        setFirstName(result.first_name)
                        setLastName(result.last_name)
                        setAddress(result.address)
                        setEmail(result.email)
                        setEmployeeCode(result.employee_code)
                        setContactNumber(result.mobile)
                        setUserManagement(result.permissions.user_management)
                        setMessageManagement(result.permissions.message_management)
                        setReportManagement(result.permissions.report_management)
                        setMetaDataManagement(result.permissions.meta_data_management)
                        setAssignLevel(result.assign_level)
                        setCountry(result.location.country)
                        setState(result.location.state)
                        setCity(result.location.city)
                        setBuilding(result.location.building)
                        setFloor(result.location.floor)
                        setScreen(result.location.screen)
                    } else if (res.data.status === "error") console.log(res.data.message)
                    else console.log('Cannot Process Request')
                })
                .catch((err) => console.log(err));
        }
    }, [userID])

    return (
        <div>
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row justify-content-center">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <h1 className="m-0 text-bold">{userID?"Edit":"Add"} User</h1>
                                        <div className="row mt-3">
                                            <div className="col-md-4">
                                                <input type="text" className="form-control" placeholder="First Name" value={FirstName} onChange={(e) => setFirstName(e.target.value)} />
                                            </div>
                                            <div className="col-md-4">
                                                <input type="text" className="form-control" placeholder="Last Name" value={LastName} onChange={(e) => setLastName(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="row mt-3">
                                            <div className="col-md-4">
                                                <input type="text" className="form-control" placeholder="Address/Location" value={Address} onChange={(e) => setAddress(e.target.value)} />
                                            </div>
                                            <div className="col-md-4">
                                                <input type="email" className="form-control" placeholder="Email Address" value={Email} onChange={(e) => setEmail(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="row mt-3">
                                            <div className="col-md-4">
                                                <input type="text" className="form-control" placeholder="Employee Code" value={EmployeeCode} onChange={(e) => setEmployeeCode(e.target.value)} />
                                            </div>
                                            <div className="col-md-4">
                                                <input type="number" min={1000000000} className="form-control" placeholder="Contact Number" value={ContactNumber} onChange={(e) => setContactNumber(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="row mt-3">
                                            <div className="col-md-4">
                                                <input type="text" className="form-control" placeholder="Password" value={Password} onChange={(e) => setPassword(e.target.value)} />
                                            </div>
                                        </div>
                                        <h1 className="m-0 mt-4 text-bold">Permissions</h1>
                                        <div className="custom-control custom-checkbox mt-3">
                                            <input className="custom-control-input custom-control-input-dark" type="checkbox" id="userManagement" checked={UserManagement} onChange={(e) => setUserManagement(!UserManagement)}/>
                                            <label htmlFor="userManagement" className="custom-control-label" style={{ fontWeight: 'normal' }}>User Management</label>
                                        </div>
                                        <div className="custom-control custom-checkbox mt-3">
                                            <input className="custom-control-input custom-control-input-dark" type="checkbox" id="messageManagement" checked={MessageManagement} onChange={(e) => setMessageManagement(!MessageManagement)} />
                                            <label htmlFor="messageManagement" className="custom-control-label" style={{ fontWeight: 'normal' }}>Message Management</label>
                                        </div>
                                        <div className="custom-control custom-checkbox mt-3">
                                            <input className="custom-control-input custom-control-input-dark" type="checkbox" id="reportManagement" checked={ReportManagement} onChange={(e) => setReportManagement(!ReportManagement)} />
                                            <label htmlFor="reportManagement" className="custom-control-label" style={{ fontWeight: 'normal' }}>Report Management</label>
                                        </div>
                                        <div className="custom-control custom-checkbox mt-3">
                                            <input className="custom-control-input custom-control-input-dark" type="checkbox" id="metaDataManagement" checked={MetaDataManagement} onChange={(e) => setMetaDataManagement(!MetaDataManagement)} />
                                            <label htmlFor="metaDataManagement" className="custom-control-label" style={{ fontWeight: 'normal' }}>Meta Data Management</label>
                                        </div>
                                        <h1 className="m-0 mt-4 text-bold">Assign Location</h1>
                                        <div className="row mt-3">
                                            <div className="col-md-5">
                                                <select className="form-control" value={AssignLevel} onChange={(e) => setAssignLevel(e.target.value)}>
                                                    <option value={0}>Assign Level</option>
                                                    <option value={1}>Country</option>
                                                    <option value={2}>State</option>
                                                    <option value={3}>City</option>
                                                    <option value={4}>Building</option>
                                                    <option value={5}>Floor</option>
                                                    <option value={6}>Screen</option>
                                                </select>
                                            </div>
                                        </div>
                                        {AssignLevel > 0 && <div className="row mt-3">
                                            <div className="col-md-5">
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
                                        </div>}
                                        {AssignLevel > 1 && <div className="row mt-3">
                                            <div className="col-md-5">
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
                                        </div>}
                                        {AssignLevel > 2 && <div className="row mt-3">
                                            <div className="col-md-5">
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
                                        </div>}
                                        {AssignLevel > 3 && <div className="row mt-3">
                                            <div className="col-md-5">
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
                                        </div>}
                                        {AssignLevel > 4 && <div className="row mt-3">
                                            <div className="col-md-5">
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
                                        </div>}
                                        {AssignLevel > 5 && <div className="row mt-3">
                                            <div className="col-md-5">
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
                                        </div>}
                                        <div className="row mt-3">
                                            <div className="col-md-5">
                                                <button type="button" className="btn btn-dark ml-2 float-right" onClick={(e) => saveUser()} disabled={isLoading}>{userID?"Save":"Add New"} User</button>
                                                {!userID && <button type="button" className="btn btn-dark float-right" onClick={(e) => reset()} disabled={isLoading}>Reset</button>}
                                            </div>
                                        </div>
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
