import React, { Component } from "react";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

import Layout from "../../../components/Layout/Layout";
import "./Budget.css";

import BudgetModal from "../../../components/Budget/Modal/Modal";
import Tabla from "../../../components/Budget/Tabla/Tabla"
import { Col, Row, Container } from "react-bootstrap"
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'

import { Query } from "react-apollo";
import { GET_CONCEPTS } from "./constants";
import Spinner from "../../../components/Spinner/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
      selectedMaterial: {},
      budgetKey:null,
      customer:null,
      date:null,
      attention:null,
      header:null,
      wastePercentage:0,indirectPercentage:0,finantialPercentage:0,earningPercentage:0,
      percentageTotal:0,totalWithPercentage:0,
      nombrePartida:"",unidadPartida:"",cantidadPartida:"",
      partidas:[{_id:1,ultima:true,descripcion:null,unidad:null,cantidadPartida:null,hidden:true,conceptos:[]}]
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

  handleChange = name => event => {
    this.setState({ [name]: event.target.value
    });
  }

  handleSpecialChange=(Id, name,event)=> {
    console.log( `partida modificada ${Id} por ${event.target.value}`);
    // console.log(event.target.value)
    console.log(`parametro modificado ${name}`)
    let secciones=JSON.parse(JSON.stringify(this.state.partidas))
      const seccionIndex = secciones.findIndex(
        seccion => seccion._id === Id
    );
    secciones[seccionIndex][name]=event.target.value
    this.setState({
      partidas:secciones
    })
    // console.log(`modifico ${seccionIndex}`);
    console.log(secciones)
  }

  handleSave=()=>{
    console.log("saving")
    console.log(this.state)
  }

  addConcept=(Id,valor)=>{
    console.log("agregando elemento")
      console.log("magia")
      console.log(valor)
      console.log(Id)
      let secciones=JSON.parse(JSON.stringify(this.state.partidas))
      const seccionIndex = secciones.findIndex(
        seccion => seccion._id === Id
    );
    // console.log(seccionIndex)
    // console.log( secciones)
    secciones[seccionIndex].conceptos.push(valor)
    this.setState({
      partidas:secciones
    })
  }


  handleAddSection=()=>{
    console.log("Agregando Partida")
    let secciones=JSON.parse(JSON.stringify(this.state.partidas))
    console.log(secciones)
    let newId=(secciones[secciones.length-1]._id)+1
    secciones[secciones.length-1].ultima=false;
    secciones[secciones.length-1].descripcion=this.state.nombrePartida;
    secciones[secciones.length-1].unidad=this.state.unidadPartida;
    secciones[secciones.length-1].cantidadPartida=this.state.cantidadPartida;
    secciones[secciones.length-1].precioUnitario=0;
    secciones[secciones.length-1].subtotal=0;
    secciones[secciones.length-1].importeTotal=0;
    secciones[secciones.length-1].conceptos=[];

    secciones.push({_id:newId,ultima:true,hidden:true})
    this.setState({
      partidas:secciones, nombrePartida:"",unidadPartida:"",cantidadPartida:""
    })
  }

  acordeon=(Id,event)=>{
    console.log("makeit appear")
    console.log(Id)
    let secciones=JSON.parse(JSON.stringify(this.state.partidas))
    console.log(secciones)
    const seccionIndex = secciones.findIndex(
      seccion => seccion._id === Id
    );
    secciones[seccionIndex].hidden=!secciones[seccionIndex].hidden
    this.setState({
      partidas:secciones
    })
  }

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
          <div className="mutationbtn-container">
            <button
              data-param={row.value}
              onClick={() => this.handleEdit(row.original, this)}
              className="edit-btn"
            >
              Edit
            </button>
            <button
              onClick={() => this.handleDelete.bind(this, row.original)}
              className="danger-btn"
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
          <h1>Genera Presupuesto</h1>
          <div className="side-buttons">
            <button className="submit-btn">Editar Presupuesto</button>
            {/* <button className="submit-btn">Importar materiales</button> */}
          </div>

          <div className="budget-content">
            <div className="budgetsContainer">
              <form
                className="import-buttons"
                onSubmit={this.submitHandler}
                encType="multipart/form-data"
              >
              </form>
            <Row >
                <Col xs={12} lg={4}>
                    <Form.Label>Clave de Presupuesto</Form.Label>
                    <Form.Control type="email" placeholder={this.state.budgetKey}
                    onChange={this.handleChange('budgetKey')}/>
                </Col>
                <Col xs={12} lg={4}>
                    <Form.Label>Cliente</Form.Label>
                    <Form.Control type="email" placeholder={this.state.customer}
                    onChange={this.handleChange('customer')}/>
                </Col>
                <Col xs={12} lg={4}>
                    <Form.Label>Fecha</Form.Label>
                    <Form.Control type="email" placeholder={this.state.date}
                    onChange={this.handleChange('date')}/>
                </Col>
            </Row>
            <Row style={{marginBottom:"2rem"}}>
                <Col xs={12} lg={3}>
                    <Form.Label>Atencion a:</Form.Label>
                    <Form.Control type="email" placeholder={this.state.attention}
                    onChange={this.handleChange('attention')}/>
                </Col>
                <Col xs={12} lg={7}>
                    <Form.Label>Encabezado:</Form.Label>
                    <Form.Control type="email" placeholder={this.state.header}
                    onChange={this.handleChange('header')}/>
                </Col>
                <Col>
                  {/* <button className="edit-btn" >Guardar Presupuesto</button>   */}
                  <Row className="modal_buttons-container">
                      <button className="edit-btn" onClick={() => this.handleSave()}>Guardar Presupuesto</button>
                      {/* <button className="danger-btn">Cancelar</button> */}
                  </Row>

                </Col>
            </Row>
            {/* {seccionmagica} */}
            <Row className='parent'>
              <div className='child2'style={{width:"9%"}}>Partida</div>
              <div className='child2' style={{width:"30%"}}>Descripcion</div>
              <div className='child2'>Unidad</div>
              <div className='child2'>Cantidad</div>
              <div className='child2'>P.U.</div>
              <div className='child2'>Subtotal</div>
              <div className='child2'>Importe Total</div>
            </Row>
            {this.state.partidas.map((partida,i)=>{
              // console.log(partida)
              return (
              <div key={partida._id}>
                {!partida.ultima &&
                  <Row className='parent' >
                    <div className='child' style={{width:"9%"}} onClick={this.acordeon.bind(this,partida._id)}>
                      {Number(partida._id).toFixed(2)}
                      <FontAwesomeIcon icon={['fa', 'plus']} size={"1x"} style={{marginLeft:"1rem"}}/>
                    </div>
                    <div className='child' style={{width:"30%"}}>
                      <Form.Control type="email" placeholder={partida.descripcion} className="controlEspecial"
                      onChange={this.handleSpecialChange.bind(this,partida._id,"descripcion")}/>
                    </div>
                    <div className='child'>
                      <Form.Control type="email" placeholder={partida.unidad} className="controlEspecial"
                      onChange={this.handleSpecialChange.bind(this,partida._id,"unidad")}/>
                    </div>
                    <div className='child'>
                      <Form.Control type="email" placeholder={partida.cantidadPartida} className="controlEspecial"
                      onChange={this.handleSpecialChange.bind(this,partida._id,"cantidadPartida")}/>
                    </div>
                    <div className='child'>${partida.precioUnitario}</div>
                    <div className='child'>${partida.subtotal}</div>
                    <div className='child'>${partida.importeTotal}</div>
                    {!partida.hidden &&
                        <div className="materials-table-cont" style={{marginTop:"2rem"}}>
                          <Tabla
                          handleAdd={this.addConcept.bind(this,partida._id)}
                          ></Tabla>
                       </div>
                       }
                  </Row>
                }

                {partida.ultima && <Row>
                    <Col sm={2}>
                      <Badge variant="secondary">{Number(partida._id).toFixed(2)}</Badge>
                    </Col>

                    <Col sm={6}>
                      <Form.Control type="email" placeholder="Introduzca Nombre de Nueva Partida"
                      onChange={this.handleChange('nombrePartida')}/>
                    </Col>
                    <Col sm={2}>
                      <Form.Control type="email" placeholder="Unidad"
                      onChange={this.handleChange('unidadPartida')}/>
                    </Col>
                    <Col sm={2}>
                      <Form.Control type="email" placeholder="Cantidad"
                      onChange={this.handleChange('cantidadPartida')}/>
                    </Col>
                    <Col sm={2}>
                      <button className="edit-btn" onClick={() => this.handleAddSection()}>Agregar Partida</button>
                    </Col>
                  </Row>
                }
              </div>
              )
            })
            }
            {/* {seccionmagica} */}


            {/* Seccion de porcentajes */}
            <Form.Group as={Row} controlId="formHorizontalEmail">
                <Form.Label column sm={3}>Porcentaje de Desperdicio:</Form.Label>
                <Col sm={2}>
                  <Form.Control type="email" placeholder={this.state.wastePercentage}
                  onChange={this.handleChange('wastePercentage')}/>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formHorizontalEmail">
                <Form.Label column sm={3}>Porcentaje de Indirectos:</Form.Label>
                <Col sm={2}>
                  <Form.Control type="email" placeholder={this.state.indirectPercentage}
                  onChange={this.handleChange('indirectPercentage')}/>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formHorizontalEmail">
                <Form.Label column sm={3}>Porcentaje de Financiamiento:</Form.Label>
                <Col sm={2}>
                  <Form.Control type="email" placeholder={this.state.finantialPercentage}
                  onChange={this.handleChange('finantialPercentage')}/>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formHorizontalEmail">
                <Form.Label column sm={3}>Porcentaje de Utilidad:</Form.Label>
                <Col sm={2}>
                  <Form.Control type="email" placeholder={this.state.earningPercentage}
                  onChange={this.handleChange('earningPercentage')}/>
                </Col>
            </Form.Group>
{/* Termina seccion de porcentajes */}
 {/* percentageTotal:0,totalWithPercentage:0 */}
 <Row>
   <p>Sumatoria Porcentajes</p>
   <p style={{marginLeft:"2rem"}}>${this.state.percentageTotal}</p>
 </Row>
 <Row>
   <p>Importe Total</p>
   <p style={{marginLeft:"2rem"}}>${this.state.totalWithPercentage}</p>
 </Row>



            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default BudgetPage;
