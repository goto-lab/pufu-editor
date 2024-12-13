import{j as e}from"./jsx-runtime-DFnSfiB4.js";import{R as c}from"./index-DQ2WTIsS.js";import{P as T,g as S,s as k}from"./ProjectScore-CpXVb6s7.js";import{e as w,D as i,I as O,M as b,L}from"./common-CPNu8gk2.js";import"./Comment-DRhAEK4Z.js";import"./EightElements-DimVbWkG.js";import"./Measure-C7Dzwx8a.js";import"./index-DPHLcAAF.js";import"./IntermediatePurpose-By9BWM9q.js";import"./ObjectiveBox-CnhuyFyi.js";const C={title:"pufu-editor/Examples",component:T,parameters:{layout:"fullscreen",docs:{description:{component:`
プ譜エディターは書籍『予定通り進まないプロジェクトの進め方』（著: 前田考歩、後藤洋平）で<br>
紹介されているプロジェクト譜（プ譜）を Web ブラウザで編集・表示するためのエディターです。<br>
Github: <a href="https://github.com/goto-lab/pufu-editor" target="_blank">goto-lab/pufu-editor</a>`}}},tags:["autodocs"]},a="example1",o="example2",v=()=>!!(window.matchMedia&&window.matchMedia("(max-device-width: 640px)").matches),m={args:{uniqueKey:a,initScore:w,preview:!0,mobile:v()},render:function({...d}){const[x,s]=c.useState(!1),[l,p]=c.useState(""),[g,r]=c.useState("");return e.jsxs(e.Fragment,{children:[e.jsx(i,{scoreKey:a,kind:"json"}),e.jsx(i,{scoreKey:a,kind:"png"}),e.jsx(i,{scoreKey:a,kind:"svg"}),e.jsx(O,{onClick:()=>{const t=S(a);p(t),s(!0),r("")}}),e.jsxs("p",{className:"ml-8",children:["ID: ",a]}),e.jsx(C.component,{...d}),e.jsx(b,{open:x,text:l,error:g,onCancel:()=>s(!1),onChange:t=>{p(t)},onOk:()=>{try{r(""),k(a,l),s(!1)}catch(t){console.error(t),t instanceof Error&&r(t.message)}}})]})}},u={args:{uniqueKey:o,feedback:!0,mobile:v()},render:function({...d}){const[x,s]=c.useState(!1),[l,p]=c.useState(""),[g,r]=c.useState(""),[t,K]=c.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(i,{scoreKey:o,kind:"json"}),e.jsx(i,{scoreKey:o,kind:"png"}),e.jsx(i,{scoreKey:o,kind:"svg"}),e.jsx(O,{onClick:()=>{const n=S(o);p(n),s(!0),r("")}}),e.jsx(L,{checked:t,onClick:n=>{K(n)},onLoad:()=>{const n=localStorage.getItem(o);n&&k(o,n)},onSave:()=>{const n=S(o);console.log(n),n&&localStorage.setItem(o,n)}}),e.jsxs("p",{className:"ml-8",children:["ID: ",o]}),e.jsx(C.component,{...d}),e.jsx(b,{open:x,text:l,error:g,onCancel:()=>s(!1),onChange:n=>{p(n)},onOk:()=>{try{r(""),k(o,l),s(!1)}catch(n){console.error(n),n instanceof Error&&r(n.message)}}})]})}};var f,y,j;m.parameters={...m.parameters,docs:{...(f=m.parameters)==null?void 0:f.docs,source:{originalSource:`{
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
}`,...(j=(y=m.parameters)==null?void 0:y.docs)==null?void 0:j.source}}};var I,h,E;u.parameters={...u.parameters,docs:{...(I=u.parameters)==null?void 0:I.docs,source:{originalSource:`{
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
    const [isLocalSave, setIsLocalSave] = React.useState(false);
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
        <LocalSave checked={isLocalSave} onClick={(status: boolean) => {
        setIsLocalSave(status);
      }} onLoad={() => {
        const json = localStorage.getItem(key2);
        if (json) {
          setScore(key2, json);
        }
      }} onSave={() => {
        const json = getScoreJson(key2);
        console.log(json);
        if (json) {
          localStorage.setItem(key2, json);
        }
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
}`,...(E=(h=u.parameters)==null?void 0:h.docs)==null?void 0:E.source}}};const W=["Example1","Example2"];export{m as Example1,u as Example2,W as __namedExportsOrder,C as default};
//# sourceMappingURL=1_ProjectScoreExamples.stories-T2DuSZqi.js.map
