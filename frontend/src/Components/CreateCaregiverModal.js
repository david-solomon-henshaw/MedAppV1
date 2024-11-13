// CreateCaregiverModal.js
import React, { useState } from 'react';
import { Button, Modal, Form, Row, Col, Alert } from 'react-bootstrap';
import PasswordInput from './PasswordInput';
import axios from 'axios';

const CreateCaregiverModal = ({ show, handleClose }) => {
  const [caregiverData, setCaregiverData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    department: '',
    password: '',
    confirmPassword: '',
  });

  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: '', // 'success' or 'danger'
  });

  const departments = [
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Radiology',
    'General Surgery',
  ];

  const isFormFilled = () => {
    const { firstName, lastName, email, phoneNumber, department, password, confirmPassword } = caregiverData;
    return firstName && lastName && email && phoneNumber && department && password && confirmPassword;
  };

  const handleCreateCaregiver = async (e) => {
    e.preventDefault();
    if (caregiverData.password !== caregiverData.confirmPassword) {
      return setAlert({
        show: true,
        message: 'Passwords do not match',
        type: 'danger',
      });
    }

    try {
      // Send the caregiver data to the backend, with 'available' set to true by default
      const response = await axios.post('http://localhost:2000/api/admin/caregivers', {
        firstName: caregiverData.firstName,
        lastName: caregiverData.lastName,
        email: caregiverData.email,
        phoneNumber: caregiverData.phoneNumber,
        department: caregiverData.department,
        password: caregiverData.password,
        available: true, // Set availability as true by default
      });

      console.log('Caregiver created successfully:', response.data);

      // Clear form data and close modal after successful submission
      setCaregiverData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        department: '',
        password: '',
        confirmPassword: '',
      });
      setAlert({
        show: true,
        message: 'Caregiver created successfully!',
        type: 'success',
      });
      setTimeout(handleClose, 2000); // Close modal after 2 seconds
    } catch (error) {
      console.error('Error creating caregiver:', error.response?.data?.message || error.message);
      setAlert({
        show: true,
        message: 'Error creating caregiver. Please try again.',
        type: 'danger',
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create Caregiver</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Display success or error alert */}
        {alert.show && (
          <Alert variant={alert.type} onClose={() => setAlert({ ...alert, show: false })} dismissible>
            {alert.message}
          </Alert>
        )}

        <Form onSubmit={handleCreateCaregiver}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formFirstName" className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter first name"
                  value={caregiverData.firstName}
                  onChange={(e) => setCaregiverData({ ...caregiverData, firstName: e.target.value })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formLastName" className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter last name"
                  value={caregiverData.lastName}
                  onChange={(e) => setCaregiverData({ ...caregiverData, lastName: e.target.value })}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={caregiverData.email}
                  onChange={(e) => setCaregiverData({ ...caregiverData, email: e.target.value })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formPhoneNumber" className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Enter phone number"
                  value={caregiverData.phoneNumber}
                  onChange={(e) => setCaregiverData({ ...caregiverData, phoneNumber: e.target.value })}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="formDepartment" className="mb-3">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  as="select"
                  value={caregiverData.department}
                  onChange={(e) => setCaregiverData({ ...caregiverData, department: e.target.value })}
                  required
                >
                  <option value="">Select a department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <PasswordInput
                label="Password"
                value={caregiverData.password}
                onChange={(e) => setCaregiverData({ ...caregiverData, password: e.target.value })}
                className="mb-3"
              />
            </Col>
            <Col md={6}>
              <PasswordInput
                label="Confirm Password"
                value={caregiverData.confirmPassword}
                onChange={(e) => setCaregiverData({ ...caregiverData, confirmPassword: e.target.value })}
                className="mb-3"
              />
            </Col>
          </Row>

          <Button
            variant="primary"
            type="submit"
            className="mt-3"
            disabled={!isFormFilled()}
          >
            Create Caregiver
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateCaregiverModal;
