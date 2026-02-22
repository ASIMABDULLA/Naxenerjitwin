import { createClient } from '@supabase/supabase-js'
import { useState, useEffect, useCallback, useRef } from "react";
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
  LineChart, Line, ReferenceLine
} from "recharts";
import {
  Zap, AlertTriangle, Battery, TrendingUp, Sun, Wind,
  Droplets, Activity, CheckCircle, RefreshCw,
  Cpu, Radio, Thermometer,
  Shield, BarChart2, Layers, Eye, Filter, Plus, Trash2,
  DollarSign, Leaf,
  X, Save, Wrench, FileWarning, ClipboardList,
  CheckSquare, Square, ChevronDown, Hammer,
  Lock, LogIn, UserPlus, Users, UserCheck, UserX,
  Crown, LogOut, UserCog, ShieldCheck, ShieldOff,
  Star, MapPinned, History, Edit3, Database, Send,
  MessageSquare, Bell, BellRing, Inbox, MessageCircle, ArrowLeft, AtSign, Reply,
  PenLine, Settings2
} from "lucide-react";

// ============================================================
// SUPABASE CLIENT
// ============================================================
const SUPABASE_URL = "https://psvobvcuczallzmyqnjm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzdm9idmN1Y3phbGx6bXlxbmptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NTEwNzAsImV4cCI6MjA4NzMyNzA3MH0.94u6a0xpU3mNei4BsBxzWYIP2TDmHfP6TaXmETgp3zY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const NODES = [
  { id:"naxModul",     label:"Naxçıvan Modul Elektrik Stansiyası",  region:"Naxçıvan Şəhər",  type:"thermal",  icon:Zap,         color:"#f97316", sensors:{boilerTemp:420,steamPressure:14.2,output:82.1},     deltas:{boilerTemp:[2,0.5],steamPressure:[0.2,0.5],output:[0.8,0.5]} },
  { id:"arazHydro",    label:"Araz Su Elektrik Stansiyası",          region:"Ordubad Rayonu",  type:"hydro",    icon:Droplets,    color:"#0ea5e9", sensors:{waterLevel:22.4,turbineRpm:980,output:19.8},         deltas:{waterLevel:[0.1,0.5],turbineRpm:[15,0.5],output:[0.4,0.5]} },
  { id:"bilavHydro",   label:"Biləv Su Elektrik Stansiyası",         region:"Ordubad Rayonu",  type:"hydro",    icon:Droplets,    color:"#38bdf8", sensors:{waterLevel:18.1,turbineRpm:920,output:17.6},         deltas:{waterLevel:[0.1,0.5],turbineRpm:[12,0.5],output:[0.3,0.5]} },
  { id:"arpachay1",    label:"Arpaçay-1 Su Elektrik Stansiyası",     region:"Sədərək Rayonu",  type:"hydro",    icon:Droplets,    color:"#06b6d4", sensors:{waterLevel:16.5,turbineRpm:870,output:18.2},         deltas:{waterLevel:[0.1,0.5],turbineRpm:[10,0.5],output:[0.3,0.5]} },
  { id:"naxSolar",     label:"Naxçıvan Günəş Elektrik Stansiyası",   region:"Naxçıvan Şəhər",  type:"solar",    icon:Sun,         color:"#eab308", sensors:{panelTemp:52,output:19.4,efficiency:88},             deltas:{panelTemp:[0.4,0.5],output:[0.4,0.5],efficiency:[0.1,0.5]} },
  { id:"sherurSolar",  label:"Şərur Günəş Elektrik Stansiyası",      region:"Şərur Rayonu",    type:"solar",    icon:Sun,         color:"#f59e0b", sensors:{panelTemp:50,output:9.7,efficiency:88},              deltas:{panelTemp:[0.3,0.5],output:[0.2,0.5],efficiency:[0.1,0.5]} },
  { id:"kengerliSolar",label:"Kəngərli Günəş Elektrik Stansiyası",   region:"Kəngərli Rayonu", type:"solar",    icon:Sun,         color:"#fbbf24", sensors:{panelTemp:48,output:4.3,efficiency:86},              deltas:{panelTemp:[0.3,0.5],output:[0.15,0.5],efficiency:[0.1,0.5]} },
  { id:"arpachay2",    label:"Arpaçay-2 Su Elektrik Stansiyası",     region:"Sədərək Rayonu",  type:"hydro",    icon:Droplets,    color:"#67e8f9", sensors:{waterLevel:8.2,turbineRpm:620,output:1.1},           deltas:{waterLevel:[0.05,0.5],turbineRpm:[8,0.5],output:[0.05,0.5]} },
  { id:"culfaHybrid",  label:"Culfa Külək-Günəş Hibrid Stansiyası",  region:"Culfa Rayonu",    type:"wind",     icon:Wind,        color:"#10b981", sensors:{rpm:1120,bearingTemp:64,vibration:1.1,output:0.95},  deltas:{rpm:[18,0.5],bearingTemp:[0.4,0.45],vibration:[0.08,0.4],output:[0.04,0.5]} },
  { id:"culfaWind",    label:"Culfa Külək Elektrik Stansiyası",       region:"Culfa Rayonu",    type:"wind",     icon:Wind,        color:"#34d399", sensors:{rpm:980,bearingTemp:58,vibration:0.9,output:0.26},   deltas:{rpm:[15,0.5],bearingTemp:[0.3,0.45],vibration:[0.05,0.4],output:[0.02,0.5]} }
];

const REGIONS = [...new Set(NODES.map(n => n.region))];

const SERVICE_AREAS = {
  "Rayonlar": [
    "Naxçıvan Şəhər","Sədərək Rayonu","Şərur Rayonu","Kəngərli Rayonu",
    "Babək Rayonu","Şahbuz Rayonu","Culfa Rayonu","Ordubad Rayonu"
  ],
  "Stansiyalar": NODES.map(n => n.label)
};

const SEVERITY_MAP = {
  yüksək:{ color:"#ef4444", bg:"rgba(239,68,68,0.1)",   border:"rgba(239,68,68,0.35)",  label:"KRİTİK" },
  orta:  { color:"#f59e0b", bg:"rgba(245,158,11,0.1)",  border:"rgba(245,158,11,0.3)",  label:"DİQQƏT" },
  aşağı: { color:"#10b981", bg:"rgba(16,185,129,0.08)", border:"rgba(16,185,129,0.25)", label:"NORMAL" }
};

const DIST_ZONES = [
  { name:"Naxçıvan Şəhər", load:98, capacity:124, health:95 },
  { name:"Sədərək",        load:52, capacity:60,  health:88 },
  { name:"Şərur",          load:28, capacity:35,  health:92 },
  { name:"Kəngərli",       load:22, capacity:30,  health:97 },
  { name:"Babək",          load:26, capacity:80,  health:97 },
  { name:"Şahbuz",         load:56, capacity:67,  health:97 },
  { name:"Culfa",          load:48, capacity:80,  health:97 },
  { name:"Ordubad",        load:49, capacity:70,  health:97 }
];

const CONS_HISTORY = [
  {t:"00:00",i:45,p:44},{t:"04:00",i:38,p:39},{t:"08:00",i:62,p:61},
  {t:"12:00",i:78,p:76},{t:"16:00",i:72,p:74},{t:"20:00",i:85,p:83},{t:"İndi",i:67,p:69}
];

const ENERGY_SOURCES = [
  { name:"Modul (İstilik)",  cap:87,   cur:82.1,  eff:94, icon:Zap,      color:"#f97316" },
  { name:"Araz SES",         cap:22,   cur:19.8,  eff:90, icon:Droplets, color:"#0ea5e9" },
  { name:"Biləv SES",        cap:20,   cur:17.6,  eff:88, icon:Droplets, color:"#38bdf8" },
  { name:"Arpaçay-1 SES",    cap:20.5, cur:18.2,  eff:89, icon:Droplets, color:"#67e8f9" },
  { name:"Naxçıvan GES",     cap:22,   cur:19.4,  eff:88, icon:Sun,      color:"#eab308" },
  { name:"Şərur GES",        cap:11,   cur:9.7,   eff:88, icon:Sun,      color:"#f59e0b" },
  { name:"Kəngərli GES",     cap:5,    cur:4.3,   eff:86, icon:Sun,      color:"#fbbf24" },
  { name:"Arpaçay-2 + Culfa",cap:2.8,  cur:2.37,  eff:85, icon:Wind,     color:"#10b981" },
];

const TOTAL_CAPACITY = ENERGY_SOURCES.reduce((s,e) => s + e.cap, 0);

const INIT_STRATEGIES = [
  { id:1, title:"Günəş panellərinin yönümləndirilməsi", category:"Günəş Enerjisi", categoryColor:"#F59E0B", desc:"Naxçıvan və Şərur GES-lərinin 240 panelinin günəş izləmə sistemi ilə yönümləndirilməsi", impact:"+12.4% istehsal artımı", annualSavings:"486,000 ₼", energySaved:"1,215 MWh/il", co2Reduction:"487 ton/il", duration:"3-4 ay", priority:"Yüksək", priorityColor:"#ef4444", status:"Planlaşdırılıb", statusColor:"#f59e0b", roi:"14 ay", progress:0,  completed:false },
  { id:2, title:"Gecə saatlarında Modul stansiya yük azaldılması", category:"İstilik Stansiyası", categoryColor:"#ef4444", desc:"23:00-05:00 arasında Modul stansiyasının yükünün 60 MW-a endirilməsi", impact:"-8.3% yanacaq sərfi", annualSavings:"312,000 ₼", energySaved:"780 MWh/il", co2Reduction:"312 ton/il", duration:"2-3 həftə", priority:"Yüksək", priorityColor:"#ef4444", status:"İcradadır", statusColor:"#38bdf8", roi:"8 ay", progress:62, completed:false },
  { id:3, title:"Araz SES kabel izolyasiyası yenilənməsi", category:"Şəbəkə", categoryColor:"#3b82f6", desc:"Araz Su Elektrik Stansiyasının 12 km kabel seqmentinin yenilənməsi", impact:"-15.2% ötürmə itkisi", annualSavings:"228,000 ₼", energySaved:"570 MWh/il", co2Reduction:"228 ton/il", duration:"5-6 ay", priority:"Orta", priorityColor:"#f59e0b", status:"Planlaşdırılıb", statusColor:"#f59e0b", roi:"22 ay", progress:0,  completed:false },
  { id:4, title:"Culfa Hibrid stansiyası yağlama optimizasiyası", category:"Külək Enerjisi", categoryColor:"#06b6d4", desc:"Culfa külək turbinlərinin yağlama intervalının sensor məlumatlarına əsasən uzadılması", impact:"-22% texniki xidmət xərci", annualSavings:"96,000 ₼", energySaved:"240 MWh/il", co2Reduction:"96 ton/il", duration:"1 ay", priority:"Aşağı", priorityColor:"#10b981", status:"Tamamlandı", statusColor:"#10b981", roi:"6 ay", progress:100, completed:true },
  { id:5, title:"Biləv SES reaktiv güc kompensasiyası", category:"Şəbəkə", categoryColor:"#8b5cf6", desc:"Biləv SES şinindəki güc faktörünün kondensator batareyası ilə yüksəldilməsi", impact:"+9.8% şəbəkə səmərəliliyi", annualSavings:"174,000 ₼", energySaved:"435 MWh/il", co2Reduction:"174 ton/il", duration:"2-3 ay", priority:"Orta", priorityColor:"#f59e0b", status:"Planlaşdırılıb", statusColor:"#f59e0b", roi:"18 ay", progress:15, completed:false }
];

function normalizeRole(role) {
  if (!role) return "viewer";
  const map = { observer: "viewer", viewer: "viewer", operator: "operator", admin: "admin", vice_admin: "vice_admin" };
  return map[role] || "viewer";
}

