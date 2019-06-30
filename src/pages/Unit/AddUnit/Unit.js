import React, { Component } from 'react'
import Layout from "../../../components/Layout/Layout";
import "./Unit.css"
import { Query } from "react-apollo";
import { GET_MATERIALS } from "../../Materials/constants";
import ReactTable from "react-table";
import Spinner from "../../../components/Spinner/Spinner";
import { Col, Row } from "react-bootstrap"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import swal from 'sweetalert';

import { GET_UNITS,ADD_MATERIAL,ADD_UNIT } from "./constants";
import { withApollo } from "react-apollo";
let subidos=0;
let materialesAux=[]

export class UnitPage extends Component {

    constructor(props) {
            super(props);
            this.state = { 
                conceptKey:null,
                description:null,
                unit:null,
                show:false,
                id:"",
                materialsInConcept:[]
        }
    }
    saveUnit=(materialGroup)=>{
        console.log("saving")
        console.log(materialGroup)
        
        this.props.client.mutate({
            mutation: ADD_UNIT,
            variables: { ...materialGroup }
        }).then(data => {
            console.log(`created material group: ${data.data.createMaterialGroup._id}`)
            // materialesAux.push(data.data.createAuxMaterial._id)
            // subidos++;
            // if(this.state.materialsInConcept.length===subidos){
            //     console.log("termine2")
            //     console.log(materialesAux)
            //     this.saveUnit(concepto)
            // }
        }).catch((err) => { console.log(err) })
    }

    addMaterial=async (materialInput,concepto)=>{
        materialInput._id=null;
        materialInput.totalQuantity=materialInput.quantity
            await this.props.client.mutate({
                mutation: ADD_MATERIAL,
                variables: { ...materialInput }
            }).then(data => {
                // console.log(data.data.createAuxMaterial._id)
                materialesAux.push(data.data.createAuxMaterial._id)
                subidos++;
                if(this.state.materialsInConcept.length===subidos){
                    console.log("termine2")
                    console.log(materialesAux)
                    concepto.auxMaterials=materialesAux
                    this.saveUnit(concepto)
                }
            }).catch((err) => { console.log(err) })
    }

    searchUnits = () => {
        this.props.client
            .query({
            query: GET_UNITS,
            })
            .then(data => {
                console.log(data)
            // const foundCustomers = data.data.clients.filter(client =>
            //     client.name.toUpperCase().includes(this.state.customer.toUpperCase()) ||
            //     client.email.toUpperCase().includes(this.state.customer.toUpperCase()) ||
            //     client.company.toUpperCase().includes(this.state.customer.toUpperCase()))
            // this.setState({ foundCustomers })
            })
            .catch(error => {
            console.log("error", error)
            // if (error.graphQLErrors && error.graphQLErrors.length > 0)
            //     console.log(`error: ${error.graphQLErrors[0].message}`)
            // this.setState({
            //     error: true
            // })
        });
    }


