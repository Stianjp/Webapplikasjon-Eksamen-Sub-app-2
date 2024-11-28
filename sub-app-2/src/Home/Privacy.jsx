import React from 'react';
import { Container } from 'react-bootstrap';

const Privacy = () => {
    return(
        <Container> 
            <div className="AllProducts">
                <h1>Privacy Page</h1>
                <p>We do not collect any personal information. This site is used solely for educational purposes, and the only data stored in our databases are your username, password, and the products you add.</p>
                <h4>Use of data</h4>
                <p>All data entered on our website is stored in a database to display our product to all users. Since this is solely a university project, the data will only be shared with our workgroup and any university evaluators.</p>
            </div>
        </Container>
    );
};
export default Privacy;
