import React, { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2'
import AsyncSelect from 'react-select/async';
import getAxiosInstance from '../../Utils/axios'
import { Toast } from './../../Utils/Toast'

export default function Projects() {
    const [projects, setProjects] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchFilter, setSearchFilter] = useState("");
    const [limit, setLimit] = useState(20);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalProjects, setTotalProjects] = useState(0);

    const getProjects = () => { 
        let jsonData = {
            limit: limit,
            page: pageNumber * limit,
            search: searchFilter
        };
        // converting (json --> form-urlencoded)
        const data = Object.keys(jsonData)
        .map((key) => `${key}=${encodeURIComponent(jsonData[key])}`)
        .join('&');

        getAxiosInstance()
        .get("/projects?"+data)
            .then((res) => {
                // Validating form
                setIsLoading(false);
                if(res.data.status === 'success'){
                    // console.log(res.data);
                    setTotalProjects(res.data.totalCount);
                    setProjects(res.data.result);
                }else if(res.data.status === "error") Toast.fire({ icon: 'error', title: res.data.message })
                else Toast.fire({ icon: 'error', title: "Cannot process request" })
            })
            .catch((err) => {
                setIsLoading(false);
                console.log(err);
            });
    }

    useEffect(() => {
        getProjects();
    }, [limit, pageNumber]);

    const changePage = ({ selected }) => setPageNumber(selected);

    const deleteProject = (id) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            html: '<h5>This project will be deleted?</h5>',
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
                .post("/admin/delete-project", data, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    })
                .then((res) => {
                    // Validating form
                    setIsLoading(false);
                    if(res.data.status === 'success'){
                        Toast.fire({ icon: 'success', title: "Successfully deleted project" })
                        getProjects();
                    }else{
                        console.log(res.data);
                        Toast.fire({ icon: 'error', title: "Unable to delete project" })
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
                                <h1 className="m-0">All Projects</h1>
                            </div>
                            <div className="col-sm-6">
                                <button type="button" className="btn btn-dark float-right" onClick={(e) => { window.location.href = "/projects/add" }}>Add New Project</button>
                            </div>
                        </div>
                        
                        <div className="row justify-content-center mt-3">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        {/* <h3 className="card-title">Project List</h3> */}
                                        <div class="card-tools">
                                            <div className="input-group input-group-sm" style={{width: 250}}>
                                                <input type="text" name="table_search" className="form-control float-right" placeholder="Search" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} />
                                                <div className="input-group-append">
                                                    <button type="submit" className="btn btn-default" onClick={() => getProjects()}>
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
                                                    <th>Image</th>
                                                    <th>Resources</th>
                                                    <th>Status</th>
                                                    <th style={{width: 80}}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {isLoading && <tr style={{ textAlign: 'center' }}>
                                                    <td colSpan={8}>Loading Projects ...</td>
                                                </tr>}
                                                {!isLoading && totalProjects === 0 && <tr style={{ textAlign: 'center' }}>
                                                    <td colSpan={8}>No Projects Found</td>
                                                </tr>}
                                                {projects?.map((project, i) => (
                                                    <tr key={i}>
                                                        <td>{i+1}.</td>
                                                        <td>{project.name}</td>
                                                        <td><img src={project.image} alt={project.name} height={50} /></td>
                                                        <td>{project.resources.map(resource => (
                                                            <span className="badge badge-primary mr-1">{resource}</span>
                                                        ))}</td>
                                                        <td>{project.status === 1 ? "Active" : "Inactive"}</td>
                                                        <td>
                                                            <div style={{ display: 'flex' }}>
                                                                <button type="button" class="btn btn-success btn-sm ml-1" onClick={() => { window.location.href = `/projects/${project._id}/edit` }}>
                                                                    <i className="fas fa-pen"></i>
                                                                </button>
                                                                <button type="button" class="btn btn-danger btn-sm ml-1" onClick={() => deleteProject(project._id)}>
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
                                        {(totalProjects > limit)?
                                            <ReactPaginate 
                                                previousLabel={"«"}
                                                nextLabel={"»"}
                                                pageCount={Math.ceil(totalProjects / limit)}
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
