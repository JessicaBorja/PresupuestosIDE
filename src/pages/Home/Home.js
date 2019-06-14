import React, { Component } from "react";

import Layout from "../../components/Layout/Layout";
import "./Home.css";

export class HomePage extends Component {


  render() {
    return (
      <Layout>
        <div className="home">
          <p>Landing page</p>
        </div>
      </Layout>
    );
  }
}

export default HomePage;
