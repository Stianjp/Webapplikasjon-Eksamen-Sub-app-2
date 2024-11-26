import React from 'react';
import { Container } from 'react-bootstrap';

const ProductsPage = () => {
    return(
        <Container>
            <div className="Privacy">
                <h1>Privacy Policy</h1>
                <div className="bg-white rounded-[var(--border-radius-lg)] shadow-[var(--shadow-md)] p-8">
                    <section className="mb-8">
                        <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">
                            Data Collection
                        </h3>
                        <p className="text-[var(--text-secondary)] leading-relaxed">
                            We do not collect any personal information. This site is used solely 
                            for educational purposes, and the only data stored in our databases 
                            are your username, password, and the products you add.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                            Use of Data
                        </h4>
                        <p className="text-[var(--text-secondary)] leading-relaxed">
                            All data entered on our website is stored in a database to display 
                            our product to all users. Since this is solely a university project, 
                            the data will only be shared with our workgroup and any university 
                            evaluators.
                        </p>
                    </section>
                </div>
            </div>
        </Container>
    );
};

export default ProductsPage;
