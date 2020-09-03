import React, { useContext } from "react";
import { ContextUser } from "../context/ContextUser";
import user from "../../assets/img/user.png";
import menu from "../../assets/img/menu.png";
import menu2 from "../../assets/img/menu2.png";
import logout from "../../assets/img/logout.png";
import { Route, Link } from "react-router-dom";

export default function Dropdown(props) {
  const { setContextUser } = useContext(ContextUser);

  const handelLogout = () => {
    localStorage.removeItem("token");
    setContextUser(false);
  };
  const toggle = () => {
    let modalDropdown;
    props.toggle
      ? (modalDropdown = (
          <div className="dropdown" style={{ display: "block", zIndex: 1 }}>
            <Route>
              <Link to="/profile">
                <img src={user} className="img-dd"></img>
                <p className="text-dd">Profile</p>
              </Link>

              <Link to="/add-journey">
                <img src={menu} className="img-dd" style={{ top: 50 }}></img>
                <p className="text-dd" style={{ top: 50 }}>
                  New Journey
                </p>
              </Link>
              <Link to="/bookmark">
                <img
                  src={menu2}
                  className="img-dd"
                  style={{ top: 90, height: 30 }}
                ></img>
                <p className="text-dd" style={{ top: 90 }}>
                  Bookmark
                </p>
              </Link>
              <hr
                className="line"
                style={{ position: "absolute", top: 110, width: 145 }}
              />
              <Link to="/" onClick={handelLogout}>
                <img src={logout} className="img-dd" style={{ top: 140 }}></img>
                <p className="text-dd" style={{ top: 140 }}>
                  Logout
                </p>
              </Link>
            </Route>
          </div>
        ))
      : (modalDropdown = (
          <div className="dropdown" style={{ display: "none" }}>
            <img src={user} className="img-dd"></img>
            <p className="text-dd">Profile</p>
            <img src={menu} className="img-dd" style={{ top: 50 }}></img>
            <p className="text-dd" style={{ top: 50 }}>
              Pay
            </p>
            <hr
              className="line"
              style={{ position: "absolute", top: 75, width: 150 }}
            />
            <img src={logout} className="img-dd" style={{ top: 110 }}></img>
            <p className="text-dd" style={{ top: 110 }}>
              Logout
            </p>
          </div>
        ));

    return modalDropdown;
  };

  return <div>{toggle()}</div>;
}
