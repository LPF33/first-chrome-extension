import Navigation from "./components/Navigation";
import Break from "./components/Break";
import Tracker from "./components/Tracker";
import SnippetSafer from "./components/SnippetSafer";
import ColorPicker from "./components/ColorPicker";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";

function App() {
    return (
        <>
            <header>
                <Navigation />
            </header>
            <main>
                <SwitchMain />
            </main>
        </>
    );
}

function SwitchMain() {
    const { tool } = useContext(AppContext);

    switch (tool) {
        case "Tracker":
            return <Tracker />;
        case "Break":
            return <Break />;
        case "SnippetSafer":
            return <SnippetSafer />;
        case "ColorPicker":
            return <ColorPicker />;
        default:
            return <Tracker />;
    }
}

export default App;
