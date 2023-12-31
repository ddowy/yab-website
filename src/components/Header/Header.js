import styles from './header.module.css'

export default function Header() {
    return (
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <img className={styles.logo} src="/images/logo.svg" alt="Logo for St. Pauls homeless Youth Advisory Board" />
        </div>
        <nav className={styles.nav}>
          <ul className={styles.navul}>
            <li className={styles.navli}>
              <a className={styles.link} href="/enroll">Enroll</a>
            </li>
            <li className={styles.navli}>
              <a className={styles.link} href="/contact">Contact us</a>
            </li>
          </ul>
        </nav>
      </header>
    )
}