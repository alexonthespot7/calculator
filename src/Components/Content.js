import bcground from '../assets/bcground.jpg';
import bcground_light from '../assets/bcground_light.jpg';

import { useContext } from "react";

import Header from "./Header";
import Calculator from "./Calculator";
import useMediaQuery from "../Hooks/useMediaQuery";
import ThemeContext from "../contexts/ThemeContext";

export default function Content() {
  const { theme } = useContext(ThemeContext);
  const isPC = useMediaQuery("(min-width: 950px)");
  const image = theme === 'dark' ? bcground : bcground_light;

  const divStyle = isPC
    ? {}
    : {
      backgroundImage: `url(${image})`,
      backgroundSize: 'cover', // Adjust based on your design preferences
      backgroundPosition: 'center center', // Adjust based on your design preferences
      backgroundRepeat: 'no-repeat', // Adjust based on your design preferences
      height: '100vh', // Set the height of the background
    }

  return (
    <div style={divStyle}>
      <Header />
      <Calculator />
    </div>
  );
}