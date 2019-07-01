import React from 'react';
import Modal from "react-bootstrap/Modal";
import "./Modal.css"
// import ProductCarousel from "../../Carousel/Carousel"
import { Col, Row, Container } from "react-bootstrap"
import Form from 'react-bootstrap/Form'
import  { Component } from "react";


// import Link from "react-router-dom/Link"
class ProductModal extends Component {  
    constructor(props) {
        super(props);
        this.state = { 
        materialQuantity:null,
        unitPrice:null,
        totalPrice:null,
        measurementUnit:"",
        id:""
    }
        // console.log(props)

    }
// const ProductModal = (props) => {
    handleSave=(material,stuff)=>{
        console.log("save")
        console.log(this.state)
        // this.setState({ price: true });

    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value ,
            id:this.props.product._id
        });
    }
    
    render() {
        // console.log("render")
        // console.log(this.props)
        return (
            <Modal
                className="product__modal"
                show={this.props.show}
                onHide={this.props.onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {this.props.product.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container fluid>
                        <Row>
                            <Col xs={12} lg={6}>
                                <Form.Label>Cantidad</Form.Label>
                                <Form.Control type="email" placeholder={this.props.product.materialQuantity} 
                                onChange={this.handleChange('materialQuantity')}/>    
                            </Col>
                            <Col xs={12} lg={6}>
                                <Form.Label>Precio unitario</Form.Label>
                                <Form.Control type="email" placeholder={this.props.product.unitPrice} 
                                onChange={this.handleChange('unitPrice')}/>    
                            </Col>
                        </Row>
                        <Row className="modal_buttons-container">
                            <button className="edit-btn" onClick={this.props.onConfirm.bind(this,this.state)}>Guardar</button>  
                            <button className="danger-btn" onClick={this.props.onHide}>Cancelar</button>
                        </Row>
                    </Container>
                </Modal.Body >
                <Modal.Footer>
                    {/* <Link to="/cotizacion">
                        <button onClick={props.handleQuotation} className="btn btn-main">Solicita cotización</button>
                    </Link> */}
                </Modal.Footer>
            </Modal >
        )
    }   
}

export default ProductModal
