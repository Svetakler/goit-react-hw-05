import { Link } from "react-router-dom";
import styles from "./Navigation.module.css";

const Navigation = () => {
  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.link}>
        Home
      </Link>
      <Link to="/movies" className={styles.link}>
        Movies
      </Link>
    </nav>
  );
};

export default Navigation;
