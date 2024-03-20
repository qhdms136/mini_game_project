import React, { Component } from "react";

import WithMoveValidation from "../integrations/WithMoveValidation";

class Chess extends Component {
  render() {
    return (
      <div className="bg_chess">
        <div style={boardsContainer}>
          <WithMoveValidation />
        </div>
      </div>
    );
  }
}

export default Chess;

const boardsContainer = {
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  flexWrap: "wrap",
  width: "100vw",
  marginTop: 30,
  marginBottom: 50
};
