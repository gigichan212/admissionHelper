import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { IRootState } from "../../store";
// Redux
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/auth/actions";
import logo from "../../assets/img/logo.png";
//  FontAwesome
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NavBar() {
  const dispatch = useDispatch();
  // Trigger mobile menu open
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMenu = () => setMobileMenuOpen(!isMobileMenuOpen);
  // Get user Login Status
  const isAuthenticated = useSelector((state: IRootState) => state.auth.isAuth);
  return (
    <nav
      className={
        isMobileMenuOpen ? "topNav container responsive" : "topNav container"
      }
      id="navBar"
    >
      <Link to="/">
        <a className="icons">
          <img src={logo} alt={logo} />
        </a>
      </Link>
      <div onClick={toggleMenu} className="buttons">
        {!isAuthenticated && <NavLink to="/form">填寫表格</NavLink>}

        <NavLink to="/edit">修改資料</NavLink>
        <NavLink to="/result">查詢結果</NavLink>
        {isAuthenticated && (
          <a href="#" className="logout" onClick={() => dispatch(logout())}>
            登出
          </a>
        )}
      </div>
      <a className="icon" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
        <FontAwesomeIcon icon={faBars} />
      </a>
    </nav>
  );
}
