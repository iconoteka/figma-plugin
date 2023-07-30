import { h } from "preact";
import styles from "./NoIcons.css";

export const NoIcons = () => {
  return (
    <div className={styles.NoIcons}>
      Sorry, we don't have this icon yet.
      <br />
      <a href="mailto:iconoteka.com" target="_blank">
        Submit icon
      </a>
    </div>
  );
};
