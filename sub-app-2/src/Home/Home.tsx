import React from "react";
import { Container } from "react-bootstrap";

const Home = () => {
    /* Basert på tidligere kode, må kobles til backend for at dette skal fungerer
    const { isAuthenticated, user, userRole } = useAuth();

    /*const getRoleMessage = (role) => {
      switch (role) {
        case UserRoles.Administrator:
          return "As an administrator, you have full access to manage products and users.";
        case UserRoles.FoodProducer:
          return "As a food producer, you can add and manage your products.";
        case UserRoles.RegularUser:
          return "As a user, you can view all products and their nutritional information.";
        default:
          return "Welcome to our application!";
      }
    };
    */
    /*
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-[var(--shadow-md)] p-8">
          <div className="text-center mb-6">
            <BowlFood 
              className="mx-auto w-16 h-16 text-[var(--primary-green)]" 
              aria-label="App Logo"
            />
          </div>
  
          {isAuthenticated ? (
            <>
              <h2 className="text-2xl font-bold text-center text-[var(--text-primary)] mb-3">
                Welcome, {user?.name}!
              </h2>
              <h6 className="text-lg text-center text-[var(--text-secondary)] mb-6">
                {getRoleMessage(userRole)}
              </h6>
              <hr className="my-6 border-[var(--border-color)]" />
              <p className="text-center text-[var(--secondery-blue)] mb-6">
                Get started by exploring our products.
              </p>
              <div className="text-center">
                <Link 
                  to="/products"
                  className="inline-flex items-center px-6 py-3 bg-[var(--primary-green)] hover:bg-[var(--primary-green-hover)] text-white rounded-[var(--border-radius-md)] transition-colors"
                >
                  View Products
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-center text-[var(--text-primary)] mb-3">
                Welcome to FoodStack!
              </h2>
              <h6 className="text-lg text-center text-[var(--text-secondary)] mb-6">
                Discover a variety of food products and their nutritional information.
              </h6>
              <hr className="my-6 border-[var(--border-color)]" />
              <p className="text-center text-[var(--secondery-blue)] mb-6">
                You need to log in to access the full features of our application.
              </p>
              <div className="text-center">
                <Link 
                  to="/account"
                  className="inline-flex items-center px-6 py-3 bg-[var(--primary-green)] hover:bg-[var(--primary-green-hover)] text-white rounded-[var(--border-radius-md)] transition-colors"
                >
                  Log in or register
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

*/
    return (
        <Container >
        <div className="text-center">
            <h1 className="display-4">Welcome to FoodBank</h1>
        </div>
        </Container>
    );
};

export default Home;