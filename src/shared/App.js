import * as React from "react";
import Grid from "./Grid";
import "./styles.css";

export default function App({ serverData }) {
  return (
    <div>
      <Grid data={serverData} />
    </div>
  );
}