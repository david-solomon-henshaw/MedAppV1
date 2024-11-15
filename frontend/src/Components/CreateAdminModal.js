// // CreateAdminModal.js
// import React, { useState } from 'react';
// import { Button, Modal, Form, Alert } from 'react-bootstrap';
// import axios from 'axios';

// const CreateAdminModal = ({ show, handleClose }) => {
//   const [adminData, setAdminData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });
  
//   const [alert, setAlert] = useState({
//     show: false,
//     message: '',
//     type: '', // 'success' or 'danger'
//   });

//   const handleCreateAdmin = async (e) => {
//     e.preventDefault();

//     if (adminData.password !== adminData.confirmPassword) {
//       return setAlert({
//         show: true,
//         message: 'Passwords do not match',
//         type: 'danger',
//       });
//     }

//     try {
//       const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/register`, {
//         firstName: adminData.firstName,
//         lastName: adminData.lastName,
//         email: adminData.email,
//         password: adminData.password,
//       });

//       setAdminData({
//         firstName: '',
//         lastName: '',
//         email: '',
//         password: '',
//         confirmPassword: '',
//       });
//       setAlert({
//         show: true,
//         message: 'Admin created successfully!',
//         type: 'success',
//       });
//       setTimeout(handleClose, 2000); // Close modal after 2 seconds
//     } catch (error) {
//       setAlert({
//         show: true,
//         message: 'Error creating admin. Please try again.',
//         type: 'danger',
//       });
//     }
//   };

//   return (
//     <Modal show={show} onHide={handleClose} size="lg">
//       <Modal.Header closeButton>
//         <Modal.Title>Create Admin</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {alert.show && (
//           <Alert variant={alert.type} onClose={() => setAlert({ ...alert, show: false })} dismissible>
//             {alert.message}
//           </Alert>
//         )}
//         <Form onSubmit={handleCreateAdmin}>
//           <Form.Group controlId="formFirstName" className="mb-3">
//             <Form.Label>First Name</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Enter first name"
//               value={adminData.firstName}
//               onChange={(e) => setAdminData({ ...adminData, firstName: e.target.value })}
//               required
//             />
//           </Form.Group>
//           <Form.Group controlId="formLastName" className="mb-3">
//             <Form.Label>Last Name</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Enter last name"
//               value={adminData.lastName}
//               onChange={(e) => setAdminData({ ...adminData, lastName: e.target.value })}
//               required
//             />
//           </Form.Group>
//           <Form.Group controlId="formEmail" className="mb-3">
//             <Form.Label>Email</Form.Label>
//             <Form.Control
//               type="email"
//               placeholder="Enter email"
//               value={adminData.email}
//               onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
//               required
//             />
//           </Form.Group>
//           <Form.Group controlId="formPassword" className="mb-3">
//             <Form.Label>Password</Form.Label>
//             <Form.Control
//               type="password"
//               placeholder="Enter password"
//               value={adminData.password}
//               onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
//               required
//             />
//           </Form.Group>
//           <Form.Group controlId="formConfirmPassword" className="mb-3">
//             <Form.Label>Confirm Password</Form.Label>
//             <Form.Control
//               type="password"
//               placeholder="Confirm password"
//               value={adminData.confirmPassword}
//               onChange={(e) => setAdminData({ ...adminData, confirmPassword: e.target.value })}
//               required
//             />
//           </Form.Group>
//           <Button variant="success" type="submit" className="mt-3">
//             Create Admin
//           </Button>
//         </Form>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default CreateAdminModal;

