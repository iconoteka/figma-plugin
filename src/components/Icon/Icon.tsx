import { emit } from "@create-figma-plugin/utilities";
import { IconItem } from "../../types";
import styles from "./Icon.css";
import { h } from "preact";

type ImageProps = {
  src: string;
  onClick: (event: any) => void;
};

function Image(props: ImageProps) {
  const style = {
    opacity: props.src !== "" ? 1 : 0,
  };

  return (
    <div className={styles.iconImageContainer}>
      <img
        src={props.src}
        class={styles.iconImage}
        style={style}
        onClick={props.onClick}
      />
    </div>
  );
}

type IconProps = {
  icon: IconItem;
  isVisible: boolean;
  baseUrl: string;
};
export function Icon(props: IconProps) {
  const { icon, isVisible, baseUrl } = props;
  const url = `${baseUrl}/media/${icon.path}`;

  const handleClick = () => {
    (async () => {
      const svgRequest = await fetch(url);
      const svg = await svgRequest.text();
      emit("ADD_ICON", { name: icon.name, svg });
    })();
  };

  const urlToUse = isVisible ? url : "";
  return (
    <div class={styles.iconContainer}>
      <div className={`${styles.iconPlaceholder}`}></div>

      <Image src={urlToUse} onClick={handleClick} />
    </div>
  );
}
