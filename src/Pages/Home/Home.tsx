/* eslint-disable react-hooks/exhaustive-deps */
import "./Home.css"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRestaurantById } from "../../api/Restaurant.API";
import { Restaurant } from "../../models/Restauran.model";
import Loading from "../../components/Loading/Loading";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import People from "./People/People";
import { Button, Row,Container, Col, Image, Modal, Form, Alert } from "react-bootstrap";
import Date, { Value } from "./Date/Date";
import Turn from "./Turn/Turn";
import Confirm from "./Confirm/Confirm";
import * as formik from 'formik';
import * as yup from 'yup';
import { createUserPassword, loginUserPassword, signInWithGoogle } from "../../api/googleAuth";
import { CreateUser } from "../../api/authRestApi";
import { PostBooking } from "../../api/bookings";
import moment from "moment";

const steps = ['¿Cuantos Van?', '¿Que día?', '¿A que Hora?','Confirmar'];

const Home = () => {
    let { id } = useParams();
    const [data, setData] = useState<Restaurant|null>(null)
    const [loading,setLoading] = useState<boolean>(false)
    const [active, setActive] = useState(0);
    const [showSuccess,setShowSuccess] = useState(false)
    const [showBookingError,setShowBookingError] = useState(false)

    const [people,setPeople] = useState<number|null>(null)
    const [date,setDate] = useState<Value|null>(null)
    const [turn,setTurn] = useState<string|null>(null)
    const [showLogInError,setShowLogInError] = useState(false)
    const [showSignUpError,setShowSignUpError] = useState(false)

    const [show, setShow] = useState(false);
    const [showNewAccount, setShowNewAccount] = useState(false);

    const handleClose = () => {
        setShow(false)
        setShowNewAccount(false)
    };
    const { Formik } = formik;

    const schema = yup.object().shape({
        email:yup.string().required(),
        password:yup.string().required(),
    });

    const signUpSchema = yup.object().shape({
        email:yup.string().required(),
        password:yup.string().required(),
        phone:yup.string().required(),
    });

    const createBooking = async (token:string) => {
        try {
            if(people&&id&&turn) {
                setLoading(true)
                const turnData = turn.split(':') 
                const newDate = date as Date;
                const result = await PostBooking({
                    time:moment(newDate?.toISOString()).set('hour',parseInt(turnData[0])).set('minute',parseInt(turnData[1])).toISOString(),
                    people:people,
                    venue:id,
                },token)
                setLoading(false)
                console.log('new booking',result)
                setShowSuccess(true)
                CleanData()
            }
        } catch(err) {
            console.error('PostBooking',err)
            setShowBookingError(true)
        }
    }

    const getVenueData = async () => {
        setLoading(true)
        try {
            if(id) {
                const result = await getRestaurantById(id)
                if(result.result.length>0){
                    setData(result.result[0])
                }
            }
        } catch (err) {
            console.error(err)
            alert('Erro obteniendo los datos del Restaurante')
        }
        setLoading(false)
    }
    useEffect(()=>{
        getVenueData()
    },[id])

    const onLogin = async (values:any) =>{
        setLoading(true)
        try {
            const user = await loginUserPassword(values.email,values.password)
            console.log('login',user)
            const token = await user?.getIdToken()
            if(user !== null&&token) {
                await createBooking(token)
                handleClose()
            } else {
                // error en la creacion de usuario
                setLoading(false)
                setShowLogInError(true)

            }
        } catch (err) {
            console.log(err)
            setLoading(false)
            setShowLogInError(true)
        }
    }

    const googleLogin = async () => {
        const user = await signInWithGoogle()
        console.log('login',user)
        const token = await user?.user.getIdToken()
        if(token) {
            try {
                await CreateUser(token)
            } catch (err){

            }
            await createBooking(token)
            handleClose()
        }
    }

    const showCreateAccaount = () =>{
        setShow(false)
        setShowNewAccount(true)
    }

    const SignUp = async (values:any) => {
        const user = await createUserPassword(values.email,values.password)
        console.log('login',user)
        const token = await user?.getIdToken()
        if(user !== null&&token) {
            try {
                await CreateUser(token,values.phone)
                await createBooking(token)
                setShowNewAccount(false)
                handleClose()
            } catch (err){

            }
            
        } else {
            // error en la creacion de usuario
            setLoading(false)
            setShowSignUpError(true)
        }
    }

    const CleanData = () =>{
        setActive(0)
        setPeople(null)
        setDate(null)
        setTurn(null)
    }

    return (
        <div className="container-image">
            <Container style={{backgroundColor:'white',padding:12,minHeight:350}} >
                {data&&<>
                    
                    {/* <div className="logo-image"><Image src={data.logo} height={250} /></div> */}
                    <Stepper activeStep={active} style={{marginBottom:12,backgroundColor:'transparent'}}>
                        {steps.map((label, index) => {
                            return (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    <Row>
                        <Col style={{textAlign:'center'}}><Image src={data.logo} height={250} /></Col>
                        <Col xs={{order:window.innerWidth<=900?'first':'1'}} style={{alignContent:'center',minWidth:450}}>
                            {active===0&&
                            <>
                                <Row>
                                    <People data={people?people.toString():''} restaurant={data} setPeople={(value)=>{
                                        const parse = parseInt(value)
                                        if(parse&&parse>0) {
                                            setPeople(parse)
                                        } else {
                                            setPeople(null)
                                        }
                                    }} />
                                </Row>
                                <Row className="buttonRow">
                                    <Col className="next-button"></Col>
                                    <Col className="next-button"><Button onClick={()=> setActive(1)} disabled={!people||people<1}>Siguiente</Button></Col>
                                </Row>
                            </>
                            }
                            {active===1&&
                            <>
                                <Row>
                                    <Date data={date} restaurant={data} setData={setDate} />
                                </Row>
                                <Row className="buttonRow">
                                    <Col className="next-button"><Button onClick={()=> setActive(0)}>Atras</Button></Col>
                                    <Col className="next-button"><Button onClick={()=> setActive(2)} disabled={!date}>Siguiente</Button></Col>
                                </Row>
                            </>
                            }
                            {active===2&&
                            <>
                                <Row>
                                    <Turn data={turn} restaurant={data} setData={setTurn} />
                                </Row>
                                <Row className="buttonRow">
                                    <Col className="next-button"><Button onClick={()=> setActive(1)}>Atras</Button></Col>
                                    <Col className="next-button"><Button onClick={()=> setActive(3)} disabled={!turn}>Siguiente</Button></Col>
                                </Row>
                            </>
                            }
                            {active===3&&
                            <>
                                <Row>
                                    <Confirm people={people} date={date} turn={turn} />
                                </Row>
                                <Row className="buttonRow">
                                    <Col className="next-button"><Button onClick={()=> setActive(2)}>Atras</Button></Col>
                                    <Col className="next-button"><Button onClick={()=> {
                                        setShow(true)
                                    }}>Crear Reserva</Button></Col>
                                </Row>
                            </>
                            }
                        </Col>
                        <Col xs={{order:'2'}} style={{minWidth:300}}></Col>
                    </Row>
                </>}
                {loading&&<Loading />}

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Log in</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                                validationSchema={schema}
                                onSubmit={onLogin}
                                initialValues={{
                                    email:'',
                                    password:''
                                }}
                        >
                            {({ handleSubmit, handleChange, values, touched, errors }) => (
                                    <Form noValidate onSubmit={handleSubmit}>
                                        <Form.Group className="mb-3" controlId="email">
                                            <Form.Control type="email" placeholder="Email*"
                                            value={values.email}
                                            onChange={handleChange}
                                            isValid={touched.email && !errors.email}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="password">
                                            <Form.Control type="password" placeholder="Contraseña*"
                                            value={values.password}
                                            onChange={handleChange}
                                            isValid={touched.password && !errors.password}
                                            />
                                        </Form.Group>
                                        <Button className='submitButton' type="submit">
                                            Ingresar
                                        </Button>

                                        <Button onClick={googleLogin}>
                                            Ingresar con Google
                                        </Button>

                                        <Button onClick={showCreateAccaount} style={{marginLeft:8}}>
                                            Crear Cuenta
                                        </Button>
                                    </Form>
                                )}
                        </Formik>
                    </Modal.Body>
                </Modal>

                <Modal show={showNewAccount} onHide={()=>setShowNewAccount(false)}>
                    <Modal.Header closeButton>
                    <Modal.Title>Sign Up</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                                validationSchema={signUpSchema}
                                onSubmit={SignUp}
                                initialValues={{
                                    email:'',
                                    password:'',
                                    phone:''
                                }}
                        >
                            {({ handleSubmit, handleChange, values, touched, errors }) => (
                                    <Form noValidate onSubmit={handleSubmit}>
                                        <Form.Group className="mb-3" controlId="email">
                                            <Form.Control type="email" placeholder="Email*"
                                            value={values.email}
                                            onChange={handleChange}
                                            isValid={touched.email && !errors.email}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="phone">
                                            <Form.Control type="text" placeholder="Telefono*"
                                            value={values.phone}
                                            onChange={handleChange}
                                            isValid={touched.phone && !errors.phone}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="password">
                                            <Form.Control type="password" placeholder="Contraseña*"
                                            value={values.password}
                                            onChange={handleChange}
                                            isValid={touched.password && !errors.password}
                                            />
                                        </Form.Group>
                                        <Button className='submitButton' type="submit">
                                            Crear Cuenta
                                        </Button>

                                        <Button onClick={googleLogin}>
                                            Ingresar con Google
                                        </Button>

                                        <Button onClick={()=>{setShow(true);setShowNewAccount(false)}} style={{marginLeft:8}}>
                                            Log In
                                        </Button>
                                    </Form>
                                )}
                        </Formik>
                    </Modal.Body>
                </Modal>
            </Container>
            <Alert variant="danger" show={showLogInError} onClose={() => setShowLogInError(false)} dismissible style={{position:'fixed',top:100,left:'42%',zIndex:100000}}>
                <Alert.Heading>Error al Logearse</Alert.Heading>
                <p>
                    Mail o contraseña incorrecto
                </p>
            </Alert>
            <Alert variant="danger" show={showSignUpError} onClose={() => setShowSignUpError(false)} dismissible style={{position:'fixed',top:100,left:'39%',zIndex:100000}}>
                <Alert.Heading>Error Creando Usuario</Alert.Heading>
                <p>
                    Hubo un error al crear el usuario. Por favor contacte al soporte.
                </p>
            </Alert>
            <Alert variant="success" show={showSuccess} onClose={() => setShowSuccess(false)} dismissible style={{position:'fixed',top:50,left:'40%',zIndex:1000}}>
                <Alert.Heading>Exito</Alert.Heading>
                <p>
                    Reserva creada con exito
                </p>
            </Alert>
            <Alert variant="danger" show={showBookingError} onClose={() => setShowBookingError(false)} dismissible style={{position:'fixed',top:100,left:'39%',zIndex:100000}}>
                <Alert.Heading>Error Creando Reserva</Alert.Heading>
                <p>
                    Error al momento de crear la reserva. Pro favor intente nuevamente
                </p>
            </Alert>
        </div>
    )
}

export default Home