import React, { useState } from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phoneNumber: false,
    department: false,
    password: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    department: '',
    password: '',
    confirmPassword: '',
  });

  const departments = [
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Radiology',
    'General Surgery',
  ];

  // Validate individual field
  const validateField = (field, value) => {
    switch (field) {
      case 'firstName':
      case 'lastName':
        if (!value) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: 'This field is required.',
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: '',
          }));
        }
        break;
      case 'email':
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: 'This field is required.',
          }));
        } else if (!emailPattern.test(value)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: 'Please enter a valid email address (e.g., name@example.com).',
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: '',
          }));
        }
        break;
      case 'phoneNumber':
        const phonePattern = /^\d{10,15}$/;
        if (!value) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            phoneNumber: 'This field is required.',
          }));
        } else if (!phonePattern.test(value)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            phoneNumber: 'Please enter a valid phone number (10-15 digits, numbers only).',
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            phoneNumber: '',
          }));
        }
        break;
      case 'password':
        if (!value) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            password: 'This field is required.',
          }));
        } else if (value.length < 8) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            password: 'Password must be at least 8 characters long.',
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            password: '',
          }));
        }
        break;
      case 'confirmPassword':
        if (!value) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            confirmPassword: 'This field is required.',
          }));
        } else if (value !== caregiverData.password) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            confirmPassword: 'Passwords do not match.',
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            confirmPassword: '',
          }));
        }
        break;
      case 'department':
        if (!value) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            department: 'Please select a department.',
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            department: '',
          }));
        }
        break;
      default:
        break;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCaregiverData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));
    validateField(name, caregiverData[name]);
  };

  const handleCreateCaregiver = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(touched).reduce((acc, key) => ({
      ...acc,
      [key]: true,
    }), {});
    setTouched(allTouched);

    // Validate all fields
    Object.keys(caregiverData).forEach((field) => validateField(field, caregiverData[field]));

    // Check for errors
    const hasErrors = Object.values(errors).some((error) => error !== '');
    if (hasErrors) {
      toast.error('Please fix all errors before submitting.');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/caregivers`, {
        ...caregiverData,
        available: true,
      });

      console.log('Caregiver created successfully:', response.data);
      toast.success('Caregiver created successfully!');

      // Reset form
      setCaregiverData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        department: '',
        password: '',
        confirmPassword: '',
      });
      setTouched({
        firstName: false,
        lastName: false,
        email: false,
        phoneNumber: false,
        department: false,
        password: false,
        confirmPassword: false,
      });
      
      setTimeout(handleClose, 2000);
    } catch (error) {
      console.error('Error creating caregiver:', error.response?.data?.message || error.message);
      toast.error('Error creating caregiver. Please try again.');
    }
  };

  const getValidationState = (field) => {
    if (!touched[field]) return null;
    return errors[field] ? 'invalid' : 'valid';
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create Caregiver</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateCaregiver} noValidate>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formFirstName" className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
                    value={caregiverData.firstName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    isValid={touched.firstName && !errors.firstName}
                    isInvalid={touched.firstName && !!errors.firstName}
                  />
                  <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formLastName" className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                    value={caregiverData.lastName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    isValid={touched.lastName && !errors.lastName}
                    isInvalid={touched.lastName && !!errors.lastName}
                  />
                  <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={caregiverData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    isValid={touched.email && !errors.email}
                    isInvalid={touched.email && !!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formPhoneNumber" className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    value={caregiverData.phoneNumber}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    isValid={touched.phoneNumber && !errors.phoneNumber}
                    isInvalid={touched.phoneNumber && !!errors.phoneNumber}
                  />
                  <Form.Control.Feedback type="invalid">{errors.phoneNumber}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group controlId="formDepartment" className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Select
                    name="department"
                    value={caregiverData.department}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    isValid={touched.department && !errors.department}
                    isInvalid={touched.department && !!errors.department}
                  >
                    <option value="">Select department</option>
                    {departments.map((dept, index) => (
                      <option key={index} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.department}</Form.Control.Feedback>
                </Form.Group>
              </Col>
           
            </Row>

            <Row>
            <Col md={6}>
                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={caregiverData.password}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    isValid={touched.password && !errors.password}
                    isInvalid={touched.password && !!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formConfirmPassword" className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={caregiverData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    isValid={touched.confirmPassword && !errors.confirmPassword}
                    isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                  />
                  <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-between mt-3">
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Create Caregiver
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default CreateCaregiverModal;
