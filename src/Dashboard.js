import React, { useContext } from "react";
import { Usercontext } from "./Usercontext.js";

function Dashboard(props) {
  let Context = useContext(Usercontext);
  console.log(Context);

  return (
    <div>
      <h5 style={{ color: "orange" }}>
        Welcome,{Context.user.CurrentUsername}!
      </h5>
    </div>
  );
}
export default Dashboard;
