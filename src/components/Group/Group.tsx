import { h } from "preact";
import { useObserver } from "preact-intersection-observer";
import { IconCategory } from "../../types";
import { VerticalSpace, Text } from "@create-figma-plugin/ui";
import styles from "./Group.css";
import { Icon } from "../Icon";

type GroupProps = {
  group: IconCategory;
  baseUrl: string;
};
export function Group(props: GroupProps) {
  const { group, baseUrl } = props;
  const [sectionRef, inView] = useObserver<HTMLDivElement>({ threshold: 0.01 });
  console.log(group.name, "inView", inView);

  return (
    <div ref={sectionRef}>
      <VerticalSpace space="small" />
      <Text muted>{group.name}</Text>
      <div class={styles.iconsContainer}>
        {group.items.map((icon) => (
          <Icon baseUrl={baseUrl} icon={icon} isVisible={inView} />
        ))}
      </div>
    </div>
  );
}
