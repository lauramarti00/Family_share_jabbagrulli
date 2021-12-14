import React from "react";
import PropTypes from "prop-types";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import BackNavigation from "./BackNavigation";
/*perchè .js */
import CreateBookStepper from "./CreateBookStepper.js";


const CreateBookScreen = ({ language, history }) => {
  const texts = Texts[language].createActivityScreen;
  return (
    <div id="createActivityContainer">
      <BackNavigation
        title={"Aggiungi Libro"}
        onClick={() => history.goBack()}
      />
      <CreateBookStepper />
    </div>
  );
};

CreateBookScreen.propTypes = {
  language: PropTypes.string,
  history: PropTypes.object,
};

export default withLanguage(CreateBookScreen);