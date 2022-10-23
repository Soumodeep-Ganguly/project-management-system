import React, { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2'
import AsyncSelect from 'react-select/async';
import getAxiosInstance from '../../Utils/axios'
import { Toast } from './../../Utils/Toast'

export default function Technologies() {
    const [technologies, setTechnologies] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchFilter, setSearchFilter] = useState("");
    const [limit, setLimit] = useState(20);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalTechnologies, setTotalTechnologies] = useState(0);

    const getTechnologies = () => { 
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
        .get("/technologies?"+data)
            .then((res) => {
                // Validating form
                setIsLoading(false);
                if(res.data.status === 'success'){
                    // console.log(res.data);
                    setTotalTechnologies(res.data.totalCount);
                    setTechnologies(res.data.result);
                }else if(res.data.status === "error") Toast.fire({ icon: 'error', title: res.data.message })
                else Toast.fire({ icon: 'error', title: "Cannot process request" })
            })
            .catch((err) => {
                setIsLoading(false);
                console.log(err);
            });
    }

    useEffect(() => {
        getTechnologies();
    }, [limit, pageNumber]);

    const changePage = ({ selected }) => setPageNumber(selected);

    const deleteTechnology = (id) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            html: '<h5>This technology will be deleted?</h5>',
            showCancelButton: true,
            confirmButtonText: `Delete`,
            confirmButtonColor: '#D14343',
        }).then((result) => {
            if (result.isConfirmed) {
                setIsLoading(true);
                getAxiosInstance()
                .delete("/technology/"+id)
                    .then((res) => {
                        // Validating form
                        setIsLoading(false);
                        if(res.data.status === 'success'){
                            Toast.fire({ icon: 'success', title: "Successfully deleted technology" })
                            getTechnologies();
                        }else{
                            console.log(res.data);
                            Toast.fire({ icon: 'error', title: "Unable to delete technology" })
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
                                <h1 className="m-0">All Technologies</h1>
                            </div>
                            <div className="col-sm-6">
                                <button type="button" className="btn btn-dark float-right" onClick={(e) => { window.location.href = "/technologies/add" }}>Add New Technology</button>
                            </div>
                        </div>
                        
                        <div className="row justify-content-center mt-3">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        {/* <h3 className="card-title">Technology List</h3> */}
                                        <div class="card-tools">
                                            <div className="input-group input-group-sm" style={{width: 250}}>
                                                <input type="text" name="table_search" className="form-control float-right" placeholder="Search" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} />
                                                <div className="input-group-append">
                                                    <button type="submit" className="btn btn-default" onClick={() => getTechnologies()}>
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
                                                    <td colSpan={8}>Loading Technologies ...</td>
                                                </tr>}
                                                {!isLoading && totalTechnologies === 0 && <tr style={{ textAlign: 'center' }}>
                                                    <td colSpan={8}>No Technologies Found</td>
                                                </tr>}
                                                {technologies?.map((technology, i) => (
                                                    <tr key={i}>
                                                        <td>{i+1}.</td>
                                                        <td>{technology.name}</td>
                                                        <td><img src={technology.image} alt={technology.name} height={50} /></td>
                                                        <td>{technology.resources.map(resource => (
                                                            <span className="badge badge-primary mr-1">{resource}</span>
                                                        ))}</td>
                                                        <td>{technology.status === 1 ? "Active" : "Inactive"}</td>
                                                        <td>
                                                            <button type="button" class="btn btn-danger btn-sm ml-1" onClick={() => deleteTechnology(technology._id)}>
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="card-footer clearfix">
                                        {(totalTechnologies > limit)?
                                            <ReactPaginate 
                                                previousLabel={"«"}
                                                nextLabel={"»"}
                                                pageCount={Math.ceil(totalTechnologies / limit)}
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
