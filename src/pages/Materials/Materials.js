import React, { Component } from "react";
import Layout from "../../components/Layout/Layout";
import Spinner from "../../components/Spinner/Spinner";
import "./Materials.css";
// react table
import ReactTable from "react-table";
import "react-table/react-table.css";
import { Table } from "react-bootstrap";

export class MaterialsPage extends Component {
  state = { file: null };

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

  render() {
    const myData = [
      {
        name: "Tanner Linsley",
        age: 26,
        description: "feof",
        friend: {
          name: "Jason Maurer",
          age: 23
        }
      },
      {
        name: "Oscar Rosete",
        age: 27,
        description: "guapo",
        friend: {
          name: "Erick Rosete",
          age: 21
        }
      }
    ];

    const myColumns = [
      {
        Header: "Clave",
        accessor: "name",
        filterable: true,
        filterMethod: (filter, row) =>
          row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
      },
      {
        Header: "Descripción",
        accessor: "description",
        filterable: true,
        filterMethod: (filter, row) =>
          row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
      },
      {
        Header: "Unidad",
        accessor: "name" // String-based value accessors!
      },
      {
        Header: "Cantidad",
        accessor: "name" // String-based value accessors!
      },
      {
        Header: "Precio",
        accessor: "name" // String-based value accessors!
      },
      {
        Header: "Descripción",
        accessor: "age",
        Cell: props => <span className="number">{props.value}</span> // Custom cell components!
      },
      {
        id: "friendName", // Required because our accessor is not a string
        Header: "Friend Name",
        accessor: d => d.friend.name // Custom value accessors!
      },
      {
        Header: props => <span>Friend Age</span>, // Custom header components!
        accessor: "friend.age"
      }
    ];

    return (
      <Layout>
        <div className="materials">
          <h1>Materiales</h1>
          {this.state.loading ? (
            <Spinner />
          ) : (
            <form onSubmit={this.submitHandler} encType="multipart/form-data">
              <input
                accept=".xlsx"
                onChange={this.changeInputHandler}
                type="file"
              />
              <button type="submit">Importar materiales</button>
            </form>
          )}
          <div className="materials-table">
            <Table striped bordered hover size="sm" responsive="md">
              <thead>
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Username</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Jacob</td>
                  <td>Thornton</td>
                  <td>@fat</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td colSpan="2">Larry the Bird</td>
                  <td>@twitter</td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div style={{ width: "70vw", height: "50vh" }}>
            <ReactTable data={myData} columns={myColumns} defaultPageSize={5} />
          </div>
        </div>
      </Layout>
    );
  }
}
export default MaterialsPage;