    handleAdd = (addMaterial) => {
        console.log("Add")
        console.log(addMaterial)
        let materials=this.state.materialsInConcept
        console.log(materials)
        const materialIndex = materials.findIndex(
            material => material._id === addMaterial._id
        );
        console.log("found")
        console.log(materialIndex)
        if(materialIndex===-1){
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
                    addMaterial.materialQuantity=Number(value);
                    addMaterial.subtotal=Number(value)*Number(addMaterial.unitPrice);
                    console.log(addMaterial)
                    materials.push(addMaterial)
                    console.log(materials)
                    this.setState({
                        materialsInConcept:materials,
                        // show:true
                    })    
                }
              })
        }
        else{
            swal(`Ya cuenta con ese material`);
        }
    }

    handleEdit=(selectedMaterial)=>{
        swal({
            title:`Editar cantidad de: ${selectedMaterial.materialKey}`,
            content:'input',
            inputValue:"valor",
            showCancelButton:true,
          }).then((value)=>{
            if(!value || isNaN(Number(value)) || Number(value)<=0){
                swal(`Favor de ingresar un numero mayor a 0, usted ingreso: ${value}`);
            }
            else{
                selectedMaterial.materialQuantity=value
                selectedMaterial.subtotal=Number(value)*Number(selectedMaterial.unitPrice);
                let materials=this.state.materialsInConcept
                const materialIndex = materials.findIndex(
                    material => material._id === selectedMaterial._id
                );
                materials[materialIndex]=selectedMaterial
                this.setState({
                    materialsInConcept:materials
                  })
            }
        })
    }

    handleDelete=(material)=>{
        console.log(material)
        let materials=this.state.materialsInConcept
        let deleteMaterial=material
        function spliceNoMutate(myArray,indexToRemove) {
            return myArray.slice(0,indexToRemove).concat(myArray.slice(indexToRemove+1));
          }
        //   const { accessories } = cache.readQuery({ query: GET_ACCESSORIES });
          const materialIndex = materials.findIndex(
            material => material._id === deleteMaterial._id
          );
          console.log(materialIndex)
          materials=spliceNoMutate(materials,materialIndex)
          console.log(materials)
          this.setState({
            materialsInConcept:materials
          })

    }

    handleSave= ()=>{
       let condition=this.state.description===null||this.state.description.length===0
       condition|=this.state.conceptKey==null||this.state.conceptKey.length===0
       condition|=this.state.unit==null||this.state.unit.length===0
       if(condition){
            swal(`Favor de llenar los campos de cantidad, precio unitario y unidad`);
       }
       else if(this.state.materialsInConcept.length===null||this.state.materialsInConcept.length===0){
            swal(`Favor de agregar por lo menos un material`);
       }
       else{
            console.log(this.state.materialsInConcept)
            let concepto={
                name:this.state.description,
                materialGroupKey:this.state.conceptKey,
                measurementUnit:this.state.unit,
                auxMaterials:this.state.materialsInConcept
            }
            console.log(concepto)
            let subidos=0;
            concepto.auxMaterials.forEach(async (materialInput)=>{
                this.addMaterial(materialInput,concepto)
            })
        }
    }

    handleChange = name => event => {
        this.setState({ 
            [name]: event.target.value ,
        });
    }

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
            Header: "Cantidad",
            accessor: "quantity",
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
                <Button variant="success"
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
            accessor: "materialKey",
            Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>,
            },
            {
            Header: "Nombre",
            accessor: "name",
            Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>,
            },
            {
            Header: "Unidad",
            accessor: "measurementUnit",
            Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>,
            },
            {
            Header: "Cantidad",
            accessor: "materialQuantity",
            Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>,
            filterMethod: (filter, row) =>
                row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
            },
            {
            Header: "Subtotal",
            accessor: "subtotal",
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
        return (
            <Layout>
                <div className="unit">
                    <h1>Agrega Precios Unitarios</h1>
                    <Row style={{marginBottom:"2rem",width:"90%"}}> 
                        <Col xs={12} lg={3}>
                            <Form.Label>Cantidad</Form.Label>
                            <Form.Control type="email" placeholder="Clave de Concepto"
                            onChange={this.handleChange('conceptKey')}/>    
                        </Col>
                        <Col xs={12} lg={3}>
                            <Form.Label>Precio unitario</Form.Label>
                            <Form.Control type="email" placeholder="Descripcion"
                            onChange={this.handleChange('description')}/>    
                        </Col>
                        <Col xs={12} lg={3}>
                            <Form.Label>Unidad</Form.Label>
                            <Form.Control type="email" placeholder="unidad"
                            onChange={this.handleChange('unit')}/>    
                        </Col>
                        <Col xs={12} lg={3}>
                            <Button variant="success" onClick={this.handleSave.bind(this,this.state)}>Guardar</Button>  
                        </Col>
                    </Row>

                    {this.state.materialsInConcept.length>0 && <div className="materials-table-cont">
                        <ReactTable
                            data={this.state.materialsInConcept}
                            columns={columns2}
                            showPaginationBottom= {false}
                            minRows={1}
                        />
                    </div>
                    }

                    <div className="materials-table-cont">
                        <Query query={GET_MATERIALS}>
                            {({ loading, error, data }) => {
                            if (loading) return <Spinner />;
                            if (error) return <p>Error :( recarga la página!</p>;
                            return (
                                <ReactTable
                                data={data.materials}
                                columns={columns}
                                defaultPageSize={2}
                                showPaginationBottom= {false}

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
export default withApollo(UnitPage)