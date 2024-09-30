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
import { Button, Row,Container, Col, Carousel, Image, Modal, Form } from "react-bootstrap";
import Date, { Value } from "./Date/Date";
import Turn from "./Turn/Turn";
import Confirm from "./Confirm/Confirm";
import * as formik from 'formik';
import * as yup from 'yup';
import { loginUserPassword, signInWithGoogle } from "../../api/googleAuth";
import { CreateUser } from "../../api/authRestApi";
import { PostBooking } from "../../api/bookings";
import moment from "moment";

const steps = ['¿Cuantos Van?', '¿Que día?', '¿A que Hora?','Confirmar'];

const Home = () => {
    let { id } = useParams();
    const [data, setData] = useState<Restaurant|null>(null)
    const [loading,setLoading] = useState<boolean>(false)
    const [active, setActive] = useState(0);

    const [people,setPeople] = useState<number|null>(null)
    const [date,setDate] = useState<Value|null>(null)
    const [turn,setTurn] = useState<string|null>(null)

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false)
    };

    const { Formik } = formik;

    const schema = yup.object().shape({
        email:yup.string().required(),
        password:yup.string().required(),
    });

    const createBooking = async (token:string) => {
        try {
            if(people&&id&&turn) {
                const turnData = turn.split(':') 
                const newDate = date as Date;
                const result = await PostBooking({
                    time:moment(newDate?.toISOString()).set('hour',parseInt(turnData[0])).set('minute',parseInt(turnData[1])).toISOString(),
                    people:people,
                    venue:id,
                },token)
                console.log('new booking',result)
                alert('Reserva creada Exitosamente')
            }
        } catch(err) {
            console.error('PostBooking',err)
            alert('Error al momento de crear la reserva. Pro favor intente nuevamente')
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
        const user = await loginUserPassword(values.email,values.password)
        console.log('login',user)
        const token = await user?.getIdToken()
        if(user !== null&&token) {
            try {
                await CreateUser(token)
            } catch (err){

            }
            await createBooking(token)
            handleClose()
        } else {
            // error en la creacion de usuario
            setLoading(false)
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

    return (
        <div className="container-image">
            <Container style={{backgroundColor:'white',padding:12}} >
                {data&&<>
                    <div className="logo-image"><Image src={data.logo} height={70} /></div>
                    <Stepper activeStep={active} style={{marginBottom:12,backgroundColor:'transparent'}}>
                        {steps.map((label, index) => {
                            return (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
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
                        <Row>
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
                        <Row>
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
                        <Row>
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
                        <Row>
                            <Col className="next-button"><Button onClick={()=> setActive(2)}>Atras</Button></Col>
                            <Col className="next-button"><Button onClick={()=> {setShow(true)}}>Crear Reserva</Button></Col>
                        </Row>
                    </>
                    }
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
                                    </Form>
                                )}
                        </Formik>
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    )
}

export default Home