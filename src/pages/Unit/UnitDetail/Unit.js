import React, { Component } from "react";
import Layout from "../../../components/Layout/Layout";
import "./Unit.css";
import { Query,Mutation } from "react-apollo";
import { GET_UNIT, DELETE_MATERIAL, EDIT_MATERIAL ,GET_UNITS,GET_MATERIALS} from "./constants";
import { withApollo } from "react-apollo";

import ReactTable from "react-table";
import Spinner from "../../../components/Spinner/Spinner";
import Button from "react-bootstrap/Button";
import swal from "sweetalert";
import MaterialModal from "../../../components/Unit/Modal";
let materialGroup={}

export class UnitPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      conceptKey: null,
      description: null,
      unit: null,
      show: false,
      id: "",
      materialsInConcept: [],
      selectedMaterial: {},
      modalShow: false,
      materialGroup:{}
    };
  }

  handleEdit = selectedMaterial => {
    console.log("editando");
    console.log(selectedMaterial);
    // swal("Proceso de edicion exitoso!", "Su informacion se ha removido!", "success");
    // swal("Proceso de edicion no exitoso!", "Notificar al programador!", "error");
    this.setState({
      modalShow: true,
      selectedMaterial
    });
  };

  handleDelete = selectedMaterial => {
    console.log("eliminando");
    console.log(selectedMaterial);
    // swal("Proceso de eliminado exitoso!", "Su informacion se ha removido!", "success");
    // swal("Proceso de eliminado no exitoso!", "Notificar al programador!", "error");
    this.props.client
      .mutate({
        mutation: DELETE_MATERIAL,
        variables: { id: selectedMaterial._id }
      })
      .then(data => {
        // console.log(data.data.deleteMaterialGroup._id)
        console.log(data.data.deleteAuxMaterial);
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
  };

  handleSave = () => {
    this.searchUnits();
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  
  handleAdd=async (addMaterial,concepto)=>{
    console.log("Add")
    console.log(addMaterial)
    let materialGroup=this.state.materialGroup
    let materials=this.state.materialGroup.auxMaterials
    console.log(materials)
    const materialIndex = materials.findIndex(
        material => material._id === addMaterial._id
    );
    console.log("found")
    console.log(materialIndex)
    console.log(materialGroup)
    console.log(materials)

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
                materialGroup.auxMaterials=materials
                this.setState({
                    materialGroup,
                    // show:true
                })    
            }
        })
    }

    // materialInput._id=null;
    // materialInput.totalQuantity=materialInput.quantity
    //     await this.props.client.mutate({
    //         mutation: ADD_MATERIAL,
    //         variables: { ...materialInput }
    //     }).then(data => {
    //         // console.log(data.data.createAuxMaterial._id)
    //         materialesAux.push(data.data.createAuxMaterial._id)
    //         subidos++;
    //         if(this.state.materialsInConcept.length===subidos){
    //             console.log("termine2")
    //             console.log(materialesAux)
    //             concepto.auxMaterials=materialesAux
    //             this.saveUnit(concepto)
    //         }
    //     }).catch((err) => { console.log(err) })
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
        Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>
      },
      {
        Header: "cantidad",
        accessor: "materialQuantity",
        Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>
      },
      {
        Header: "Precio",
        accessor: "unitPrice",
        Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>
      },
      {
        Header: "Subtotal",
        accessor: "unitPrice",
        // headerStyle: {textAlign: 'right'},
        Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>
      },
      {
        Header: props => <span>Operacion a realizar</span>, // Custom header components!
        accessor: "_id",
        Cell: row => (
          <div>
            <Button
              variant="warning"
              data-param={row.value}
              onClick={() => this.handleEdit(row.original)}
            >
              Editar
            </Button>

            <Button
              variant="danger"
              data-param={row.value}
              onClick={() => this.handleDelete(row.original)}
            >
              Eliminar
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

    // console.log(this.state.materialsInConcept.length);
    // console.log(this.props.match.params.id);
    return (
      <Layout>
        <div className="unit">
          <h1>Edita Precios Unitarios</h1>
          <div className="materials-table-cont" style={{marginBottom:"2rem"}}>
            <Query
              query={GET_UNIT}
              variables={{ id: this.props.match.params.id }}
              onCompleted={data => this.setState({materialGroup:data.materialGroup})}
            >
              {({ loading, error, data }) => {
                  console.log("get unit")
                  console.log(data)
                  materialGroup=data.materialGroup
                // console.log("query");
                // console.log(data.materialGroup);
                if (loading) return <Spinner />;
                if (error) return <p>Error :( recarga la página!</p>;
                return (
                    <div>
                        <ReactTable
                            data={data.materialGroup.auxMaterials}
                            columns={columns}
                            defaultPageSize={2}
                            minRows={1}
                            showPaginationBottom={true}
                        />
                        <div className="materials-table-cont">
                            <Query query={GET_MATERIALS}>
                                {({ loading, error, data }) => {
                                if (loading) return <Spinner />;
                                if (error) return <p>Error :( recarga la página!</p>;
                                return (
                                    <ReactTable
                                    data={data.materials}
                                    columns={columns2}
                                    defaultPageSize={2}
                                    showPaginationBottom= {false}
            
                                    />
                                );
                                }}
                            </Query>
                        </div>
                    </div>
                );
              }}
            </Query>

          </div>


        {/* EDIT */}
        <Mutation mutation={EDIT_MATERIAL}
                  update ={(cache,{ data: { updateAuxMaterial } })=>{
    
                        const  {materialGroup}  = cache.readQuery({ query: GET_UNIT,
                            variables:{ id: this.props.match.params.id }});
                        let materials=materialGroup.auxMaterials
                        let updateMaterial=updateAuxMaterial

                        console.log(materialGroup)
                        console.log(materials)

                        function updateArray(arr, index, newValue) {
                            arr[index] = newValue;
                            return arr;
                        }
                        let editedMaterialIndex = materials.findIndex(
                            material => material._id === updateMaterial._id
                        );
                        // console.log(GET_UNITS)
                        console.log(cache)

                        this.props.client.writeQuery({ 
                            query: GET_UNIT,
                            variables:{ id: this.props.match.params.id },
                            data: {
                                materialGroup:{...materialGroup,
                                    auxMaterials:updateArray(materials, editedMaterialIndex, updateMaterial)
                                }
                            },

                    })
                }} 
            //     refetchQueries={() => {
            //         // console.log("refetchQueries", product.id)
            //         console.log("refetch")
            //         return [{
            //            query: GET_UNITS,
            //        }];
            //    }}
            >
            {updateAccessory => (
                <MaterialModal
                    show={this.state.modalShow}
                    onHide={this.handleModalClose}
                    product={this.state.selectedMaterial}
                    handleQuotation={this.handleQuotation}
                    onConfirm={editedMaterial => {
                        // console.log(editedMaterial)
                        updateAccessory({
                            variables: { 
                                id: editedMaterial._id,
                                ...editedMaterial,
                                materialQuantity: +editedMaterial.materialQuantity,
                                unitPrice: +editedMaterial.unitPrice             }
                          });
                        this.setState({
                            modalShow:false
                        })
                        }
                    }
                >

                 </MaterialModal>
            )}
        </Mutation>
        
          {/* <Mutation mutation={EDIT_MATERIAL}>
            {(addTodo, { data }) => (
              <div>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    addTodo({ variables: { type: input.value } });
                    input.value = "";
                  }}
                >
                  <input
                    ref={node => {
                      input = node;
                    }}
                  />
                  <button type="submit">Add Todo</button>
                </form>
              </div>
            )}
          </Mutation> */}
          {/* <MaterialModal
            show={this.state.modalShow}
            onHide={this.handleModalClose}
            product={this.state.selectedMaterial}
            handleQuotation={this.handleQuotation}
            onConfirm={editedMaterial => {
            //   console.log("confirmado el material");
            //   console.log(editedMaterial);
              this.setState({ modalShow: false });
            }}
          /> */}
        </div>
      </Layout>
    );
  }
}
export default withApollo(UnitPage);
