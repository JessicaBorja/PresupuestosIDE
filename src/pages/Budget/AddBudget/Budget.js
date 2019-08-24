import React, { Component } from "react";

// Import React Table
import "react-table/react-table.css";

import Layout from "../../../components/Layout/Layout";
import "./Budget.css";

import Tabla from "../../../components/Budget/Tabla/Tabla"
import { Col, Row } from "react-bootstrap"
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import swal from 'sweetalert';

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
    console.log(secciones[seccionIndex].precioUnitario)
    console.log(secciones[seccionIndex].cantidadPartida)
    secciones[seccionIndex].subtotal=(+(secciones[seccionIndex].cantidadPartida)*+(secciones[seccionIndex].precioUnitario)).toFixed(2);
    secciones[seccionIndex].importeTotal=(+(secciones[seccionIndex].cantidadPartida)*+(secciones[seccionIndex].precioUnitario)).toFixed(2);

    this.setState({
      partidas:secciones
    })
    // console.log(`modifico ${seccionIndex}`);
    console.log(secciones)
  }

  handleConceptChange=(Id, ConceptId, name,event)=> {
    console.log(`this,partida._id,concepto._id,"quantity"`)
    console.log( `partida modificada ${Id} parametro modificado ${name} a ${event.target.value}`);
    console.log( `ConceptId ${ConceptId}`)
    let secciones=JSON.parse(JSON.stringify(this.state.partidas))

    //====detectando partida a modificar
      const seccionIndex = secciones.findIndex(
        seccion => seccion._id === Id
    );
    console.log(secciones[seccionIndex])
    // console.log(secciones[seccionIndex].conceptos)

    //===Detectando concepto a modificar
    const ConceptIndex = secciones[seccionIndex].conceptos.findIndex(
      concepto => concepto._id === ConceptId
    );

    //===cambiando valor
    if(name==="quantity")
    secciones[seccionIndex].conceptos[ConceptIndex][name]=+(event.target.value)
      else{
        secciones[seccionIndex].conceptos[ConceptIndex][name]=(event.target.value)
      }

    console.log(secciones[seccionIndex].conceptos[ConceptIndex])
    secciones[seccionIndex].conceptos[ConceptIndex].totalPrice=+(secciones[seccionIndex].conceptos[ConceptIndex].price)*+(secciones[seccionIndex].conceptos[ConceptIndex].quantity)
    let totalPrice=0;

    //====actualizando precio total en base amodificacion
    secciones[seccionIndex].conceptos.forEach(concepto => {
      totalPrice+=concepto.totalPrice;
    });
    console.log(totalPrice)
    secciones[seccionIndex].precioUnitario=totalPrice.toFixed(2);
    secciones[seccionIndex].subtotal=(+(secciones[seccionIndex].cantidadPartida)*+(totalPrice)).toFixed(2);
    secciones[seccionIndex].importeTotal=(+(secciones[seccionIndex].cantidadPartida)*+(totalPrice)).toFixed(2);


    this.setState({
      partidas:secciones
    })
    
    // secciones[seccionIndex].precioUnitario

    // secciones[seccionIndex][name]=event.target.value
    // this.setState({
    //   partidas:secciones
    // })
    // // console.log(`modifico ${seccionIndex}`);
    // console.log(secciones)
  }

  handleSave=()=>{
    console.log("saving")
    console.log(this.state)
  }

  addConcept=(Id,valor)=>{
    swal({
      title: "Ingresa cantidad",
      content: 'input',
      buttons: true,
      dangerMode: true,
    }).then( async (value) => {
      if(value===null){
      }
      else if( isNaN(Number(value)) || Number(value) <= 0) {
          swal(`Favor de ingresar un numero mayor a 0, usted ingreso: ${value}`);
      }
      else {
        console.log(`agregando cantidad: ${value}`)
        console.log("agregando elemento")
        console.log("magia")
        console.log(valor)
        console.log(Id)
        let secciones=JSON.parse(JSON.stringify(this.state.partidas))
        const seccionIndex = secciones.findIndex(
          seccion => seccion._id === Id
        );
        valor.quantity=+value;
        valor.totalPrice=(+value)*(+valor.price);
        valor.mo=0;
        valor.noMo=0;
        valor.description=""
        valor.notas=""
        // console.log(seccionIndex)
        // console.log( secciones)
        secciones[seccionIndex].conceptos.push(valor)
        this.setState({
          partidas:secciones
        })
      }
    })
  }


  handleAddSection=()=>{
    console.log("Agregando Partida")
    let condition=this.state.nombrePartida===null||this.state.nombrePartida.length===0
    condition|=this.state.unidadPartida==null||this.state.unidadPartida.length===0
    condition|=this.state.cantidadPartida==null||this.state.cantidadPartida.length===0
    if(condition){
      swal(`Favor de llenar los campos de cantidad, nombre partida y unidad partida`,"Valores no nulos","error");
    }
    else{
      if (!this.state.cantidadPartida || isNaN(Number(this.state.cantidadPartida)) || Number(this.state.cantidadPartida) <= 0) {
        swal(`Favor de ingresar un numero mayor a 0`,` usted ingreso: ${this.state.cantidadPartida}`,"error");
      }
      else{
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
    }
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
            {this.state.partidas.map((partida,x)=>{
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
                    {
                      partida.conceptos.map((concepto,i)=>{
                        return (
                          <Row noGutters className="concept" key={concepto._id}>
                            <div className='concept-child' style={{width:"100%"}}>
                              <Form.Control type="text" placeholder={`Descripcion de concepto ${x+1}.0${i+1}`} 
                                onChange={this.handleConceptChange.bind(this,partida._id,concepto._id,"descripcion")}/>
                                  {/* Descripcion de concepto {x+1}.0{i+1} */}
                            </div>
                            <div className='concept-child' style={{width:"100%"}}>
                              <Form.Control type="text" placeholder={`Notas ${x+1}.0${i+1}`} 
                                onChange={this.handleConceptChange.bind(this,partida._id,concepto._id,"notas")}/>
                            </div>
                            {/* <div className='concept-child' style={{width:"100%"}}>Notas {x+1}.0{i+1}</div> */}
                            <div className='concept-child' style={{width:"12%",backgroundColor:"#699c9c"}}>{x+1}.0{i+1}</div>
                            <div className='concept-child' style={{width:"12%",backgroundColor:"#699c9c"}}>{concepto.conceptKey}</div>
                            <div className='concept-child' style={{width:"12%",backgroundColor:"#699c9c"}}>{concepto.name}</div>
                            <div className='concept-child' style={{width:"12%",backgroundColor:"#699c9c"}}>{concepto.measurementUnit}</div>
                            {/* <div className='concept-child' style={{width:"12%"}}>{concepto.quantity}</div> */}
                            <div className='concept-child' style={{width:"12%" ,backgroundColor:"#699c9c"}}>
                              <Form.Control type="email" placeholder={concepto.quantity} 
                              onChange={this.handleConceptChange.bind(this,partida._id,concepto._id,"quantity")}/>
                            </div>
                            <div className='concept-child' style={{width:"12%",backgroundColor:"#699c9c"}}>{concepto.price.toFixed(2)}</div>
                            <p >hola</p>
                          </Row>
                        )
                      })
                    }
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
