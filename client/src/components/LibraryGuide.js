import React from "react";
import PropTypes from "prop-types";
import Texts from "../Constants/Texts";
import BackNavigation from "./BackNavigation";
import withLanguage from "./LanguageContext";

const LibraryGuide = ({ history }) => {
  const renderGuide = () => {
    const { guide } = Texts.LibraryGuide;
    return guide.map((instruction, index) => (
      <li key={index} className="row no-gutters" id="instructionContainer">
        <div className="col-2-10">
          <h2 className="indexCircle center">{index + 1}</h2>
        </div>
        <div className="col-8-10">
          <div className="verticalCenter">
            <h1>{instruction.main}</h1>
            <p>{instruction.secondary}</p>
          </div>
        </div>
      </li>
    ));
  };
  const texts = Texts.sLibraryGuide;
  return (
    <React.Fragment>
      <BackNavigation
        title={texts.backNavTitle}
        onClick={() => history.goBack()}
      />
      <ul>{renderGuide()}</ul>
    </React.Fragment>
  );
};

export default withLanguage(LibraryGuide);

LibraryGuide.propTypes = {
  history: PropTypes.object,
  
};
