import{j as e}from"./Comment-sNEHMkq0.js";import{R as a}from"./index-BBkUAzwr.js";import{P as T,g as E,s as O}from"./ProjectScore-C4P8E61U.js";import{e as w,D as c,I,M as D}from"./common-CMcHK0TL.js";import"./extends-CCbyfPlC.js";import"./EightElements-BM6s_sQY.js";import"./Measure-gSCx8pge.js";import"./index-C3lW4ia-.js";import"./IntermediatePurpose-btytgzyz.js";import"./ObjectiveBox-ioYppb4V.js";const h={title:"pufu-editor/Examples",component:T,parameters:{layout:"fullscreen"},tags:["autodocs"]},s="example1",r="example2",C=()=>!!(window.matchMedia&&window.matchMedia("(max-device-width: 640px)").matches),m={args:{uniqueKey:s,initScore:w,preview:!0,mobile:C()},render:function({...u}){const[x,o]=a.useState(!1),[i,p]=a.useState(""),[d,t]=a.useState("");return e.jsxs(e.Fragment,{children:[e.jsx(c,{scoreKey:s,kind:"json"}),e.jsx(c,{scoreKey:s,kind:"png"}),e.jsx(c,{scoreKey:s,kind:"svg"}),e.jsx(I,{onClick:()=>{const n=E(s);p(n),o(!0),t("")}}),e.jsxs("p",{className:"ml-8",children:["ID: ",s]}),e.jsx(h.component,{...u}),e.jsx(D,{open:x,text:i,error:d,onCancel:()=>o(!1),onChange:n=>{p(n)},onOk:()=>{try{t(""),O(s,i),o(!1)}catch(n){console.error(n),n instanceof Error&&t(n.message)}}})]})}},l={args:{uniqueKey:r,feedback:!0,mobile:C()},render:function({...u}){const[x,o]=a.useState(!1),[i,p]=a.useState(""),[d,t]=a.useState("");return e.jsxs(e.Fragment,{children:[e.jsx(c,{scoreKey:r,kind:"json"}),e.jsx(c,{scoreKey:r,kind:"png"}),e.jsx(c,{scoreKey:r,kind:"svg"}),e.jsx(I,{onClick:()=>{const n=E(r);p(n),o(!0),t("")}}),e.jsxs("p",{className:"ml-8",children:["ID: ",r]}),e.jsx(h.component,{...u}),e.jsx(D,{open:x,text:i,error:d,onCancel:()=>o(!1),onChange:n=>{p(n)},onOk:()=>{try{t(""),O(r,i),o(!1)}catch(n){console.error(n),n instanceof Error&&t(n.message)}}})]})}};var g,k,y;m.parameters={...m.parameters,docs:{...(g=m.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    uniqueKey: key1,
    initScore: exampleData,
    preview: true,
    mobile: isMobile()
  },
  render: function Comp({
    ...args
  }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [scoreText, setScoreText] = React.useState("");
    const [error, setError] = React.useState("");
    return <>
        <DownloadButton scoreKey={key1} kind="json" />
        <DownloadButton scoreKey={key1} kind="png" />
        <DownloadButton scoreKey={key1} kind="svg" />
        <ImportButton onClick={() => {
        const json = getScoreJson(key1);
        setScoreText(json!);
        setIsOpen(true);
        setError("");
      }} />
        <p className="ml-8">ID: {key1}</p>
        <meta.component {...args}></meta.component>
        <ModalDialog open={isOpen} text={scoreText} error={error} onCancel={() => setIsOpen(false)} onChange={(text: string) => {
        setScoreText(text);
      }} onOk={() => {
        try {
          setError("");
          setScore(key1, scoreText);
          setIsOpen(false);
        } catch (e) {
          console.error(e);
          if (e instanceof Error) {
            setError(e.message);
          }
        }
      }} />
      </>;
  }
}`,...(y=(k=m.parameters)==null?void 0:k.docs)==null?void 0:y.source}}};var f,S,j;l.parameters={...l.parameters,docs:{...(f=l.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    uniqueKey: key2,
    feedback: true,
    mobile: isMobile()
  },
  render: function Comp({
    ...args
  }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [scoreText, setScoreText] = React.useState("");
    const [error, setError] = React.useState("");
    return <>
        <DownloadButton scoreKey={key2} kind="json" />
        <DownloadButton scoreKey={key2} kind="png" />
        <DownloadButton scoreKey={key2} kind="svg" />
        <ImportButton onClick={() => {
        const json = getScoreJson(key2);
        setScoreText(json!);
        setIsOpen(true);
        setError("");
      }} />
        <p className="ml-8">ID: {key2}</p>
        <meta.component {...args}></meta.component>
        <ModalDialog open={isOpen} text={scoreText} error={error} onCancel={() => setIsOpen(false)} onChange={(text: string) => {
        setScoreText(text);
      }} onOk={() => {
        try {
          setError("");
          setScore(key2, scoreText);
          setIsOpen(false);
        } catch (e) {
          console.error(e);
          if (e instanceof Error) {
            setError(e.message);
          }
        }
      }} />
      </>;
  }
}`,...(j=(S=l.parameters)==null?void 0:S.docs)==null?void 0:j.source}}};const _=["Example1","Example2"];export{m as Example1,l as Example2,_ as __namedExportsOrder,h as default};
//# sourceMappingURL=1_ProjectScoreExamples.stories-DErNVcY_.js.map
