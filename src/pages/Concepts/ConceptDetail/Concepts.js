import React, { Component } from 'react'
import Layout from "../../../components/Layout/Layout";
import "./Concepts.css"

import { Query } from "react-apollo";
import { GET_CONCEPT} from "./constants";
import { withApollo } from "react-apollo";

import ReactTable from "react-table";
import Spinner from "../../../components/Spinner/Spinner";
import Button from 'react-bootstrap/Button'
import swal from 'sweetalert';

export class ConceptsPage extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            conceptKey:null,
            description:null,
            unit:null,
            show:false,
            id:"",
            materialGroupsInConcept:[],
            concept:[]
        }
    }


    handleEdit=(concept)=>{
        console.log("edit")
        console.log(concept)
    }
    
    handleDelete=(concept)=>{
        console.log("borrar")
        console.log(concept)
    }

    render() {
        const columns = [
            {
            Header: "Nombre",
            accessor: "name",
            Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>,
            filterable: true,
            filterMethod: (filter, row) =>
                row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
            },
            {
            Header: props => <span>Operacion a realizar</span>, // Custom header components!
            accessor: "_id",
            Cell: row => (
                <div>
                <Button variant="warning"
                    data-param={row.value}
                    onClick={() => this.handleEdit(row.original)}
                >
                    Editar
                </Button>

                <Button variant="danger"
                    data-param={row.value}
                    onClick={() => this.handleDelete(row.original)}
                >
                    -
                </Button>
                </div>
                
            )
            }
        ];


        return (
            <Layout>
                <div className="concepts">
                    <h1>Edicion de Concepto {this.props.match.params.id}</h1>
                    <div className="materials-table-cont">
                            <Query
                                query={GET_CONCEPT}
                                variables={{ id: this.props.match.params.id }}
                                onCompleted={data => {
                                    console.log(data.concept.materialGroups)
                                    this.setState({concept:data.concept.materialGroups})
                                }}
                                >                          
                            {({ loading, error, data }) => {
                                console.log("CONCEPTO")
                            if (loading) return <Spinner />;
                            if (error) return <p>Error :( recarga la página!</p>;
                            return (
                                <ReactTable
                                data={this.state.concept}
                                columns={columns}
                                defaultPageSize={2}
                                minRows={1}
                                showPaginationBottom= {true}

                                />
                            );
                            }}
                        </Query>
                    </div>
                </div>
                
            </Layout>
        )
    }
}
export default withApollo(ConceptsPage)
