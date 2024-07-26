import { Link } from "react-router-dom";
import logo from "../assets/icons/logo.svg";
import { useIsAuthenticated, useIsAdmin } from "../context/AuthContext";
import UserService from "../service/UserService";

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
    <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-dark border-bottom box-shadow">
      <div className="container-fluid">
        <img
          src={logo}
          alt="logo"
          width="40"
          className="d-inline-block align-top"
        />
        <Link to="/" className="mx-2">
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
          <ul className="navbar-nav me-auto mb-lg-0">
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link to="/user/topic">Your topics</Link>
                </li>
                <li className="nav-item">
                  <Link to="/user/quiz/set">Quiz</Link>
                </li>
                {isAdmin && (
                  <li className="nav-item">
                    <Link to="/admin/user-management">User Management</Link>
                  </li>
                )}
              </>
            )}
          </ul>
          <ul className="navbar-nav ms-auto mb-lg-0">
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link to="/profile">Profile</Link>
                </li>
                <li className="nav-item">
                  <Link to="/" onClick={handleLogout}>
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
  );
}

export default Navbar;