const ROLES_DEF = [
  { id:"admin",       label:"Administrator",  color:"#ef4444", icon:Crown,   desc:"Tam idarəetmə hüququ" },
  { id:"vice_admin",  label:"Baş Müavin",    color:"#f97316", icon:Star,    desc:"Operator və müşahidəçilərə nəzarət" },
  { id:"operator",    label:"Operator",       color:"#f59e0b", icon:UserCog, desc:"Stansiyalar üzrə əməliyyat hüququ" },
  { id:"viewer",      label:"Müşahidəçi",     color:"#10b981", icon:Eye,     desc:"Yalnız baxış hüququ" }
];

const INIT_MESSAGES = [
  { id:1, fromId:"system", fromName:"Sistem", fromAvatar:"SY", fromRole:"admin", toId:null, toName:"Hamı", subject:"Sistemə Xoş Gəldiniz", body:"Naxçıvan Enerji İdarəetmə Sisteminə xoş gəldiniz. Hər hansı sualınız olarsa administratorla əlaqə saxlayın.", timestamp:new Date(Date.now()-86400000).toISOString(), readBy:[], priority:"normal", type:"broadcast" }
];

const INIT_DATA_ENTRIES = [];

function getPerms(user) {
  if (!user) return {};
  const r = user.role;
  return {
    isAdmin:           r === "admin",
    isViceAdmin:       r === "vice_admin",
    isOperator:        r === "operator",
    isViewer:          r === "viewer",
    canSeeAdminTab:    r === "admin" || r === "vice_admin",
    canManageOps:      r === "admin" || r === "vice_admin",
    canManageAdmins:   r === "admin",
    canEditStations:   r === "admin" || r === "vice_admin" || r === "operator",
    canEditStrategies: r === "admin" || r === "vice_admin" || r === "operator",
    canAddIncidents:   r === "admin" || r === "vice_admin" || r === "operator",
    canEnterData:      r === "admin" || r === "vice_admin" || r === "operator",
    readOnly:          r === "viewer",
    canSeeActivityLog: r === "admin",
    canBroadcast:      r === "admin",
    canDeleteEntries:  r === "admin"
  };
}

