import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { TeacherOverview } from "./TeacherOverview";
import { AdminOverview } from "./AdminOverview";
import Header from "../Header";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export function Overview() {
    const { role } = useSelector(
        (state: RootState) => state.auth.payload.login
    );

    

    return (
        <div className="outer_container">
            <Header title="總覽" />

            <main>
                {role === "admin" && <AdminOverview />}
                {role === "teacher" && <TeacherOverview />}
            </main>
        </div>
    );
}
