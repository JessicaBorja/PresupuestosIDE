import React, { Component } from "react";
import Layout from "../../../components/Layout/Layout";
import "./Unit.css";
import { Query, Mutation } from "react-apollo";
import { GET_UNIT, DELETE_MATERIAL, EDIT_MATERIAL, GET_MATERIALS, ADD_MATERIAL,UPDATE_UNIT } from "./constants";
import { withApollo } from "react-apollo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ReactTable from "react-table";
import Spinner from "../../../components/Spinner/Spinner";
import Button from "react-bootstrap/Button";
import swal from "sweetalert";
import MaterialModal from "../../../components/Unit/Modal";

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
      materialGroup: {}
    };
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

  handleEdit = selectedMaterial => {
    // swal("Proceso de edicion exitoso!", "Su informacion se ha removido!", "success");
    // swal("Proceso de edicion no exitoso!", "Notificar al programador!", "error");
    console.log(selectedMaterial)
    this.setState({
      modalShow: true,
      selectedMaterial
    });
  };

  handleDelete = selectedMaterial => {
    // swal("Proceso de eliminado exitoso!", "Su informacion se ha removido!", "success");
    // swal("Proceso de eliminado no exitoso!", "Notificar al programador!", "error");
    this.props.client
      .mutate({
        mutation: DELETE_MATERIAL,
        variables: { id: selectedMaterial._id }
      })
      .then(data => {
        // console.log(data.data.deleteMaterialGroup._id)
        console.log(data)
        let auxMaterials=this.state.materialGroup.auxMaterials
        const materialIndex = auxMaterials.findIndex(
          material => material._id === selectedMaterial._id
        );
        console.log(materialIndex)
        function spliceNoMutate(myArray, indexToRemove) {
            return myArray.slice(0, indexToRemove).concat(myArray.slice(indexToRemove + 1));
        }
        let newAuxMaterials = spliceNoMutate(auxMaterials, materialIndex)
        let newMaterialGroup=this.state.materialGroup
        newMaterialGroup.auxMaterials=newAuxMaterials
        console.log(newMaterialGroup)
        this.setState({
          materialGroup: newMaterialGroup
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
  };

  handleSave = () => {
    this.searchUnits();
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };


  addMaterialDb= async (materialGroup,addMaterial)=>{
    console.log("adding material to db")
    console.log(materialGroup)
    console.log(addMaterial)
    await this.props.client.mutate({
        mutation: ADD_MATERIAL,
        variables: { ...addMaterial }
    }).then(async (data) => {
        console.log("added to db")
        console.log(data.data.createAuxMaterial)
        materialGroup.auxMaterials.splice(-1,1)
        let materialGroupInDb=JSON.parse(JSON.stringify(materialGroup))
        materialGroupInDb.auxMaterials=materialGroup.auxMaterials.map((auxMaterial)=>{
            return auxMaterial._id
        })
        materialGroupInDb.auxMaterials.push(data.data.createAuxMaterial._id)
        materialGroup.auxMaterials.push(data.data.createAuxMaterial)
        console.log(materialGroup.auxMaterials)
        console.log(materialGroupInDb.auxMaterials)
        console.log("updating ")
        console.log(materialGroup)
        console.log(materialGroupInDb)

        await this.props.client.mutate({
              mutation: UPDATE_UNIT,
              variables: {id:materialGroupInDb._id, ...materialGroupInDb}
          }).then(data => {
              console.log("added to db")
              console.log(data)
              swal(
                "Proceso de adicion exitoso!",
                "Su material se ha añadido!",
                "success"
              );
              this.setState({
                materialGroup,
                // show:true
              })
          })
    }).catch((err) => { 
      console.log(err) 
    })
  }

  handleAdd = async (addMaterial, concepto) => {
    let materialGroup = this.state.materialGroup
    let materials = this.state.materialGroup.auxMaterials
    const materialIndex = materials.findIndex(
      material => material.materialKey === addMaterial.materialKey
    );

    if (materialIndex === -1) {
      swal({
        title: "Ingresa cantidad",
        content: 'input',
        buttons: true,
        dangerMode: true,
    }).then((value) => {
        if(value===null){
        }
        else if( isNaN(Number(value)) || Number(value) <= 0) {
            swal(`Favor de ingresar un numero mayor a 0, usted ingreso: ${value}`);
        }
        else {
        console.log(value)
          addMaterial.materialQuantity = Number(value);
          addMaterial.totalPrice = Number(value) * Number(addMaterial.unitPrice);
          materials.push(addMaterial)
          materialGroup.auxMaterials = materials
          this.addMaterialDb(materialGroup,addMaterial)
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
      },
      {
        Header: "Descripcion",
        accessor: "name",
        Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>,
      },
      {
        Header: "Unidad",
        accessor: "measurementUnit",
        Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>
      },
      {
        Header: "Cantidad",
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
        accessor: "totalPrice",
        // headerStyle: {textAlign: 'right'},
        Cell: row => <div style={{ textAlign: "center" }}>${row.value.toFixed(2)}</div>
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
              <FontAwesomeIcon icon={['fa', 'edit']} size={"1x"}/>
            </Button>

            <Button
              variant="danger"
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
              <FontAwesomeIcon icon={['fa', 'plus']} size={"1x"}/>
            </Button>
          </div>

        )
      }
    ];

    return (
      <Layout>
        <div className="unit">
          <h1>Edicion de Precio Unitario: {this.state.materialGroup.materialGroupKey}</h1>
          <div className="materials-table-cont" style={{ marginBottom: "2rem" }}>
            <Query
              query={GET_UNIT}
              variables={{ id: this.props.match.params.id }}
              onCompleted={data => {
                console.log(data.materialGroup)
                this.setState({ materialGroup: data.materialGroup })}}
            >
              {({ loading, error, data }) => {
                if (loading) return <Spinner />;
                if (error) return <p>Error :( recarga la página!</p>;
                return (
                  <div>
                    <ReactTable
                      data={this.state.materialGroup.auxMaterials}
                      columns={columns}
                      defaultPageSize={5}
                      minRows={1}
                      showPaginationBottom={true}
                    />

                  </div>
                );
              }}
            </Query>
          </div>

          <h1>Materiales</h1>

          <div className="materials-table-cont" style={{ marginBottom: "4rem" }}>
            <Query query={GET_MATERIALS}>
              {({ loading, error, data }) => {
                if (loading) return <Spinner />;
                if (error) return <p>Error :( recarga la página!</p>;
                return (
                  <ReactTable
                    data={data.materials}
                    columns={columns2}
                    defaultPageSize={5}
                    showPaginationBottom={true}

                  />
                );
              }}
            </Query>
          </div>


          {/* EDIT */}
          <Mutation mutation={EDIT_MATERIAL}
          >
            {updateAuxMaterial => (
              this.state.modalShow && <MaterialModal
                show={this.state.modalShow}
                onHide={this.handleModalClose}
                product={this.state.selectedMaterial}
                handleQuotation={this.handleQuotation}
                onConfirm={editedMaterial => {
                  editedMaterial.totalPrice = Number(editedMaterial.materialQuantity) * Number(editedMaterial.unitPrice);

                  console.log(editedMaterial)

                  let condition=editedMaterial.materialQuantity===null||editedMaterial.materialQuantity.length===0
                  condition|=editedMaterial.unitPrice==null||editedMaterial.unitPrice.length===0
                  if(condition){
                    swal(
                      "Favor de modificar los valores de cantidad y precio unitario",
                      "Valores no modificados o nulos",
                      "error"
                    );
                  }else{
                    updateAuxMaterial({
                      variables: {
                        id: editedMaterial._id,
                        ...editedMaterial,
                        materialQuantity: +editedMaterial.materialQuantity,
                        unitPrice: +editedMaterial.unitPrice
                      }
                    }).then(data => {
                      console.log("editado")
                      console.log(data.data.updateAuxMaterial)
                      swal(
                        "Proceso de edicion exitoso!",
                        "Su informacion se ha editado!",
                        "success"
                      );
                      this.setState({
                        modalShow: false
                      })
                    }).catch(err=>{
                      console.log(err)
                    })
                 
                  }        
                }
                }
              >

              </MaterialModal>
            )}
          </Mutation>
        </div>
      </Layout >
    );
  }
}
export default withApollo(UnitPage);
