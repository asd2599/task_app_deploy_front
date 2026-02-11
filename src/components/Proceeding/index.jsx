import React from "react";
import Navbar from "../Common/Navbar";
import ItemPanel from "../Common/ItemPanel";

const index = () => {
  return (
    <div className="page_section">
      <Navbar />
      <ItemPanel
        pageTitle="Proceeding Items"
        filterCompleted={false}
        filterImportant={"all"}
      />
    </div>
  );
};

export default index;