function useSensors() {
  const [data, setData] = useState(() => Object.fromEntries(NODES.map(n => [n.id, { ...n.sensors }])));
  useEffect(() => {
    const iv = setInterval(() => {
      setData(prev => {
        const next = { ...prev };
        NODES.forEach(node => {
          const s = { ...prev[node.id] };
          Object.keys(s).forEach(k => {
            const [range, bias] = node.deltas[k] || [0, 0.5];
            if (typeof s[k] === "number") s[k] = parseFloat((s[k] + (Math.random() - bias) * range).toFixed(3));
          });
          next[node.id] = s;
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(iv);
  }, []);
  return data;
}

function RoleBadge({ role, size="sm" }) {
  const rd = ROLES_DEF.find(r=>r.id===role)||ROLES_DEF[3];
  const Icon = rd.icon;
  const fs = size==="xs"?"0.52rem":size==="sm"?"0.58rem":"0.65rem";
  return (
    <span style={{fontSize:fs,color:rd.color,background:`${rd.color}12`,border:`1px solid ${rd.color}25`,borderRadius:4,padding:"1px 6px",display:"inline-flex",alignItems:"center",gap:3,fontWeight:800}}>
      <Icon size={size==="xs"?8:10}/> {rd.label}
    </span>
  );
}

function PermissionBanner({ message }) {
  return (
    <div style={{background:"rgba(249,115,22,0.08)",border:"1px solid rgba(249,115,22,0.25)",borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
      <Lock size={13} style={{color:"#f97316",flexShrink:0}}/>
      <span style={{fontSize:"0.72rem",color:"#fdba74"}}>{message}</span>
    </div>
  );
}

function relTime(iso) {
  const d = Date.now() - new Date(iso).getTime();
  const m = Math.floor(d/60000);
  if (m < 1) return "İndicə";
  if (m < 60) return `${m} dəq`;
  const h = Math.floor(m/60);
  if (h < 24) return `${h} saat`;
  return `${Math.floor(h/24)} gün`;
}

function DropdownOption({ opt, selected, onSelect }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onSelect} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{padding:"9px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,
        background:selected?"rgba(56,189,248,0.1)":hov?"rgba(255,255,255,0.03)":"transparent",
        borderLeft:`2px solid ${selected?"#38bdf8":"transparent"}`,transition:"all 0.15s"}}>
      {opt.colorDot&&<div style={{width:8,height:8,borderRadius:"50%",background:opt.colorDot,flexShrink:0,boxShadow:selected?`0 0 6px ${opt.colorDot}`:"none"}}/>}
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:"0.73rem",color:selected?"#f1f5f9":hov?"#cbd5e1":"#94a3b8",fontWeight:selected?700:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{opt.label}</div>
        {opt.sub&&<div style={{fontSize:"0.58rem",color:"#334155",marginTop:1}}>{opt.sub}</div>}
      </div>
      {selected&&<div style={{width:16,height:16,borderRadius:"50%",background:"rgba(56,189,248,0.15)",border:"1px solid rgba(56,189,248,0.4)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:"#38bdf8"}}/>
      </div>}
    </div>
  );
}

function DarkSelect({ value, onChange, options, placeholder, style, grouped, accentColor="#38bdf8" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const allOptions = grouped ? grouped.reduce((acc,g)=>[...acc,...g.options.map(o=>({...o,group:g.label}))],[]) : (options||[]);
  const selected = allOptions.find(o => o.value === value);
  return (
    <div ref={ref} style={{position:"relative",width:"100%",boxSizing:"border-box",...style}}>
      <button type="button" onClick={()=>setOpen(o=>!o)} style={{
        width:"100%",boxSizing:"border-box",
        background:open?"linear-gradient(135deg,rgba(8,16,30,0.99),rgba(4,10,22,0.99))":"linear-gradient(135deg,rgba(6,12,28,0.95),rgba(4,8,20,0.98))",
        border:`1px solid ${open?`${accentColor}60`:`${accentColor}20`}`,
        borderRadius:9,padding:"9px 36px 9px 12px",color:selected?"#e2e8f0":"#334155",
        fontSize:"0.76rem",cursor:"pointer",display:"flex",alignItems:"center",gap:8,
        transition:"all 0.2s",outline:"none",fontFamily:"inherit",
        position:"relative"
      }}>
        {selected?.colorDot&&<div style={{width:8,height:8,borderRadius:"50%",background:selected.colorDot,flexShrink:0}}/>}
        <span style={{flex:1,textAlign:"left",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
          {selected?selected.label:(placeholder||"— Seçin —")}
        </span>
        <ChevronDown size={13} style={{color:accentColor,flexShrink:0,position:"absolute",right:12,transition:"transform 0.2s",transform:open?"rotate(180deg)":"rotate(0deg)"}}/>
      </button>
      {open&&(
        <div style={{
          position:"absolute",top:"calc(100% + 4px)",left:0,right:0,
          background:"linear-gradient(160deg,rgba(6,12,28,0.99),rgba(4,8,20,0.99))",
          border:`1px solid ${accentColor}30`,borderRadius:10,zIndex:9999,maxHeight:280,overflowY:"auto",
          boxShadow:`0 16px 40px rgba(0,0,0,0.6),0 0 0 1px ${accentColor}10`,backdropFilter:"blur(20px)",
        }}>
          {grouped?grouped.map((group,gi)=>(
            <div key={gi}>
              <div style={{padding:"8px 14px 4px",fontSize:"0.55rem",color:accentColor,letterSpacing:"0.14em",fontWeight:800,borderBottom:`1px solid ${accentColor}12`,background:`${accentColor}04`}}>{group.label}</div>
              {group.options.map((opt,oi)=><DropdownOption key={oi} opt={opt} selected={value===opt.value} onSelect={()=>{onChange(opt.value);setOpen(false);}}/>)}
            </div>
          )):(options||[]).map((opt,i)=>(
            <DropdownOption key={i} opt={opt} selected={value===opt.value} onSelect={()=>{onChange(opt.value);setOpen(false);}}/>
          ))}
        </div>
      )}
    </div>
  );
}

function EnergyChart({ data }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{background:"rgba(4,8,20,0.97)",border:"1px solid rgba(56,189,248,0.25)",borderRadius:10,padding:"10px 14px",boxShadow:"0 8px 24px rgba(0,0,0,0.5)"}}>
          <div style={{fontSize:"0.65rem",color:"#64748b",marginBottom:6,fontWeight:600}}>{label}</div>
          {payload.map((p,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
              <div style={{width:8,height:8,borderRadius:2,background:p.color}}/>
              <span style={{fontSize:"0.68rem",color:"#94a3b8"}}>{p.name}:</span>
              <span style={{fontSize:"0.72rem",fontWeight:800,color:p.color}}>{p.value} MW</span>
            </div>
          ))}
          {payload.length===2&&(
            <div style={{fontSize:"0.62rem",color:"#334155",marginTop:6,paddingTop:6,borderTop:"1px solid rgba(255,255,255,0.05)"}}>
              Balans: <span style={{color: payload[0].value >= payload[1].value ? "#10b981":"#ef4444", fontWeight:700}}>
                {(payload[0].value - payload[1].value).toFixed(1)} MW
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{position:"relative"}}>
      <div style={{display:"flex",gap:16,marginBottom:14}}>
        {[["#38bdf8","İstehsal"],["#f59e0b","İstehlak"]].map(([col,lbl])=>(
          <div key={lbl} style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:24,height:2,background:col,borderRadius:99}}/>
            <span style={{fontSize:"0.62rem",color:"#64748b"}}>{lbl}</span>
          </div>
        ))}
        <div style={{marginLeft:"auto",fontSize:"0.62rem",color:"#334155",display:"flex",alignItems:"center",gap:4}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:"#10b981"}}/>
          Real vaxt
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{top:8,right:8,bottom:0,left:0}}>
          <defs>
            <linearGradient id="gradI" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.25}/>
              <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.02}/>
            </linearGradient>
            <linearGradient id="gradP" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.2}/>
              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.02}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 6" stroke="rgba(148,163,184,0.06)" horizontal={true} vertical={false}/>
          <XAxis dataKey="t" tick={{fontSize:10,fill:"#475569",fontFamily:"inherit"}} axisLine={{stroke:"rgba(255,255,255,0.06)"}} tickLine={false} dy={6}/>
          <YAxis tick={{fontSize:10,fill:"#475569",fontFamily:"inherit"}} axisLine={false} tickLine={false} width={32}/>
          <Tooltip content={<CustomTooltip/>}/>
          <Area type="monotoneX" dataKey="i" stroke="#38bdf8" strokeWidth={2} fill="url(#gradI)" name="İstehsal" activeDot={{r:5,fill:"#38bdf8",stroke:"rgba(4,8,20,0.8)",strokeWidth:2}}/>
          <Area type="monotoneX" dataKey="p" stroke="#f59e0b" strokeWidth={2} fill="url(#gradP)" name="İstehlak" activeDot={{r:5,fill:"#f59e0b",stroke:"rgba(4,8,20,0.8)",strokeWidth:2}}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function ManualDataEntryPanel({ currentUser, perms, sensors, setSensorOverrides, dataEntries, setDataEntries }) {
  const [targetType, setTargetType] = useState("station");
  const [selectedStation, setStation] = useState("");
  const [selectedZone, setZone] = useState("");
  const [fieldKey, setFieldKey] = useState("");
  const [fieldValue, setFieldValue] = useState("");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const userArea = currentUser?.serviceArea || "";
  const isAllAccess = userArea === "Bütün Ərazilər" || perms.isAdmin || perms.isViceAdmin;

  const accessibleStations = NODES.filter(n => {
    if (isAllAccess) return true;
    return n.label === userArea || n.region === userArea;
  });

  const accessibleZones = DIST_ZONES.filter(z => {
    if (isAllAccess) return true;
    return z.name === userArea || userArea.includes(z.name) || z.name.includes(userArea.replace(" Rayonu","").replace(" Şəhər",""));
  });

  const stationOpts = accessibleStations.map(n=>({value:n.id, label:n.label, colorDot:n.color}));
  const zoneOpts = accessibleZones.map(z=>({value:z.name, label:z.name, colorDot:"#38bdf8"}));

  const selectedNode = NODES.find(n=>n.id===selectedStation);
  const sensorLabels = {
    boilerTemp:"Qazan Temperaturu (°C)",steamPressure:"Buxar Təzyiqi (MPa)",output:"Çıxış Gücü (MW)",
    waterLevel:"Su Səviyyəsi (m)",turbineRpm:"Türbin RPM",panelTemp:"Panel Temperaturu (°C)",
    efficiency:"Səmərəlilik (%)",rpm:"Fırlanma (RPM)",bearingTemp:"Yataq Temperaturu (°C)",vibration:"Vibrasiya (mm/s)"
  };
  const zoneFieldLabels = { load:"Yük (MW)", capacity:"Güc (MW)", health:"Sağlamlıq (%)" };

  const stationFieldOpts = selectedNode ? Object.keys(selectedNode.sensors).map(k=>({value:k, label:sensorLabels[k]||k})) : [];
  const zoneFieldOpts = Object.entries(zoneFieldLabels).map(([k,v])=>({value:k, label:v}));

  const inp = {width:"100%",boxSizing:"border-box",background:"linear-gradient(135deg,rgba(6,12,28,0.95),rgba(4,8,20,0.98))",border:"1px solid rgba(56,189,248,0.18)",borderRadius:9,padding:"9px 12px",color:"#e2e8f0",fontSize:"0.76rem",fontFamily:"inherit",outline:"none"};

  const handleSubmit = () => {
    setError("");
    if (targetType==="station" && (!selectedStation || !fieldKey || fieldValue==="")) { setError("Stansiyanı, sahəni və dəyəri doldurun."); return; }
    if (targetType==="grid" && (!selectedZone || !fieldKey || fieldValue==="")) { setError("Zonu, sahəni və dəyəri doldurun."); return; }
    const numVal = parseFloat(fieldValue);
    if (isNaN(numVal)) { setError("Dəyər rəqəm olmalıdır."); return; }
    if (targetType==="station") { setSensorOverrides(prev => ({...prev,[selectedStation]:{...(prev[selectedStation]||{}),[fieldKey]:numVal}})); }
    const label = targetType==="station" ? NODES.find(n=>n.id===selectedStation)?.label : selectedZone;
    const fLabel = targetType==="station" ? (sensorLabels[fieldKey]||fieldKey) : (zoneFieldLabels[fieldKey]||fieldKey);
    setDataEntries(prev => [{id:Date.now(),timestamp:new Date().toISOString(),actor:currentUser.name,actorRole:currentUser.role,targetType,target:label,field:fLabel,value:numVal,note,color:targetType==="station"?(NODES.find(n=>n.id===selectedStation)?.color||"#38bdf8"):"#38bdf8"}, ...prev]);
    setFieldValue(""); setNote(""); setSaved(true); setTimeout(()=>setSaved(false), 2500);
  };

  if (!perms.canEnterData) return <PermissionBanner message="Məlumat daxil etmək üçün Operator və ya yuxarı hüquq lazımdır."/>;

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
        <PenLine size={16} style={{color:"#38bdf8"}}/>
        <h3 style={{color:"#f1f5f9",fontSize:"0.85rem",fontWeight:800,margin:0}}>Manuel Məlumat Daxiletmə</h3>
      </div>
      {!isAllAccess && (<div style={{background:"rgba(56,189,248,0.06)",border:"1px solid rgba(56,189,248,0.15)",borderRadius:8,padding:"8px 12px",marginBottom:14,fontSize:"0.66rem",color:"#7dd3fc",display:"flex",alignItems:"center",gap:6}}><Shield size={11}/> Xidmət sahəniz: <strong>{userArea}</strong></div>)}
      {saved&&<div style={{background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.25)",borderRadius:8,padding:"8px 12px",marginBottom:12,fontSize:"0.72rem",color:"#34d399",display:"flex",alignItems:"center",gap:6}}><CheckCircle size={12}/> Məlumat uğurla qeydə alındı</div>}
      {error&&<div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:8,padding:"8px 12px",marginBottom:12,fontSize:"0.7rem",color:"#fca5a5"}}>{error}</div>}
      <div style={{display:"flex",gap:6,marginBottom:14}}>
        {[{k:"station",l:"Stansiya",Icon:Cpu},{k:"grid",l:"Şəbəkə Zonu",Icon:Activity}].map(({k,l,Icon})=>(
          <button key={k} onClick={()=>{setTargetType(k);setFieldKey("");setStation("");setZone("");}} style={{flex:1,padding:"8px",borderRadius:8,border:`1px solid ${targetType===k?"rgba(56,189,248,0.4)":"rgba(56,189,248,0.1)"}`,background:targetType===k?"rgba(56,189,248,0.12)":"transparent",color:targetType===k?"#38bdf8":"#475569",cursor:"pointer",fontSize:"0.68rem",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
            <Icon size={12}/>{l}
          </button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {targetType==="station" ? (
          <><DarkSelect value={selectedStation} onChange={(v)=>{setStation(v);setFieldKey("");}} options={stationOpts} placeholder="Stansiyanı seçin"/>
          {selectedStation&&<DarkSelect value={fieldKey} onChange={setFieldKey} options={stationFieldOpts} placeholder="Sensor sahəsini seçin"/>}</>
        ):(
          <><DarkSelect value={selectedZone} onChange={(v)=>{setZone(v);setFieldKey("");}} options={zoneOpts} placeholder="Zonu seçin"/>
          {selectedZone&&<DarkSelect value={fieldKey} onChange={setFieldKey} options={zoneFieldOpts} placeholder="Sahəni seçin"/>}</>
        )}
        {fieldKey&&(<>
          <input type="number" step="0.01" placeholder="Yeni dəyər" value={fieldValue} onChange={e=>setFieldValue(e.target.value)} style={inp}/>
          <textarea placeholder="Qeyd (ixtiyari)" value={note} onChange={e=>setNote(e.target.value)} rows={2} style={{...inp,resize:"none"}}/>
          <button onClick={handleSubmit} style={{padding:"10px",borderRadius:9,background:"linear-gradient(135deg,rgba(56,189,248,0.18),rgba(14,165,233,0.1))",border:"1px solid rgba(56,189,248,0.35)",color:"#38bdf8",fontWeight:800,fontSize:"0.76rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <Save size={13}/> Yadda Saxla
          </button>
        </>)}
      </div>
      {dataEntries.length > 0 && (
        <div style={{marginTop:18}}>
          <div style={{fontSize:"0.65rem",color:"#475569",fontWeight:700,marginBottom:10,display:"flex",alignItems:"center",gap:6}}><ClipboardList size={11}/> SON DƏYİŞİKLİKLƏR</div>
          <div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:220,overflowY:"auto"}}>
            {dataEntries.slice(0,10).map(e=>(
              <div key={e.id} style={{display:"flex",gap:8,alignItems:"flex-start",padding:"8px 10px",background:"rgba(255,255,255,0.02)",borderRadius:8,border:`1px solid ${e.color}18`}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:e.color,marginTop:5,flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:"0.65rem",color:"#94a3b8"}}><span style={{color:"#e2e8f0",fontWeight:700}}>{e.target}</span> · {e.field}</div>
                  <div style={{fontSize:"0.7rem",color:e.color,fontWeight:800,marginTop:1}}>→ {e.value}</div>
                  {e.note&&<div style={{fontSize:"0.58rem",color:"#475569",marginTop:2,fontStyle:"italic"}}>{e.note}</div>}
                  <div style={{fontSize:"0.58rem",color:"#334155",marginTop:2}}>{e.actor} · {relTime(e.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AuthScreen({ onLogin, onRegister }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [requestedRole, setRole] = useState("viewer");
  const [serviceArea, setArea] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const groupedAreas = [
    { label:"RAYONLAR", options: SERVICE_AREAS["Rayonlar"].map(v=>({value:v,label:v,colorDot:"#3b82f6"})) },
    { label:"STANSIYALAR", options: SERVICE_AREAS["Stansiyalar"].map(v=>({value:v,label:v,colorDot:"#10b981"})) }
  ];
  const roleOpts = ROLES_DEF.filter(r=>r.id!=="admin"&&r.id!=="vice_admin").map(r=>({value:r.id,label:r.label,colorDot:r.color,sub:r.desc}));
  const inp = {width:"100%",boxSizing:"border-box",background:"linear-gradient(135deg,rgba(6,12,28,0.95),rgba(4,8,20,0.98))",border:"1px solid rgba(56,189,248,0.18)",borderRadius:9,padding:"9px 12px",color:"#e2e8f0",fontSize:"0.76rem",fontFamily:"inherit",outline:"none"};

  const submit = async () => {
    setError("");
    setLoading(true);
    if (mode==="login") {
      const res = await onLogin(username, password);
      if (!res.ok) setError(res.msg);
    } else {
      if (!username||!password||!name||!email||!serviceArea) { setError("Bütün sahələri doldurun."); setLoading(false); return; }
      const res = await onRegister({ username,password,name,email,requestedRole,serviceArea,note });
      if (res && res.error) { setError(res.error); setLoading(false); return; }
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#020610,#030915)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center",padding:40}}>
        <CheckCircle size={52} style={{color:"#10b981",marginBottom:16}}/>
        <h2 style={{color:"#f1f5f9",fontWeight:800,marginBottom:8}}>Müraciətiniz Qeydə Alındı</h2>
        <p style={{color:"#64748b",fontSize:"0.8rem",maxWidth:300,margin:"0 auto 24px"}}>Administrator hesabınızı yoxlayıb icazə verdikdən sonra daxil ola biləcəksiniz.</p>
        <button onClick={()=>{setMode("login");setSuccess(false);}} style={{background:"linear-gradient(135deg,rgba(56,189,248,0.15),rgba(14,165,233,0.08))",border:"1px solid rgba(56,189,248,0.3)",borderRadius:8,padding:"9px 22px",color:"#38bdf8",cursor:"pointer",fontSize:"0.76rem"}}>Giriş Səhifəsinə Qayıt</button>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#020610,#030915)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter',system-ui,sans-serif"}}>
      <div style={{width:420,background:"linear-gradient(135deg,rgba(6,12,28,0.9),rgba(4,8,20,0.95))",border:"1px solid rgba(56,189,248,0.15)",borderRadius:18,padding:36,backdropFilter:"blur(20px)"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:52,height:52,borderRadius:14,background:"linear-gradient(135deg,rgba(56,189,248,0.2),rgba(14,165,233,0.1))",border:"1px solid rgba(56,189,248,0.3)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
            <Zap size={26} style={{color:"#38bdf8"}}/>
          </div>
          <h1 style={{color:"#f1f5f9",fontSize:"1.1rem",fontWeight:900,marginBottom:4}}>Naxçıvan Enerji İdarəetmə Sistemi</h1>
          <p style={{color:"#334155",fontSize:"0.7rem"}}>{mode==="login"?"Hesabınıza daxil olun":"Yeni hesab tələb edin"}</p>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:22}}>
          {[{k:"login",l:"Giriş",Icon:LogIn},{k:"register",l:"Qeydiyyat",Icon:UserPlus}].map(({k,l,Icon})=>(
            <button key={k} onClick={()=>{setMode(k);setError("");}} style={{flex:1,padding:"8px",borderRadius:8,border:`1px solid ${mode===k?"rgba(56,189,248,0.4)":"rgba(56,189,248,0.1)"}`,background:mode===k?"rgba(56,189,248,0.12)":"transparent",color:mode===k?"#38bdf8":"#475569",cursor:"pointer",fontSize:"0.72rem",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              <Icon size={13}/>{l}
            </button>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {mode==="register"&&<input placeholder="Ad Soyad" value={name} onChange={e=>setName(e.target.value)} style={inp}/>}
          <input placeholder="İstifadəçi adı" value={username} onChange={e=>setUsername(e.target.value)} style={inp}/>
          {mode==="register"&&<input placeholder="E-poçt" type="email" value={email} onChange={e=>setEmail(e.target.value)} style={inp}/>}
          <input placeholder="Şifrə" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={inp} onKeyDown={e=>e.key==="Enter"&&submit()}/>
          {mode==="register"&&<>
            <DarkSelect value={requestedRole} onChange={setRole} options={roleOpts} placeholder="Rol seçin"/>
            <DarkSelect value={serviceArea} onChange={setArea} placeholder="Xidmət sahəsi seçin" grouped={groupedAreas}/>
            <textarea placeholder="Qeyd (ixtiyari)" value={note} onChange={e=>setNote(e.target.value)} rows={2} style={{...inp,resize:"none"}}/>
          </>}
          {error&&<div style={{color:"#ef4444",fontSize:"0.7rem",textAlign:"center",background:"rgba(239,68,68,0.08)",borderRadius:7,padding:"8px 12px"}}>{error}</div>}
          <button onClick={submit} disabled={loading} style={{width:"100%",padding:"11px",borderRadius:10,background:"linear-gradient(135deg,rgba(56,189,248,0.18),rgba(14,165,233,0.1))",border:"1px solid rgba(56,189,248,0.35)",color:"#38bdf8",fontWeight:800,fontSize:"0.8rem",cursor:loading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,opacity:loading?0.6:1}}>
            {loading ? <RefreshCw size={14} style={{animation:"spin 1s linear infinite"}}/> : mode==="login"?<><LogIn size={14}/>Daxil Ol</>:<><UserPlus size={14}/>Müraciət Et</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function MessagingPanel({ currentUser, users, messages, onSend, perms }) {
  const [tab, setTab] = useState("inbox");
  const [compose, setCompose] = useState(false);
  const [recipient, setRec] = useState("broadcast");
  const [subject, setSubj] = useState("");
  const [body, setBody] = useState("");
  const [priority, setPri] = useState("normal");
  const [viewing, setView] = useState(null);
  const inp = {width:"100%",boxSizing:"border-box",background:"linear-gradient(135deg,rgba(6,12,28,0.95),rgba(4,8,20,0.98))",border:"1px solid rgba(56,189,248,0.18)",borderRadius:9,padding:"9px 12px",color:"#e2e8f0",fontSize:"0.76rem",fontFamily:"inherit",outline:"none"};
  const myMessages = messages.filter(m=>{
    if(tab==="inbox") return m.toId===currentUser.id || (m.type==="broadcast"&&m.fromId!==currentUser.id);
    if(tab==="sent")  return m.fromId===currentUser.id;
    return false;
  });
  const unread = messages.filter(m=>(m.toId===currentUser.id||(m.type==="broadcast"&&m.fromId!==currentUser.id))&&!(m.readBy||[]).includes(currentUser.id)).length;
  const recipientOpts = [
    ...(perms.canBroadcast?[{value:"broadcast",label:"📢 Hər Kəs (Broadcast)",colorDot:"#f97316"}]:[]),
    ...users.filter(u=>u.id!==currentUser.id).map(u=>({value:String(u.id),label:`${u.name}`,sub:ROLES_DEF.find(r=>r.id===u.role)?.label,colorDot:ROLES_DEF.find(r=>r.id===u.role)?.color||"#64748b"}))
  ];
  const handleSend = () => {
    if (!subject||!body) return;
    const isBroadcast = recipient==="broadcast";
    const toUser = isBroadcast?null:users.find(u=>String(u.id)===recipient);
    onSend({fromId:currentUser.id,fromName:currentUser.name,fromAvatar:currentUser.avatar,fromRole:currentUser.role,toId:isBroadcast?null:(toUser?.id||null),toName:isBroadcast?"Hamı":(toUser?.name||""),subject,body,priority,type:isBroadcast?"broadcast":"direct"});
    setCompose(false); setSubj(""); setBody(""); setRec("broadcast"); setPri("normal");
  };
  if (viewing) {
    const msg = messages.find(m=>m.id===viewing);
    if (!msg) { setView(null); return null; }
    return (
      <div style={{color:"#94a3b8"}}>
        <button onClick={()=>setView(null)} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",color:"#38bdf8",cursor:"pointer",fontSize:"0.72rem",marginBottom:16}}><ArrowLeft size={13}/> Geri</button>
        <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(56,189,248,0.12)",borderRadius:12,padding:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div>
              <h3 style={{color:"#f1f5f9",fontSize:"0.9rem",fontWeight:800,margin:0}}>{msg.subject}</h3>
              <div style={{fontSize:"0.65rem",color:"#475569",marginTop:4}}><span style={{color:"#94a3b8"}}>{msg.fromName}</span> → <span style={{color:"#94a3b8"}}>{msg.toName||"Hamı"}</span>{" · "}{relTime(msg.timestamp)}</div>
            </div>
            {msg.priority==="high"&&<span style={{fontSize:"0.58rem",color:"#ef4444",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:4,padding:"2px 8px",fontWeight:800}}>TƏCİLİ</span>}
          </div>
          <p style={{fontSize:"0.78rem",lineHeight:1.7,color:"#cbd5e1",whiteSpace:"pre-wrap"}}>{msg.body}</p>
        </div>
      </div>
    );
  }
  if (compose) return (
    <div style={{color:"#94a3b8"}}>
      <button onClick={()=>setCompose(false)} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",color:"#38bdf8",cursor:"pointer",fontSize:"0.72rem",marginBottom:16}}><ArrowLeft size={13}/> Geri</button>
      <h3 style={{color:"#f1f5f9",fontSize:"0.85rem",fontWeight:800,marginBottom:16}}>Yeni Mesaj</h3>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <DarkSelect value={recipient} onChange={setRec} options={recipientOpts} placeholder="Alıcı seçin"/>
        <input placeholder="Mövzu" value={subject} onChange={e=>setSubj(e.target.value)} style={inp}/>
        <textarea placeholder="Mesaj mətni..." value={body} onChange={e=>setBody(e.target.value)} rows={6} style={{...inp,resize:"vertical"}}/>
        <DarkSelect value={priority} onChange={setPri} options={[{value:"normal",label:"Normal",colorDot:"#10b981"},{value:"high",label:"Təcili",colorDot:"#ef4444"}]} placeholder="Prioritet"/>
        <button onClick={handleSend} style={{padding:"10px",borderRadius:9,background:"linear-gradient(135deg,rgba(56,189,248,0.18),rgba(14,165,233,0.1))",border:"1px solid rgba(56,189,248,0.35)",color:"#38bdf8",fontWeight:800,fontSize:"0.76rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Send size={13}/> Göndər</button>
      </div>
    </div>
  );
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h3 style={{color:"#f1f5f9",fontSize:"0.85rem",fontWeight:800,margin:0}}>Mesajlar</h3>
        <button onClick={()=>setCompose(true)} style={{padding:"6px 14px",borderRadius:8,background:"rgba(56,189,248,0.1)",border:"1px solid rgba(56,189,248,0.25)",color:"#38bdf8",fontSize:"0.65rem",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}><Plus size={11}/> Yeni</button>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:14}}>
        {[{k:"inbox",l:"Gələnlər",Icon:Inbox},{k:"sent",l:"Göndərilənlər",Icon:Send}].map(({k,l,Icon})=>(
          <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"7px",borderRadius:7,border:`1px solid ${tab===k?"rgba(56,189,248,0.35)":"rgba(56,189,248,0.1)"}`,background:tab===k?"rgba(56,189,248,0.1)":"transparent",color:tab===k?"#38bdf8":"#475569",cursor:"pointer",fontSize:"0.65rem",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
            <Icon size={11}/>{l}{k==="inbox"&&unread>0&&<span style={{background:"#ef4444",color:"#fff",fontSize:"0.5rem",borderRadius:"50%",width:14,height:14,display:"inline-flex",alignItems:"center",justifyContent:"center",fontWeight:900}}>{unread}</span>}
          </button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {myMessages.length===0&&<div style={{color:"#334155",fontSize:"0.72rem",textAlign:"center",padding:"20px 0"}}>Mesaj yoxdur</div>}
        {myMessages.map(msg=>{
          const isUnread = !(msg.readBy||[]).includes(currentUser.id)&&tab==="inbox";
          return (
            <div key={msg.id} onClick={()=>setView(msg.id)} style={{background:isUnread?"rgba(56,189,248,0.06)":"rgba(255,255,255,0.02)",border:`1px solid ${isUnread?"rgba(56,189,248,0.2)":"rgba(56,189,248,0.08)"}`,borderRadius:9,padding:"10px 12px",cursor:"pointer"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                <span style={{fontSize:"0.72rem",fontWeight:isUnread?800:600,color:isUnread?"#f1f5f9":"#94a3b8"}}>{msg.subject}</span>
                <span style={{fontSize:"0.6rem",color:"#334155"}}>{relTime(msg.timestamp)}</span>
              </div>
              <div style={{fontSize:"0.62rem",color:"#475569"}}>{tab==="inbox"?msg.fromName:msg.toName||"Hamı"} {msg.type==="broadcast"&&<span style={{color:"#f97316",fontSize:"0.55rem"}}>[Broadcast]</span>}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StrategyModal({ onClose, onSave, initial }) {
  const isEdit = !!initial;
  const [title, setTitle] = useState(initial?.title||"");
  const [cat, setCat] = useState(initial?.category||"Şəbəkə");
  const [pri, setPri] = useState(initial?.priority||"Orta");
  const [status, setStatus] = useState(initial?.status||"Planlaşdırılıb");
  const [desc, setDesc] = useState(initial?.desc||"");
  const [roi, setRoi] = useState(initial?.roi||"");
  const [dur, setDur] = useState(initial?.duration||"");
  const [savings, setSav] = useState(initial?.annualSavings||"");
  const [impact, setImp] = useState(initial?.impact||"");
  const inp = {width:"100%",boxSizing:"border-box",background:"linear-gradient(135deg,rgba(6,12,28,0.95),rgba(4,8,20,0.98))",border:"1px solid rgba(56,189,248,0.18)",borderRadius:9,padding:"9px 12px",color:"#e2e8f0",fontSize:"0.76rem",fontFamily:"inherit",outline:"none"};
  const catOpts = ["Şəbəkə","Günəş Enerjisi","İstilik Stansiyası","Su Enerjisi","Külək Enerjisi"].map(v=>({value:v,label:v}));
  const priOpts = [{value:"Yüksək",label:"Yüksək",colorDot:"#ef4444"},{value:"Orta",label:"Orta",colorDot:"#f59e0b"},{value:"Aşağı",label:"Aşağı",colorDot:"#10b981"}];
  const statusOpts = [{value:"Planlaşdırılıb",label:"Planlaşdırılıb",colorDot:"#f59e0b"},{value:"İcradadır",label:"İcradadır",colorDot:"#38bdf8"},{value:"Tamamlandı",label:"Tamamlandı",colorDot:"#10b981"}];
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(6px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:520,background:"linear-gradient(135deg,rgba(6,12,28,0.98),rgba(4,8,20,0.99))",border:"1px solid rgba(56,189,248,0.2)",borderRadius:16,padding:28,maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h3 style={{color:"#f1f5f9",fontSize:"0.9rem",fontWeight:800,margin:0}}>{isEdit?"Strategiyanı Düzəlt":"Yeni Strategiya"}</h3>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#475569",cursor:"pointer"}}><X size={16}/></button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <input placeholder="Başlıq" value={title} onChange={e=>setTitle(e.target.value)} style={inp}/>
          <input placeholder="Təsvir" value={desc} onChange={e=>setDesc(e.target.value)} style={inp}/>
          <DarkSelect value={cat} onChange={setCat} options={catOpts} placeholder="Kateqoriya"/>
          <DarkSelect value={pri} onChange={setPri} options={priOpts} placeholder="Prioritet"/>
          <DarkSelect value={status} onChange={setStatus} options={statusOpts} placeholder="Status"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <input placeholder="ROI müddəti" value={roi} onChange={e=>setRoi(e.target.value)} style={inp}/>
            <input placeholder="Müddət" value={dur} onChange={e=>setDur(e.target.value)} style={inp}/>
          </div>
          <input placeholder="İllik qənaət (₼)" value={savings} onChange={e=>setSav(e.target.value)} style={inp}/>
          <input placeholder="Təsir (+X% / -Y%)" value={impact} onChange={e=>setImp(e.target.value)} style={inp}/>
          <div style={{display:"flex",gap:10,marginTop:4}}>
            <button onClick={onClose} style={{flex:1,padding:"10px",borderRadius:9,border:"1px solid rgba(100,116,139,0.25)",background:"transparent",color:"#475569",cursor:"pointer",fontSize:"0.76rem"}}>Ləğv Et</button>
            <button onClick={()=>onSave({title,category:cat,categoryColor:"#3b82f6",desc,roi,duration:dur,annualSavings:savings,impact,priority:pri,priorityColor:pri==="Yüksək"?"#ef4444":pri==="Orta"?"#f59e0b":"#10b981",status,statusColor:status==="Tamamlandı"?"#10b981":status==="İcradadır"?"#38bdf8":"#f59e0b",energySaved:"",co2Reduction:"",progress:0,completed:false})} style={{flex:1,padding:"10px",borderRadius:9,border:"1px solid rgba(56,189,248,0.35)",background:"rgba(56,189,248,0.12)",color:"#38bdf8",cursor:"pointer",fontSize:"0.76rem",fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              <Save size={13}/>{isEdit?"Yenilə":"Əlavə Et"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ManualIncidentPanel({ perms, onAddAlert }) {
  const [station, setStation] = useState(NODES[0].id);
  const [component, setComp] = useState("");
  const [severity, setSev] = useState("orta");
  const [message, setMsg] = useState("");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const stationOpts = NODES.map(n=>({value:n.id,label:n.label,colorDot:n.color}));
  const sevOpts = [{value:"yüksək",label:"Kritik",colorDot:"#ef4444"},{value:"orta",label:"Diqqət",colorDot:"#f59e0b"},{value:"aşağı",label:"Normal",colorDot:"#10b981"}];
  const inp = {width:"100%",boxSizing:"border-box",background:"linear-gradient(135deg,rgba(6,12,28,0.95),rgba(4,8,20,0.98))",border:"1px solid rgba(56,189,248,0.18)",borderRadius:9,padding:"9px 12px",color:"#e2e8f0",fontSize:"0.76rem",fontFamily:"inherit",outline:"none"};
  const submit = () => {
    if (!component||!message) return;
    const node = NODES.find(n=>n.id===station);
    onAddAlert({node:node?.label||station,component,severity,message,note,time:new Date().toLocaleTimeString("az-AZ")});
    setComp(""); setMsg(""); setNote(""); setSaved(true); setTimeout(()=>setSaved(false), 2500);
  };
  if (!perms.canAddIncidents) return <PermissionBanner message="Hadisə əlavə etmək üçün Operator, Baş Müavin və ya Administrator hüququ lazımdır."/>;
  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}><FileWarning size={16} style={{color:"#f97316"}}/><h3 style={{color:"#f1f5f9",fontSize:"0.85rem",fontWeight:800,margin:0}}>Hadisə Qeydiyyatı</h3></div>
      {saved&&<div style={{background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.25)",borderRadius:8,padding:"8px 12px",marginBottom:12,fontSize:"0.72rem",color:"#34d399",display:"flex",alignItems:"center",gap:6}}><CheckCircle size={12}/> Hadisə qeydə alındı</div>}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <DarkSelect value={station} onChange={setStation} options={stationOpts} placeholder="Stansiyanı seçin" accentColor="#f97316"/>
        <input placeholder="Komponent (məs: Türbin-A, Kabel-3)" value={component} onChange={e=>setComp(e.target.value)} style={inp}/>
        <DarkSelect value={severity} onChange={setSev} options={sevOpts} placeholder="Səviyyə" accentColor="#f97316"/>
        <input placeholder="Qısa mesaj" value={message} onChange={e=>setMsg(e.target.value)} style={inp}/>
        <textarea placeholder="Ətraflı qeyd (ixtiyari)" value={note} onChange={e=>setNote(e.target.value)} rows={3} style={{...inp,resize:"none"}}/>
        <button onClick={submit} style={{padding:"10px",borderRadius:9,background:"linear-gradient(135deg,rgba(249,115,22,0.18),rgba(249,115,22,0.08))",border:"1px solid rgba(249,115,22,0.35)",color:"#f97316",fontWeight:800,fontSize:"0.76rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Plus size={13}/> Hadisə Əlavə Et</button>
      </div>
    </div>
  );
}

function AdminPanel({ currentUser, users, setUsers, pending, setPending, activityLog, setActivityLog, perms }) {
  const [sub, setSub] = useState("users");
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  const logAction = (action, target, details, color="#10b981") => {
    setActivityLog(prev => [{id:Date.now(),timestamp:new Date().toISOString(),actorName:currentUser.name,actorRole:currentUser.role,action,target,details,color}, ...prev]);
  };

  const approve = async (req) => {
    const roleToSave = normalizeRole(req.requestedRole || req.role);
    const { error } = await supabase.from('users').update({ status: 'approved', role: roleToSave }).eq('id', req.id);
    if (error) { console.error("Approve error:", error); return; }
    const newUser = {
      id: req.id, username: req.username, password: req.password,
      name: req.name || req.full_name, role: roleToSave, email: req.email,
      createdAt: new Date().toISOString().split("T")[0], status: "active",
      avatar: (req.name || req.full_name || "??").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(),
      serviceArea: req.serviceArea || req.service_region || "Bütün Ərazilər"
    };
    setUsers(prev => [...prev, newUser]);
    setPending(prev => prev.filter(p => p.id !== req.id));
    logAction("approve", req.name || req.full_name, `${ROLES_DEF.find(r=>r.id===roleToSave)?.label} kimi təsdiqləndi`, "#10b981");
  };

  const reject = async (req) => {
    const { error } = await supabase.from('users').update({ status: 'rejected' }).eq('id', req.id);
    if (error) { console.error("Reject error:", error); return; }
    setPending(prev => prev.filter(p => p.id !== req.id));
    logAction("reject", req.name || req.full_name, "Qeydiyyat tələbi rədd edildi", "#ef4444");
  };

  const blockUser = async (u) => {
    const newStatus = u.status === "active" ? "blocked" : "active";
    await supabase.from('users').update({ status: newStatus }).eq('id', u.id);
    setUsers(prev => prev.map(x => x.id===u.id ? {...x,status:newStatus} : x));
    logAction(u.status==="active"?"block":"unblock", u.name, u.status==="active"?"Hesab bloklandı":"Hesab blokdan çıxarıldı", u.status==="active"?"#ef4444":"#10b981");
  };

  const changeRole = async (u, role) => {
    const oldRole = ROLES_DEF.find(r=>r.id===u.role)?.label;
    const newRoleLabel = ROLES_DEF.find(r=>r.id===role)?.label;
    await supabase.from('users').update({ role }).eq('id', u.id);
    setUsers(prev => prev.map(x => x.id===u.id ? {...x,role} : x));
    logAction("role_change", u.name, `Rol dəyişdirildi: ${oldRole} → ${newRoleLabel}`, "#f97316");
    setEditingUser(null);
  };

  const availableRoles = perms.canManageAdmins ? ROLES_DEF : ROLES_DEF.filter(r => r.id !== "admin" && r.id !== "vice_admin");
  const roleOpts = availableRoles.map(r=>({value:r.id,label:r.label,colorDot:r.color,sub:r.desc}));
  const subTabs = [{k:"users",l:"İstifadəçilər",Icon:Users},{k:"pending",l:`Gözləyən${pending.length>0?` (${pending.length})`:""}`,Icon:UserCheck},{k:"activity",l:"Jurnal",Icon:History}];

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}><Crown size={16} style={{color:"#ef4444"}}/><h3 style={{color:"#f1f5f9",fontSize:"0.85rem",fontWeight:800,margin:0}}>İdarəetmə Paneli</h3></div>
      <div style={{display:"flex",gap:5,marginBottom:16,flexWrap:"wrap"}}>
        {subTabs.map(({k,l,Icon})=>(
          <button key={k} onClick={()=>setSub(k)} style={{padding:"6px 12px",borderRadius:7,border:`1px solid ${sub===k?"rgba(239,68,68,0.4)":"rgba(239,68,68,0.12)"}`,background:sub===k?"rgba(239,68,68,0.1)":"transparent",color:sub===k?"#ef4444":"#475569",cursor:"pointer",fontSize:"0.62rem",fontWeight:700,display:"flex",alignItems:"center",gap:5}}>
            <Icon size={11}/>{l}
          </button>
        ))}
      </div>
      {sub==="users"&&(
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {users.length===0&&<div style={{color:"#334155",fontSize:"0.72rem",textAlign:"center",padding:"20px 0"}}>İstifadəçi tapılmadı</div>}
          {users.map(u=>(
            <div key={u.id} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(56,189,248,0.1)",borderRadius:10,padding:"10px 12px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                <div style={{display:"flex",gap:10,alignItems:"center",flex:1,minWidth:0}}>
                  <div style={{width:32,height:32,borderRadius:8,background:`${ROLES_DEF.find(r=>r.id===u.role)?.color||"#64748b"}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.6rem",fontWeight:900,color:ROLES_DEF.find(r=>r.id===u.role)?.color||"#64748b",flexShrink:0}}>{u.avatar}</div>
                  <div style={{minWidth:0}}>
                    <div style={{fontSize:"0.74rem",fontWeight:700,color:u.status==="blocked"?"#475569":"#e2e8f0",display:"flex",alignItems:"center",gap:5}}>{u.name} {u.status==="blocked"&&<UserX size={11} style={{color:"#ef4444"}}/>}</div>
                    <div style={{fontSize:"0.6rem",color:"#334155",marginTop:2}}>@{u.username} · {u.serviceArea}</div>
                    <div style={{marginTop:4}}><RoleBadge role={u.role} size="xs"/></div>
                  </div>
                </div>
                {u.id!==currentUser.id&&(
                  <div style={{display:"flex",gap:5,flexShrink:0}}>
                    {perms.canManageOps&&(editingUser===u.id?(
                      <div style={{display:"flex",gap:5,alignItems:"center"}}>
                        <DarkSelect value={newRole} onChange={setNewRole} options={roleOpts} placeholder="Rol seçin" style={{width:160}} accentColor="#ef4444"/>
                        <button onClick={()=>newRole&&changeRole(u,newRole)} style={{padding:"5px 10px",borderRadius:7,background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.25)",color:"#10b981",cursor:"pointer",fontSize:"0.6rem"}}><Save size={10}/></button>
                        <button onClick={()=>setEditingUser(null)} style={{padding:"5px",borderRadius:7,background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",color:"#ef4444",cursor:"pointer"}}><X size={10}/></button>
                      </div>
                    ):(
                      <>
                        <button onClick={()=>{setEditingUser(u.id);setNewRole(u.role);}} style={{padding:"5px 8px",borderRadius:6,background:"rgba(56,189,248,0.08)",border:"1px solid rgba(56,189,248,0.2)",color:"#38bdf8",cursor:"pointer",fontSize:"0.58rem",display:"flex",alignItems:"center",gap:4}}><Edit3 size={9}/>Rol</button>
                        <button onClick={()=>blockUser(u)} style={{padding:"5px 8px",borderRadius:6,background:u.status==="blocked"?"rgba(16,185,129,0.08)":"rgba(239,68,68,0.08)",border:`1px solid ${u.status==="blocked"?"rgba(16,185,129,0.2)":"rgba(239,68,68,0.2)"}`,color:u.status==="blocked"?"#10b981":"#ef4444",cursor:"pointer",fontSize:"0.58rem",display:"flex",alignItems:"center",gap:4}}>
                          {u.status==="blocked"?<><ShieldCheck size={9}/>Açıq</>:<><ShieldOff size={9}/>Blok</>}
                        </button>
                      </>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {sub==="pending"&&(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {pending.length===0&&<div style={{color:"#334155",fontSize:"0.72rem",textAlign:"center",padding:"20px 0"}}>Gözləyən müraciət yoxdur</div>}
          {pending.map(req=>(
            <div key={req.id} style={{background:"rgba(56,189,248,0.03)",border:"1px solid rgba(56,189,248,0.15)",borderRadius:10,padding:"12px 14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div>
                  <div style={{fontSize:"0.75rem",fontWeight:700,color:"#e2e8f0"}}>{req.name || req.full_name}</div>
                  <div style={{fontSize:"0.6rem",color:"#475569",marginTop:2}}>@{req.username} · {req.email}</div>
                  <div style={{marginTop:4}}><RoleBadge role={normalizeRole(req.requestedRole || req.role)} size="xs"/></div>
                </div>
                <div style={{fontSize:"0.6rem",color:"#334155"}}>{relTime(req.requestedAt || req.created_at)}</div>
              </div>
              <div style={{fontSize:"0.62rem",color:"#94a3b8",marginBottom:8}}>Xidmət: {req.serviceArea || req.service_region}</div>
              {req.note&&<div style={{fontSize:"0.62rem",color:"#475569",background:"rgba(255,255,255,0.02)",borderRadius:6,padding:"6px 8px",marginBottom:8,fontStyle:"italic"}}>"{req.note}"</div>}
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>approve(req)} style={{flex:1,padding:"7px",borderRadius:7,background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.25)",color:"#10b981",cursor:"pointer",fontSize:"0.65rem",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}><UserCheck size={11}/>Təsdiqlə</button>
                <button onClick={()=>reject(req)} style={{flex:1,padding:"7px",borderRadius:7,background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",color:"#ef4444",cursor:"pointer",fontSize:"0.65rem",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}><UserX size={11}/>Rədd Et</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {sub==="activity"&&(
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {activityLog.length===0&&<div style={{color:"#334155",fontSize:"0.72rem",textAlign:"center",padding:"20px 0"}}>Jurnal boşdur</div>}
          {activityLog.map(entry=>(
            <div key={entry.id} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:entry.color,marginTop:5,flexShrink:0,boxShadow:`0 0 6px ${entry.color}60`}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:"0.68rem",color:"#94a3b8"}}><span style={{color:"#e2e8f0",fontWeight:700}}>{entry.actorName}</span> → {entry.target}</div>
                <div style={{fontSize:"0.62rem",color:"#475569",marginTop:2}}>{entry.details}</div>
                <div style={{fontSize:"0.58rem",color:"#334155",marginTop:2}}>{relTime(entry.timestamp)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// ANA KOMPONENT
// ============================================================
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [pending, setPending] = useState([]);
  const [activityLog, setActLog] = useState([]);
  const [messages, setMessages] = useState(INIT_MESSAGES);
  const [strategies, setStrat] = useState(INIT_STRATEGIES);
  const [dataEntries, setDataEntries] = useState(INIT_DATA_ENTRIES);
  const [sensorOverrides, setSensorOverrides] = useState({});
  const [alerts, setAlerts] = useState([
    { id:1, node:"Culfa Külək-Günəş Hibrid Stansiyası", component:"Turbine Bearing",       severity:"yüksək", message:"Yüksək vibrasiya aşkarlandı — dərhal yoxlayın",  time:"14:23", note:"" },
    { id:2, node:"Naxçıvan Modul Elektrik Stansiyası",  component:"Boiler Pressure Valve", severity:"orta",   message:"Buxar təzyiqi nominal həddin üst hissəsindədir", time:"14:45", note:"" },
    { id:3, node:"Naxçıvan Günəş Elektrik Stansiyası",  component:"Inverter Array",        severity:"aşağı",  message:"Panel temperaturunda kiçik sapma — izlənilir",   time:"15:10", note:"" }
  ]);

  useEffect(() => {
    const loadPending = async () => {
      const { data, error } = await supabase.from('users').select('*').eq('status', 'pending');
      if (error) { console.error("Pending load error:", error); return; }
      setPending(data || []);
    };
    loadPending();
    const channel = supabase.channel('pending-users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => { loadPending(); })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      const { data, error } = await supabase.from('users').select('*').eq('status', 'approved');
      if (error) { console.error("Users load error:", error); return; }
      setUsers((data || []).map(u => ({
        ...u,
        name: u.full_name || u.name || u.username,
        role: normalizeRole(u.role),
        serviceArea: u.service_region || "Bütün Ərazilər",
        avatar: (u.full_name || u.name || u.username || "??").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(),
        status: u.status || "active"
      })));
    };
    loadUsers();
    const channel2 = supabase.channel('approved-users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => { loadUsers(); })
      .subscribe();
    return () => supabase.removeChannel(channel2);
  }, []);

  const [activeTab, setTab] = useState("overview");
  const [selNodeIds, setSelNodeIds] = useState([NODES[0].id, NODES[1].id]);
  const [chartHistory, setChartHist] = useState(CONS_HISTORY);
  const [stratModal, setStratModal] = useState(false);
  const [filterSev, setFilterSev] = useState("all");

  const rawSensors = useSensors();
  const sensors = Object.fromEntries(NODES.map(n => [n.id, { ...rawSensors[n.id], ...(sensorOverrides[n.id]||{}) }]));

  useEffect(() => {
    const iv = setInterval(() => {
      const now = new Date();
      const label = `${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`;
      const totalOutput = ENERGY_SOURCES.reduce((s,e)=>s+e.cur,0);
      const noise = (Math.random()-0.5)*4;
      setChartHist(prev => [...prev.slice(-23), { t:label, i:+(totalOutput+noise).toFixed(1), p:+(totalOutput-1+noise).toFixed(1) }]);
    }, 8000);
    return () => clearInterval(iv);
  }, []);

  const handleLogin = async (username, password) => {
    if (!username || !password) return { ok:false, msg:"İstifadəçi adı və şifrəni daxil edin." };
    const { data, error } = await supabase.from('users').select('*').eq('username', username).eq('password', password).single();
    if (error || !data) return { ok:false, msg:"İstifadəçi adı və ya şifrə yanlışdır." };
    if (data.status === 'pending') return { ok:false, msg:"Hesabınız hələ təsdiqlənməyib. Administrator ilə əlaqə saxlayın." };
    if (data.status === 'rejected') return { ok:false, msg:"Hesab müraciətiniz rədd edilib." };
    if (data.status === 'blocked') return { ok:false, msg:"Hesabınız bloklanıb. Administrator ilə əlaqə saxlayın." };
    const normalizedRole = normalizeRole(data.role);
    const userName = data.full_name || data.name || data.username;
    setCurrentUser({
      ...data, id: data.id, name: userName, role: normalizedRole,
      serviceArea: data.service_region || "Bütün Ərazilər",
      avatar: userName.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()
    });
    return { ok:true };
  };

  const handleRegister = async (formData) => {
    try {
      const { data: existing } = await supabase.from('users').select('id').eq('username', formData.username).maybeSingle();
      if (existing) return { error: "Bu istifadəçi adı artıq mövcuddur." };
      const { data: existingEmail } = await supabase.from('users').select('id').eq('email', formData.email).maybeSingle();
      if (existingEmail) return { error: "Bu e-poçt artıq qeydiyyatdadır." };
      const insertData = {
        username: formData.username, password: formData.password,
        full_name: formData.name, email: formData.email,
        role: formData.requestedRole || 'viewer', status: 'pending',
        service_region: formData.serviceArea, note: formData.note || ""
      };
      const { data, error } = await supabase.from('users').insert([insertData]).select();
      if (error) return { error: `Xəta: ${error.message}` };
      return { ok: true };
    } catch (err) {
      return { error: "Gözlənilməz xəta baş verdi." };
    }
  };

  const handleLogout = () => { setCurrentUser(null); setTab("overview"); };
  const handleSendMsg = (msg) => setMessages(prev => [{ ...msg, id:Date.now(), timestamp:new Date().toISOString(), readBy:[msg.fromId] }, ...prev]);
  const addAlert = (a) => setAlerts(prev => [{ ...a, id:Date.now() }, ...prev]);
  const removeAlert = (id) => setAlerts(prev => prev.filter(a => a.id!==id));
  const saveStrategy = (s) => { setStrat(prev => [...prev, { ...s, id:Date.now() }]); setStratModal(false); };
  const toggleNode = (id) => setSelNodeIds(prev => prev.includes(id) ? (prev.length>1?prev.filter(x=>x!==id):prev) : [...prev, id]);

  const filteredAlerts = alerts.filter(a => filterSev==="all"||a.severity===filterSev);
  const unreadMsgs = currentUser ? messages.filter(m=>(m.toId===currentUser.id||(m.type==="broadcast"&&m.fromId!==currentUser.id))&&!(m.readBy||[]).includes(currentUser.id)).length : 0;
  const perms = getPerms(currentUser);

  if (!currentUser) return <AuthScreen onLogin={handleLogin} onRegister={handleRegister}/>;

  const TABS = [
    { k:"overview",   l:"Ümumi Baxış",    Icon:BarChart2 },
    { k:"stations",   l:"Stansiyalar",    Icon:Cpu },
    { k:"grid",       l:"Şəbəkə",         Icon:Activity },
    { k:"dataentry",  l:"Məlumat Daxilet",Icon:PenLine },
    { k:"strategies", l:"Strategiyalar",  Icon:Leaf },
    { k:"incidents",  l:"Hadisələr",      Icon:AlertTriangle },
    { k:"messages",   l:"Mesajlar",       Icon:MessageSquare, badge:unreadMsgs },
    ...(perms.canSeeAdminTab?[{ k:"admin", l:"Admin", Icon:Crown, badge:pending.length }]:[])
  ];

  const card = (extra={}) => ({
    background:"linear-gradient(135deg,rgba(6,12,28,0.9),rgba(4,8,20,0.95))",
    border:"1px solid rgba(56,189,248,0.12)",
    borderRadius:14,padding:18,backdropFilter:"blur(10px)",...extra
  });

  const totalOutput = ENERGY_SOURCES.reduce((s,e)=>s+e.cur,0);
  const totalCapacity = TOTAL_CAPACITY;
  const gridEfficiency = +((totalOutput/totalCapacity)*100).toFixed(1);

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#020610 0%,#030915 50%,#020710 100%)",fontFamily:"'Inter',system-ui,sans-serif",color:"#e2e8f0",fontSize:"0.8rem"}}>
      <style>{`
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(56,189,248,0.2);border-radius:2px;}
        @keyframes fadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}</style>

      <header style={{background:"linear-gradient(90deg,rgba(2,6,16,0.95),rgba(4,8,22,0.95))",borderBottom:"1px solid rgba(56,189,248,0.1)",padding:"12px 20px",display:"flex",alignItems:"center",gap:16,position:"sticky",top:0,zIndex:100,backdropFilter:"blur(20px)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0}}>
          <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,rgba(56,189,248,0.2),rgba(14,165,233,0.1))",border:"1px solid rgba(56,189,248,0.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <Zap size={20} style={{color:"#38bdf8"}}/>
          </div>
          <div>
            <div style={{fontSize:"0.85rem",fontWeight:900,color:"#f1f5f9",lineHeight:1}}>Naxçıvan Enerji</div>
            <div style={{fontSize:"0.58rem",color:"#334155",marginTop:2}}>Digital Twin İdarəetmə Sistemi</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:"#10b981",animation:"pulse 2s infinite",boxShadow:"0 0 8px #10b98160"}}/>
          <span style={{fontSize:"0.65rem",color:"#10b981",fontWeight:700}}>Aktiv</span>
          <span style={{fontSize:"0.65rem",color:"#334155",marginLeft:6}}>{totalOutput.toFixed(1)} MW / {totalCapacity} MW</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginLeft:8}}>
          <div style={{width:32,height:32,borderRadius:8,background:`${ROLES_DEF.find(r=>r.id===currentUser.role)?.color||"#64748b"}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.6rem",fontWeight:900,color:ROLES_DEF.find(r=>r.id===currentUser.role)?.color||"#64748b"}}>{currentUser.avatar}</div>
          <div style={{display:"flex",flexDirection:"column"}}>
            <span style={{fontSize:"0.68rem",color:"#e2e8f0",fontWeight:700}}>{currentUser.name}</span>
            <RoleBadge role={currentUser.role} size="xs"/>
          </div>
          <button onClick={handleLogout} style={{padding:"5px 10px",borderRadius:7,background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",color:"#ef4444",cursor:"pointer",fontSize:"0.62rem",display:"flex",alignItems:"center",gap:4}}>
            <LogOut size={10}/>Çıx
          </button>
        </div>
      </header>

      <nav style={{background:"linear-gradient(90deg,rgba(2,6,14,0.9),rgba(3,8,20,0.9))",borderBottom:"1px solid rgba(56,189,248,0.08)",padding:"0 20px",display:"flex",gap:2,overflowX:"auto"}}>
        {TABS.map(({k,l,Icon,badge})=>(
          <button key={k} onClick={()=>setTab(k)} style={{padding:"10px 14px",border:"none",borderBottom:`2px solid ${activeTab===k?"#38bdf8":"transparent"}`,background:"transparent",color:activeTab===k?"#38bdf8":"#475569",cursor:"pointer",fontSize:"0.68rem",fontWeight:700,whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:6,transition:"all 0.2s",position:"relative"}}>
            <Icon size={13}/>{l}
            {badge>0&&<span style={{background:"#ef4444",color:"#fff",fontSize:"0.5rem",borderRadius:"50%",width:14,height:14,display:"inline-flex",alignItems:"center",justifyContent:"center",fontWeight:900}}>{badge}</span>}
          </button>
        ))}
      </nav>

      <main style={{padding:20,maxWidth:1400,margin:"0 auto"}}>

        {activeTab==="overview"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14,marginBottom:20}}>
              {[
                { label:"Ümumi İstehsal",   value:`${totalOutput.toFixed(1)} MW`,   sub:`Gücün ${gridEfficiency}%-i`,         color:"#38bdf8", Icon:Zap },
                { label:"Sistem Gücü",      value:`${totalCapacity} MW`,             sub:`${ENERGY_SOURCES.length} mənbə`,    color:"#10b981", Icon:Battery },
                { label:"Şəbəkə Fəallığı", value:`${gridEfficiency}%`,              sub:"Real vaxt",                         color:"#eab308", Icon:TrendingUp },
                { label:"Aktiv Hadisələr",  value:alerts.filter(a=>a.severity==="yüksək").length, sub:`${alerts.length} ümumilikdə`, color:"#ef4444", Icon:AlertTriangle },
                { label:"Yenilenebilir",    value:`${(ENERGY_SOURCES.filter(e=>e.icon!==Zap).reduce((s,e)=>s+e.cur,0)).toFixed(1)} MW`, sub:"Günəş+Su+Külək", color:"#8b5cf6", Icon:Leaf }
              ].map(({label,value,sub,color,Icon})=>(
                <div key={label} style={{...card(),display:"flex",gap:14,alignItems:"flex-start"}}>
                  <div style={{width:42,height:42,borderRadius:12,background:`${color}15`,border:`1px solid ${color}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon size={20} style={{color}}/></div>
                  <div>
                    <div style={{fontSize:"0.65rem",color:"#475569",marginBottom:3}}>{label}</div>
                    <div style={{fontSize:"1.2rem",fontWeight:900,color:"#f1f5f9",lineHeight:1}}>{value}</div>
                    <div style={{fontSize:"0.6rem",color:"#334155",marginTop:3}}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:14,marginBottom:14}}>
              <div style={card()}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <div style={{fontSize:"0.7rem",color:"#64748b",fontWeight:700,letterSpacing:"0.08em"}}>ENERJİ İSTEHSALI / İSTEHLAKI</div>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{fontSize:"0.62rem",color:"#334155"}}>Son 24 saat</span>
                    <div style={{fontSize:"0.58rem",color:"#10b981",background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:4,padding:"2px 7px",fontWeight:700}}>
                      ΔMW {((chartHistory[chartHistory.length-1]?.i||0)-(chartHistory[chartHistory.length-2]?.i||0)>0?"+":"")}{((chartHistory[chartHistory.length-1]?.i||0)-(chartHistory[chartHistory.length-2]?.i||0)).toFixed(1)}
                    </div>
                  </div>
                </div>
                <EnergyChart data={chartHistory}/>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginTop:14,paddingTop:12,borderTop:"1px solid rgba(255,255,255,0.04)"}}>
                  {[
                    {lbl:"Pik İstehsal",val:`${Math.max(...chartHistory.map(d=>d.i)).toFixed(1)} MW`,col:"#38bdf8"},
                    {lbl:"Min İstehsal",val:`${Math.min(...chartHistory.map(d=>d.i)).toFixed(1)} MW`,col:"#94a3b8"},
                    {lbl:"Ortalama",    val:`${(chartHistory.reduce((s,d)=>s+d.i,0)/chartHistory.length).toFixed(1)} MW`,col:"#f59e0b"}
                  ].map(({lbl,val,col})=>(
                    <div key={lbl} style={{textAlign:"center"}}>
                      <div style={{fontSize:"0.58rem",color:"#334155",marginBottom:3}}>{lbl}</div>
                      <div style={{fontSize:"0.75rem",fontWeight:800,color:col}}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={card()}>
                <div style={{fontSize:"0.7rem",color:"#64748b",fontWeight:700,marginBottom:12}}>ENERJİ MƏNBƏLƏRİ</div>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={ENERGY_SOURCES.slice(0,6)} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="cur" nameKey="name" paddingAngle={2}>
                      {ENERGY_SOURCES.slice(0,6).map((e,i)=><Cell key={i} fill={e.color}/>)}
                    </Pie>
                    <Tooltip contentStyle={{background:"rgba(6,12,28,0.95)",border:"1px solid rgba(56,189,248,0.2)",borderRadius:8,fontSize:11}}/>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{display:"flex",flexDirection:"column",gap:5,marginTop:8}}>
                  {ENERGY_SOURCES.map((e,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <div style={{width:8,height:8,borderRadius:2,background:e.color,flexShrink:0}}/>
                        <span style={{fontSize:"0.62rem",color:"#64748b"}}>{e.name}</span>
                      </div>
                      <span style={{fontSize:"0.62rem",color:"#94a3b8",fontWeight:700}}>{e.cur} MW</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={card()}>
              <div style={{fontSize:"0.7rem",color:"#64748b",fontWeight:700,marginBottom:14}}>PAYLAŞDIRMA ZONALARI</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10}}>
                {DIST_ZONES.map(z=>{
                  const pct = Math.round((z.load/z.capacity)*100);
                  const col = pct>90?"#ef4444":pct>70?"#f59e0b":"#10b981";
                  return (
                    <div key={z.name} style={{background:"rgba(255,255,255,0.02)",borderRadius:10,padding:"12px 14px",border:`1px solid ${col}20`}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                        <span style={{fontSize:"0.68rem",color:"#94a3b8",fontWeight:600}}>{z.name}</span>
                        <span style={{fontSize:"0.65rem",color:col,fontWeight:800}}>{pct}%</span>
                      </div>
                      <div style={{height:4,background:"rgba(255,255,255,0.05)",borderRadius:99,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${col}80,${col})`,borderRadius:99,transition:"width 1s"}}/>
                      </div>
                      <div style={{fontSize:"0.58rem",color:"#334155",marginTop:5}}>{z.load} / {z.capacity} MW · Sağlamlıq: {z.health}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab==="stations"&&(
          <div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
              {NODES.map(n=>{
                const sel = selNodeIds.includes(n.id);
                return (
                  <button key={n.id} onClick={()=>toggleNode(n.id)} style={{padding:"7px 14px",borderRadius:9,border:`1px solid ${sel?n.color+"60":n.color+"20"}`,background:sel?`${n.color}15`:"transparent",color:sel?n.color:"#475569",cursor:"pointer",fontSize:"0.65rem",fontWeight:sel?700:500,display:"flex",alignItems:"center",gap:6,transition:"all 0.2s"}}>
                    <n.icon size={12}/>{n.label.split(" ").slice(0,2).join(" ")}
                  </button>
                );
              })}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14}}>
              {NODES.filter(n=>selNodeIds.includes(n.id)).map(n=>{
                const s = sensors[n.id]||{};
                return (
                  <div key={n.id} style={{...card(),borderColor:`${n.color}25`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                        <div style={{width:32,height:32,borderRadius:9,background:`${n.color}15`,border:`1px solid ${n.color}30`,display:"flex",alignItems:"center",justifyContent:"center"}}><n.icon size={16} style={{color:n.color}}/></div>
                        <div>
                          <div style={{fontSize:"0.75rem",fontWeight:800,color:"#f1f5f9",lineHeight:1.2}}>{n.label}</div>
                          <div style={{fontSize:"0.6rem",color:"#334155",marginTop:2}}>{n.region}</div>
                        </div>
                      </div>
                      <div style={{width:7,height:7,borderRadius:"50%",background:"#10b981",animation:"pulse 2s infinite",marginTop:4}}/>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {Object.entries(s).map(([k,v])=>{
                        const labels = {boilerTemp:"Qazan Temp",steamPressure:"Buxar Təzyiqi",output:"Çıxış Gücü",waterLevel:"Su Səviyyəsi",turbineRpm:"Türbin RPM",panelTemp:"Panel Temp",efficiency:"Səmərəlilik",rpm:"Fırlanma",bearingTemp:"Yataq Temp",vibration:"Vibrasiya"};
                        const units  = {boilerTemp:"°C",steamPressure:"MPa",output:"MW",waterLevel:"m",turbineRpm:"RPM",panelTemp:"°C",efficiency:"%",rpm:"RPM",bearingTemp:"°C",vibration:"mm/s"};
                        const isOverridden = sensorOverrides[n.id]?.[k] !== undefined;
                        return (
                          <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(255,255,255,0.03)",paddingBottom:6}}>
                            <span style={{fontSize:"0.65rem",color:"#64748b",display:"flex",alignItems:"center",gap:4}}>
                              {labels[k]||k}
                              {isOverridden&&<span style={{fontSize:"0.52rem",color:"#f59e0b",background:"rgba(245,158,11,0.1)",borderRadius:3,padding:"1px 4px"}}>Manuel</span>}
                            </span>
                            <span style={{fontSize:"0.72rem",fontWeight:800,color:isOverridden?"#f59e0b":n.color}}>{typeof v==="number"?v.toFixed(2):v} {units[k]||""}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab==="grid"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14,marginBottom:16}}>
              {ENERGY_SOURCES.map((e,i)=>(
                <div key={i} style={{...card(),borderColor:`${e.color}20`}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><e.icon size={16} style={{color:e.color}}/><span style={{fontSize:"0.68rem",color:"#94a3b8",fontWeight:600}}>{e.name}</span></div>
                  <div style={{fontSize:"1.1rem",fontWeight:900,color:e.color,marginBottom:4}}>{e.cur} MW</div>
                  <div style={{fontSize:"0.6rem",color:"#334155",marginBottom:8}}>{e.cap} MW gücünün {e.eff}%-i</div>
                  <div style={{height:4,background:"rgba(255,255,255,0.05)",borderRadius:99,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${(e.cur/e.cap)*100}%`,background:`linear-gradient(90deg,${e.color}80,${e.color})`,borderRadius:99}}/>
                  </div>
                </div>
              ))}
            </div>
            <div style={card()}>
              <div style={{fontSize:"0.7rem",color:"#64748b",fontWeight:700,marginBottom:14}}>PAYLAŞDIRMA YÜK XƏRİTƏSİ</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10}}>
                {DIST_ZONES.map(z=>{
                  const pct = Math.round((z.load/z.capacity)*100);
                  const col = pct>90?"#ef4444":pct>70?"#f59e0b":"#10b981";
                  return (
                    <div key={z.name} style={{background:`${col}08`,borderRadius:10,padding:"12px 14px",border:`1px solid ${col}20`}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                        <span style={{fontSize:"0.68rem",color:"#94a3b8",fontWeight:700}}>{z.name}</span>
                        <span style={{fontSize:"0.7rem",color:col,fontWeight:900}}>{pct}%</span>
                      </div>
                      <div style={{display:"flex",gap:3,marginBottom:6}}>
                        {Array.from({length:10}).map((_,j)=>(
                          <div key={j} style={{flex:1,height:20,borderRadius:3,background:j<Math.round(pct/10)?col:col+"20",transition:"background 0.3s"}}/>
                        ))}
                      </div>
                      <div style={{fontSize:"0.58rem",color:"#334155"}}>{z.load}/{z.capacity} MW · Sağ: {z.health}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab==="dataentry"&&(
          <div style={{display:"grid",gridTemplateColumns:"380px 1fr",gap:14}}>
            <div style={card()}>
              <ManualDataEntryPanel currentUser={currentUser} perms={perms} sensors={sensors} setSensorOverrides={setSensorOverrides} dataEntries={dataEntries} setDataEntries={setDataEntries}/>
            </div>
            <div>
              <div style={{...card(),marginBottom:14}}>
                <div style={{fontSize:"0.7rem",color:"#64748b",fontWeight:700,marginBottom:14,display:"flex",alignItems:"center",gap:6}}><Database size={13}/> MƏLUMAT GİRİŞ TARİXÇƏSİ</div>
                {dataEntries.length===0 ? (
                  <div style={{textAlign:"center",padding:"32px 0",color:"#334155",fontSize:"0.72rem"}}>Hələ heç bir məlumat daxil edilməyib</div>
                ):(
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {dataEntries.map(e=>(
                      <div key={e.id} style={{display:"grid",gridTemplateColumns:"auto 1fr auto auto auto",gap:12,alignItems:"center",padding:"10px 14px",background:"rgba(255,255,255,0.02)",borderRadius:9,border:`1px solid ${e.color}18`}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:e.color,boxShadow:`0 0 6px ${e.color}60`}}/>
                        <div>
                          <div style={{fontSize:"0.7rem",color:"#e2e8f0",fontWeight:700}}>{e.target}</div>
                          <div style={{fontSize:"0.62rem",color:"#475569",marginTop:1}}>{e.field}</div>
                          {e.note&&<div style={{fontSize:"0.58rem",color:"#334155",marginTop:1,fontStyle:"italic"}}>{e.note}</div>}
                        </div>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontSize:"0.75rem",fontWeight:800,color:e.color}}>{e.value}</div>
                          <div style={{fontSize:"0.58rem",color:"#334155",marginTop:1}}>{e.targetType==="station"?"Stansiya":"Şəbəkə"}</div>
                        </div>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontSize:"0.65rem",color:"#64748b"}}>{e.actor}</div>
                          <div style={{fontSize:"0.58rem",color:"#334155",marginTop:1}}>{relTime(e.timestamp)}</div>
                        </div>
                        <RoleBadge role={e.actorRole} size="xs"/>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{...card(),borderColor:"rgba(56,189,248,0.2)"}}>
                <div style={{fontSize:"0.7rem",color:"#64748b",fontWeight:700,marginBottom:12,display:"flex",alignItems:"center",gap:6}}><Shield size={13}/> GİRİŞ İCAZƏLƏRİ</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {[
                    {role:"admin",      desc:"Bütün stansiyalar və zonalar",     status:true},
                    {role:"vice_admin", desc:"Bütün stansiyalar və zonalar",     status:true},
                    {role:"operator",   desc:"Yalnız öz xidmət sahəsi",         status:true},
                    {role:"viewer",     desc:"Yalnız baxış (daxiletmə yoxdur)", status:false}
                  ].map(({role,desc,status})=>(
                    <div key={role} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 10px",background:"rgba(255,255,255,0.02)",borderRadius:7}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}><RoleBadge role={role} size="xs"/><span style={{fontSize:"0.65rem",color:"#64748b"}}>{desc}</span></div>
                      {status ? <CheckCircle size={13} style={{color:"#10b981"}}/> : <X size={13} style={{color:"#ef4444"}}/>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab==="strategies"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div>
                <h2 style={{color:"#f1f5f9",fontSize:"0.9rem",fontWeight:800,margin:0}}>Optimallaşdırma Strategiyaları</h2>
                <p style={{color:"#475569",fontSize:"0.65rem",margin:"4px 0 0"}}>İllik potensial qənaət: {strategies.reduce((s,st)=>s+parseFloat((st.annualSavings||"0").replace(/[^0-9]/g,"")),0).toLocaleString()} ₼</p>
              </div>
              {perms.canEditStrategies&&<button onClick={()=>setStratModal(true)} style={{padding:"8px 16px",borderRadius:9,background:"rgba(56,189,248,0.1)",border:"1px solid rgba(56,189,248,0.25)",color:"#38bdf8",cursor:"pointer",fontSize:"0.68rem",fontWeight:700,display:"flex",alignItems:"center",gap:7}}><Plus size={13}/>Yeni Strategiya</button>}
            </div>
            {!perms.canEditStrategies&&<PermissionBanner message="Strategiya əlavə etmək üçün Operator və ya yuxarı hüquq lazımdır."/>}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:14}}>
              {strategies.map(s=>(
                <div key={s.id} style={{...card(),borderColor:`${s.categoryColor||"#3b82f6"}20`,opacity:s.completed?0.7:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <span style={{fontSize:"0.58rem",color:s.categoryColor||"#38bdf8",background:`${s.categoryColor||"#38bdf8"}12`,border:`1px solid ${s.categoryColor||"#38bdf8"}25`,borderRadius:4,padding:"2px 8px",fontWeight:800}}>{s.category}</span>
                    <div style={{display:"flex",gap:5}}>
                      <span style={{fontSize:"0.55rem",color:s.priorityColor||"#f59e0b",background:`${s.priorityColor||"#f59e0b"}10`,border:`1px solid ${s.priorityColor||"#f59e0b"}25`,borderRadius:4,padding:"2px 8px",fontWeight:800}}>{s.priority}</span>
                      <span style={{fontSize:"0.55rem",color:s.statusColor||"#f59e0b",background:`${s.statusColor||"#f59e0b"}10`,border:`1px solid ${s.statusColor||"#f59e0b"}25`,borderRadius:4,padding:"2px 8px",fontWeight:800}}>{s.status}</span>
                    </div>
                  </div>
                  <h4 style={{color:"#f1f5f9",fontSize:"0.8rem",fontWeight:800,margin:"0 0 6px"}}>{s.title}</h4>
                  <p style={{color:"#64748b",fontSize:"0.67rem",lineHeight:1.5,margin:"0 0 12px"}}>{s.desc}</p>
                  {s.progress>0&&<div style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:"0.6rem",color:"#64748b"}}>İcra Gedişatı</span>
                      <span style={{fontSize:"0.6rem",color:"#38bdf8",fontWeight:700}}>{s.progress}%</span>
                    </div>
                    <div style={{height:4,background:"rgba(255,255,255,0.05)",borderRadius:99,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${s.progress}%`,background:"linear-gradient(90deg,#38bdf880,#38bdf8)",borderRadius:99}}/>
                    </div>
                  </div>}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    {[["İllik Qənaət",s.annualSavings,"#10b981"],["Təsir",s.impact,"#38bdf8"],["ROI",s.roi,"#8b5cf6"],["Müddət",s.duration,"#f59e0b"]].map(([lbl,val,col])=>val&&(
                      <div key={lbl} style={{background:"rgba(255,255,255,0.02)",borderRadius:7,padding:"7px 10px"}}>
                        <div style={{fontSize:"0.56rem",color:"#334155"}}>{lbl}</div>
                        <div style={{fontSize:"0.7rem",fontWeight:700,color:col,marginTop:2}}>{val}</div>
                      </div>
                    ))}
                  </div>
                  {perms.canDeleteEntries&&<button onClick={()=>setStrat(prev=>prev.filter(x=>x.id!==s.id))} style={{width:"100%",marginTop:10,padding:"6px",borderRadius:7,background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.15)",color:"#ef4444",cursor:"pointer",fontSize:"0.6rem",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}><Trash2 size={10}/>Sil</button>}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab==="incidents"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:14}}>
            <div>
              <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
                <Filter size={13} style={{color:"#64748b"}}/>
                {["all","yüksək","orta","aşağı"].map(s=>(
                  <button key={s} onClick={()=>setFilterSev(s)} style={{padding:"5px 12px",borderRadius:7,border:`1px solid ${filterSev===s?"rgba(56,189,248,0.4)":"rgba(56,189,248,0.1)"}`,background:filterSev===s?"rgba(56,189,248,0.1)":"transparent",color:filterSev===s?"#38bdf8":"#475569",cursor:"pointer",fontSize:"0.62rem",fontWeight:700}}>
                    {s==="all"?"Hamısı":SEVERITY_MAP[s].label}
                  </button>
                ))}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {filteredAlerts.length===0&&<div style={{...card(),textAlign:"center",padding:40,color:"#334155"}}>Hadisə tapılmadı</div>}
                {filteredAlerts.map(a=>{
                  const sv = SEVERITY_MAP[a.severity]||SEVERITY_MAP["aşağı"];
                  return (
                    <div key={a.id} style={{...card(),borderColor:sv.border,background:`linear-gradient(135deg,${sv.bg},rgba(4,8,20,0.97))`}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                            <span style={{fontSize:"0.56rem",color:sv.color,background:sv.bg,border:`1px solid ${sv.border}`,borderRadius:4,padding:"2px 8px",fontWeight:800,flexShrink:0}}>{sv.label}</span>
                            <span style={{fontSize:"0.65rem",color:"#94a3b8",fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.node}</span>
                          </div>
                          <div style={{fontSize:"0.72rem",color:"#f1f5f9",fontWeight:700,marginBottom:3}}>{a.component}</div>
                          <div style={{fontSize:"0.68rem",color:"#94a3b8"}}>{a.message}</div>
                          {a.note&&<div style={{fontSize:"0.62rem",color:"#475569",marginTop:4,fontStyle:"italic"}}>Not: {a.note}</div>}
                        </div>
                        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,flexShrink:0}}>
                          <span style={{fontSize:"0.6rem",color:"#334155"}}>{a.time}</span>
                          {perms.canDeleteEntries&&<button onClick={()=>removeAlert(a.id)} style={{padding:"4px 8px",borderRadius:6,background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",color:"#ef4444",cursor:"pointer",fontSize:"0.58rem",display:"flex",alignItems:"center",gap:4}}><Trash2 size={9}/>Sil</button>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={card()}>
              <ManualIncidentPanel perms={perms} onAddAlert={addAlert}/>
            </div>
          </div>
        )}

        {activeTab==="messages"&&(
          <div style={card()}>
            <MessagingPanel currentUser={currentUser} users={users} messages={messages} onSend={handleSendMsg} perms={perms}/>
          </div>
        )}

        {activeTab==="admin"&&perms.canSeeAdminTab&&(
          <div style={card()}>
            <AdminPanel currentUser={currentUser} users={users} setUsers={setUsers} pending={pending} setPending={setPending} activityLog={activityLog} setActivityLog={setActLog} perms={perms}/>
          </div>
        )}

      </main>

      {stratModal&&<StrategyModal onClose={()=>setStratModal(false)} onSave={saveStrategy}/>}
    </div>
  );
}
