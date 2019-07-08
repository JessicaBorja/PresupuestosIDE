import React, { Component } from "react";

import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import ScrollToTop from "./containers/ScrollToTop/ScrollToTop";
import ConceptsPage from "./pages/Concepts/AddConcept/Concepts";
import EditConcept from "./pages/Concepts/ConceptEdit/Concepts";
import ConceptDetail from "./pages/Concepts/ConceptDetail/Concepts";

import MaterialsPage from "./pages/Materials/Materials";
import UnitPage from "./pages/Unit/AddUnit/Unit";
import EditPage from "./pages/Unit/UnitEdit/Unit";
import UnitDetail from "./pages/Unit/UnitDetail/Unit";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPlus,
  faTrash,
  faEdit,faSync,
  faHome,
  faChevronLeft,
  faMapMarkerAlt,
  faSearch,
  faChevronCircleLeft,
  faChevronCircleRight,
  faWindowClose
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faLinkedin,
  faWhatsapp
} from "@fortawesome/free-brands-svg-icons";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";
import "./App.css";
import BudgetPage from "./pages/Budget/Budget";

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_SERVER_URL}/graphql`
});

class App extends Component {
  render() {
    library.add([
      faFacebook, faLinkedin, faSearch, faHome,
      faWindowClose, faChevronLeft, faMapMarkerAlt,
      faChevronCircleLeft, faChevronCircleRight, faWhatsapp,
      faPlus,faTrash,faEdit,faSync
    ]);

    return (
      <BrowserRouter>
        <ScrollToTop>
          <ApolloProvider client={client}>
            <Switch>

              <Route path="/concepto/:id" component={ConceptDetail} />
              <Route path="/ConsultaConcepto" component={EditConcept} />
              <Route path="/presupuestos" component={BudgetPage} />
              <Route path="/conceptos" component={ConceptsPage} />

              <Route path="/unitario/:id" component={UnitDetail} />
              <Route path="/unitario" component={UnitPage} />
              <Route path="/ConsultaUnitario" component={EditPage} />

              <Route path="/materiales" component={MaterialsPage} />
              <Redirect to="/presupuestos" />
            </Switch>
          </ApolloProvider>
        </ScrollToTop>
      </BrowserRouter>
    );
  }
}

export default App;
