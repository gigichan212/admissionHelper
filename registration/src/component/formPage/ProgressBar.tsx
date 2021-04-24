import React from "react";

function ProgressBar(props: {
    current: string
}){
    return (
        <section className="container">
            <ul className="progressbar">
            <li className={`${props.current === "step1" ? "active" : ""} `}>填寫資料</li>
            <li className={`${props.current === "step2" ? "active" : ""} `}>確認資料</li>
            <li className={`${props.current === "step3" ? "active" : ""} `}>完成報名</li>
            </ul>
        </section>
    )
}

export default ProgressBar;