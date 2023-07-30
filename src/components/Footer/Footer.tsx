import { h } from "preact";
import styles from "./Footer.css";

type FooterProps = {
  version: string;
};

export const Footer = ({ version }: FooterProps) => {
  return (
    <div className={styles.footer}>
      <div className={styles.footer__about}>
        <a href="https://readymag.com/turbaba/1296248/" target="_blank">
          About
        </a>
      </div>
      <div className={styles.footer__support}>
        <a href="https://www.patreon.com/iconoteka" target="_blank">
          Support us on Patreon
        </a>
      </div>
      <div className={styles.footer__version}>V{version}</div>
    </div>
  );
};
