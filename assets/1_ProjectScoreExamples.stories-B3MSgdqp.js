import{j as e}from"./jsx-runtime-CD9V3zLE.js";import{R as r}from"./index-DTLCi2z1.js";import{i as _}from"./Comment-DpaRJS4W.js";import{P as q,g as k,s as y}from"./ProjectScore-D-q_EZS1.js";import{e as B,D as a,I as M,M as L,L as P}from"./common-Bf7N1yx4.js";import"./EightElements-coZYDxE7.js";import"./Measure-xg2U5I-n.js";import"./index-B2LkkuhT.js";import"./IntermediatePurpose-pwydkJPT.js";import"./ObjectiveBox-z7oMIgMo.js";const f={title:"pufu-editor/Examples",component:q,parameters:{layout:"fullscreen",docs:{description:{component:`
プ譜エディターは書籍『予定通り進まないプロジェクトの進め方』（著: 前田考歩、後藤洋平）で<br>
紹介されているプロジェクト譜（プ譜）を Web ブラウザで編集・表示するためのエディターです。<br>
Github: <a href="https://github.com/goto-lab/pufu-editor" target="_blank">goto-lab/pufu-editor</a>`}}},tags:["autodocs"]},s="example1",o="example2",J="example3",p={args:{uniqueKey:s,initScore:B,preview:!0},render:function({...m}){const[x,c]=r.useState(!1),[i,u]=r.useState(""),[S,l]=r.useState("");return e.jsxs(e.Fragment,{children:[e.jsx(a,{scoreKey:s,kind:"json"}),e.jsx(a,{scoreKey:s,kind:"markdown"}),e.jsx(a,{scoreKey:s,kind:"png"}),e.jsx(a,{scoreKey:s,kind:"svg"}),e.jsx(M,{onClick:()=>{const t=k(s);u(t),c(!0),l("")}}),e.jsxs("p",{className:"ml-8",children:["ID: ",s]}),e.jsx(f.component,{...m}),e.jsx(L,{open:x,text:i,error:S,onCancel:()=>c(!1),onChange:t=>{u(t)},onOk:()=>{try{l(""),y(s,i),c(!1)}catch(t){console.error(t),t instanceof Error&&l(t.message)}}})]})}},d={args:{uniqueKey:o,feedback:!0},render:function({...m}){const[x,c]=r.useState(!1),[i,u]=r.useState(""),[S,l]=r.useState(""),[t,N]=r.useState(!1),[h,I]=r.useState("");return e.jsxs(e.Fragment,{children:[e.jsx(a,{scoreKey:o,kind:"json"}),e.jsx(a,{scoreKey:o,kind:"markdown"}),e.jsx(a,{scoreKey:o,kind:"png"}),e.jsx(a,{scoreKey:o,kind:"svg"}),e.jsx(M,{onClick:()=>{const n=k(o);u(n),c(!0),l("")}}),e.jsx(P,{checked:t,onClick:n=>{N(n)},onLoad:()=>{const n=localStorage.getItem(o);n&&y(o,n);const b=localStorage.getItem(`${o}-memo`);b&&I(b)},onSave:()=>{const n=k(o);n&&localStorage.setItem(o,n),localStorage.setItem(`${o}-memo`,h)}}),e.jsxs("p",{className:"ml-8",children:["ID: ",o]}),e.jsx(f.component,{...m}),e.jsx("div",{className:"p-2",children:e.jsx(_,{className:`
              block p-2.5 w-full text-sm text-gray-900 bg-gray-50
              rounded-lg border border-gray-300
              focus:outline-none focus:ring-blue-300 focus:border-blue-300
            `,minRows:2,value:h,onChange:n=>I(n.target.value),placeholder:"メモを入力"})}),e.jsx(L,{open:x,text:i,error:S,onCancel:()=>c(!1),onChange:n=>{u(n)},onOk:()=>{try{l(""),y(o,i),c(!1)}catch(n){console.error(n),n instanceof Error&&l(n.message)}}})]})}},g={args:{uniqueKey:J,initScore:B,preview:!0,showProgress:!0},render:function({...m}){return e.jsxs(e.Fragment,{children:[e.jsx("p",{className:"ml-8 mb-2",children:"進捗インジケーター表示の例"}),e.jsx(f.component,{...m})]})}};var v,w,E;p.parameters={...p.parameters,docs:{...(v=p.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    uniqueKey: key1,
    initScore: exampleData,
    preview: true
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
}`,...(E=(w=p.parameters)==null?void 0:w.docs)==null?void 0:E.source}}};var C,K,O;d.parameters={...d.parameters,docs:{...(C=d.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    uniqueKey: key2,
    feedback: true
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
}`,...(O=(K=d.parameters)==null?void 0:K.docs)==null?void 0:O.source}}};var D,T,R;g.parameters={...g.parameters,docs:{...(D=g.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    uniqueKey: key3,
    initScore: exampleData,
    preview: true,
    showProgress: true
  },
  render: function Comp({
    ...args
  }) {
    return <>
        <p className="ml-8 mb-2">進捗インジケーター表示の例</p>
        <meta.component {...args}></meta.component>
      </>;
  }
}`,...(R=(T=g.parameters)==null?void 0:T.docs)==null?void 0:R.source}}};const X=["Example1","Example2_Edit","Example3_ShowProgress"];export{p as Example1,d as Example2_Edit,g as Example3_ShowProgress,X as __namedExportsOrder,f as default};
//# sourceMappingURL=1_ProjectScoreExamples.stories-B3MSgdqp.js.map
