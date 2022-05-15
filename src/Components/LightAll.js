import LightCalculator from "./LightCalculator";
import LightHeader from "./LightHeader";

export default function LightAll({ setTheme }) {
    return (
      <>
        <LightHeader setTheme={setTheme} />
        <LightCalculator />
      </>
    )
    
}