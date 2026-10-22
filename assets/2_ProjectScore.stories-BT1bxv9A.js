import{j as e}from"./jsx-runtime-CD9V3zLE.js";import{R as T}from"./index-DTLCi2z1.js";import{P as t,g as Ee,s as We}from"./ProjectScore-HpE2QE0q.js";import{e as Pe,f as Me,m as Oe,n as Be,p as Ke,s as Ne,t as Fe}from"./ProjectScore.stories.test-BJBjWNEl.js";import{c as Re,a as o}from"./common-DoQ1JgVW.js";import{e as s,D as P,I as qe,M as Je}from"./common-DLdKrlN5.js";import"./Comment-Bt0CxpYJ.js";import"./EightElements-CBG9L8RQ.js";import"./Measure-CvOcpiwI.js";import"./index-LrvYS77v.js";import"./IntermediatePurpose-v_3XwovD.js";import"./ObjectiveBox-D6aapSv0.js";import"./index-DnpXSZi2.js";const Ce={title:"pufu-editor/ProjectScore",component:t,parameters:{layout:"fullscreen"},tags:["autodocs"]},n={args:{},play:Pe},c={args:{feedback:!0},play:Me},i={args:{initScore:Re(),feedback:!0}},m={args:{initScore:o(),preview:!0},play:Ke},p={args:{lang:"en"},render:function({...j}){return e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"※Docsでは英語表示不可"}),e.jsx(Ce.component,{...j})]})}},l={args:{feedback:!0,mobile:!0},play:Pe},d={args:{initScore:s,mobile:!0,textSize:"base"},render:r=>e.jsx("div",{style:{maxWidth:390,margin:"0 auto"},children:e.jsx(t,{...r})})},u={args:{initScore:s,preview:!0,mobile:!0,textSize:"base"},render:r=>e.jsx("div",{style:{maxWidth:390,margin:"0 auto"},children:e.jsx(t,{...r})}),play:Oe},g={args:{initScore:s,mobile:!1,textSize:"base"},render:r=>e.jsx("div",{"data-testid":"resizable-score",style:{maxWidth:640,margin:"0 auto"},children:e.jsx(t,{...r})})},S={args:{initScore:s,preview:!0,mobile:!1,textSize:"base"},render:r=>e.jsx("div",{"data-testid":"resizable-score",style:{maxWidth:640,margin:"0 auto"},children:e.jsx(t,{...r})}),play:Be},x={args:{uniqueKey:"sample",feedback:!0},render:function({...j}){const[ze,k]=T.useState(!1),[C,z]=T.useState(""),[Ie,D]=T.useState("");return e.jsxs(e.Fragment,{children:[e.jsx(P,{scoreKey:"sample",kind:"json"}),e.jsx(P,{scoreKey:"sample",kind:"png"}),e.jsx(P,{scoreKey:"sample",kind:"svg"}),e.jsx(qe,{onClick:()=>{const a=Ee("sample");z(a),k(!0),D("")}}),e.jsx("p",{className:"ml-8",children:"ID: sample"}),e.jsx(Ce.component,{...j}),e.jsx(Je,{open:ze,text:C,error:Ie,onCancel:()=>k(!1),onChange:a=>{z(a)},onOk:()=>{try{D(""),We("sample",C),k(!1)}catch(a){console.error(a),a instanceof Error&&D(a.message)}}})]})}},b={args:{initScore:o(),feedback:!0,border:!1}},f={args:{initScore:o(),feedback:!0,textSize:"xsmall"}},w={args:{initScore:o(),feedback:!1,textSize:"base"}},h={args:{initScore:o(),feedback:!0,textSize:"large"}},y={args:{initScore:s,preview:!0},play:Fe},v={args:{initScore:s,preview:!0,showProgress:!0},play:Ne};var I,E,W;n.parameters={...n.parameters,docs:{...(I=n.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {},
  play: editTest
}`,...(W=(E=n.parameters)==null?void 0:E.docs)==null?void 0:W.source}}};var M,O,B;c.parameters={...c.parameters,docs:{...(M=c.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    feedback: true
  },
  play: feedbackTest
}`,...(B=(O=c.parameters)==null?void 0:O.docs)==null?void 0:B.source}}};var K,N,F;i.parameters={...i.parameters,docs:{...(K=i.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    initScore: createInitialScoreDataWithDuplication(),
    feedback: true
  }
}`,...(F=(N=i.parameters)==null?void 0:N.docs)==null?void 0:F.source}}};var R,q,J;m.parameters={...m.parameters,docs:{...(R=m.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    initScore: createInitialScoreDataWithComment(),
    preview: true
  },
  play: previewTest
}`,...(J=(q=m.parameters)==null?void 0:q.docs)==null?void 0:J.source}}};var L,X,_;p.parameters={...p.parameters,docs:{...(L=p.parameters)==null?void 0:L.docs,source:{originalSource:`{
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
}`,...(_=(X=p.parameters)==null?void 0:X.docs)==null?void 0:_.source}}};var A,G,H;l.parameters={...l.parameters,docs:{...(A=l.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    feedback: true,
    mobile: true
  },
  play: editTest
}`,...(H=(G=l.parameters)==null?void 0:G.docs)==null?void 0:H.source}}};var Q,U,V;d.parameters={...d.parameters,docs:{...(Q=d.parameters)==null?void 0:Q.docs,source:{originalSource:`{
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
}`,...(V=(U=d.parameters)==null?void 0:U.docs)==null?void 0:V.source}}};var Y,Z,$;u.parameters={...u.parameters,docs:{...(Y=u.parameters)==null?void 0:Y.docs,source:{originalSource:`{
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
}`,...($=(Z=u.parameters)==null?void 0:Z.docs)==null?void 0:$.source}}};var ee,re,ae;g.parameters={...g.parameters,docs:{...(ee=g.parameters)==null?void 0:ee.docs,source:{originalSource:`{
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
}`,...(ae=(re=g.parameters)==null?void 0:re.docs)==null?void 0:ae.source}}};var se,te,oe;S.parameters={...S.parameters,docs:{...(se=S.parameters)==null?void 0:se.docs,source:{originalSource:`{
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
}`,...(oe=(te=S.parameters)==null?void 0:te.docs)==null?void 0:oe.source}}};var ne,ce,ie;x.parameters={...x.parameters,docs:{...(ne=x.parameters)==null?void 0:ne.docs,source:{originalSource:`{
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
}`,...(ie=(ce=x.parameters)==null?void 0:ce.docs)==null?void 0:ie.source}}};var me,pe,le;b.parameters={...b.parameters,docs:{...(me=b.parameters)==null?void 0:me.docs,source:{originalSource:`{
  args: {
    initScore: createInitialScoreDataWithComment(),
    feedback: true,
    border: false
  }
}`,...(le=(pe=b.parameters)==null?void 0:pe.docs)==null?void 0:le.source}}};var de,ue,ge;f.parameters={...f.parameters,docs:{...(de=f.parameters)==null?void 0:de.docs,source:{originalSource:`{
  args: {
    initScore: createInitialScoreDataWithComment(),
    feedback: true,
    textSize: "xsmall"
  }
}`,...(ge=(ue=f.parameters)==null?void 0:ue.docs)==null?void 0:ge.source}}};var Se,xe,be;w.parameters={...w.parameters,docs:{...(Se=w.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  args: {
    initScore: createInitialScoreDataWithComment(),
    feedback: false,
    textSize: "base"
  }
}`,...(be=(xe=w.parameters)==null?void 0:xe.docs)==null?void 0:be.source}}};var fe,we,he;h.parameters={...h.parameters,docs:{...(fe=h.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  args: {
    initScore: createInitialScoreDataWithComment(),
    feedback: true,
    textSize: "large"
  }
}`,...(he=(we=h.parameters)==null?void 0:we.docs)==null?void 0:he.source}}};var ye,ve,je;y.parameters={...y.parameters,docs:{...(ye=y.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  args: {
    initScore: exampleData,
    preview: true
  },
  play: twoColumnTest
}`,...(je=(ve=y.parameters)==null?void 0:ve.docs)==null?void 0:je.source}}};var ke,De,Te;v.parameters={...v.parameters,docs:{...(ke=v.parameters)==null?void 0:ke.docs,source:{originalSource:`{
  args: {
    initScore: exampleData,
    preview: true,
    showProgress: true
  },
  play: showProgressTest
}`,...(Te=(De=v.parameters)==null?void 0:De.docs)==null?void 0:Te.source}}};const rr=["Edit","Feedback","FeedbackDuplication","Preview","English","Mobile","MobileEdit","MobilePreview","NarrowEdit","NarrowPreview","Download","NoBorder","TextXSmall","TextBase","TextLarge","TwoColumn","ShowProgress"];export{x as Download,n as Edit,p as English,c as Feedback,i as FeedbackDuplication,l as Mobile,d as MobileEdit,u as MobilePreview,g as NarrowEdit,S as NarrowPreview,b as NoBorder,m as Preview,v as ShowProgress,w as TextBase,h as TextLarge,f as TextXSmall,y as TwoColumn,rr as __namedExportsOrder,Ce as default};
//# sourceMappingURL=2_ProjectScore.stories-BT1bxv9A.js.map
