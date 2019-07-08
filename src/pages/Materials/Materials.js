import React, { Component } from "react";
import Layout from "../../components/Layout/Layout";
import Spinner from "../../components/Spinner/Spinner";
import "./Materials.css";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { Query, Mutation } from "react-apollo";
import { GET_MATERIALS, EDIT_MATERIAL, ADD_MATERIAL,DELETE_MATERIAL } from "./constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MaterialModal from "../../components/Material/Modal/Modal";
import swal from 'sweetalert';
import { withApollo } from "react-apollo";


export class MaterialsPage extends Component {
  state = {
    addModalShow: false,
    file: null,
    selectedMaterial: { _id: "" }
  };

  handleAddModalOpen = () => {
    this.setState({
      addModalShow: true,
    });
  };

  handleAddModalClose = () => {
    this.setState({
      addModalShow: false,
    });
  };

  submitHandler = async event => {
    event.preventDefault();
    if (!this.state.file) {
      alert("Ingresa un archivo con extensión .xlsx");
      return;
    }

    try {
      this.setState({ loading: true });

      var formData = new FormData();
      formData.append("file", this.state.file);
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/importMaterials`,
        {
          method: "POST",
          body: formData
        }
      );

      this.setState({ loading: false, file: null });

      if (res.status === 500) {
        alert("Error interno en la plataforma");
        return;
      }

      if (res.status === 400) {
        alert("Formato incorrecto de archivo de Excel");
        return;
      }

      if (res.status === 200 || res.status === 201) {
        const resData = await res.json();
        console.log(resData);
        alert("Los materiales han sido importados satisfactoriamente");
      }
    } catch (err) {
      this.setState({ loading: false, file: null });
      console.log(err);
    }
  };

  changeInputHandler = event => {
    const file = event.target.files[0];
    //check file extension
    const fileExtension = file.name
      .split(".")
      .pop()
      .toLowerCase();
    if (fileExtension !== "xlsx") {
      alert(
        "Extensión de archivo inadecuada, ingresa un archivo con extension .xlsx"
      );
      event.target.value = null;
      return;
    }

    this.setState({ file });
  };



  handleEdit = (material, stuff) => {
    this.setState({
      modalShow: true,
      selectedMaterial: material
    });
  };

  handleDelete = selectedMaterial => {
    console.log("eliminando");
    console.log(selectedMaterial);
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
            mutation: DELETE_MATERIAL,
            variables: { id: selectedMaterial._id },
            refetchQueries:[{ query: GET_MATERIALS }]
          })
          .then(data => {
            console.log(data)
            // console.log(data.data.deleteMaterialGroup._id);
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
  };


  handleModalClose = () => this.setState({ modalShow: false });

  render() {
    const columns = [
      {
        Header: "Agregado por:",
        accessor: "fromExcel",
        filterable: true,
        filterMethod: (filter, row) =>
          (!row[filter.id]).toString().toLowerCase().includes(filter.value.toLowerCase()),
        Cell: row => 
        <div style={{ textAlign: "center" }}>
        {row.value?"ContPaq":"Originales"}
        </div>
      },
      // CONTPAQ
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
        filterMethod: (filter, row) =>
          row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
      },
      {
        Header: "Cantidad",
        accessor: "quantity",
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
          <div className="mutationbtn-container">
            <button
              data-param={row.value}
              onClick={() => this.handleEdit(row.original, this)}
              className="edit-btn"
            >
              <FontAwesomeIcon icon={['fa', 'edit']} size={"1x"}/>
            </button>
            <button
              onClick={() => this.handleDelete(row.original)}
              className="danger-btn"
            >
              <FontAwesomeIcon icon={['fa', 'trash']} size={"1x"}/>
            </button>
          </div>
        )
      }
    ];

    return (
      <Layout>
        <div className="materials">
          <h1>Materiales</h1>
          {this.state.loading ? (
            <Spinner />
          ) : (
              <form
                className="materials-import"
                onSubmit={this.submitHandler}
                encType="multipart/form-data"
              >
                <input
                  accept=".xlsx"
                  onChange={this.changeInputHandler}
                  type="file"
                />
                <button type="submit" className="submit-btn">
                  Importar materiales
              </button>
              </form>
            )}

          <div style={{ position: 'fixed', top: 110, right: 20, zIndex: 10 }}>
            <button className="submit-btn" onClick={this.handleAddModalOpen}>
              <FontAwesomeIcon icon={['fas', 'plus']} size={"2x"} />
            </button>
          </div>

          {/* ADD */}
          <Mutation
            mutation={ADD_MATERIAL}
            update={(cache, { data: { addMaterial } }) => {
              let { materials } = cache.readQuery({ query: GET_MATERIALS });
              materials.push(addMaterial);
              cache.writeQuery({
                query: GET_MATERIALS,
                data: { materials }
              });
            }}
          >
            {addMaterial => (
              <MaterialModal
                show={this.state.addModalShow}
                onHide={this.handleAddModalClose}
                onConfirm={(material) => {
                  addMaterial({
                    variables: {
                      ...material,
                      totalPrice: +material.totalPrice,
                      unitPrice: +material.unitPrice,
                      quantity: +material.quantity,
                      fromExcel: false
                    }
                  });
                  this.setState({ addModalShow: false });
                }}
              />
            )}
          </Mutation>

          {/* EDIT */}
          <Mutation
            mutation={EDIT_MATERIAL}
            update={(cache, { data: { updateMaterial } }) => {
              function updateArray(arr, index, newValue) {
                console.log(arr);
                arr[index] = newValue;
                return arr;
              }
              console.log(updateMaterial);
              let { materials } = cache.readQuery({ query: GET_MATERIALS });
              let editedMaterialIndex = materials.findIndex(
                material => material._id === updateMaterial._id
              );
              console.log("el nuevo");
              updateArray(materials, editedMaterialIndex, updateMaterial);
              cache.writeQuery({
                query: GET_MATERIALS,

                data: {
                  materials: updateArray(
                    materials,
                    editedMaterialIndex,
                    updateMaterial
                  )
                }
              });
            }}
          >
            {updateMaterial => (
              <MaterialModal
                key={this.state.selectedMaterial._id}
                show={this.state.modalShow}
                onHide={this.handleModalClose}
                material={this.state.selectedMaterial}
                onConfirm={(material) => {
                  updateMaterial({
                    variables: {
                      ...material,
                      totalPrice: +material.totalPrice,
                      unitPrice: +material.unitPrice,
                      quantity: +material.quantity,
                    }
                  });
                  this.setState({ modalShow: false });
                }}
              />
            )}
          </Mutation>

          <div className="materials-table-cont">
            <Query query={GET_MATERIALS}>
              {({ loading, error, data }) => {
                if (loading) return <Spinner />;
                if (error) return <p>Error :( recarga la página!</p>;
                return (
                  <ReactTable
                    data={data.materials}
                    columns={columns}
                    defaultPageSize={10}
                    className="-highlight"
                  />
                );
              }}
            </Query>
          </div>
        </div>
      </Layout >
    );
  }
}

export default withApollo(MaterialsPage);
