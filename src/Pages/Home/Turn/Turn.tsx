import { Col, Container, Row } from "react-bootstrap";
import { Restaurant } from "../../../models/Restauran.model";
import "./Turn.css"
import { MenuItem, Select } from "@mui/material";
import moment from "moment";

type Props = {
    restaurant:Restaurant;
    setData:(value:string)=>void
    data:string|null;
}
const Turn = ({restaurant,data,setData}:Props) => {
    const setValue = (value:any) => {
        console.log(value.target.value)
        setData(value.target.value)
    }
    return(
        <Container>
            <div className="title">¿A que Hora Van?</div>
            <Row>
                <Col></Col>
                <Col className="field">
                    <Select
                    labelId="select-label"
                    id="select"
                    value={data??''}
                    label="Hora"
                    onChange={setValue}>
                        {restaurant.slots.map((item,index)=><MenuItem key={index} value={moment(item).add(-3,'hour').local().format('HH:mm')}>{moment(item).add(-3,'hour').local().format('HH:mm')}</MenuItem>)}
                    </Select>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    )
}

export default Turn