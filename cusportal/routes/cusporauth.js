var express = require('express');
var router = express.Router();
var jwt=require('jsonwebtoken');
var soapRequest = require('easy-soap-request');
var { transform} = require('camaro');
const { post } = require('.');
const sampleHeaders = {
  'user-agent': 'sampleTest',
  'Content-Type': 'text/xml;charset=UTF-8',
  'Authorization': 'Basic UE9VU0VSOlRlY2hAMjAyMQ=='
};
function verifyToken(req,res,next)
{
  if(!req.headers.authorization)
  {
    return res.status(401).send('unauthorized');
  }
  let tok= req.headers.authorization.split(' ')[1]
  if(tok== 'null'){
    return res.status(401).send('unauthorized');
  }
  let verify=jwt.verify(tok,'Bala');
  if(verify=='null')
  {
    return res.status(401).send('unauthorized');
  }
  req.cusid=verify.subject;
  next();
}
/* GET home page. */
router.post('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  var user=req.body.cusid;
  var pass=req.body.password;
  var payload={subject:user};
  

const template = {
    RETURN:{
      TYPE:'//SOAP:Body//RETURN/TYPE',
      CODE:'//SOAP:Body//RETURN/CODE',
      MESSAGE:'//SOAP:Body//RETURN/MESSAGE',
      LOG_NO:'//SOAP:Body//RETURN/LOG_NO',
      LOG_MSG_NO:'//SOAP:Body//RETURN/LOG_MSG_NO',
      MESSAGE_V1:'//SOAP:Body//RETURN/MESSAGE_V1',
      MESSAGE_V2:'//SOAP:Body//RETURN/MESSAGE_V2',
      MESSAGE_V3:'//SOAP:Body//RETURN/MESSAGE_V3',
      MESSAGE_V4:'//SOAP:Body//RETURN/MESSAGE_V4'
    } 
};

const url = 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_CUSPASS1&receiverParty=&receiverService=&interface=SI_CUSPASS&interfaceNamespace=http://bala.com';

var val = 22;
console.log(pass);
const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
<soapenv:Header/>
<soapenv:Body>
   <urn:ZBAPICUSAUTH_FM>
      <!--You may enter the following 2 items in any order-->
      <CUSID>${user}</CUSID>
      <PASS>${pass}</PASS>
   </urn:ZBAPICUSAUTH_FM>
</soapenv:Body>
</soapenv:Envelope>`;

var xmlData;
(async () => {
  const { response } = await soapRequest({ url: url, headers: sampleHeaders, xml: xml, timeout: 10000 });
  const { headers, body, statusCode } = response;
  console.log(headers);
  console.log(body);
  console.log(statusCode);

  xmlData = body;
  const result = await transform(xmlData, template);
  //const result=parser.xml2json(xmlData, {compact: true, spaces: 4});
  if(result.RETURN.MESSAGE== 'true')
  {
      let tok=jwt.sign(payload,'Bala');
      console.log(tok);
      res.status(200).send({tok});
  }
  else{
    res.status(401).send('unauthorized');
  }
})();




});
router.get('/special',verifyToken,(req,res)=>{
  let events =[]
  res.json(events);
});
router.post('/cusprofile',(req,res)=>{
    var cusid=req.body.cusid;
    console.log(req.body);
    var xml=`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
    <soapenv:Header/>
    <soapenv:Body>
       <urn:ZBAPICUSPROF_FM>
          <CUSID>${cusid}</CUSID>
       </urn:ZBAPICUSPROF_FM>
    </soapenv:Body>
 </soapenv:Envelope>`
  const temp={
    contno: '//SOAP:Body//CONTNO',
    cuscity: '//SOAP:Body//CUSCITY',
    cuscountry: '//SOAP:Body//CUSCOUNTRY',
    cusid: '//SOAP:Body//CUSIDOUT',
    cusmail: '//SOAP:Body//CUSMAIL',
    cusname: '//SOAP:Body//CUSNAME',
    cuspost: '//SOAP:Body//CUSPOST',
      RETURN:{
        TYPE:'//SOAP:Body//RETURN/TYPE',
        CODE:'//SOAP:Body//RETURN/CODE',
        MESSAGE:'//SOAP:Body//RETURN/MESSAGE',
        LOG_NO:'//SOAP:Body//RETURN/LOG_NO',
        LOG_MSG_NO:'//SOAP:Body//RETURN/LOG_MSG_NO',
        MESSAGE_V1:'//SOAP:Body//RETURN/MESSAGE_V1',
        MESSAGE_V2:'//SOAP:Body//RETURN/MESSAGE_V2',
        MESSAGE_V3:'//SOAP:Body//RETURN/MESSAGE_V3',
        MESSAGE_V4:'//SOAP:Body//RETURN/MESSAGE_V4'
      } 
  }
  const url = 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_CUSPROF&receiverParty=&receiverService=&interface=SI_CUSPROF&interfaceNamespace=http://bala.com';
  var xmlData;
  (async () => {
    const { response } = await soapRequest({ url: url, headers: sampleHeaders, xml: xml, timeout: 10000 });
    const { headers, body, statusCode } = response;
    console.log(headers);
    console.log(body);
    console.log(statusCode);
  
    xmlData = body;
    const result = await transform(xmlData, temp);
    console.log(result);
    res.status(200).send(result);
  })();
});

router.post('/inquiry',(req,res)=>{
    var cusid=req.body.cusid;
    var doctype=req.body.doctype;
    //var cusid=11;
    //var doctype='A';
    console.log(req);
    var xml=`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
    <soapenv:Header/>
    <soapenv:Body>
       <urn:ZBAPICUSSALE_FM>
          <!--You may enter the following 3 items in any order-->
          <CUSID>${cusid}</CUSID>
          <DOCTYPE>${doctype}</DOCTYPE>
          <RESULT>
             <!--Zero or more repetitions:-->
             <item>
                <!--Optional:-->
                <VBELN>?</VBELN>
                <!--Optional:-->
                <VBTYP>?</VBTYP>
                <!--Optional:-->
                <KUNNR>?</KUNNR>
             </item>
          </RESULT>
       </urn:ZBAPICUSSALE_FM>
    </soapenv:Body>
 </soapenv:Envelope>`
 const temp=['//SOAP:Body//RESULT/item',{ 
   VBELN:'VBELN'
 }];
 const url = 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_CUSSALE&receiverParty=&receiverService=&interface=SI_CUSSALE&interfaceNamespace=http://bala.com';
  var xmlData;
  (async () => {
    const { response } = await soapRequest({ url: url, headers: sampleHeaders, xml: xml, timeout: 10000 });
    const { headers, body, statusCode } = response;
    console.log(headers);
    console.log(body);
    console.log(statusCode);
  
    xmlData = body;
    const result = await transform(xmlData, temp);
    console.log(result);
    res.status(200).send(result);
  })();
});
router.post('/inqdata',(req,res)=>{
    //var saledoc=10000048;
    var saledoc=req.body.saledoc;
    console.log(saledoc);
    var xml=`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
    <soapenv:Header/>
    <soapenv:Body>
       <urn:ZBAPICUSINQ>
          <!--You may enter the following 3 items in any order-->
          <SALEDOC>${saledoc}</SALEDOC>
       </urn:ZBAPICUSINQ>
    </soapenv:Body>
 </soapenv:Envelope>`;
//  const temp={
//    OPER:'OPERATION',
//    REC_DATE:'REC_DATE',
//    REC_TIME:'REC_TIME',
//    CREATED_BY:'CREATED_BY',
//    DOC_DATE:'DOC_DATE',
//    TRAN_GROUP:'TRAN_GROUP',
//    DOC_TYPE:'DOC_TYPE',
//    NET_VAL:'NET_VAL_HD',
//    CURRENCY:'CURRENCY',
//    SALES_ORG:'SALES_ORG',
//    LINEITEMS:['//SOAP:Body//INQ_LINE/item',{
//   DOC_NUMBER:'DOC_NUMBER',
//   ITM_NUMBER:'ITM_NUMBER',
//    MATERIAL:'MATERIAL',
//    MAT_ENTRD:'MAT_ENTRD',
//    MATL_GROUP:'MATL_GROUP',
//    SHORT_TEXT:'SHORT_TEXT',
//    ITEM_CATEG:'ITEM_CATEG',
//    ORDER_PROB:'ORDER_PROB',
//    CREAT_DATE:'CREAT_DATE',
//    CREATED_BY:'CREATED_BY'
//   }],
//   RETURN:['//SOAP:Body//RETURN/item',{TYPE:'TYPE'}]
//  };
 const temp={
   headers:['//SOAP:Body//INQ_HEAD',{
  OPER:'OPERATION',
  REC_DATE:'REC_DATE',
  REC_TIME:'REC_TIME',
  CREATED_BY:'CREATED_BY',
  DOC_DATE:'DOC_DATE',
  TRAN_GROUP:'TRAN_GROUP',
  DOC_TYPE:'DOC_TYPE',
  NET_VAL:'NET_VAL_HD',
  CURRENCY:'CURRENCY',
  SALES_ORG:'SALES_ORG'}],
  LINEITEMS:['//SOAP:Body//INQ_LINE/item',{
 DOC_NUMBER:'DOC_NUMBER',
 ITM_NUMBER:'ITM_NUMBER',
  MATERIAL:'MATERIAL',
  MAT_ENTRD:'MAT_ENTRD',
  MATL_GROUP:'MATL_GROUP',
  SHORT_TEXT:'SHORT_TEXT',
  ITEM_CATEG:'ITEM_CATEG',
  ORDER_PROB:'ORDER_PROB',
  CREAT_DATE:'CREAT_DATE',
  CREATED_BY:'CREATED_BY'
 }],
 RETURN:['//SOAP:Body//RETURN/item',{TYPE:'TYPE'}]
};
 const url = 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_CUSINQ&receiverParty=&receiverService=&interface=SI_CUSINQ&interfaceNamespace=http://bala.com';
  var xmlData;
  (async () => {
    const { response } = await soapRequest({ url: url, headers: sampleHeaders, xml: xml, timeout: 10000 });
    const { headers, body, statusCode } = response;
    console.log(headers);
    console.log(body);
    console.log(statusCode);
  
    xmlData = body;
    const result = await transform(xmlData, temp);
    console.log(result);
    res.status(200).send(result);
  })();
});
router.post('/cusdeli',(req,res)=>{
  var cusid=req.body.cusid;
  //cusid=179999;
  var xml=`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
  <soapenv:Header/>
  <soapenv:Body>
     <urn:ZBAPICUSDELI_FM>
        <!--You may enter the following 4 items in any order-->
        <CUSID>${cusid}</CUSID>
       
     </urn:ZBAPICUSDELI_FM>
  </soapenv:Body>
</soapenv:Envelope>`
const temp={HEADER:['//SOAP:Body//IT_DELIHEAD/item',{VBELN:'VBELN',VSTEL:'VSTEL',WADAT:'WADAT',INCO2:'INCO2',NTGEW:'NTGEW',GEWEI:'GEWEI',LFART:'LFART',ERDAT:'ERDAT',ERNAM:'ERNAM',VKORG:'VKORG'}],
LINE:['//SOAP:Body//IT_DELILINE/item',{VBELN:'VBELN',MATNR:'MATNR',MATWA:'MATWA',ARKTX:'ARKTX',NTGEW:'NTGEW',GEWEI:'GEWEI',MBDAT:'MBDAT',LGMNG:'LGMNG',ERDAT:'ERDAT',ERNAM:'ERNAM'}],
RETURN:['//SOAP:Body//RETURN',{TYPE:'TYPE'}]
};
  const url = 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_CUSDELI&receiverParty=&receiverService=&interface=SI_CUSDELI&interfaceNamespace=http://bala.com';
 var xmlData;
 (async () => {
   const { response } = await soapRequest({ url: url, headers: sampleHeaders, xml: xml, timeout: 10000 });
   const { headers, body, statusCode } = response;
   console.log(headers);
   console.log(body);
   console.log(statusCode);
 
   xmlData = body;
   const result = await transform(xmlData, temp);
   console.log(result);
   res.status(200).send(result);
 })();

})
router.post('/cussaleor',(req,res)=>{
  var cusid=req.body.cusid;
  //cusid=179999;
  var xml=`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
  <soapenv:Header/>
  <soapenv:Body>
     <urn:ZBAPICUSSALEOR_FM>
        <!--You may enter the following 2 items in any order-->
        <CUSID>${cusid}</CUSID>
        
     </urn:ZBAPICUSSALEOR_FM>
  </soapenv:Body>
</soapenv:Envelope>`
const temp={SALESORDERS:['//SOAP:Body//IT_CUSSALEOR/item',{SD_DOC:'SD_DOC',ITM_NUMBER:'ITM_NUMBER',MATERIAL:'MATERIAL',SHORT_TEXT:'SHORT_TEXT',NAME:'NAME',DOC_DATE:'DOC_DATE',NET_VAL:'NET_VAL',CURRENCY:'CURRENCY',SALES_ORG:'SALES_ORG',EXCHG_RATE:'EXCHG_RATE'}]
};
  const url = 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_CUSSALEOR&receiverParty=&receiverService=&interface=SI_CUSSALEOR&interfaceNamespace=http://bala.com';
 var xmlData;
 (async () => {
   const { response } = await soapRequest({ url: url, headers: sampleHeaders, xml: xml, timeout: 10000 });
   const { headers, body, statusCode } = response;
   console.log(headers);
   console.log(body);
   console.log(statusCode);
 
   xmlData = body;
   const result = await transform(xmlData, temp);
   console.log(result);
   res.status(200).send(result);
 })();

})

router.post('/cuscredit',(req,res)=>{
   var cusid=req.body.cusid;
   var xml=`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:ZBAPICUSCRED_FM>
         <!--You may enter the following 3 items in any order-->
         <CUSID>${cusid}</CUSID>
         <IT_CUSCRED>
            <!--Zero or more repetitions:-->
          
         </IT_CUSCRED>
         <IT_CUSDEB>
            
         </IT_CUSDEB>
      </urn:ZBAPICUSCRED_FM>
   </soapenv:Body>
</soapenv:Envelope>`
const temp={CREDIT:['//SOAP:Body//IT_CUSCRED/item',{COMP_CODE:'COMP_CODE',ITEM_NUM:'ITEM_NUM',ALLOC_NMBR:'ALLOC_NMBR',FISC_YEAR:'FISC_YEAR',DOC_NO:'DOC_NO',DOC_DATE:'DOC_DATE',LC_AMOUNT:'LC_AMOUNT',CURRENCY:'CURRENCY',PSTNG_DATE:'PSTNG_DATE',ENTRY_DATE:'ENTRY_DATE'}],
DEBIT:['//SOAP:Body//IT_CUSDEB/item',{COMP_CODE:'COMP_CODE',ITEM_NUM:'ITEM_NUM',ALLOC_NMBR:'ALLOC_NMBR',FISC_YEAR:'FISC_YEAR',DOC_NO:'DOC_NO',DOC_DATE:'DOC_DATE',LC_AMOUNT:'LC_AMOUNT',CURRENCY:'CURRENCY',PSTNG_DATE:'PSTNG_DATE',ENTRY_DATE:'ENTRY_DATE'}],
RETURN:'//SOAP:Body//RETURN/TYPE'
};
   const url = 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_CUSCRED&receiverParty=&receiverService=&interface=SI_CUSCRED&interfaceNamespace=http://bala.com';
  var xmlData;
  (async () => {
    const { response } = await soapRequest({ url: url, headers: sampleHeaders, xml: xml, timeout: 10000 });
    const { headers, body, statusCode } = response;
    console.log(headers);
    console.log(body);
    console.log(statusCode);
  
    xmlData = body;
    const result = await transform(xmlData, temp);
    console.log(result);
    res.status(200).send(result);
  })();

})


module.exports = router;
