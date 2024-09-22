import { Col, Container, Row } from "react-bootstrap";
import { Restaurant } from "../../../models/Restauran.model"
import "./People.css"
import { TextField } from "@mui/material";

type Props = {
    restaurant:Restaurant;
    setPeople:(value:string)=>void;
    data:string;
}
const People = ({restaurant,data,setPeople}:Props) => {
    return(
        <Container>
            <div className="title">¿Cuantos Van?</div>
            <Row>
                <Col></Col>
                <Col className="field"><TextField value={data} id="people" label="Personas" variant="standard" onChange={((value)=>setPeople(value.target.value))} /></Col>
                <Col></Col>
            </Row>
        </Container>
    )
}

export default People