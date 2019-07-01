import React, { Component } from 'react'
import Layout from "../../../components/Layout/Layout";
import "./Unit.css"
import { Query } from "react-apollo";
import { GET_UNITS, DELETE_UNIT,DUPLICATE_UNIT} from "./constants";
import { withApollo } from "react-apollo";

import ReactTable from "react-table";
import Spinner from "../../../components/Spinner/Spinner";
import Button from 'react-bootstrap/Button'
import swal from 'sweetalert';


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

    searchUnits = () => {
        this.props.client
            .query({
            query: GET_UNITS,
            })
            .then(data => {
                console.log(data)
            })
            .catch(error => {
            console.log("error", error)
        });
    }


    handleDuplicate=(materialGroup)=>{
        console.log(materialGroup)
        console.log("duplicando")
        materialGroup.auxMaterials=materialGroup.auxMaterials.map((aux)=>{
            return aux._id
        })
        console.log(materialGroup)
        
        //TODO VALIDAR NO SEA CLAVE DUPLICADA
        let detalles={}
        swal({
            title:"Ingresa Clave",
            content:'input',
            buttons: true,
            dangerMode: true,
          }).then((value,isConfirm)=>{
              console.log(isConfirm)
            if(!value && value!=null){
                swal(`Favor de ingresar una clave, usted ingreso: ${value}`);
            }
            else if(value===null){

            }
            else{
                detalles.materialGroupKey=value
                swal({
                    title:"Ingresa descripcion",
                    content:'input',
                    buttons: true,
                    dangerMode: true,
                  }).then((value,isConfirm)=>{
                    console.log(isConfirm)
                  if(!value && value!=null){
                      swal(`Favor de ingresar una descripcion, usted ingreso: ${value}`);
                  }
                  else if(value===null){

                    }
                  else{
                    detalles.name=value
                    swal({
                        title:"Ingresa Unidad",
                        content:'input',
                        buttons: true,
                        dangerMode: true,
                      }).then((value,isConfirm)=>{
                        console.log(isConfirm)
                      if(!value && value!=null){
                          swal(`Favor de ingresar una Unidad, usted ingreso: ${value}`);
                      }
                      else if(value===null){

                    }
                      else{
                        detalles.measurementUnit=value
                        detalles.auxMaterials=materialGroup.auxMaterials;
                        detalles.id=materialGroup._id
                        console.log(detalles)
                        this.props.client.mutate({
                            mutation: DUPLICATE_UNIT,
                            variables: { ...detalles }
                        }).then(data => {
                            console.log(data)
                            swal("Proceso de duplicado exitoso!", "Su informacion se ha guardado!", "success");
                        }).catch((err) => { 
                            console.log(err)
                            swal("Proceso de duplicado no exitoso!", "Notificar al programador!", "error");

                         })                
                      }
                    })
                  }
                })
                // addMaterial.materialQuantity=Number(value);
                // addMaterial.subtotal=Number(value)*Number(addMaterial.unitPrice);
                // console.log(addMaterial)
                // materials.push(addMaterial)
                // console.log(materials)
                // this.setState({
                //     materialsInConcept:materials,
                //     // show:true
                // })    
            }
          })
    }

    handleEdit=(materialGroup)=>{
        console.log("editando")
        console.log(materialGroup)
        this.props.history.push("/unitario/"+materialGroup._id)
    }

    handleDelete=(materialGroup)=>{
        console.log("eliminando")
        console.log(materialGroup)
        this.props.client.mutate({
            mutation: DELETE_UNIT,
            variables: { id:materialGroup._id }
        }).then(data => {
            console.log(data.data.deleteMaterialGroup._id)
            swal("Proceso de eliminado exitoso!", "Su informacion se ha removido!", "success");
        }).catch((err) => { 
            console.log(err)
            swal("Proceso de eliminado no exitoso!", "Notificar al programador!", "error");

         })                

    }

    handleUpdate=(materialGroup)=>{
        console.log("actualizando")
        console.log(materialGroup)
    }

    handleSave=()=>{
        this.searchUnits()
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

                <Button variant="primary"
                    data-param={row.value}
                    onClick={() => this.handleDuplicate(row.original)}
                >
                    Duplicar
                </Button>
                
                <Button variant="success"
                    data-param={row.value}
                    onClick={() => this.handleUpdate(row.original)}
                >
                    Actualizar
                </Button>

                </div>
                
            )
            }
        ];

        console.log(this.state.materialsInConcept.length)
        return (
            <Layout>
                <div className="unit">
                <h1>Edita Precios Unitarios</h1>
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
export default withApollo(UnitPage)