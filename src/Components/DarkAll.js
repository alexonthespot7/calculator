import DarkCalculator from "./DarkCalculator";
import DarkHeader from "./DarkHeader";

export default function DarkAll({ theme, setTheme }) {
    return (
        <>
            <DarkHeader setTheme={setTheme} />
            <DarkCalculator />
        </>
    )
}