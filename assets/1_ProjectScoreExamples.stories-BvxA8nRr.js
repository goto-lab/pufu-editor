import{j as e}from"./Comment-DDDcLj1j.js";import{R as a}from"./index-BBkUAzwr.js";import{P as K,g as E,s as O}from"./ProjectScore-CPI1BSN6.js";import{e as T,D as c,I as h,M as I}from"./common-bVP3cUbp.js";import"./extends-CCbyfPlC.js";import"./EightElements-C0E8NWtb.js";import"./Measure-I5p7HuVZ.js";import"./index-4mDH4tRs.js";import"./IntermediatePurpose-B8fhX97D.js";import"./ObjectiveBox-DDruwQeW.js";const b={title:"pufu-editor/Examples",component:K,parameters:{layout:"fullscreen",docs:{description:{component:`
プ譜エディターは書籍『予定通り進まないプロジェクトの進め方』（著: 前田考歩、後藤洋平）で<br>
紹介されているプロジェクト譜（プ譜）を Web ブラウザで編集・表示するためのエディターです。<br>
Github: <a href="https://github.com/goto-lab/pufu-editor" target="_blank">goto-lab/pufu-editor</a>`}}},tags:["autodocs"]},s="example1",r="example2",D=()=>!!(window.matchMedia&&window.matchMedia("(max-device-width: 640px)").matches),l={args:{uniqueKey:s,initScore:T,preview:!0,mobile:D()},render:function({...u}){const[x,o]=a.useState(!1),[i,p]=a.useState(""),[d,t]=a.useState("");return e.jsxs(e.Fragment,{children:[e.jsx(c,{scoreKey:s,kind:"json"}),e.jsx(c,{scoreKey:s,kind:"png"}),e.jsx(c,{scoreKey:s,kind:"svg"}),e.jsx(h,{onClick:()=>{const n=E(s);p(n),o(!0),t("")}}),e.jsxs("p",{className:"ml-8",children:["ID: ",s]}),e.jsx(b.component,{...u}),e.jsx(I,{open:x,text:i,error:d,onCancel:()=>o(!1),onChange:n=>{p(n)},onOk:()=>{try{t(""),O(s,i),o(!1)}catch(n){console.error(n),n instanceof Error&&t(n.message)}}})]})}},m={args:{uniqueKey:r,feedback:!0,mobile:D()},render:function({...u}){const[x,o]=a.useState(!1),[i,p]=a.useState(""),[d,t]=a.useState("");return e.jsxs(e.Fragment,{children:[e.jsx(c,{scoreKey:r,kind:"json"}),e.jsx(c,{scoreKey:r,kind:"png"}),e.jsx(c,{scoreKey:r,kind:"svg"}),e.jsx(h,{onClick:()=>{const n=E(r);p(n),o(!0),t("")}}),e.jsxs("p",{className:"ml-8",children:["ID: ",r]}),e.jsx(b.component,{...u}),e.jsx(I,{open:x,text:i,error:d,onCancel:()=>o(!1),onChange:n=>{p(n)},onOk:()=>{try{t(""),O(r,i),o(!1)}catch(n){console.error(n),n instanceof Error&&t(n.message)}}})]})}};var g,k,f;l.parameters={...l.parameters,docs:{...(g=l.parameters)==null?void 0:g.docs,source:{originalSource:`{
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
}`,...(f=(k=l.parameters)==null?void 0:k.docs)==null?void 0:f.source}}};var y,S,j;m.parameters={...m.parameters,docs:{...(y=m.parameters)==null?void 0:y.docs,source:{originalSource:`{
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
}`,...(j=(S=m.parameters)==null?void 0:S.docs)==null?void 0:j.source}}};const P=["Example1","Example2"];export{l as Example1,m as Example2,P as __namedExportsOrder,b as default};
//# sourceMappingURL=1_ProjectScoreExamples.stories-BvxA8nRr.js.map
