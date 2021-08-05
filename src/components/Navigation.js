import React, { useContext } from "react";
import { FaBusinessTime, FaNotesMedical } from "react-icons/fa";
import { BiTimer } from "react-icons/bi";
import { CgColorPicker } from "react-icons/cg";
import { AppContext } from "../context/AppContext";

export default function Navigation() {
    const { setTool } = useContext(AppContext);

    return (
        <nav>
            <button onClick={() => setTool("Tracker")}>
                <FaBusinessTime />
            </button>
            <button onClick={() => setTool("Break")}>
                <BiTimer />
            </button>
            <button onClick={() => setTool("SnippetSafer")}>
                <FaNotesMedical />
            </button>
            <button onClick={() => setTool("ColorPicker")}>
                <CgColorPicker />
            </button>
        </nav>
    );
}
