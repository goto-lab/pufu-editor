import{j as e}from"./jsx-runtime-DFnSfiB4.js";import{R as s}from"./index-DQ2WTIsS.js";import{P as L,g as S,s as f}from"./ProjectScore-CpXVb6s7.js";import{e as R,D as l,I as C,M as w,L as B}from"./common-Dfd2UMnC.js";import"./Comment-DRhAEK4Z.js";import"./EightElements-DimVbWkG.js";import"./Measure-C7Dzwx8a.js";import"./index-DPHLcAAF.js";import"./IntermediatePurpose-By9BWM9q.js";import"./ObjectiveBox-CnhuyFyi.js";const D={title:"pufu-editor/Examples",component:L,parameters:{layout:"fullscreen",docs:{description:{component:`
プ譜エディターは書籍『予定通り進まないプロジェクトの進め方』（著: 前田考歩、後藤洋平）で<br>
紹介されているプロジェクト譜（プ譜）を Web ブラウザで編集・表示するためのエディターです。<br>
Github: <a href="https://github.com/goto-lab/pufu-editor" target="_blank">goto-lab/pufu-editor</a>`}}},tags:["autodocs"]},c="example1",n="example2",M=()=>!!(window.matchMedia&&window.matchMedia("(max-device-width: 640px)").matches),u={args:{uniqueKey:c,initScore:R,preview:!0,mobile:M()},render:function({...g}){const[d,r]=s.useState(!1),[m,i]=s.useState(""),[x,a]=s.useState("");return e.jsxs(e.Fragment,{children:[e.jsx(l,{scoreKey:c,kind:"json"}),e.jsx(l,{scoreKey:c,kind:"png"}),e.jsx(l,{scoreKey:c,kind:"svg"}),e.jsx(C,{onClick:()=>{const t=S(c);i(t),r(!0),a("")}}),e.jsxs("p",{className:"ml-8",children:["ID: ",c]}),e.jsx(D.component,{...g}),e.jsx(w,{open:d,text:m,error:x,onCancel:()=>r(!1),onChange:t=>{i(t)},onOk:()=>{try{a(""),f(c,m),r(!1)}catch(t){console.error(t),t instanceof Error&&a(t.message)}}})]})}},p={args:{uniqueKey:n,feedback:!0,mobile:M()},render:function({...g}){const[d,r]=s.useState(!1),[m,i]=s.useState(""),[x,a]=s.useState(""),[t,T]=s.useState(!1),[k,y]=s.useState("");return e.jsxs(e.Fragment,{children:[e.jsx(l,{scoreKey:n,kind:"json"}),e.jsx(l,{scoreKey:n,kind:"png"}),e.jsx(l,{scoreKey:n,kind:"svg"}),e.jsx(C,{onClick:()=>{const o=S(n);i(o),r(!0),a("")}}),e.jsx(B,{checked:t,onClick:o=>{T(o)},onLoad:()=>{const o=localStorage.getItem(n);o&&f(n,o);const j=localStorage.getItem(`${n}-memo`);j&&y(j)},onSave:()=>{const o=S(n);o&&localStorage.setItem(n,o),localStorage.setItem(`${n}-memo`,k)}}),e.jsxs("p",{className:"ml-8",children:["ID: ",n]}),e.jsx(D.component,{...g}),e.jsx("div",{className:"p-2",children:e.jsx("textarea",{className:`
              block p-2.5 w-full text-sm text-gray-900 bg-gray-50
              rounded-lg border border-gray-300
              focus:outline-none focus:ring-blue-300 focus:border-blue-300
            `,rows:4,value:k,onChange:o=>y(o.target.value),placeholder:"メモを入力"})}),e.jsx(w,{open:d,text:m,error:x,onCancel:()=>r(!1),onChange:o=>{i(o)},onOk:()=>{try{a(""),f(n,m),r(!1)}catch(o){console.error(o),o instanceof Error&&a(o.message)}}})]})}};var b,I,h;u.parameters={...u.parameters,docs:{...(b=u.parameters)==null?void 0:b.docs,source:{originalSource:`{
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
}`,...(h=(I=u.parameters)==null?void 0:I.docs)==null?void 0:h.source}}};var v,E,O;p.parameters={...p.parameters,docs:{...(v=p.parameters)==null?void 0:v.docs,source:{originalSource:`{
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
          <textarea className="
              block p-2.5 w-full text-sm text-gray-900 bg-gray-50
              rounded-lg border border-gray-300
              focus:outline-none focus:ring-blue-300 focus:border-blue-300
            " rows={4} value={memo} onChange={e => setMemo(e.target.value)} placeholder="メモを入力"></textarea>
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
}`,...(O=(E=p.parameters)==null?void 0:E.docs)==null?void 0:O.source}}};const A=["Example1","Example2"];export{u as Example1,p as Example2,A as __namedExportsOrder,D as default};
//# sourceMappingURL=1_ProjectScoreExamples.stories-CucG_KX_.js.map
