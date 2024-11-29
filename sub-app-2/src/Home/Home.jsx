import React from "react";
import { Container } from "react-bootstrap";
import Account from "./Account";


{ /* Need login and create account info her, se Index home i Sub-app-1 for inspo */}

const Home = () => {
    return (
        <Container >
        <div className="text-center">
            <h1>Welcome to FoodBank</h1>
            < Account />
        </div>
        </Container>
    );
};

export default Home;