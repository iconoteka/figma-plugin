import {
  Container,
  Divider,
  LoadingIndicator,
  MiddleAlign,
  render,
  SearchTextbox,
  SegmentedControl,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import styles from "./ui.css";
import { version } from "../package.json";
const backendUrl = "https://staging.iconoteka.com:8080";

import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { Iconoteka, RootCategory, Style, Thickness } from "./types";
import { filterIcons } from "./utils/filterIcons";
import { Footer } from "./components/Footer";
import { Group } from "./components/Group";
import { NoIcons } from "./components/NoIcons";

type SearchParams = {
  weight: Thickness;
  style: Style;
  query: string;
};
function Plugin() {
  const [icons, setIcons] = useState<null | any[]>(null);
  const [iconoteka, setIconoteka] = useState<RootCategory>();
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    weight: "bold",
    style: "stroke",
    query: "",
  });

  useEffect(() => {
    (async () => {
      const result = await fetch(`${backendUrl}/all`);
      const icons: Iconoteka = await result.json();

      setIconoteka(icons.iconoteka);
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!iconoteka) {
      return;
    }
    const icons = filterIcons(
      iconoteka,
      searchParams.query,
      searchParams.style,
      searchParams.weight
    );
    setIcons(icons);
  }, [iconoteka, searchParams.weight, searchParams.style, searchParams.query]);

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
          height: "349px",
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
          icons?.map((group: any) => (
            <Group baseUrl={backendUrl} group={group} />
          ))}

        {!isLoading && icons?.length === 0 && <NoIcons />}
      </Container>
      <Divider />
      <Footer version={version} />
    </div>
  );
}

export default render(Plugin);
