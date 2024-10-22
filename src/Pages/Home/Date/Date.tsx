import { Col, Container, Row } from "react-bootstrap";
import { Restaurant } from "../../../models/Restauran.model";
import Calendar from 'react-calendar';
import "./Date.css";
import moment from "moment";
export type ValuePiece = Date | null;

export type Value = ValuePiece | [ValuePiece, ValuePiece];
type Props = {
    restaurant:Restaurant;
    setData:(value:Value)=>void
    data:Value;
}
const Date = ({restaurant,data,setData}:Props) => {
    return(
        <Container>
            <div className="title">¿Que dia Van?</div>
            <Row>
                <Col></Col>
                <Col>
                    <Calendar onChange={setData} value={data} 
                    minDate={moment().add(restaurant.reservationLeadTime,'days').toDate()} 
                    />
                </Col>
                <Col></Col>
            </Row>
        </Container>
    )
}

export default Date