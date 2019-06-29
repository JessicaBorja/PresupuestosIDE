import React, { Component } from "react";
import Layout from "../../components/Layout/Layout";
import Spinner from "../../components/Spinner/Spinner";
import "./Materials.css";
// react table
import ReactTable from "react-table";
import "react-table/react-table.css";
// import { Table } from "react-bootstrap";
import { Query, Mutation } from "react-apollo";
import { GET_MATERIALS, EDIT_MATERIAL } from "./constants";
// https://codesandbox.io/s/0pp97jnrvv
// https://www.npmjs.com/package/react-table
// https://react-bootstrap.github.io/components/forms/

import MaterialModal from "../../components/Material/Modal/Modal";
// import import ProductModal from "../../../components/Product/Modal/Modal"

export class MaterialsPage extends Component {
  state = { file: null, selectedMaterial: {} };

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
    // console.log("edit")
    // console.log(material)
    // console.log(stuff)
    // console.log(this.getAttribute('data-param'));

    this.setState({
      modalShow: true,
      selectedMaterial: material
      // selectedProduct: product
    });
  };

  handleDelete = () => {
    console.log("delete");
  };

  handleModalClose = () => this.setState({ modalShow: false });

  render() {
    const columns = [
      {
        Header: "Clave",
        accessor: "materialKey",
        filterable: true,
        filterMethod: (filter, row) =>
          row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
      },
      {
        Header: "Nombre",
        accessor: "name",
        filterable: true,
        filterMethod: (filter, row) =>
          row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
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
          <div>
            <button
              data-param={row.value}
              onClick={() => this.handleEdit(row.original, this)}
            >
              Edit
            </button>
            <button onClick={() => this.handleDelete.bind(this, row.original)}>
              Delete
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
            <form className="materials-import" onSubmit={this.submitHandler} encType="multipart/form-data">
              <input
                accept=".xlsx"
                onChange={this.changeInputHandler}
                type="file"
              />
              <button type="submit">Importar materiales</button>
            </form>
          )}

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
                show={this.state.modalShow}
                onHide={this.handleModalClose}
                product={this.state.selectedMaterial}
                handleQuotation={this.handleQuotation}
                onConfirm={(material, stuff) => {
                  material.totalPrice = +material.totalPrice;
                  material.unitPrice = +material.unitPrice;
                  material.quantity = +material.quantity;
                  updateMaterial({
                    variables: { ...material }
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
                  />
                );
              }}
            </Query>
          </div>
        </div>
      </Layout>
    );
  }
}
export default MaterialsPage;
