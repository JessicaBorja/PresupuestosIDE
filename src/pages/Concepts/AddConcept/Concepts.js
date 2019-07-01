import React, { Component } from 'react'
import Layout from "../../../components/Layout/Layout";
import "./Concepts.css"

import { Query } from "react-apollo";
import { GET_UNITS, DELETE_UNIT,DUPLICATE_UNIT,ADD_CONCEPT} from "./constants";
import { withApollo } from "react-apollo";

import ReactTable from "react-table";
import Spinner from "../../../components/Spinner/Spinner";
import Button from 'react-bootstrap/Button'
import swal from 'sweetalert';

import { Col, Row } from "react-bootstrap"
import Form from 'react-bootstrap/Form'

export class ConceptsPage extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            conceptKey:null,
            description:null,
            unit:null,
            show:false,
            id:"",
            materialGroupsInConcept:[]
        }
    }

    handleChange = name => event => {
        this.setState({ 
            [name]: event.target.value ,
        });
    }

    handleSave=()=>{
        console.log("grabando")
        let newMaterialGroups=this.state.materialGroupsInConcept.map((materialGroup)=>{
            return materialGroup._id
        })
        console.log(newMaterialGroups)
        let objeto={
            conceptKey:this.state.conceptKey,
            name:this.state.description,
            measurementUnit:this.state.unit,
            materialGroups:newMaterialGroups
        }
        console.log(objeto)   
        // $conceptKey: String!, $measurementUnit:String, $name: String,$materialGroups:[ID]     
        this.props.client.mutate({
            mutation: ADD_CONCEPT,
            variables: { ...objeto }
        }).then(data => {
            console.log(data.data.createConcept._id)
            // console.log(`created material group: ${data.data.createMaterialGroup._id}`)
            // materialesAux.push(data.data.createAuxMaterial._id)
            // subidos++;
            // if(this.state.materialsInConcept.length===subidos){
            //     console.log("termine2")
            //     console.log(materialesAux)
            //     this.saveUnit(concepto)
            // }
        }).catch((err) => { console.log(err) })
    }

    handleEdit=(selectedMaterialGroup)=>{
        console.log("editar")
        console.log(selectedMaterialGroup)
        
        swal({
            title:"Ingresa cantidad de "+selectedMaterialGroup.materialGroupKey,
            content:'input',
            inputValue:"valor",
            showCancelButton:true,
            }).then((value)=>{
            if(!value || isNaN(Number(value)) || Number(value)<=0){
                swal(`Favor de ingresar un numero mayor a 0, usted ingreso: ${value}`);
            }
            else{
                console.log(value)
                let materialGroups=this.state.materialGroupsInConcept

                const materialGroupIndex = materialGroups.findIndex(
                    materialGroup => materialGroup._id === selectedMaterialGroup._id
                );
                console.log(materialGroupIndex)
                materialGroups[materialGroupIndex].quantity=value
                this.setState({
                    materialGroupsInConcept:materialGroups
                })
        
            }
        })
        
    }
    handleDelete=(selectedMaterialGroup)=>{
        console.log("borrar")
        console.log(selectedMaterialGroup)
        let materialGroups=this.state.materialGroupsInConcept
        const materialGroupIndex = materialGroups.findIndex(
            materialGroup => materialGroup._id === selectedMaterialGroup._id
        );
        console.log(materialGroupIndex)
        function spliceNoMutate(myArray,indexToRemove) {
            return myArray.slice(0,indexToRemove).concat(myArray.slice(indexToRemove+1));
          }
        let newMaterialGroups=spliceNoMutate(materialGroups,materialGroupIndex)
        console.log(newMaterialGroups)
        this.setState({
            materialGroupsInConcept:newMaterialGroups
        })
    }

    handleAdd=(addConcept)=>{
        console.log("concepto")
        console.log(addConcept)
        let materialGroups=this.state.materialGroupsInConcept
        const materialGroupIndex = materialGroups.findIndex(
            materialGroup => materialGroup._id === addConcept._id
        );
        console.log("found")
        console.log(materialGroupIndex)
        console.log(materialGroups)
        if(materialGroupIndex===-1){
            swal({
                title:"Ingresa cantidad",
                content:'input',
                inputValue:"valor",
                showCancelButton:true,
                }).then((value)=>{
                if(!value || isNaN(Number(value)) || Number(value)<=0){
                    swal(`Favor de ingresar un numero mayor a 0, usted ingreso: ${value}`);
                }
                else{
                    console.log(value)
                    addConcept.quantity=value
                    materialGroups.push(addConcept)
                    this.setState({materialGroupsInConcept:materialGroups})
                    // addMaterial.materialQuantity=Number(value);
                    // addMaterial.subtotal=Number(value)*Number(addMaterial.unitPrice);
                    // console.log(addMaterial)
                    // materials.push(addMaterial)
                    // console.log(materials)
                    // materialGroup.auxMaterials=materials
                    // this.setState({
                    //     materialGroup,
                    //     // show:true
                    // })    
                }
            })
        }
    }

    render() {
        const columns = [
            {
            Header: "Clave",
            accessor: "materialGroupKey",
            Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>,
            filterable: true,
            filterMethod: (filter, row) =>
                row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
            },
            {
            Header: "Nombre",
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
            filterMethod: (filter, row) =>
                row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
            },
            {
            Header: "Precio",
            accessor: "unitPrice",
            // headerStyle: {textAlign: 'right'},
            Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>,
            filterMethod: (filter, row) =>
                row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
            },
            {
            Header: props => <span>Operacion a realizar</span>, // Custom header components!
            accessor: "_id",
            Cell: row => (
                <div>
                    <Button variant="primary"
                        data-param={row.value}
                        onClick={() => this.handleAdd(row.original)}
                    >
                        Agregar
                    </Button>
                </div>
                
            )
            }
        ];

        const columns2 = [
            {
            Header: "Clave",
            accessor: "materialGroupKey",
            Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>,
            filterable: true,
            filterMethod: (filter, row) =>
                row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
            },
            {
            Header: "Nombre",
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
            filterMethod: (filter, row) =>
                row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
            },
            {
            Header: "Precio",
            accessor: "unitPrice",
            // headerStyle: {textAlign: 'right'},
            Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>,
            filterMethod: (filter, row) =>
                row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
            },
            {
                Header: "Cantidad",
                accessor: "quantity",
                // headerStyle: {textAlign: 'right'},
                Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>,
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
                        Modificar
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

        return (
            <Layout>
                <div className="concepts">
                    <h1>Conceptos </h1>
                    <Row style={{marginBottom:"2rem",width:"90%"}}> 
                        <Col xs={12} lg={3}>
                            <Form.Label>Clave de Concepto</Form.Label>
                            <Form.Control type="email" placeholder="Clave de Concepto"
                            onChange={this.handleChange('conceptKey')}/>    
                        </Col>
                        <Col xs={12} lg={3}>
                            <Form.Label>Descripcion de Concepto</Form.Label>
                            <Form.Control type="email" placeholder="Descripcion"
                            onChange={this.handleChange('description')}/>    
                        </Col>
                        <Col xs={12} lg={2}>
                            <Form.Label>Unidad</Form.Label>
                            <Form.Control type="email" placeholder="unidad"
                            onChange={this.handleChange('unit')}/>    
                        </Col>
                        <Col xs={12} lg={2}>
                            <Button variant="success" onClick={this.handleSave.bind(this,this.state)}>Guardar</Button>  
                        </Col>
                        <Col xs={12} lg={2}>

                            <Button variant="success" onClick={()=>{
                                    this.props.history.push("/consultaConcepto")
                                }}>Edicion Conceptos</Button>  
                        </Col>
                    </Row>

                    <div className="materials-table-cont" style={{marginBottom:"2rem"}}>
                        <ReactTable
                            data={this.state.materialGroupsInConcept}
                            columns={columns2}
                            defaultPageSize={2}
                            minRows={1}
                            showPaginationBottom= {true}
                        />
                    </div>
                    <div className="materials-table-cont">
                        <Query query={GET_UNITS}>
                            {({ loading, error, data }) => {
                            if (loading) return <Spinner />;
                            if (error) return <p>Error :( recarga la página!</p>;
                            return (
                                <ReactTable
                                data={data.materialGroups}
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
