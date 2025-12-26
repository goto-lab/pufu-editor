import{j as e}from"./jsx-runtime-DFnSfiB4.js";import{R as r}from"./index-DQ2WTIsS.js";import{i as R}from"./Comment-CLRktOpt.js";import{P as B,g as k,s as S}from"./ProjectScore-BXfcyZv4.js";import{e as L,D as a,I as O,M as C,L as N}from"./common-DUBYcQwO.js";import"./EightElements-CK4dmmlp.js";import"./Measure-KdatraD6.js";import"./index-Ce-rDAX5.js";import"./IntermediatePurpose-CeZnclaa.js";import"./ObjectiveBox-DqMJMEJU.js";const K={title:"pufu-editor/Examples",component:B,parameters:{layout:"fullscreen",docs:{description:{component:`
プ譜エディターは書籍『予定通り進まないプロジェクトの進め方』（著: 前田考歩、後藤洋平）で<br>
紹介されているプロジェクト譜（プ譜）を Web ブラウザで編集・表示するためのエディターです。<br>
Github: <a href="https://github.com/goto-lab/pufu-editor" target="_blank">goto-lab/pufu-editor</a>`}}},tags:["autodocs"]},s="example1",n="example2",D=()=>!!(window.matchMedia&&window.matchMedia("(max-device-width: 640px)").matches),u={args:{uniqueKey:s,initScore:L,preview:!0,mobile:D()},render:function({...d}){const[g,c]=r.useState(!1),[i,m]=r.useState(""),[x,l]=r.useState("");return e.jsxs(e.Fragment,{children:[e.jsx(a,{scoreKey:s,kind:"json"}),e.jsx(a,{scoreKey:s,kind:"markdown"}),e.jsx(a,{scoreKey:s,kind:"png"}),e.jsx(a,{scoreKey:s,kind:"svg"}),e.jsx(O,{onClick:()=>{const t=k(s);m(t),c(!0),l("")}}),e.jsxs("p",{className:"ml-8",children:["ID: ",s]}),e.jsx(K.component,{...d}),e.jsx(C,{open:g,text:i,error:x,onCancel:()=>c(!1),onChange:t=>{m(t)},onOk:()=>{try{l(""),S(s,i),c(!1)}catch(t){console.error(t),t instanceof Error&&l(t.message)}}})]})}},p={args:{uniqueKey:n,feedback:!0,mobile:D()},render:function({...d}){const[g,c]=r.useState(!1),[i,m]=r.useState(""),[x,l]=r.useState(""),[t,M]=r.useState(!1),[f,y]=r.useState("");return e.jsxs(e.Fragment,{children:[e.jsx(a,{scoreKey:n,kind:"json"}),e.jsx(a,{scoreKey:n,kind:"markdown"}),e.jsx(a,{scoreKey:n,kind:"png"}),e.jsx(a,{scoreKey:n,kind:"svg"}),e.jsx(O,{onClick:()=>{const o=k(n);m(o),c(!0),l("")}}),e.jsx(N,{checked:t,onClick:o=>{M(o)},onLoad:()=>{const o=localStorage.getItem(n);o&&S(n,o);const j=localStorage.getItem(`${n}-memo`);j&&y(j)},onSave:()=>{const o=k(n);o&&localStorage.setItem(n,o),localStorage.setItem(`${n}-memo`,f)}}),e.jsxs("p",{className:"ml-8",children:["ID: ",n]}),e.jsx(K.component,{...d}),e.jsx("div",{className:"p-2",children:e.jsx(R,{className:`
              block p-2.5 w-full text-sm text-gray-900 bg-gray-50
              rounded-lg border border-gray-300
              focus:outline-none focus:ring-blue-300 focus:border-blue-300
            `,minRows:2,value:f,onChange:o=>y(o.target.value),placeholder:"メモを入力"})}),e.jsx(C,{open:g,text:i,error:x,onCancel:()=>c(!1),onChange:o=>{m(o)},onOk:()=>{try{l(""),S(n,i),c(!1)}catch(o){console.error(o),o instanceof Error&&l(o.message)}}})]})}};var b,I,h;u.parameters={...u.parameters,docs:{...(b=u.parameters)==null?void 0:b.docs,source:{originalSource:`{
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
        <DownloadButton scoreKey={key1} kind="markdown" />
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
}`,...(h=(I=u.parameters)==null?void 0:I.docs)==null?void 0:h.source}}};var v,w,E;p.parameters={...p.parameters,docs:{...(v=p.parameters)==null?void 0:v.docs,source:{originalSource:`{
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
    const [memo, setMemo] = React.useState("");
    return <>
        <DownloadButton scoreKey={key2} kind="json" />
        <DownloadButton scoreKey={key2} kind="markdown" />
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
        const localStorageMemo = localStorage.getItem(\`\${key2}-memo\`);
        if (localStorageMemo) {
          setMemo(localStorageMemo);
        }
      }} onSave={() => {
        const json = getScoreJson(key2);
        if (json) {
          localStorage.setItem(key2, json);
        }
        localStorage.setItem(\`\${key2}-memo\`, memo);
      }} />
        <p className="ml-8">ID: {key2}</p>
        <meta.component {...args}></meta.component>
        <div className="p-2">
          <TextareaAutosize className="
              block p-2.5 w-full text-sm text-gray-900 bg-gray-50
              rounded-lg border border-gray-300
              focus:outline-none focus:ring-blue-300 focus:border-blue-300
            " minRows={2} value={memo} onChange={e => setMemo(e.target.value)} placeholder="メモを入力"></TextareaAutosize>
        </div>
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
}`,...(E=(w=p.parameters)==null?void 0:w.docs)==null?void 0:E.source}}};const H=["Example1","Example2"];export{u as Example1,p as Example2,H as __namedExportsOrder,K as default};
//# sourceMappingURL=1_ProjectScoreExamples.stories-Dz3RWXyl.js.map
