import "./App.scss";
import Experience from "./Experience/Experience";
import IntroScreen from "./components/IntroScreen/IntroScreen";
import Chatbot from "./components/Chatbot/Chatbot";

function App() {
  return (
    <>
      <IntroScreen />
      <Experience />
      <Chatbot />
    </>
  );
}

export default App;
