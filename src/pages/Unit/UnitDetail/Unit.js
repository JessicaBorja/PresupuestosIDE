import React, { Component } from 'react'
import Layout from "../../../components/Layout/Layout";
import "./Unit.css"
import { Query } from "react-apollo";
import { GET_MATERIALS } from "../../Materials/constants";
import { GET_UNIT, DELETE_MATERIAL} from "./constants";
import { withApollo } from "react-apollo";

import ReactTable from "react-table";
import Spinner from "../../../components/Spinner/Spinner";
import { Col, Row } from "react-bootstrap"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import swal from 'sweetalert';
import MaterialModal from "../../../components/Unit/Modal";


export class UnitPage extends Component {

    constructor(props) {
            super(props);
            this.state = { 
                conceptKey:null,
                description:null,
                unit:null,
                show:false,
                id:"",
                materialsInConcept:[],
                selectedMaterial:{},
                modalShow:false
        }
    }


    handleEdit=(selectedMaterial)=>{
        console.log("editando")
        console.log(selectedMaterial)
        // swal("Proceso de edicion exitoso!", "Su informacion se ha removido!", "success");
        // swal("Proceso de edicion no exitoso!", "Notificar al programador!", "error");
        this.setState({
            modalShow:true,
            selectedMaterial
        })
    }

    handleDelete=(selectedMaterial)=>{
        console.log("eliminando")
        console.log(selectedMaterial)
        // swal("Proceso de eliminado exitoso!", "Su informacion se ha removido!", "success");
        // swal("Proceso de eliminado no exitoso!", "Notificar al programador!", "error");
        this.props.client.mutate({
            mutation: DELETE_MATERIAL,
            variables: { id:selectedMaterial._id }
        }).then(data => {
            // console.log(data.data.deleteMaterialGroup._id)
            console.log(data.data.deleteAuxMaterial)
            swal("Proceso de eliminado exitoso!", "Su informacion se ha removido!", "success");
        }).catch((err) => { 
            console.log(err)
            swal("Proceso de eliminado no exitoso!", "Notificar al programador!", "error");

         })                

    }

    handleSave=()=>{
        this.searchUnits()
    }


  
    handleChange = name => event => {
        this.setState({ 
            [name]: event.target.value ,
        });
    }

    handleModalClose = () => this.setState({ modalShow: false });


    render() {
        
        const columns = [
            {
                Header: "Clave",
                accessor: "materialKey",
                Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>,
                filterable: true,
                filterMethod: (filter, row) =>
                    row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
            },
            {
                Header: "Descripcion",
                accessor: "name",
                Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>,
                filterable: true,
                filterMethod: (filter, row) =>
                    row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
            },
            {
                Header: "Unidad",
                accessor: "measurementUnit",
                Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>,
            },
            {
                Header: "cantidad",
                accessor: "materialQuantity",
                Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>,
                },
            {
                Header: "Precio",
                accessor: "unitPrice",
                Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>,
            },
            {
                Header: "Subtotal",
                accessor: "unitPrice",
                // headerStyle: {textAlign: 'right'},
                Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>,
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
                        Eliminar
                    </Button>
                    </div>
                    
                )
            }
        ];

        console.log(this.state.materialsInConcept.length)
        console.log(this.props.match.params.id)
        return (
            <Layout>
                <div className="unit">
                <h1>Edita Precios Unitarios</h1>
                    <div className="materials-table-cont">

                        <Query query={GET_UNIT} variables={{ id: this.props.match.params.id }}>
                            {({ loading, error, data }) => {
                                console.log("query")
                            console.log(data.materialGroup)
                            if (loading) return <Spinner />;
                            if (error) return <p>Error :( recarga la página!</p>;
                            return (
                                <ReactTable
                                data={data.materialGroup.auxMaterials}
                                columns={columns}
                                defaultPageSize={2}
                                minRows={1}
                                showPaginationBottom= {true}

                                />
                            );
                            }}
                        </Query>
                    </div>
                    <MaterialModal
                        show={this.state.modalShow}
                        onHide={this.handleModalClose}
                        product={this.state.selectedMaterial}
                        handleQuotation={this.handleQuotation}
                        onConfirm={(material, stuff) => {
                            console.log("confirmado el material")
                            console.log(material)
                            // material.totalPrice = +material.totalPrice;
                            // material.unitPrice = +material.unitPrice;
                            // material.quantity = +material.quantity;
                            // updateMaterial({
                            //     variables: { ...material }
                            // });
                            // this.setState({ modalShow: false });
                        }}
                    />
                </div>
            </Layout>
        )
    }
}
export default withApollo(UnitPage)