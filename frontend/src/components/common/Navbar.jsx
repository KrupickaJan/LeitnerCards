import { Link } from "react-router-dom";
import logo from "../assets/icons/logo.svg";
import { useIsAuthenticated, useIsAdmin } from "../context/AuthContext";
import UserService from "../service/UserService";
import "bootstrap/dist/css/bootstrap.css";

function Navbar() {
  const { isAuthenticated, setIsAuthenticated } = useIsAuthenticated();
  const { isAdmin, setIsAdmin } = useIsAdmin();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      UserService.logout();
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  };

  return (
    <nav className="navbar navbar-expand-sm bg-dark navbar-toggleable-sm navbar-dark border-bottom box-shadow">
      <div className="container-fluid">
        <img
          src={logo}
          alt="logo"
          width="40"
          className="d-inline-block align-top"
        />
        <Link to="/" className="navbar-brand">
          LeitnerCards
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target=".navbar-collapse"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
          <ul className="navbar-nav">
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link active" to="/user/topic">
                    Your topics
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" to="/user/quiz/set">
                    Quiz
                  </Link>
                </li>
                {isAdmin && (
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      to="/admin/user-management"
                    >
                      User Management
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>
          <ul className="navbar-nav ms-auto mb-lg-0">
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link active" to="/profile">
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    to="/"
                    onClick={handleLogout}
                  >
                    Logout
                  </Link>
                </li>
              </>
            )}
            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
    // <nav class="navbar navbar-expand-sm bg-dark navbar-toggleable-sm navbar-dark border-bottom box-shadow">
    //   <div class="container-fluid">
    //     <a class="navbar-brand" href="#">
    //       Navbar
    //     </a>
    //     <button
    //       class="navbar-toggler"
    //       type="button"
    //       data-bs-toggle="collapse"
    //       data-bs-target="#navbarNav"
    //       aria-controls="navbarNav"
    //       aria-expanded="false"
    //       aria-label="Toggle navigation"
    //     >
    //       <span class="navbar-toggler-icon"></span>
    //     </button>
    //     <div class="collapse navbar-collapse" id="navbarNav">
    //       <ul class="navbar-nav">
    //         <li class="nav-item">
    //           <a class="nav-link active" aria-current="page" href="#">
    //             Home
    //           </a>
    //         </li>
    //         <li class="nav-item">
    //           <a class="nav-link" href="#">
    //             Features
    //           </a>
    //         </li>
    //         <li class="nav-item">
    //           <a class="nav-link" href="#">
    //             Pricing
    //           </a>
    //         </li>
    //         <li class="nav-item">
    //           <a class="nav-link disabled">Disabled</a>
    //         </li>
    //       </ul>
    //     </div>
    //   </div>
    // </nav>
  );
}

export default Navbar;
