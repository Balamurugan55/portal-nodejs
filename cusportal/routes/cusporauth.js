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

module.exports = router;
