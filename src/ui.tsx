import {
  Container,
  Divider,
  LoadingIndicator,
  MiddleAlign,
  render,
  SearchTextbox,
  SegmentedControl,
  Text,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import styles from "./ui.css";
import useObserver from "preact-intersection-observer";
import { version } from "../package.json";
const backendUrl = "https://staging.iconoteka.com:8080";

import { emit } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useState, useEffect } from "preact/hooks";

const Footer = () => {
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

const NoIcons = () => {
  return (
    <div className={styles.NoIcons}>
      Sorry, we don't have this icon yet.
      <br />
      <a href="mailto:hello@iconoteka.com">Submit icon</a>
    </div>
  );
};
function Plugin() {
  const [icons, setIcons] = useState<null | any[]>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    weight: "bold",
    style: "stroke",
    query: "",
  });

  useEffect(() => {
    (async () => {
      const result: any = await fetch(
        `${backendUrl}/icons/style/${searchParams.style}/weight/${searchParams.weight}?query=${searchParams.query}&useGroups=true`
      );
      const icons = await result.json();

      setIcons(icons);
      setIsLoading(false);
    })();
  }, [searchParams.weight, searchParams.style, searchParams.query]);

  const handleWeightChange = (event: any) => {
    const value = event.target.value;
    setSearchParams({
      ...searchParams,
      weight: value,
    });
  };

  const handleStyleChange = (event: any) => {
    const value = event.target.value;
    setSearchParams({
      ...searchParams,
      style: value,
    });
  };

  const handleQueryChange = (event: any) => {
    const value = event.target.value;
    setSearchParams({
      ...searchParams,
      query: value,
    });
  };

  return (
    <div style={{ overflow: "hidden" }}>
      <SearchTextbox
        value={searchParams.query}
        placeholder="Search"
        onInput={handleQueryChange}
      />
      <Container>
        <div class={styles["style-selector"]}>
          <SegmentedControl
            onChange={handleWeightChange}
            options={[
              { children: "Bold", value: "bold" },
              { children: "Medium", value: "medium" },
              { children: "Regular", value: "regular" },
              { children: "Light", value: "light" },
            ]}
            value={searchParams.weight}
          />
        </div>
        <VerticalSpace space="extraSmall" />
        <div class={styles["style-selector"]}>
          <SegmentedControl
            onChange={handleStyleChange}
            options={[
              { children: "Stroke", value: "stroke" },
              { children: "Fill", value: "fill" },
            ]}
            value={searchParams.style}
          />
        </div>
      </Container>
      <VerticalSpace space="small" />
      <Divider />
      <Container
        style={{
          height: "338px",
          overflowY: "auto",
          overflowX: "hidden",
          paddingBottom: "20px",
          boxSizing: "border-box",
        }}
      >
        {isLoading && (
          <MiddleAlign>
            <LoadingIndicator />
          </MiddleAlign>
        )}

        {!isLoading &&
          icons?.length !== 0 &&
          icons?.map((group: any) => <Group group={group} />)}

        {!isLoading && icons?.length === 0 && <NoIcons />}
      </Container>
      <Divider />
      <Footer />
    </div>
  );
}

function Group(props: any) {
  const { group, ...otherProps } = props;
  const [sectionRef, inView] = useObserver({ threshold: 0.01 });
  console.log(group.name, "inView", inView);

  return (
    <div {...otherProps} ref={sectionRef}>
      <VerticalSpace space="small" />
      <Text muted>{group.name}</Text>
      <div class={styles.iconsContainer}>
        {group.items.map((icon: any) => (
          <Icon icon={icon} isVisible={inView} />
        ))}
      </div>
    </div>
  );
}
type ImageProps = {
  src: string;
  onClick: (event: any) => void;
};
function Image(props: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [placeholderClass, setPlaceholderClass] = useState("");

  useEffect(() => {
    let img = new window.Image();
    img.src = props.src;
    img.onload = onImageLoad;
  }, []);

  const onImageLoad = () => {
    setIsLoaded(true);
  };

  const style = {
    opacity: isLoaded ? 1 : 0,
  };

  return (
    <div 
    className={styles.iconImageContainer}>
      {/* <div style={divStyle}></div> */}
      <img
        src={props.src}
        class={styles.iconImage}
        style={style}
        onClick={props.onClick}
      />
    </div>
  );
}
function Icon(props: any) {
  const { icon, isVisible } = props;
  const url = `${backendUrl}/media/${icon.path}`;

  const handleClick = () => {
    (async () => {
      const svgRequest = await fetch(url);
      const svg = await svgRequest.text();
      emit("ADD_ICON", { name: icon.name, svg });
    })();
  };

  return (
    <div class={styles.iconContainer}>
      <div className={`${styles.iconPlaceholder}`}></div>

      {isVisible && <Image src={url} onClick={handleClick} />}
    </div>
  );
}

export default render(Plugin);
