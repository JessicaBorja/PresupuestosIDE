import React, { Component } from 'react'
import Layout from "../../../components/Layout/Layout";
import "./Unit.css"
import { Query } from "react-apollo";
import ReactTable from "react-table";
import Spinner from "../../../components/Spinner/Spinner";
import { Col, Row } from "react-bootstrap"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import swal from 'sweetalert';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { GET_MATERIALS, ADD_MATERIAL,ADD_UNIT ,GET_UNITS} from "./constants";
import { withApollo } from "react-apollo";
// import { join } from 'path';

let subidos=0;
let materials=[]

 

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
                units:[]
        }
    }

    componentDidMount=()=>{
        console.log("\n====pagina de precios unitarios\n")
        subidos=0;
        materials=[]
        this.searchUnits();
    }

    updateTotalPrice=(materialGroup,materials)=>{
        console.log("updating")
        console.log(materialGroup)
        let Mo=0;
        let noMo=0;
        let totalPrice=0;
        materials.forEach(auxMaterial => {
            totalPrice += auxMaterial.totalPrice;
            if(auxMaterial.materialKey.slice(0,2)==="MO")
                Mo+=auxMaterial.totalPrice
            else
                noMo+=auxMaterial.totalPrice
        });
        materialGroup.totalPrice=totalPrice;
        materialGroup.Mo=Mo;
        materialGroup.noMo=noMo;
        console.log(totalPrice)
          return materialGroup;
    }

    saveUnit=(materialGroup)=>{
        console.log("saving")
        // this.searchUnits();
        materialGroup=this.updateTotalPrice(materialGroup,this.state.materialsInConcept)
        materialGroup.auxMaterials=materialGroup.auxMaterials.map((material)=>{ return material._id})
        console.log(materialGroup)

        this.props.client.mutate({
            mutation: ADD_UNIT,
            variables: { ...materialGroup },
            refetchQueries:[{ query: GET_UNITS }]
        }).then(data => {
            console.log(`created material group: ${data.data.createMaterialGroup._id}`)
            swal(
                "Proceso de generacion exitoso!",
                "Su precio unitario se ha añadido!",
                "success"
              ).then((value)=>{
                this.props.history.push("/consultaUnitario")
            });
        }).catch((err) => { console.log(err) })
    }

    addMaterial=async (materialInput,concepto)=>{
            await this.props.client.mutate({
                mutation: ADD_MATERIAL,
                variables: { ...materialInput,
                    materialQuantity:+materialInput.materialQuantity,
                    totalQuantity:materialInput.quantity,
                    _id:null
                 }
            }).then(data => {
                console.log(`created aux material :${data.data.createAuxMaterial._id}`)
                materials.push(data.data.createAuxMaterial)
                subidos++;
                // si se terminaron de generar los auxmaterials
                if(this.state.materialsInConcept.length===subidos){
                    console.log("termine2")
                    console.log(this.state.materialsInConcept)
                    concepto.auxMaterials=materials
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
                console.log(data.data.materialGroups)
                this.setState({
                    units:data.data.materialGroups
                })
            })
            .catch(error => {
            console.log("error", error)
        });
    }


    handleAdd = (addMaterial) => {
        console.log("Add")
        console.log(addMaterial)
        console.log(addMaterial.unitPrice)
        let materials=this.state.materialsInConcept
        console.log(materials)
        const materialIndex = materials.findIndex(
            material => material._id === addMaterial._id
        );
        console.log("found")
        console.log(materialIndex)
        let typicalDialog=()=>{
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
                    // addMaterial.subtotal=Number(value)*Number(addMaterial.unitPrice);
                    addMaterial.totalPrice=(+addMaterial.materialQuantity)*(+addMaterial.unitPrice)
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

        if(materialIndex===-1){
            if(addMaterial.unitPrice<=0){
                // alert("hola")
                swal({
                    title:"El material seleccionado tiene un precio de 0"
                }).then(()=>{
                    typicalDialog()
                })
            }
            else{
                typicalDialog()
            }
         
        
        
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
                selectedMaterial.totalPrice=Number(value)*Number(selectedMaterial.unitPrice);
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
            console.log(this.state.conceptKey)
            console.log(this.state.units)
            let units=JSON.parse(JSON.stringify(this.state.units))
            const materialGroupIndex = units.findIndex(
                materialGroup => materialGroup.materialGroupKey === this.state.conceptKey
            );
            console.log(materialGroupIndex)
            if(materialGroupIndex===-1){
                console.log("clave nueva")
                console.log(this.state.materialsInConcept)
                let concepto={
                    name:this.state.description,
                    materialGroupKey:this.state.conceptKey,
                    measurementUnit:this.state.unit,
                    auxMaterials:this.state.materialsInConcept
                }
                console.log(concepto)
                concepto.auxMaterials.forEach(async (materialInput)=>{
                    this.addMaterial(materialInput,concepto)
                })    
            }
            else{
                swal(
                    "Ya existe un Precio Unitario con esa Clave!",
                    "Modificar La Clave",
                    "error"
                  );
            }
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
            filterable: true,
            filterMethod: (filter, row) =>{
                if(row[filter.id]===null){
                  if("indefinido".includes(filter.value)){
                    console.log(row[filter.id])
                    return(true)
                  }
                }
                else{
                  return(row[filter.id].toLowerCase().includes(filter.value.toLowerCase()))
                }
              },
            Cell: row => 
              <div style={{ textAlign: "center" }}>
              {row.value===null?"indefinido":row.value}
              </div>  
            },
            {
            Header: "Nombre",
            accessor: "name",
            filterable: true,
            filterMethod: (filter, row) =>{
                if(row[filter.id]===null){
                  if("indefinido".includes(filter.value)){
                    console.log(row[filter.id])
                    return(true)
                  }
                }
                else{
                  return(row[filter.id].toLowerCase().includes(filter.value.toLowerCase()))
                }
              },
            Cell: row => 
              <div style={{ textAlign: "center" }}>
              {row.value===null?"indefinido":row.value}
              </div>  
            },
            {
            Header: "Unidad",
            accessor: "measurementUnit",
            Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>,
            },
            {
            Header: "Cantidad",
            accessor: "quantity",
            Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>,
            },
            {
            Header: "Precio",
            accessor: "unitPrice",
            // headerStyle: {textAlign: 'right'},
            Cell: row => <div style={{ textAlign: "center" }}>${row.value.toFixed(2)}</div>,
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
                  <FontAwesomeIcon icon={['fa', 'plus']} size={"1x"}/>

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
                    <FontAwesomeIcon icon={['fa', 'edit']} size={"1x"}/>
                </Button>
                <Button variant="danger"
                    data-param={row.value}
                    onClick={() => this.handleDelete(row.original)}
                >
                    <FontAwesomeIcon icon={['fa', 'trash']} size={"1x"}/>
                </Button>
                </div>
            )
            }
        ];

        // console.log(this.state.materialsInConcept.length)
        return (
            <Layout>
                <div className="unit">
                    <h1>Agrega Precios Unitarios</h1>
                    <Row style={{marginBottom:"2rem",width:"90%"}}> 
                        <Col xs={12} lg={3}>
                            <Form.Label>Clave</Form.Label>
                            <Form.Control type="email" placeholder="Clave de Precio Unitario"
                            onChange={this.handleChange('conceptKey')}/>    
                        </Col>
                        <Col xs={12} lg={3}>
                            <Form.Label>Nombre/descripción </Form.Label>
                            <Form.Control type="email" placeholder="Descripcion de Precio Unitario"
                            onChange={this.handleChange('description')}/>    
                        </Col>
                        <Col xs={12} lg={2}>
                            <Form.Label>Unidad</Form.Label>
                            <Form.Control type="email" placeholder="Unidad de Precio Unitario"
                            onChange={this.handleChange('unit')}/>    
                        </Col>
                        <Col xs={12} lg={2}>
                            <Button variant="success" onClick={this.handleSave.bind(this,this.state)}>Guardar</Button>  
                        </Col>
                        <Col xs={12} lg={2}>
                            <Button variant="success" onClick={()=>{
                                this.props.history.push("/consultaUnitario")
                            }}>Edicion Unitarios</Button>  
                        </Col>
                    </Row>

                    <h1>Agregar Material</h1>

                    {this.state.materialsInConcept.length>0 && <div className="materials-table-cont">
                        <ReactTable
                            data={this.state.materialsInConcept}
                            columns={columns2}
                            defaultPageSize={4}
                            minRows={1}
                            showPaginationBottom={true}
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
export default withApollo(UnitPage)