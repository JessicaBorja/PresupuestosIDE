import React, { Component } from "react";
import Layout from "../../components/Layout/Layout";
import "./Materials.css";
import { Table } from "react-bootstrap";

export class MaterialsPage extends Component {
  render() {
    return (
      <Layout>
        <div className="materials">
          <h1>Materiales</h1>
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
        </div>
      </Layout>
    );
  }
}
export default MaterialsPage;
