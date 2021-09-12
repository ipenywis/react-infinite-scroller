import logo from "./logo.svg";
import "./App.css";

import tw from "twin.macro";
import { Coins } from "./components/coins";

const AppContainer = tw.div`
  w-full
  max-w-full
  flex
  flex-col
  items-center
  justify-center
  pt-6
  pb-10
`;

const Title = tw.h1`
  text-2xl
  font-semibold
`;

function App() {
  return (
    <AppContainer>
      <Title>Crypto Currencies</Title>
      <Coins />
    </AppContainer>
  );
}

export default App;
