import React, { useState } from 'react';
import "../app/App.css";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveIcon from '@material-ui/icons/Remove'; // ✅ Keep this

const FaqChild = ({ item }) => {
  const [state, set_state] = useState(false);

  return (
    <div className="faq_row">
      {state ? (
        <RemoveIcon onClick={() => set_state(!state)} />
      ) : (
        <AddCircleIcon onClick={() => set_state(!state)} />
      )}

      <div className="faq_col">
        <h1>{item.ques}</h1>
        <h2>{state ? item.ans : ""}</h2>
      </div>
    </div>
  );
};

export default FaqChild;
