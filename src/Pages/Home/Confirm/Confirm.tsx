import { Card, Container, Row } from "react-bootstrap";
import "./Confirm.css"
import moment from "moment";
type Props = {
    date:any;
    people:number | null;
    turn:string  | null;
}
const Confirm = ({date,people,turn}:Props) => {
    return(
        <Container style={{display:'flex',justifyContent:'center'}}>
            <Card style={{width:400}}>
                <Card.Body className="card-content">
                    <Card.Title className="text-center card-text">Confirmar Reserva</Card.Title>
                    <Card.Text>
                        <Row><div className="card-text">Personas: {people}</div> </Row>
                        <Row><div className="card-text">Fecha: {moment(date?.toISOString()).format('DD/MM/YYYY')}</div> </Row>
                        <Row><div className="card-text">Hora: {turn}</div> </Row>
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default Confirm