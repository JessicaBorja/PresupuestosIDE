import React from 'react';
import "./Tabla.css"
// import ProductCarousel from "../../Carousel/Carousel"
import  { Component } from "react";
import { Query } from "react-apollo";
import { GET_CONCEPTS } from "./constants";
import Spinner from "../../../components/Spinner/Spinner";
import ReactTable from "react-table";
import "react-table/react-table.css";
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


class Tabla extends Component {  
    constructor(props) {
        super(props);
        this.state = { 
            quantity:null,
            unitPrice:null,
            totalPrice:null,
            measurementUnit:"",
            id:""
        }
    }   
    handleAdd=()=>{
        console.log("agregando")
    }

     columnsConcept = [
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
                  <Button variant="success"
                      data-param={row.value}
                      onClick={() => this.props.handleAdd(row.original)}
                  >
                      <FontAwesomeIcon icon={['fa', 'plus']} size={"1x"}/>
                  </Button>
      
                </div>
      
            )
        }
      ];

    render() {
        console.log("render")
        console.log(this.props)
            return (
                <Query query={GET_CONCEPTS}>
                {({ loading, error, data }) => {
                  // console.log("conceptos")
                  // console.log(data)
                  if (loading) return <Spinner />;
                  if (error) return <p>Error :( recarga la página!</p>;
                  return (
                      <ReactTable
                          data={data.concepts}
                          columns={this.columnsConcept}
                          defaultPageSize={2}
                          minRows={1}
                          showPaginationBottom={true}
              
                      />
                  );
                }}
              </Query>
        )
    }
}

export default Tabla;