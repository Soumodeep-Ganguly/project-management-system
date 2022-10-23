import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import getAxiosInstance from './../../Utils/axios'
import { Toast } from './../../Utils/Toast'

export default function Add() {
    const [isLoading, setIsLoading] = useState(false);
    let { technologyID } = useParams()

    // Technology Details
    const [Name, setName] = useState("")
    const [Image, setImage] = useState("");
    const [Resources, setResources] = useState([])
    const [Resource, setResource] = useState("")
    const [Status, setStatus] = useState(1)

    const reset = () => {
        setName("")
        setImage("")
        setResources("")
        setStatus("")
    }

    const saveTechnology = () => {
        if(Name.trim() === "") return Toast.fire({ icon: 'error', title: 'Name required' })
        if(Image === "") return Toast.fire({ icon: 'error', title: 'Image required' })
        if(Resources.length == 0) return Toast.fire({ icon: 'error', title: 'Resources required' })
        
        setIsLoading(true);
        let link = "/technology"
        let data = { 
            name: Name,
            image: Image,
            resources: Resources,
            status: Status
        }
        if(technologyID) link = "/technology/"+technologyID

        getAxiosInstance()
            .post(link, data)
            .then((res) => {
                // Validating form
                setIsLoading(false);
                // console.log(res.data)
                if(res.data.status === 'success'){
                    Toast.fire({ icon: 'success', title: `Technology ${technologyID?"updated":"added"} successfully.` })
                    window.location.href = "/technologies"
                } else Toast.fire({ icon: 'error', title: 'Cannot Process Request' })
            })
            .catch((err) => {
                setIsLoading(false);
                if(err?.response?.status === 401) Toast.fire({ icon: 'error', title: 'Unauthorized Access' })
                else Toast.fire({ icon: 'error', title: err?.response?.data?.message })
                console.log(err);
            });
    }

    const handleFileUpload = (e) => {
        let file = e.target.files[0];
        let size = file.size / (1024 ** 2)
        // console.log(size)
        if(size > 1) return Toast.fire({ icon: 'error', title: 'File size too large.' })
        let reader = new FileReader();
        reader.onloadend = function() {
            // console.log('RESULT', reader.result)
            setImage(reader.result);
        }
        reader.readAsDataURL(file);
    }

    useEffect(() => {
        if(technologyID) {
            getAxiosInstance()
                .get("/technology/"+technologyID)
                .then((res) => {
                    if(res.data.status === 'success'){
                        // console.log(res.data)
                        let result = res.data.result
                        setName(result.name)
                        setImage(result.image)
                        setResources(result.resources)
                        setStatus(result.status)
                    } else console.log('Cannot Process Request')
                })
                .catch((err) => console.log(err));
        }
    }, [technologyID])

    return (
        <div>
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row justify-content-center">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <h1 className="m-0 text-bold">{technologyID?"Edit":"Add"} Technology</h1>
                                        <div className="row justify-content-center mt-3">
                                            <div className="col-md-7">
                                                <input type="text" className="form-control" placeholder="Techonology Name" value={Name} onChange={(e) => setName(e.target.value)} />
                                            </div>
                                            <div className="form-group col-md-7 mt-3">
                                                <div className="custom-file">
                                                    <input type="file" className="custom-file-input" id="customFile" onChange={(e) => handleFileUpload(e)} />
                                                    <label className="custom-file-label" htmlFor="customFile">Choose image</label>
                                                </div>
                                                <code className="mt-1">Max file size 1MB</code>
                                            </div>
                                            <div className="col-md-12"></div>
                                            {Image !== "" && <div className="card col-md-4 mt-3 bg-gradient-dark">
                                                <img className="card-img-top" src={Image} alt="Selected Image" />
                                                <div className="card-img-overlay d-flex flex-column justify-content-end">
                                                    <button type="button" className="btn btn-outline-danger btn-block" onClick={(e) => setImage("")}>Remove</button>
                                                </div>
                                            </div>}
                                            <div className="col-md-12"></div>
                                            {Resources.map((resource, index) => (
                                                <div className="input-group mb-3 col-md-7">
                                                    <input type="text" className="form-control" placeholder="Add Resource" value={resource} />
                                                    <div className="input-group-append">
                                                        <span className="input-group-text" onClick={() => {
                                                            let newResources = Resources.filter((res, i) => index !== i)
                                                            setResources(newResources)
                                                        }} ><i className="fas fa-minus"/></span>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="input-group mb-3 col-md-7">
                                                <input type="text" className="form-control" placeholder="Add Resource" value={Resource} onChange={(e) => setResource(e.target.value)} />
                                                <div className="input-group-append">
                                                    <span className="input-group-text" onClick={() => {
                                                        if(Resource.trim() === "") return Toast.fire({ icon: 'error', title: "Resource cannot be empty." })
                                                        setResources([...Resources, Resource]);
                                                        setResource("")
                                                    }} ><i className="fas fa-plus" /></span>
                                                </div>
                                            </div>
                                            <div className="col-md-7">
                                                <div className="form-group row">
                                                    <div className="col-md-6">
                                                        <div className="custom-control custom-radio">
                                                            <input className="custom-control-input" type="radio" id="activeStatus" name="status" checked={Status === 1} onChange={(e) => setStatus(1)} />
                                                            <label htmlFor="activeStatus" className="custom-control-label">Active</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="custom-control custom-radio">
                                                            <input className="custom-control-input" type="radio" id="inavtiveStatus" name="status" checked={Status === 0} onChange={(e) => setStatus(0)} />
                                                            <label htmlFor="inavtiveStatus" className="custom-control-label">Inactive</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row justify-content-center mt-3">
                                            <div className="col-md-4 text-center">
                                                <button type="button" className="btn btn-dark mr-2" onClick={(e) => saveTechnology()} disabled={isLoading}>{technologyID?"Save":"Add New"} Technology</button>
                                                {!technologyID && <button type="button" className="btn btn-dark" onClick={(e) => reset()} disabled={isLoading}>Reset</button>}
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
