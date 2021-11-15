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

const backendUrl = 'https://staging.iconoteka.com:8080';

import { emit } from '@create-figma-plugin/utilities'
import { h } from 'preact'
import { useCallback, useState, useEffect } from 'preact/hooks'

import { CloseHandler, CreateRectanglesHandler } from './types'

function Plugin() {
  const [icons, setIcons] = useState<null | any[]>(null);
  const [searchParams, setSearchParams] = useState({
    weight: 'regular',
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
    <SegmentedControl class={styles.container} onChange={handleWeightChange} options={[{children: 'Bold', value: 'bold'}, {children: 'Medium', value: 'medium'}, {children: 'Regular', value: 'regular'}, {children: 'Light', value: 'light'} ]} value={searchParams.weight} />
    
    <VerticalSpace space="extraSmall" />
    
    <SegmentedControl onChange={handleStyleChange} options={[{children: 'Stroke', value: 'stroke'}, {children: 'Fill', value: 'fill'}, ]} value={searchParams.style} />

    </Container>
    <VerticalSpace space="small" />
    <Divider />
    <Container style={{height: '390px', overflow: 'scroll', paddingBottom: '20px', boxSizing: 'border-box'}}>
     { icons === null 
        ?  <MiddleAlign><LoadingIndicator /></MiddleAlign>
        : icons.map((group: any) => (
       <Group group={group} />
     ))}

    <VerticalSpace space="small" />
    <Divider />
    <VerticalSpace space="small" />
     <Text>
      <a href="https://iconoteka.com" target="_blank">Powered by Iconoteka</a>
    </Text>
    </Container>
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
    <div>
      {group.items.map((icon:any) => (
        <Icon icon={icon} isVisible={inView} />
      ))}
    </div>
  </div>
);

}

function Image(props: any) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let img = new window.Image();
    img.src = props.src;
    img.onload = onImageLoad;
  }, []);

  const onImageLoad = () => {
    setIsLoaded(true);
  }

  const style = {
    position: 'absolute',
    top: '0',
    left: '0',
    opacity: isLoaded ? 1 : 0,
    width: '30px',
    height: '30px',
    background: 'white',
    transition: 'opacity 0.08s ease 0s'
  }

  return (
    <img src={props.src} style={style} onClick={props.onClick}/>
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

  const containerStyle: h.JSX.CSSProperties = {
    marginRight: '20px',
    marginTop: '20px',
    width: '30px',
    height: '30px',
    background: 'white',
    display: 'inline-block',
    position: 'relative',
    cursor: 'pointer',
  }

  const placeholderStyle: h.JSX.CSSProperties = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '30px',
    height: '30px',
    background: '#E2E2E2'
  }

 return (
  <div style={containerStyle}>
    <div style={placeholderStyle}></div>

    {isVisible && <Image src={url} onClick={handleClick}/> }

  </div>
 )
}

export default render(Plugin)
