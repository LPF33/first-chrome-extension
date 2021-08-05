import * as React from "react";

export const AppContext = React.createContext();

export default function AppContextProvider(props) {
    const [tool, setTool] = React.useState("Tracker");

    return (
        <AppContext.Provider value={{ tool, setTool }}>
            {props.children}
        </AppContext.Provider>
    );
}
