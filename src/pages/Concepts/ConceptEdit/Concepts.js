import React, { Component } from 'react'
import Layout from "../../../components/Layout/Layout";
import "./Concepts.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Query } from "react-apollo";
import { GET_CONCEPTS, ADD_CONCEPT, DELETE_CONCEPT,DUPLICATE_CONCEPT} from "./constants";
import { withApollo } from "react-apollo";

import ReactTable from "react-table";
import Spinner from "../../../components/Spinner/Spinner";
import Button from 'react-bootstrap/Button'
import swal from 'sweetalert';

// import { Col, Row } from "react-bootstrap"
// import Form from 'react-bootstrap/Form'

export class ConceptsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            conceptKey: null,
            description: null,
            unit: null,
            show: false,
            id: "",
            materialGroupsInConcept: []
        }
    }

    componentDidMount=()=>{
        console.log("================pagina Edicion de conceptos")
    }
    updateTotalPrice=(materialGroup,materials)=>{
        console.log("updating")
        console.log(materialGroup)
        let totalPrice=0;
        materials.forEach(auxMaterial => {
            totalPrice += auxMaterial.totalPrice;
        });
        materialGroup.totalPrice=totalPrice;
        console.log(totalPrice)
          return materialGroup;
    }


    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    }

    handleSave = () => {
        console.log("grabando")
        let newMaterialGroups = this.state.materialGroupsInConcept.map((materialGroup) => {
            return materialGroup._id
        })
        console.log(newMaterialGroups)
        let objeto = {
            conceptKey: this.state.conceptKey,
            name: this.state.description,
            measurementUnit: this.state.unit,
            materialGroups: newMaterialGroups
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

    handleEdit = (concept) => {
        console.log("edit")
        console.log(concept)
        this.props.history.push("/concepto/" + concept._id)
    }

    handleDuplicate = (selectedConcept) => {
    console.log("duplicar")
    console.log(selectedConcept)
            //TODO VALIDAR NO SEA CLAVE DUPLICADA
    let detalles = {};
    swal({
      title: "Ingresa Clave",
      content: "input",
      buttons: true,
      dangerMode: true
    }).then((value, isConfirm) => {
      console.log(isConfirm);
      if (!value && value != null) {
        swal(`Favor de ingresar una clave, usted ingreso: ${value}`);
      } else if (value === null) {
      } else {
        detalles.conceptKey = value;
        swal({
          title: "Ingresa descripcion",
          content: "input",
          buttons: true,
          dangerMode: true
        }).then((value, isConfirm) => {
          console.log(isConfirm);
          if (!value && value != null) {
            swal(`Favor de ingresar una descripcion, usted ingreso: ${value}`);
          } else if (value === null) {
          } else {
            detalles.name = value;
            swal({
              title: "Ingresa Unidad",
              content: "input",
              buttons: true,
              dangerMode: true
            }).then((value, isConfirm) => {
              console.log(isConfirm);
              if (!value && value != null) {
                swal(`Favor de ingresar una Unidad, usted ingreso: ${value}`);
              } else if (value === null) {
              } else {
                // let materialGroup
            detalles.measurementUnit = value;
            detalles.id =selectedConcept._id;
            console.log(detalles);
                this.props.client
                  .mutate({
                    mutation: DUPLICATE_CONCEPT,
                    variables: { ...detalles },
                    refetchQueries:[{ query: GET_CONCEPTS }]
                  })
                  .then(data => {
                    console.log(data);
                    console.log(data.data.createConceptCopy)
                    swal(
                      "Proceso de duplicado exitoso!",
                      "Su informacion se ha guardado!",
                      "success"
                    );
                  })
                  .catch(err => {
                    console.log(err);
                    swal(
                      "Proceso de duplicado no exitoso!",
                      "Notificar al programador!",
                      "error"
                    );
                  });
              }
            });
          }

    })
}})
    }

    handleDelete = (selectedConcept) => {
        console.log("borrar")
        console.log(selectedConcept)
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
                    mutation: DELETE_CONCEPT,
                    variables: { id: selectedConcept._id },
                    refetchQueries:[{ query: GET_CONCEPTS }]
                })
                .then(data => {
                    // console.log(data.data.deleteMaterialGroup._id)
                    //   console.log(data.data.deleteAuxMaterial);
                    console.log(data)
                    swal(
                        "Proceso de eliminado exitoso!",
                        "Su informacion se ha removido!",
                        "success"
                    );
                })
                .catch(err => {
                    console.log(err);
                    swal(
                        "Proceso de eliminado no exitoso!",
                        "Notificar al programador!",
                        "error"
                    );
                });    
              }   
        })
    }

    handleUpdate = (concept) => {
        console.log("actualizar")
        console.log(concept)
    }

    render() {
        const columns = [
            {
                Header: "Clave",
                accessor: "conceptKey",
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
                accessor: "price",
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

                        <Button variant="primary"
                            data-param={row.value}
                            onClick={() => this.handleDuplicate(row.original)}
                            style={{fontWeight:"bolder"}}
                        >
                            x2
                </Button>

                        <Button variant="success"
                            data-param={row.value}
                            onClick={() => this.handleUpdate(row.original)}
                        >
                            <FontAwesomeIcon icon={['fa', 'sync']} size={"1x"}/>
                </Button>
                    </div>

                )
            }
        ];


        return (
            <Layout>
                <div className="concepts">
                    <h1>Edicion de Conceptos</h1>
                    <div className="materials-table-cont">
                        <Query query={GET_CONCEPTS}>
                            {({ loading, error, data }) => {
                                console.log("conceptos")
                                console.log(data)
                                if (loading) return <Spinner />;
                                if (error) return <p>Error :( recarga la página!</p>;
                                return (
                                    <ReactTable
                                        data={data.concepts}
                                        columns={columns}
                                        defaultPageSize={2}
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
