import React, { Component } from 'react'
import Layout from "../../../components/Layout/Layout";
import "./Concepts.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Query } from "react-apollo";
import { GET_CONCEPT,DELETE_AUXMATGROUP,GET_AUXMATGROUPS,CREATE_AUXMATGROUP,UPDATE_CONCEPT,UPDATE_AUXMAT } from "./constants";
import { withApollo } from "react-apollo";

import ReactTable from "react-table";
import Spinner from "../../../components/Spinner/Spinner";
import Button from 'react-bootstrap/Button'
import swal from 'sweetalert';

export class ConceptsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            conceptKey: null,
            description: null,
            unit: null,
            show: false,
            id: "",
            auxMaterialGroupsInConcept: [],
            concept: [],
            materialGroups:[],
            first:false
            // modalShow:false
        }
    }

    componentDidMount=()=>{
        console.log("================pagina Detalle de conceptos")
    }

    handleEdit = (selectedAuxMaterialGroup) => {
        console.log("edit")
        console.log(selectedAuxMaterialGroup)
        console.log(selectedAuxMaterialGroup.materialGroup)
        let editedAuxMaterialGroup=JSON.parse(JSON.stringify(selectedAuxMaterialGroup))
        swal({
            title: "Ingresa cantidad",
            content: 'input',
            buttons: true,
            dangerMode: true,
        }).then( async (value) => {
            if(value===null){
            }
            else if( isNaN(Number(value)) || Number(value) <= 0) {
                swal(`Favor de ingresar un numero mayor a 0, usted ingreso: ${value}`);
            }
            else {
                console.log(`El valor seleccionado es ${value}`)
                editedAuxMaterialGroup.quantity=+value
                editedAuxMaterialGroup.totalPrice=+value*editedAuxMaterialGroup.unitPrice
                editedAuxMaterialGroup.Mo=(+value)*(selectedAuxMaterialGroup.materialGroup.Mo)
                editedAuxMaterialGroup.noMo=(+value)*(selectedAuxMaterialGroup.materialGroup.noMo)

                console.log("modificado")
                console.log(editedAuxMaterialGroup)
                let auxMaterialsGroups=JSON.parse(JSON.stringify(this.state.concept.auxMaterialGroups))
                const materialGroupIndex = auxMaterialsGroups.findIndex(
                  auxMaterialGroup => auxMaterialGroup._id === editedAuxMaterialGroup._id
                );
                console.log(materialGroupIndex)
                auxMaterialsGroups[materialGroupIndex]=editedAuxMaterialGroup
                let newConcept=this.state.concept
                newConcept.auxMaterialGroups=auxMaterialsGroups
                console.log("concepto editado enviado a db")
                console.log(newConcept)
                this.props.client.mutate({
                    mutation: UPDATE_AUXMAT,
                    variables: { id:editedAuxMaterialGroup._id,
                        ...editedAuxMaterialGroup,
                        materialGroup:editedAuxMaterialGroup.materialGroup._id
                    }
                }).then(data => {
                    console.log("=====updated auxMatGroup")
                    console.log(data.data.updateAuxMaterialGroup)
                    this.setState({concept:newConcept})
                    swal(
                        "Proceso de actualizacion exitoso!",
                        "Su concepto se ha modificado!",
                        "success"
                      );
                }).catch((err) => { console.log(err) })
            }
        })
      
    }

    handleModalClose = () => this.setState({ modalShow: false });


    handleAdd=(selectedMaterialGroup)=>{
        console.log("adding")
        console.log(selectedMaterialGroup)
        // let auxMaterialGroups = this.state.concept.auxMaterialGroups
        let auxMaterialGroups=JSON.parse(JSON.stringify(this.state.concept.auxMaterialGroups))
        let addedMaterialGroup=JSON.parse(JSON.stringify(selectedMaterialGroup))
        // let materials = this.state.materialGroup.auxMaterials
        // console.log("busqueda de index")
        // console.log(`seleccionado: ${selectedMaterialGroup.materialGroupKey}`)

        const materialGroupIndex = auxMaterialGroups.findIndex(
          (auxMaterialGroup) => {
            //   console.log(auxMaterialGroup.materialGroup.materialGroupKey)
              return auxMaterialGroup.materialGroup.materialGroupKey === selectedMaterialGroup.materialGroupKey
          }
        );
        // console.log(`index encontrado ${materialGroupIndex}`)
        if (materialGroupIndex === -1) {
          swal({
            title: "Ingresa cantidad",
            content: 'input',
            buttons: true,
            dangerMode: true,
        }).then( async (value) => {
            if(value===null){
            }
            else if( isNaN(Number(value)) || Number(value) <= 0) {
                swal(`Favor de ingresar un numero mayor a 0, usted ingreso: ${value}`);
            }
            else {
            console.log(`agregando cantidad: ${value}`)
            // let addedMaterialGroup={
            // }
            addedMaterialGroup.materialGroup=selectedMaterialGroup._id
            addedMaterialGroup.quantity=+value
            addedMaterialGroup.unitPrice=+selectedMaterialGroup.totalPrice
            addedMaterialGroup.totalPrice=+value*+selectedMaterialGroup.totalPrice
            addedMaterialGroup.Mo=(+value)*+(selectedMaterialGroup.Mo)
            addedMaterialGroup.noMo=(+value)*+(selectedMaterialGroup.noMo)

            auxMaterialGroups.push(addedMaterialGroup)
            console.log("lista consolidada de auxMaterial")
            console.log(auxMaterialGroups)
            await this.props.client.mutate({
                mutation: CREATE_AUXMATGROUP,
                variables:{
                    ...addedMaterialGroup
                }
            }).then(data => {
                console.log("auxMaterialGroup generado")
                let auxMatGroupGen=data.data.createAuxMaterialGroup
                console.log(auxMatGroupGen)
                let newConcept=JSON.parse(JSON.stringify(this.state.concept))
                let newAuxMaterialsGroups=JSON.parse(JSON.stringify(this.state.concept.auxMaterialGroups))
                newAuxMaterialsGroups.push(auxMatGroupGen)
                newConcept.auxMaterialGroups=newAuxMaterialsGroups
                newConcept.price+=auxMatGroupGen.totalPrice
                newConcept.Mo+=auxMatGroupGen.Mo
                newConcept.noMo+=auxMatGroupGen.noMo
                // console.log("nuevos auxmaterials")
                // console.log(newAuxMaterialsGroups)
                console.log("concepto generado enviado a db")
                console.log(newConcept)
                
                this.props.client.mutate({
                    mutation: UPDATE_CONCEPT,
                    variables: { id:newConcept._id,
                        ...newConcept,
                        auxMaterialGroups:newConcept.auxMaterialGroups.map((auxMaterialGroup)=>{
                            return(auxMaterialGroup._id)
                        })
                    }
                }).then(data => {
                    console.log("updated concept")
                    console.log(data.data.updateConcept)
                    this.setState({concept:newConcept})
                    swal(
                        "Proceso de actualizacion exitoso!",
                        "Su concepto se ha modificado!",
                        "success"
                      );
                }).catch((err) => { console.log(err) })
            }).catch((err) => { console.log(err) })    
            }
          })
        }
        else{
          swal(
            "Proceso de adicion no exitoso!",
            "Su material ya existe en el precio unitario, modifique la cantidad",
            "error"
          );
    
        }
    
    }

    handleDelete = (selectedAuxMaterialGroup) => {
        console.log("====borrar auxMaterialGroup")
        console.log(selectedAuxMaterialGroup)
        swal({
            title: "¿Estás seguro de que deseas eliminar?",
            buttons: true,
            dangerMode: true,
          }).then( async (value) => {
              if(value===null){
              }
              else {
                this.props.client
                .mutate({
                  mutation: DELETE_AUXMATGROUP,
                  variables: { id: selectedAuxMaterialGroup._id },
                })
                .then(data => {
                console.log("elemento que fue borrado")
                  console.log(data.data.deleteAuxMaterialGroup)
                  let auxMaterialsGroups=this.state.concept.auxMaterialGroups
                  const materialGroupIndex = auxMaterialsGroups.findIndex(
                    auxMaterialGroup => auxMaterialGroup._id === selectedAuxMaterialGroup._id
                  );
                //   console.log(materialGroupIndex)
                  function spliceNoMutate(myArray, indexToRemove) {
                      return myArray.slice(0, indexToRemove).concat(myArray.slice(indexToRemove + 1));
                  }
                  let newConcept=this.state.concept
                  let newAuxMaterialsGroups = spliceNoMutate(auxMaterialsGroups, materialGroupIndex)
                  newConcept.auxMaterialGroups=newAuxMaterialsGroups
                //   console.log(newAuxMaterialsGroups)
                  this.setState({
                    concept: newConcept
                  })
                  swal(
                    "Proceso de eliminado exitoso!",
                    "Su informacion se ha removido!",
                    "success"
                  );
                })
                .catch(err => {
                  swal(
                    "Proceso de eliminado no exitoso!",
                    "Notificar al programador!",
                    "error"
                  );
                });
              }
        })        
    }

    render() {
        const columns = [
            {
                Header: "Clave",
                accessor: "materialGroup.materialGroupKey",
                Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>,
                // filterable: true,
                // filterMethod: (filter, row) =>
                //     row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
            },
            {
                Header: "Nombre",
                accessor: "materialGroup.name",
                Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>,
                // filterable: true,
                // filterMethod: (filter, row) =>
                //     row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
            },
            {
                Header: "Cantidad",
                accessor: "quantity",
                Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>,
                
            },
            {
                Header: "Precio",
                accessor: "unitPrice",
                Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>,
            },

            {
                Header: "Subtotal",
                accessor: "totalPrice",
                Cell: row => <div style={{ textAlign: "center" }}>${row.value.toFixed(2)}</div>,
            },

            {
                Header: props => <span>Operacion a realizar</span>, // Custom header components!
                accessor: "_id",
                Cell: row => (
                    <div style={{textAlign:"center"}}>
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
            },

            {
                Header: "Precio",
                accessor: "totalPrice",
                Cell: row => <div style={{ textAlign: "center" }}>${row.value.toFixed(2)}</div>,
            },

            {
                Header: props => <span>Operacion a realizar</span>, // Custom header components!
                accessor: "_id",
                Cell: row => (
                    <div style={{textAlign:"center"}}>
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


        return (
            <Layout>
                <div className="concepts">
                    <h1>Edicion de Concepto: {this.state.concept.conceptKey}</h1>
                    {/* {this.state.first&& */}

                    <div className="materials-table-cont">
                            <Query
                            query={GET_CONCEPT}
                            variables={{ id: this.props.match.params.id }}
                            onCompleted={data => {
                                console.log(` al terminar busqueda concepto: ${this.props.match.params.id}`)
                                console.log(data.concept.auxMaterialGroups)
                                this.setState({ concept: data.concept,
                                // first:true
                            })
                            }}
                        >
                            {({ loading, error, data }) => {
                                // console.log("CONCEPTO")
                                // // console.log(data)
                                // // console.log(data.concept)
                                // console.log(this.state.concept)
                                if (loading) return <Spinner />;
                                if (error) return <p>Error :( recarga la página!</p>;
                                return (
                                    <ReactTable
                                        data={this.state.concept.auxMaterialGroups}
                                        columns={columns}
                                        defaultPageSize={4}
                                        minRows={0}
                                        showPaginationBottom={true}

                                    />
                                );
                            }}
                        </Query>
                    </div>
                    <h1>Agregar Precio Unitario </h1>

                        <div className="materials-table-cont">
                            <Query
                                query={GET_AUXMATGROUPS}
                                // onCompleted={data => {
                                //     console.log("al terminar auxMaterialsGroupsInDb")
                                //     console.log(data)
                                //     // console.log(data.concept.auxMaterialGroups)
                                //     this.setState({ materialGroups: data.materialGroups,
                                //     first:true
                                //     })
                                // }}
                            >
                                {({ loading, error, data }) => {
                                    console.log("auxMaterialsGroupsInDb")
                                    // console.log(data.materialGroups)
                                    // console.log(data.concept)
                                    // console.log(this.state.concept)
                                    if (loading) return <Spinner />;
                                    if (error) {
                                        console.log(error)
                                        return <p>Error :( recarga la página!</p>;}
                                    return (
                                        <ReactTable
                                            // data={this.state.materialGroups}
                                            data={data.materialGroups}
                                            columns={columns2}
                                            defaultPageSize={2}
                                            minRows={0}
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
