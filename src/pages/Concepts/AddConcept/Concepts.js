import React, { Component } from 'react'
import Layout from "../../../components/Layout/Layout";
import "./Concepts.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Query } from "react-apollo";
import { GET_UNITS, ADD_CONCEPT, CREATE_AUXMATGROUP,GET_CONCEPTS } from "./constants";
import { withApollo } from "react-apollo";

import ReactTable from "react-table";
import Spinner from "../../../components/Spinner/Spinner";
import Button from 'react-bootstrap/Button'
import swal from 'sweetalert';

import { Col, Row } from "react-bootstrap"
import Form from 'react-bootstrap/Form'
let uploaded=0;
let newMaterialGroups = []

export class ConceptsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            conceptKey: null,
            description: null,
            unit: null,
            show: false,
            id: "",
            materialGroupsInConcept: [],
            concepts:[]
        }
    }
    searchUnits=()=>{
        this.props.client
            .query({
            query: GET_CONCEPTS,
            })
            .then(data => {
                console.log(data.data.concepts)
                this.setState({
                    concepts:data.data.concepts
                })
            })
            .catch(error => {
            console.log("error", error)
        });
    }

    componentDidMount=()=>{
        console.log("\n====Pagina de Conceptos\n")
        this.searchUnits();
    }

    updateTotalPrice=(materialGroup,materials)=>{
        console.log("updating")
        console.log(materialGroup)
        let totalPrice=0;
        materials.forEach(auxMaterial => {
            totalPrice += auxMaterial.totalPrice;
        });
        materialGroup.price=totalPrice;
        console.log(totalPrice)
          return materialGroup;
    }


    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    }

    addMaterialToDb=async (materialGroup)=>{
        let auxMaterialGroupInput={
            materialGroup:materialGroup._id,
            quantity:+materialGroup.quantity,
            unitPrice:materialGroup.unitPrice,
            totalPrice:materialGroup.totalPrice,
        }
        console.log("materialgroup")
        console.log(auxMaterialGroupInput)
        await this.props.client.mutate({
            mutation: CREATE_AUXMATGROUP,
            variables:{
                ...auxMaterialGroupInput
            },
        }).then(data => {
            console.log(data)
            console.log(data.data.createAuxMaterialGroup)
            newMaterialGroups.push(data.data.createAuxMaterialGroup)
            uploaded++;
            if(this.state.materialGroupsInConcept.length===uploaded){
                console.log("se cargaron todos")
                let objeto = {
                    conceptKey: this.state.conceptKey,
                    name: this.state.description,
                    measurementUnit: this.state.unit,
                    auxMaterialGroups: newMaterialGroups.map((materialGroup)=>{return materialGroup._id})
                }
                console.log(objeto)
                console.log("new material groups")
                console.log(newMaterialGroups)
                console.log(this.updateTotalPrice(objeto,newMaterialGroups))
                objeto=this.updateTotalPrice(objeto,newMaterialGroups)
                console.log("enviado a db")
                console.log(objeto)
                //     concepto.auxMaterials=materials
                //     this.saveUnit(concepto)
                this.props.client.mutate({
                    mutation: ADD_CONCEPT,
                    variables: { ...objeto },
                    refetchQueries:[{ query: GET_CONCEPTS }]
                }).then(data => {
                    console.log(data.data.createConcept._id)
                    swal(
                        "Proceso de generacion exitoso!",
                        "Su concepto se ha añadido!",
                        "success"
                      ).then(()=>{
                          this.props.history.push("/consultaConcepto")
                      })
                }).catch((err) => { console.log(err) })
            }
        }).catch((err) => { console.log(err) })    
    }
    
    handleSave =  () => {
        console.log("antes")
        console.log(this.state.materialGroupsInConcept)

        let condition=this.state.description===null||this.state.description.length===0
        condition|=this.state.conceptKey==null||this.state.conceptKey.length===0
        condition|=this.state.unit==null||this.state.unit.length===0
        if(condition){
             swal(`Favor de llenar los campos de cantidad, precio unitario y unidad`,"Valores no nulos","error");
        }
        else if(this.state.materialGroupsInConcept.length===null||this.state.materialGroupsInConcept.length===0){
             swal(`Favor de agregar por lo menos un material`,"Materiales en tabla inferior","error");
        }
        else{
            console.log("grabando")
            console.log(this.state.conceptKey)
            console.log(this.state.concepts)
            let concepts=JSON.parse(JSON.stringify(this.state.concepts))
            const conceptIndex = concepts.findIndex(
                concept => concept.conceptKey === this.state.conceptKey
            );
            console.log(conceptIndex)
            if(conceptIndex===-1){
                console.log("clave de concepto nueva")
                this.state.materialGroupsInConcept.forEach(async (materialGroup)=>{
                    await this.addMaterialToDb(materialGroup)
                })
            }
            else{
                swal(
                    "Ya existe un concepto con esa Clave!",
                    "Modificar La Clave",
                    "error"
                  );
            }
        }
    }

    handleEdit = (selectedMaterialGroup) => {
        console.log("editar")
        console.log(selectedMaterialGroup)

        swal({
            title: "Ingresa cantidad de " + selectedMaterialGroup.materialGroupKey,
            content: 'input',
            inputValue: "valor",
            showCancelButton: true,
        }).then((value) => {
            if (!value || isNaN(Number(value)) || Number(value) <= 0) {
                swal(`Favor de ingresar un numero mayor a 0, usted ingreso: ${value}`);
            }
            else {
                console.log(value)
                let materialGroups = this.state.materialGroupsInConcept

                const materialGroupIndex = materialGroups.findIndex(
                    materialGroup => materialGroup._id === selectedMaterialGroup._id
                );
                console.log(materialGroupIndex)
                materialGroups[materialGroupIndex].quantity = value
                materialGroups[materialGroupIndex].totalPrice=(+value)*(+materialGroups[materialGroupIndex].unitPrice)

                this.setState({
                    materialGroupsInConcept: materialGroups
                })

            }
        })

    }
    handleDelete = (selectedMaterialGroup) => {
        console.log("borrar")
        console.log(selectedMaterialGroup)
        let materialGroups = this.state.materialGroupsInConcept
        const materialGroupIndex = materialGroups.findIndex(
            materialGroup => materialGroup._id === selectedMaterialGroup._id
        );
        console.log(materialGroupIndex)
        function spliceNoMutate(myArray, indexToRemove) {
            return myArray.slice(0, indexToRemove).concat(myArray.slice(indexToRemove + 1));
        }
        let newMaterialGroups = spliceNoMutate(materialGroups, materialGroupIndex)
        console.log(newMaterialGroups)
        this.setState({
            materialGroupsInConcept: newMaterialGroups
        })
    }

    handleAdd = (addConcept) => {
        console.log("concepto")
        console.log(addConcept)
        let materialGroups = this.state.materialGroupsInConcept
        const materialGroupIndex = materialGroups.findIndex(
            materialGroup => materialGroup._id === addConcept._id
        );
        console.log("found")
        console.log(materialGroupIndex)
        console.log(materialGroups)
        if (materialGroupIndex === -1) {
            swal({
                title: "Ingresa cantidad",
                content: 'input',
                inputValue: "valor",
                showCancelButton: true,
            }).then((value) => {
                if (!value || isNaN(Number(value)) || Number(value) <= 0) {
                    swal(`Favor de ingresar un numero mayor a 0, usted ingreso: ${value}`);
                }
                else {
                    console.log(value)
                    addConcept.quantity = value
                    addConcept.unitPrice=+addConcept.totalPrice
                    addConcept.totalPrice=(+value)*(+addConcept.unitPrice)
                    console.log("addConcept")
                    console.log(addConcept)
                    materialGroups.push(addConcept)
                    this.setState({ materialGroupsInConcept: materialGroups })
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
                accessor: "totalPrice",
                // headerStyle: {textAlign: 'right'},
                Cell: row => <div style={{ textAlign: "center" }}>${row.value.toFixed(2)}</div>,
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
                            <FontAwesomeIcon icon={['fa', 'plus']} size={"1x"}/>

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
                Header: "Subtotal",
                accessor: "totalPrice",
                // headerStyle: {textAlign: 'right'},
                Cell: row => <div style={{ textAlign: "center" }}>${row.value.toFixed(2)}</div>,
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
                    <h1>Genera Concepto </h1>
                    <Row style={{ marginBottom: "2rem", width: "90%" }}>
                        <Col xs={12} lg={3}>
                            <Form.Label>Clave de Concepto</Form.Label>
                            <Form.Control type="email" placeholder="Clave de Concepto"
                                onChange={this.handleChange('conceptKey')} />
                        </Col>
                        <Col xs={12} lg={3}>
                            <Form.Label>Descripcion de Concepto</Form.Label>
                            <Form.Control type="email" placeholder="Descripcion"
                                onChange={this.handleChange('description')} />
                        </Col>
                        <Col xs={12} lg={2}>
                            <Form.Label>Unidad</Form.Label>
                            <Form.Control type="email" placeholder="unidad"
                                onChange={this.handleChange('unit')} />
                        </Col>
                        <Col xs={12} lg={2}>
                            <Button variant="success" onClick={this.handleSave.bind(this, this.state)}>Guardar</Button>
                        </Col>
                        <Col xs={12} lg={2}>

                            <Button variant="success" onClick={() => {
                                this.props.history.push("/consultaConcepto")
                            }}>Edicion Conceptos</Button>
                        </Col>
                    </Row>

                    {this.state.materialGroupsInConcept.length>0 &&<div className="materials-table-cont" style={{ marginBottom: "2rem" }}>
                        <ReactTable
                            data={this.state.materialGroupsInConcept}
                            columns={columns2}
                            defaultPageSize={4}
                            minRows={1}
                            showPaginationBottom={true}
                        />
                    </div>
                    }
                    <h1>Agregar Precio Unitario </h1>

                    <div className="materials-table-cont">
                        <Query query={GET_UNITS}>
                            {({ loading, error, data }) => {
                                if (loading) return <Spinner />;
                                if (error) return <p>Error :( recarga la página!</p>;
                                return (
                                    <ReactTable
                                        data={data.materialGroups}
                                        columns={columns}
                                        defaultPageSize={4}
                                        minRows={1}
                                        showPaginationBottom={true}

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
