import {
  Button,
  Columns,
  Container,
  Divider,
  LoadingIndicator,
  MiddleAlign,
  render,
  SearchTextbox,
  SegmentedControl,
  Text,
  TextboxNumeric,
  VerticalSpace
} from '@create-figma-plugin/ui';
import styles from './ui.css';
import useObserver from "preact-intersection-observer";
import { version }from "../package.json";
const backendUrl = 'https://staging.iconoteka.com:8080';

import { emit, EventHandler } from '@create-figma-plugin/utilities'
import { h } from 'preact'
import { useCallback, useState, useEffect } from 'preact/hooks'

import { CloseHandler, CreateRectanglesHandler } from './types'

const Footer = () => {
  return (
  <div className={styles.footer}>
    <div className={styles.footer__about}>
      <a href="https://readymag.com/turbaba/1296248/" target="_blank">About</a>
    </div>
    <div className={styles.footer__support}>
      <a href="https://www.patreon.com/iconoteka" target="_blank">Support us on Patreon</a>
    </div>
    <div className={styles.footer__version}>
      v{version}
    </div>
 </div>
 )
}
function Plugin() {
  const [icons, setIcons] = useState<null | any[]>(null);
  const [searchParams, setSearchParams] = useState({
    weight: 'bold',
    style: 'stroke',
    query: '',
  });

  useEffect(() => {
    (async () => {
          
      const result:any = await fetch(
        `${backendUrl}/icons/style/${searchParams.style}/weight/${searchParams.weight}?query=${searchParams.query}&useGroups=true`
      );
      const icons = await result.json();

      setIcons(icons);
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
  } 

  const handleQueryChange = (event: any) => {
    const value = event.target.value;
    setSearchParams({
      ...searchParams,
      query: value,
    });
  }

  return (
    <div style={{overflow: 'hidden'}}>
    <SearchTextbox
      value={searchParams.query}
      placeholder="Search"
      onInput={handleQueryChange}
    />
    <Container>
    <div class={styles['style-selector']}>
      <SegmentedControl onChange={handleWeightChange} options={[{children: 'Bold', value: 'bold'}, {children: 'Medium', value: 'medium'}, {children: 'Regular', value: 'regular'}, {children: 'Light', value: 'light'} ]} value={searchParams.weight} />
    </div>
    <VerticalSpace space="extraSmall" />
    <div class={styles['style-selector']}>
      <SegmentedControl onChange={handleStyleChange} options={[{children: 'Stroke', value: 'stroke'}, {children: 'Fill', value: 'fill'}, ]} value={searchParams.style} />
    </div>
    </Container>
    <VerticalSpace space="small" />
    <Divider />
    <Container style={{height: '338px', overflowY: 'auto', paddingBottom: '20px', boxSizing: 'border-box'}}>
     { icons === null 
        ?  <MiddleAlign><LoadingIndicator /></MiddleAlign>
        : icons.map((group: any) => (
       <Group group={group} />
     ))}

    </Container>
    <VerticalSpace space="small" />
    <Divider />
    <VerticalSpace space="small" />
    <Footer />
    </div>
  )
}

function Group(props: any) {
  const { group, ...otherProps } = props;
  const [sectionRef, inView] = useObserver({threshold: 0.01});
  console.log(group.name, 'inView', inView);

 return ( 
 <div {...otherProps} ref={sectionRef}>
    <VerticalSpace space="small" />
    <Text muted>{group.name}</Text>
    <div class={styles.iconsContainer}>
      {group.items.map((icon:any) => (
        <Icon icon={icon} isVisible={inView} />
      ))}
    </div>
  </div>
);

}
type ImageProps = {
  src: string;
  onClick: (event: any) => void;
}
function Image(props: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [placeholderClass, setPlaceholderClass] = useState('');

  useEffect(() => {
    let img = new window.Image();
    img.src = props.src;
    img.onload = onImageLoad;
  }, []);

  const onImageLoad = () => {
    setIsLoaded(true);
  }

  const style = {
    opacity: isLoaded ? 1 : 0
  }

  const divStyle = {
    width: '24px',
    height: '24px',
    background: `url(${props.src}) no-repeat`,
  }
  return (
    <div>
      {/* <div style={divStyle}></div> */}
      <img src={props.src} class={styles.iconImage} style={style} onClick={props.onClick}/>
    </div>
  )
}
function Icon(props: any) {
  const { icon, isVisible } = props;
  const url = `${backendUrl}/media/${icon.path}`;

  const handleClick = (event: any) => {
    (async () => {
      const svgRequest = await fetch(url);
      const svg = await svgRequest.text();
      emit('ADD_ICON', {name: icon.name, svg});
    })();
  };

 return (
  <div class={styles.iconContainer}>
    <div className={`${styles.iconPlaceholder}`}></div>

    {isVisible && <Image src={url} onClick={handleClick}/> }

  </div>
 )
}

export default render(Plugin)
