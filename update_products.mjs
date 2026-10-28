import fs from 'fs';
const data={
  categories:[
    {name:"ICU / PICU / NICU Room",slug:"icu-picu-nicu-room",description:"Peralatan ruang ICU, PICU, NICU untuk perawatan kritis.",icon:"activity"},
    {name:"Operating Room",slug:"operating-room",description:"Peralatan kamar operasi dan anestesi.",icon:"scissors"},
    {name:"Ultrasound",slug:"ultrasound",description:"Peralatan USG 2D/3D/4D/5D untuk diagnostik.",icon:"monitor"},
    {name:"Emergency",slug:"emergency",description:"Peralatan emergensi dan resusitasi.",icon:"siren"},
    {name:"CSSD (Sterilisasi)",slug:"cssd-sterilisasi",description:"Peralatan sterilisasi dan CSSD.",icon:"shield-check"},
    {name:"Radiology",slug:"radiology",description:"Peralatan radiologi dan pencitraan.",icon:"scan"},
    {name:"Alat Kesehatan Lainnya",slug:"alat-kesehatan-lainnya",description:"Peralatan medis pendukung lainnya.",icon:"package"}
  ],
  brands:[
    {name:"BISOND",slug:"bisond",description:"BISOND"},
    {name:"BOSKA",slug:"boska",description:"BOSKA"},
    {name:"VINNO",slug:"vinno",description:"VINNO"},
    {name:"DENKI",slug:"denki",description:"DENKI"},
    {name:"TAKTVOLL",slug:"taktvoll",description:"TAKTVOLL"},
    {name:"DMS",slug:"dms",description:"DMS"},
    {name:"PROSOND",slug:"prosond",description:"PROSOND"},
    {name:"LIQIAN",slug:"liqian",description:"LIQIAN"},
    {name:"MINSTON",slug:"minston",description:"MINSTON"},
    {name:"Z9 PREMIUM",slug:"z9-premium",description:"Z9 PREMIUM"}
  ],
  products:[]
};
function add(n,name,brand,model,specs,price,cat,sku){
  let pv=null,pm='contact';
  if(price){const c=price.replace(/[^0-9]/g,'');if(c){pv=parseInt(c);pm='show';}}
  data.products.push({name,model:model||'-',brand,category:cat,sku:sku||'MGA-'+String(n).padStart(3,'0'),price:pv,price_mode:pm,stock_status:'Ready',is_featured:false,short_description:name,description:specs,specs:specs.split(';').map((s,i)=>{const p=s.trim().split(':');if(p.length>=2)return{label:p[0].trim(),value:p.slice(1).join(':').trim()};return{label:'Spesifikasi '+(i+1),value:s.trim()};})});
}
// ICU
add(1,'Pendant 7 Outlet','BISOND','Denki','Double arm mechanical; beban <60 kg; aluminium alloy; 7 outlet gas','Rp 160.000.000','ICU / PICU / NICU Room','MGA-ICU-001');
add(2,'Pendant 10 Outlet','BISOND','Denki','Double arm mechanical; beban <60 kg; aluminium alloy; 10 outlet gas','Rp 190.000.000','ICU / PICU / NICU Room','MGA-ICU-002');
add(3,'Syringe Pump','BISOND','BSP-03','Syringe 5-60 ml; akurasi ±2%; 2,5 kg; baterai hingga 7 jam','Rp 18.000.000','ICU / PICU / NICU Room','MGA-ICU-003');
add(4,'Infusion Pump','BISOND','IP200','Flowrate 0,1-10.000 ml; akurasi ±2%; 1,4 kg; baterai hingga 5 jam','Rp 16.000.000','ICU / PICU / NICU Room','MGA-ICU-004');
add(5,'Patient Monitor 5/7 Parameter','BOSKA','BOS-168','Layar sentuh 12 inci; SpO2, NIBP, ECG, RESP, TEMP, IBP, ETCO2; baterai cadangan hingga 2 jam','Rp 24.000.000','ICU / PICU / NICU Room','MGA-ICU-005');
add(6,'Patient Monitor 5/7 Parameter','BISOND','M90','Layar sentuh 11,6 inci; SpO2, NIBP, ECG, RESP, TEMP, IBP, ETCO2; baterai cadangan hingga 2 jam',null,'ICU / PICU / NICU Room','MGA-ICU-006');
add(7,'Infusion Pump','BISOND','IP-168','Flow rate 0,1-2300 mL/h; akurasi ±5%; baterai hingga 5 jam',null,'ICU / PICU / NICU Room','MGA-ICU-007');
add(8,'Infusion Pump','BISOND','IP03','Akurasi ±2%; 2,5 kg; baterai hingga 5 jam','Rp 16.000.000','ICU / PICU / NICU Room','MGA-ICU-008');
add(9,'Patient Monitor 5 Parameter','BISOND','AMBU 007','Layar 2,8 inci; SpO2, NIBP, ECG, RESP, TEMP; baterai cadangan hingga 2 jam; mendukung transport',null,'ICU / PICU / NICU Room','MGA-ICU-009');
add(10,'Patient Monitor 5 Parameter','BISOND','AMBU 80','Layar 8 inci; SpO2, NIBP, ECG, RESP, TEMP; baterai cadangan hingga 2 jam; mendukung transport',null,'ICU / PICU / NICU Room','MGA-ICU-010');
add(11,'4 in 1 Ventilator','BISOND','BOSKA K9','Neonate 400 gr hingga dewasa; layar sentuh warna 10,4 inci; teknologi turbin; ICU/transport; bahasa Indonesia',null,'ICU / PICU / NICU Room','MGA-ICU-011');
add(12,'Blanket Warmer','BISOND','BS-2000','Mode aliran High/Med/Low; suhu 32/35/38/43°C dan ambient; kebisingan <52 dB','Rp 90.000.000','ICU / PICU / NICU Room','MGA-ICU-012');
add(13,'Central Monitoring System','BISOND','-','Hingga 64 bedside monitor; riwayat 10.000 pasien; alarm',null,'ICU / PICU / NICU Room','MGA-ICU-013');
add(14,'Syringe Pump','BISOND','HK-70','Syringe 10-60 ml; akurasi ±2%; 2,5 kg; baterai hingga 7 jam',null,'ICU / PICU / NICU Room','MGA-ICU-014');
add(15,'Turbine Transport Ventilator','BISOND','BS-95','Dewasa, pediatrik, neonatus; LCD 10,4 inci; ventilasi invasif dan non-invasif; baterai kapasitas besar','Rp 400.000.000','ICU / PICU / NICU Room','MGA-ICU-015');
add(16,'Ventilator ICU','BISOND','BS-300','Pasien mulai 5 kg (bayi, anak, dewasa); layar TFT 10,4 inci; invasif dan non-invasif; dengan kompresor','Rp 310.000.000','ICU / PICU / NICU Room','MGA-ICU-016');
add(17,'Infusion Pump','BISOND','HK-80','Dewasa, neonatus; flow rate 0,01-1500 ml/h; akurasi ±3%; 2,5 kg; baterai hingga 5 jam',null,'ICU / PICU / NICU Room','MGA-ICU-017');
add(18,'Syringe Pump','BISOND','BOSKA-01','Flow rate 0,1-2300 mL/h; akurasi ±1,8%; kompatibel syringe 1 ml',null,'ICU / PICU / NICU Room','MGA-ICU-018');
add(19,'Ventilator','BISOND','VT-700','Dewasa, pediatrik, neonatus; layar sentuh 15,6 inci; invasif dan non-invasif; 12 mode ventilasi',null,'ICU / PICU / NICU Room','MGA-ICU-019');
add(20,'NCPAP - CPAP','BOSKA','NeoVent','CPAP dengan turbin; untuk bayi prematur, neonatus, dan pediatrik','Rp 270.000.000','ICU / PICU / NICU Room','MGA-ICU-020');
add(21,'Video Endoscopy (Gastro & Colon)','BISOND','BS ENDO 87','Video processor; auto AWB; vascular enhancement; lampu LED 35.000 jam; gastroscope 9,6 mm; colonoscope 12,5 mm; FOV 145°; termasuk Endoscopy Reporting System','Rp 1.800.000.000','ICU / PICU / NICU Room','MGA-ICU-021');
add(22,'All in One Endoscopy','BISOND','-','Hysteroscopy, urology, arthroscopy, laparoscopy, THT',null,'ICU / PICU / NICU Room','MGA-ICU-022');
// OR
add(23,'Anesthesia Ventilator','BISOND','AN-8000','Layar sentuh 12 inci; tidal volume 20-1500 ml; 2 vaporizer; 3 gas; dengan heating system','Rp 530.000.000','Operating Room','MGA-OR-001');
add(24,'Anesthesia Ventilator','BISOND','AN-5000','Layar TFT 7 inci; tidal volume 20-1500 ml; mode A/C, Standby, SIMV, MAN; 2 vaporizer','Rp 320.000.000','Operating Room','MGA-OR-002');
add(25,'Laparoscopy','BISOND','BS800','Full HD camera; waterproof camera head; LED light source',null,'Operating Room','MGA-OR-003');
add(26,'Video Bronchoscope System','BISOND','BS800','Gambar HD; reusable; ringan dan portabel',null,'Operating Room','MGA-OR-004');
add(27,'Operating Lamp Ceiling','BISOND','BS-9090','160.000 lux; suhu warna 4000-5000K (adjustable)','Rp 190.000.000','Operating Room','MGA-OR-005');
add(28,'Operating Lamp Ceiling','BISOND','BS 900/900','40.000-180.000 lux; 4000-5000K (adjustable)',null,'Operating Room','MGA-OR-006');
add(29,'Operating Lamp Ceiling (Single)','BISOND','BS-80SC','LED Osram Jerman >50.000 jam; 110.000 lux','Rp 140.000.000','Operating Room','MGA-OR-007');
add(30,'Operating Lamp Ceiling (Double)','BISOND','BS-8080','LED Osram Jerman >50.000 jam; 110.000 lux','Rp 150.000.000','Operating Room','MGA-OR-008');
add(31,'Operating Lamp Ceiling','LIQIAN','LQLED 700/500','160.000 lux; 4000-5000K (adjustable)',null,'Operating Room','MGA-OR-009');
add(32,'Operating Lamp Mobile','BISOND','BS-80MB','LED Osram Jerman >50.000 jam; 110.000 lux; dengan baterai','Rp 70.000.000','Operating Room','MGA-OR-010');
add(33,'Operating Lamp Mobile','BISOND','BS-25','LED Osram Jerman >50.000 jam; 40.000 lux',null,'Operating Room','MGA-OR-011');
add(34,'Gynaecology Table','BOSKA','OT-87','Baterai standar mendukung 80 operasi, tahan sekitar satu minggu','Rp 130.000.000','Operating Room','MGA-OR-012');
add(35,'Electric Operating Table','BOSKA','OT-5000','5 fungsi; sliding 30 cm; lumbar/kidney bridge; baterai mendukung 80 operasi','Rp 290.000.000','Operating Room','MGA-OR-013');
add(36,'Electrosurgical Unit 200W','TAKTVOLL','ES-200PK','Daya poton
