import{j as e}from"./jsx-runtime-DFnSfiB4.js";import{R as r}from"./index-DQ2WTIsS.js";import{i as P}from"./Comment-CLqfI_F3.js";import{P as q,g as k,s as y}from"./ProjectScore-BoQi68dw.js";import{e as B,D as a,I as L,M as N,L as J}from"./common-BhFctuNU.js";import"./EightElements-CPnT4k9-.js";import"./Measure-_5lxXGl4.js";import"./index-BY9vFk_1.js";import"./IntermediatePurpose-B4vPaTpb.js";import"./ObjectiveBox-CoqNu2kv.js";const f={title:"pufu-editor/Examples",component:q,parameters:{layout:"fullscreen",docs:{description:{component:`
プ譜エディターは書籍『予定通り進まないプロジェクトの進め方』（著: 前田考歩、後藤洋平）で<br>
紹介されているプロジェクト譜（プ譜）を Web ブラウザで編集・表示するためのエディターです。<br>
Github: <a href="https://github.com/goto-lab/pufu-editor" target="_blank">goto-lab/pufu-editor</a>`}}},tags:["autodocs"]},s="example1",n="example2",$="example3",j=()=>!!(window.matchMedia&&window.matchMedia("(max-device-width: 640px)").matches),p={args:{uniqueKey:s,initScore:B,preview:!0,mobile:j()},render:function({...m}){const[x,c]=r.useState(!1),[i,u]=r.useState(""),[S,l]=r.useState("");return e.jsxs(e.Fragment,{children:[e.jsx(a,{scoreKey:s,kind:"json"}),e.jsx(a,{scoreKey:s,kind:"markdown"}),e.jsx(a,{scoreKey:s,kind:"png"}),e.jsx(a,{scoreKey:s,kind:"svg"}),e.jsx(L,{onClick:()=>{const t=k(s);u(t),c(!0),l("")}}),e.jsxs("p",{className:"ml-8",children:["ID: ",s]}),e.jsx(f.component,{...m}),e.jsx(N,{open:x,text:i,error:S,onCancel:()=>c(!1),onChange:t=>{u(t)},onOk:()=>{try{l(""),y(s,i),c(!1)}catch(t){console.error(t),t instanceof Error&&l(t.message)}}})]})}},d={args:{uniqueKey:n,feedback:!0,mobile:j()},render:function({...m}){const[x,c]=r.useState(!1),[i,u]=r.useState(""),[S,l]=r.useState(""),[t,_]=r.useState(!1),[h,w]=r.useState("");return e.jsxs(e.Fragment,{children:[e.jsx(a,{scoreKey:n,kind:"json"}),e.jsx(a,{scoreKey:n,kind:"markdown"}),e.jsx(a,{scoreKey:n,kind:"png"}),e.jsx(a,{scoreKey:n,kind:"svg"}),e.jsx(L,{onClick:()=>{const o=k(n);u(o),c(!0),l("")}}),e.jsx(J,{checked:t,onClick:o=>{_(o)},onLoad:()=>{const o=localStorage.getItem(n);o&&y(n,o);const I=localStorage.getItem(`${n}-memo`);I&&w(I)},onSave:()=>{const o=k(n);o&&localStorage.setItem(n,o),localStorage.setItem(`${n}-memo`,h)}}),e.jsxs("p",{className:"ml-8",children:["ID: ",n]}),e.jsx(f.component,{...m}),e.jsx("div",{className:"p-2",children:e.jsx(P,{className:`
              block p-2.5 w-full text-sm text-gray-900 bg-gray-50
              rounded-lg border border-gray-300
              focus:outline-none focus:ring-blue-300 focus:border-blue-300
            `,minRows:2,value:h,onChange:o=>w(o.target.value),placeholder:"メモを入力"})}),e.jsx(N,{open:x,text:i,error:S,onCancel:()=>c(!1),onChange:o=>{u(o)},onOk:()=>{try{l(""),y(n,i),c(!1)}catch(o){console.error(o),o instanceof Error&&l(o.message)}}})]})}},g={args:{uniqueKey:$,initScore:B,preview:!0,showProgress:!0,mobile:j()},render:function({...m}){return e.jsxs(e.Fragment,{children:[e.jsx("p",{className:"ml-8 mb-2",children:"進捗インジケーター表示の例"}),e.jsx(f.component,{...m})]})}};var v,E,C;p.parameters={...p.parameters,docs:{...(v=p.parameters)==null?void 0:v.docs,source:{originalSource:`{
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
}`,...(C=(E=p.parameters)==null?void 0:E.docs)==null?void 0:C.source}}};var K,O,D;d.parameters={...d.parameters,docs:{...(K=d.parameters)==null?void 0:K.docs,source:{originalSource:`{
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
}`,...(D=(O=d.parameters)==null?void 0:O.docs)==null?void 0:D.source}}};var M,T,R;g.parameters={...g.parameters,docs:{...(M=g.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    uniqueKey: key3,
    initScore: exampleData,
    preview: true,
    showProgress: true,
    mobile: isMobile()
  },
  render: function Comp({
    ...args
  }) {
    return <>
        <p className="ml-8 mb-2">進捗インジケーター表示の例</p>
        <meta.component {...args}></meta.component>
      </>;
  }
}`,...(R=(T=g.parameters)==null?void 0:T.docs)==null?void 0:R.source}}};const Y=["Example1_Preview","Example2_Edit","Example3_ShowProgress"];export{p as Example1_Preview,d as Example2_Edit,g as Example3_ShowProgress,Y as __namedExportsOrder,f as default};
//# sourceMappingURL=1_ProjectScoreExamples.stories-DyHmX36m.js.map
