import React from "react";

const scrollTop = () => {
    const area = document.querySelector(".outer_container");
    if (area == null) {
        return;
    }
    area.scrollTo({ top: 0, behavior: "smooth" });
};

export default function ScrollArrow() {
    scrollTop();
    return null;
}
