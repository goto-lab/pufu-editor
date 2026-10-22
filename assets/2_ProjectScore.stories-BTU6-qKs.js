import{j as e}from"./jsx-runtime-CD9V3zLE.js";import{R as k}from"./index-DTLCi2z1.js";import{P as t,g as Pe,s as Ce}from"./ProjectScore-D-q_EZS1.js";import{e as je,f as Ee,m as Ie,n as ze,p as We,s as Me,t as Oe}from"./ProjectScore.stories.test-Cq3-faa3.js";import{c as Be,a as y}from"./common-C41EzeVm.js";import{e as s,D as T,I as Ke,M as Ne}from"./common-Bf7N1yx4.js";import"./Comment-DpaRJS4W.js";import"./EightElements-coZYDxE7.js";import"./Measure-xg2U5I-n.js";import"./index-B2LkkuhT.js";import"./IntermediatePurpose-pwydkJPT.js";import"./ObjectiveBox-z7oMIgMo.js";import"./index-DnpXSZi2.js";const De={title:"pufu-editor/ProjectScore",component:t,parameters:{layout:"fullscreen"},tags:["autodocs"]},o={args:{},play:je},n={args:{feedback:!0},play:Ee},c={args:{initScore:Be(),feedback:!0}},i={args:{initScore:y(),preview:!0},play:We},m={args:{lang:"en"},render:function({...v}){return e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"※Docsでは英語表示不可"}),e.jsx(De.component,{...v})]})}},p={args:{feedback:!0,mobile:!0},play:je},l={args:{initScore:s,mobile:!0,textSize:"base"},render:r=>e.jsx("div",{style:{maxWidth:390,margin:"0 auto"},children:e.jsx(t,{...r})})},d={args:{initScore:s,preview:!0,mobile:!0,textSize:"base"},render:r=>e.jsx("div",{style:{maxWidth:390,margin:"0 auto"},children:e.jsx(t,{...r})}),play:Ie},u={args:{initScore:s,mobile:!1,textSize:"base"},render:r=>e.jsx("div",{"data-testid":"resizable-score",style:{maxWidth:640,margin:"0 auto"},children:e.jsx(t,{...r})})},g={args:{initScore:s,preview:!0,mobile:!1,textSize:"base"},render:r=>e.jsx("div",{"data-testid":"resizable-score",style:{maxWidth:640,margin:"0 auto"},children:e.jsx(t,{...r})}),play:ze},S={args:{uniqueKey:"sample",feedback:!0},render:function({...v}){const[ke,j]=k.useState(!1),[P,C]=k.useState(""),[Te,D]=k.useState("");return e.jsxs(e.Fragment,{children:[e.jsx(T,{scoreKey:"sample",kind:"json"}),e.jsx(T,{scoreKey:"sample",kind:"png"}),e.jsx(T,{scoreKey:"sample",kind:"svg"}),e.jsx(Ke,{onClick:()=>{const a=Pe("sample");C(a),j(!0),D("")}}),e.jsx("p",{className:"ml-8",children:"ID: sample"}),e.jsx(De.component,{...v}),e.jsx(Ne,{open:ke,text:P,error:Te,onCancel:()=>j(!1),onChange:a=>{C(a)},onOk:()=>{try{D(""),Ce("sample",P),j(!1)}catch(a){console.error(a),a instanceof Error&&D(a.message)}}})]})}},x={args:{initScore:y(),feedback:!0,border:!1}},b={args:{initScore:y(),feedback:!1,textSize:"base"}},f={args:{initScore:y(),feedback:!0,textSize:"large"}},w={args:{initScore:s,preview:!0},play:Oe},h={args:{initScore:s,preview:!0,showProgress:!0},play:Me};var E,I,z;o.parameters={...o.parameters,docs:{...(E=o.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {},
  play: editTest
}`,...(z=(I=o.parameters)==null?void 0:I.docs)==null?void 0:z.source}}};var W,M,O;n.parameters={...n.parameters,docs:{...(W=n.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    feedback: true
  },
  play: feedbackTest
}`,...(O=(M=n.parameters)==null?void 0:M.docs)==null?void 0:O.source}}};var B,K,N;c.parameters={...c.parameters,docs:{...(B=c.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    initScore: createInitialScoreDataWithDuplication(),
    feedback: true
  }
}`,...(N=(K=c.parameters)==null?void 0:K.docs)==null?void 0:N.source}}};var F,R,q;i.parameters={...i.parameters,docs:{...(F=i.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    initScore: createInitialScoreDataWithComment(),
    preview: true
  },
  play: previewTest
}`,...(q=(R=i.parameters)==null?void 0:R.docs)==null?void 0:q.source}}};var J,L,_;m.parameters={...m.parameters,docs:{...(J=m.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    lang: "en"
  },
  render: function Comp({
    ...args
  }) {
    return <>
        <p>※Docsでは英語表示不可</p>
        <meta.component {...args}></meta.component>
      </>;
  }
}`,...(_=(L=m.parameters)==null?void 0:L.docs)==null?void 0:_.source}}};var A,G,H;p.parameters={...p.parameters,docs:{...(A=p.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    feedback: true,
    mobile: true
  },
  play: editTest
}`,...(H=(G=p.parameters)==null?void 0:G.docs)==null?void 0:H.source}}};var Q,U,V;l.parameters={...l.parameters,docs:{...(Q=l.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    initScore: exampleData,
    mobile: true,
    textSize: "base"
  },
  render: args => <div style={{
    maxWidth: 390,
    margin: "0 auto"
  }}>
      <ProjectScore {...args} />
    </div>
}`,...(V=(U=l.parameters)==null?void 0:U.docs)==null?void 0:V.source}}};var X,Y,Z;d.parameters={...d.parameters,docs:{...(X=d.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    initScore: exampleData,
    preview: true,
    mobile: true,
    textSize: "base"
  },
  render: args => <div style={{
    maxWidth: 390,
    margin: "0 auto"
  }}>
      <ProjectScore {...args} />
    </div>,
  play: mobilePreviewTest
}`,...(Z=(Y=d.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var $,ee,re;u.parameters={...u.parameters,docs:{...($=u.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    initScore: exampleData,
    mobile: false,
    textSize: "base"
  },
  render: args => <div data-testid="resizable-score" style={{
    maxWidth: 640,
    margin: "0 auto"
  }}>
      <ProjectScore {...args} />
    </div>
}`,...(re=(ee=u.parameters)==null?void 0:ee.docs)==null?void 0:re.source}}};var ae,se,te;g.parameters={...g.parameters,docs:{...(ae=g.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  args: {
    initScore: exampleData,
    preview: true,
    mobile: false,
    textSize: "base"
  },
  render: args => <div data-testid="resizable-score" style={{
    maxWidth: 640,
    margin: "0 auto"
  }}>
      <ProjectScore {...args} />
    </div>,
  play: narrowMinimapTest
}`,...(te=(se=g.parameters)==null?void 0:se.docs)==null?void 0:te.source}}};var oe,ne,ce;S.parameters={...S.parameters,docs:{...(oe=S.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  args: {
    uniqueKey: "sample",
    feedback: true
  },
  render: function Comp({
    ...args
  }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [scoreText, setScoreText] = React.useState("");
    const [error, setError] = React.useState("");
    return <>
        <DownloadButton scoreKey="sample" kind="json" />
        <DownloadButton scoreKey="sample" kind="png" />
        <DownloadButton scoreKey="sample" kind="svg" />
        <ImportButton onClick={() => {
        const json = getScoreJson("sample");
        setScoreText(json!);
        setIsOpen(true);
        setError("");
      }} />
        <p className="ml-8">ID: sample</p>
        <meta.component {...args}></meta.component>
        <ModalDialog open={isOpen} text={scoreText} error={error} onCancel={() => setIsOpen(false)} onChange={(text: string) => {
        setScoreText(text);
      }} onOk={() => {
        try {
          setError("");
          setScore("sample", scoreText);
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
}`,...(ce=(ne=S.parameters)==null?void 0:ne.docs)==null?void 0:ce.source}}};var ie,me,pe;x.parameters={...x.parameters,docs:{...(ie=x.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  args: {
    initScore: createInitialScoreDataWithComment(),
    feedback: true,
    border: false
  }
}`,...(pe=(me=x.parameters)==null?void 0:me.docs)==null?void 0:pe.source}}};var le,de,ue;b.parameters={...b.parameters,docs:{...(le=b.parameters)==null?void 0:le.docs,source:{originalSource:`{
  args: {
    initScore: createInitialScoreDataWithComment(),
    feedback: false,
    textSize: "base"
  }
}`,...(ue=(de=b.parameters)==null?void 0:de.docs)==null?void 0:ue.source}}};var ge,Se,xe;f.parameters={...f.parameters,docs:{...(ge=f.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  args: {
    initScore: createInitialScoreDataWithComment(),
    feedback: true,
    textSize: "large"
  }
}`,...(xe=(Se=f.parameters)==null?void 0:Se.docs)==null?void 0:xe.source}}};var be,fe,we;w.parameters={...w.parameters,docs:{...(be=w.parameters)==null?void 0:be.docs,source:{originalSource:`{
  args: {
    initScore: exampleData,
    preview: true
  },
  play: twoColumnTest
}`,...(we=(fe=w.parameters)==null?void 0:fe.docs)==null?void 0:we.source}}};var he,ye,ve;h.parameters={...h.parameters,docs:{...(he=h.parameters)==null?void 0:he.docs,source:{originalSource:`{
  args: {
    initScore: exampleData,
    preview: true,
    showProgress: true
  },
  play: showProgressTest
}`,...(ve=(ye=h.parameters)==null?void 0:ye.docs)==null?void 0:ve.source}}};const Ye=["Edit","Feedback","FeedbackDuplication","Preview","English","Mobile","MobileEdit","MobilePreview","NarrowEdit","NarrowPreview","Download","NoBorder","TextBase","TextLarge","TwoColumn","ShowProgress"];export{S as Download,o as Edit,m as English,n as Feedback,c as FeedbackDuplication,p as Mobile,l as MobileEdit,d as MobilePreview,u as NarrowEdit,g as NarrowPreview,x as NoBorder,i as Preview,h as ShowProgress,b as TextBase,f as TextLarge,w as TwoColumn,Ye as __namedExportsOrder,De as default};
//# sourceMappingURL=2_ProjectScore.stories-BTU6-qKs.js.map
