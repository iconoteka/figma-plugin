import * as JsSearch from "js-search";
import { stemmer } from "porter-stemmer";
import { IconCategory, Style, Thickness, IconItem, RootCategory } from "../types";
import isPredicate from "./isPredicate";

const filterIconGroup = (
    group: IconCategory,
    search: string,
    style: Style,
    thickness: Thickness
  ) => {
    const items =
      group.items &&
      group.items
        // Filter by style
        .filter((iconItem) => isPredicate(iconItem, style))
        // Filter by thickness
        .filter((iconItem) => isPredicate(iconItem, thickness))
        // Add group name to allow searching
        .map((item) => {
          item.groupName = group.name;
          return item;
        });
    let results = items;
    if (search.trim() !== "") {
      const searchEngine = new JsSearch.Search("name");
      searchEngine.tokenizer = new JsSearch.StemmingTokenizer(
        stemmer,
        new JsSearch.SimpleTokenizer()
      );
  
      searchEngine.addIndex("name");
      searchEngine.addIndex("groupName");
      searchEngine.addIndex("keywords");
      searchEngine.addDocuments(items);
      results = searchEngine.search(search) as IconItem[];
    }
  
    return Object.assign({}, group, {
      items: results,
    });
  };
  
  export const filterIcons = (
    iconoteka: RootCategory,
    search = "",
    style: Style = "stroke",
    thickness: Thickness = "bold"
  ) => {
    const filteredGroups = iconoteka.items
      .map((group) => filterIconGroup(group, search, style, thickness))
      .filter((group) => group.items && group.items.length);
  
    return filteredGroups;
  };
  