import React from "react";
import { BrowserRouter  } from 'react-router-dom';
import { NavLink } from 'react-router-dom';


export function Header(props: {
    logo: string,
}){
    return (
        <>  
        
            <nav className="topNav container" id="navBar">
            <a className="logo" href="index.html"><img src={props.logo} alt={props.logo} /></a>
            <div className="buttons">
            <BrowserRouter>
                <NavLink to="/1" >
                    填寫表格
                </NavLink>  
                <NavLink to="/2">
                    修改資料
                </NavLink>   
                <NavLink to="/3">
                    查詢結果
                </NavLink>  
            </BrowserRouter>              
            </div>
            <a
            href="javascript:void(0);"
            className="icon"

            >&#9776;</a
            >
        </nav>
        </>
    )
}

