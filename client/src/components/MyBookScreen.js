import React from "react";
import PropTypes from "prop-types";
import withLanguage from "./LanguageContext";
/* import Texts from "../Constants/Texts"; */
import BackNavigation from "./BackNavigation";
import MyBooks from "./MyBooks";


const MyBooksScreen = ({ language, history }) => {
  /* const texts = Texts[language].createActivityScreen; */
  return (
    <div id="createActivityContainer">
      <BackNavigation
        title={"I miei Libri"}
        onClick={() => history.goBack()}
      />
      <MyBooks />
    </div>
  );
};

MyBooksScreen.propTypes = {
  language: PropTypes.string,
  history: PropTypes.object,
};

export default withLanguage(MyBooksScreen);