import React from 'react';
import Modal from "react-bootstrap/Modal";
import "./Modal.css"
import { Col, Row, Container } from "react-bootstrap"
import Form from 'react-bootstrap/Form'
import { Component } from "react";
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

class MaterialModal extends Component {
    edit=false;
    // title="codigo"

    constructor(props) {
        super(props);
        let materialKey = "";
        let name = "";
        let quantity = 0;
        let unitPrice = 0;
        let totalPrice = 0;
        let measurementUnit = "";
        let id = "";
        let materialKeySubIndex="";
        let title="Codigo"

        if (props.material) {
            if (props.material.materialKey) materialKey = props.material.materialKey;
            if (props.material.name) name = props.material.name;
            if (props.material.quantity) quantity = props.material.quantity;
            if (props.material.unitPrice) unitPrice = props.material.unitPrice;
            if (props.material.totalPrice) totalPrice = props.material.totalPrice;
            if (props.material.measurementUnit) measurementUnit = props.material.measurementUnit;
            if (props.material._id) id = props.material._id;
            if (props.title) title = props.title;

            this.edit=true;
        }
        this.state = {
            materialKey, name, quantity, unitPrice, totalPrice, measurementUnit, id,materialKeySubIndex,title
        }
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    }
    handleSelect=(selectedValue)=>{
        console.log(selectedValue)
        this.setState({
            materialKeySubIndex:selectedValue,
            title:selectedValue
        })
    }

    render() {
        return (
            <Modal
                className="material__modal"
                show={this.props.show}
                onHide={this.props.onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {this.props.material ? "Editar Material" : "Añadir Material"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container fluid>
                        <Row>
                            <Col xs={12} lg={2}>
                            {/* title='Código'  */}
                            {/* onSelect={this.handleSelect.bind(this) */}
                                <DropdownButton variant="secondary" title={this.props.title} onSelect={this.props.changeSelect}>
                                    <Dropdown.Item as="button" eventKey='MO-' >Personal</Dropdown.Item>
                                    <Dropdown.Item as="button" eventKey='EQ-'>Equipo</Dropdown.Item>
                                    <Dropdown.Item as="button" eventKey='HE-'>Herramienta</Dropdown.Item>
                                    <Dropdown.Item as="button" eventKey='MAT-'>Material</Dropdown.Item>
                                </DropdownButton>
                            </Col>
                            <Col xs={12} lg={4}>
                                <Form.Label>Clave</Form.Label>
                                <Form.Control type="text" value={this.state.materialKey}
                                    onChange={this.handleChange('materialKey')} />
                            </Col>
                            <Col xs={12} lg={6}>
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control type="text" value={this.state.name}
                                    onChange={this.handleChange('name')} />
                            </Col>
                            {this.edit && <Col xs={12} lg={6}>
                                <Form.Label>Cantidad</Form.Label>
                                <Form.Control type="text" value={this.state.quantity}
                                    onChange={this.handleChange('quantity')} />
                            </Col>}
                            <Col xs={12} lg={6}>
                                <Form.Label>Precio unitario</Form.Label>
                                <Form.Control type="text" value={this.state.unitPrice}
                                    onChange={this.handleChange('unitPrice')} />
                            </Col>
                            {this.edit && <Col xs={12} lg={6}>
                                <Form.Label>Precio total</Form.Label>
                                <Form.Control type="text" value={this.state.totalPrice}
                                    onChange={this.handleChange('totalPrice')} />
                            </Col>}
                            <Col xs={12} lg={6}>
                                <Form.Label>Unidad</Form.Label>
                                <Form.Control type="text" value={this.state.measurementUnit}
                                    onChange={this.handleChange('measurementUnit')} />
                            </Col>
                        </Row>
                        <Row className="modal_buttons-container">
                            <button className="edit-btn" onClick={this.props.onConfirm.bind(this, this.state)}>Guardar</button>
                            <button className="danger-btn">Cancelar</button>
                        </Row>
                    </Container>
                </Modal.Body >
            </Modal >
        )
    }
}

export default MaterialModal
