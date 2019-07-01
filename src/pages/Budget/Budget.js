import React, { Component } from "react";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

import Layout from "../../components/Layout/Layout";
import "./Budget.css";

import BudgetModal from "../../components/Budget/Modal/Modal";

const range = len => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = () => {
  const statusChance = Math.random();
  return {
    budgetkey: "fulano1" + Math.floor(Math.random() * 30).toString(),
    lastName: "apellido" + Math.floor(Math.random() * 30).toString(),
    age: Math.floor(Math.random() * 30),
    visits: Math.floor(Math.random() * 100),
    progress: Math.floor(Math.random() * 100),
    status:
      statusChance > 0.66
        ? "relationship"
        : statusChance > 0.33
        ? "complicated"
        : "single"
  };
};

function makeData(len = 5553) {
  return range(len).map(d => {
    return {
      ...newPerson(),
      children: range(10).map(newPerson)
    };
  });
}

export class BudgetPage extends Component {
  constructor() {
    super();
    this.state = {
      data: makeData(),
      file: null,
      selectedMaterial: {}
    };
  }

  handleEdit = (material, stuff) => {
    this.setState({
      modalShow: true,
      selectedMaterial: material
    });
  };

  handleDelete = () => {
    console.log("delete");
  };

  handleModalClose = () => this.setState({ modalShow: false });

  render() {
    const { data } = this.state;
    const columns = [
      {
        Header: "Clave",
        accessor: "budgetkey",
        width: 100
      },
      {
        Header: "Cliente",
        id: "client",
        accessor: d => d.lastName,
        width: 300
      },
      {
        Header: "fecha",
        accessor: "date",
        minWidth: 100
      },
      {
        Header: "Importe total",
        accessor: "totalCost",
        minWidth: 200
      },
      {
        Header: "Operacion",
        accesor: "_id",
        Cell: row => (
          <div class="mutationbtn-container">
            <button
              data-param={row.value}
              onClick={() => this.handleEdit(row.original, this)}
              class="edit-btn"
            >
              Edit
            </button>
            <button
              onClick={() => this.handleDelete.bind(this, row.original)}
              class="danger-btn"
            >
              Delete
            </button>
          </div>
        ),
        minWidth: 200
      }
    ];

    return (
      <Layout>
        <div className="budget">
          <h1>Presupuestos</h1>
          <div className="side-buttons">
            <button className="submit-btn">Importar materiales</button>
            <button className="submit-btn">Importar materiales</button>
          </div>
          
          <div className="budget-content">
            <div className="budgetsContainer">
              <form
                className="import-buttons"
                onSubmit={this.submitHandler}
                encType="multipart/form-data"
              >
                <input
                  accept=".xlsx"
                  onChange={this.changeInputHandler}
                  type="file"
                />
                <button type="submit" class="submit-btn">
                  Importar materiales
                </button>
              </form>

              <ReactTable
                data={data}
                columns={columns}
                defaultPageSize={10}
                className="-highlight"
              />
              <BudgetModal
                show={this.state.modalShow}
                onHide={this.handleModalClose}
                product={this.state.selectedMaterial}
                handleQuotation={this.handleQuotation}
              />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default BudgetPage;
