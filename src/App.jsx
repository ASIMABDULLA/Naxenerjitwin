import { createClient } from '@supabase/supabase-js'
import { useState, useEffect, useCallback, useRef } from "react";
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
  LineChart, Line, ReferenceLine, BarChart, Bar
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
  PenLine, Settings2, TrendingDown, Target, Lightbulb, Award
} from "lucide-react";

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

const STRATEGY_CATEGORIES = [
  { value:"Enerji Səmərəliliyi", color:"#10b981" },
  { value:"Bərpa Olunan Enerji", color:"#eab308" },
  { value:"Şəbəkə Modernizasiyası", color:"#3b82f6" },
  { value:"Tələb İdarəetməsi", color:"#8b5cf6" },
  { value:"Saxlama və Ehtiyat", color:"#f97316" },
  { value:"Rəqəmsallaşma", color:"#06b6d4" }
];

const PRIORITY_OPTS = [
  { value:"Yüksək", color:"#ef4444" },
  { value:"Orta",   color:"#f59e0b" },
  { value:"Aşağı",  color:"#10b981" }
];

const STATUS_OPTS = [
  { value:"Planlaşdırılıb",  color:"#64748b" },
  { value:"Davam edir",      color:"#3b82f6" },
  { value:"Tamamlandı",      color:"#10b981" },
  { value:"Dayandırılıb",    color:"#ef4444" }
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
  if (!iso) return "—";
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

// ── SUPABASE HOOKS ──────────────────────────────────────────────────────────

function useSupabaseMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
      if (!error && data) setMessages(data.map(m => ({
        id:m.id, fromId:m.from_id, fromName:m.from_name, fromAvatar:m.from_avatar||"??",
        fromRole:m.from_role||"viewer", toId:m.to_id, toName:m.to_name||"Hamı",
        subject:m.subject, body:m.body, timestamp:m.created_at,
        readBy:m.read_by||[], priority:m.priority||"normal", type:m.type||"direct"
      })));
      setLoading(false);
    };
    load();
    const ch = supabase.channel('messages-sync').on('postgres_changes',{event:'INSERT',schema:'public',table:'messages'},(p)=>{
      setMessages(prev=>[{id:p.new.id,fromId:p.new.from_id,fromName:p.new.from_name,fromAvatar:p.new.from_avatar||"??",fromRole:p.new.from_role||"viewer",toId:p.new.to_id,toName:p.new.to_name||"Hamı",subject:p.new.subject,body:p.new.body,timestamp:p.new.created_at,readBy:p.new.read_by||[],priority:p.new.priority||"normal",type:p.new.type||"direct"},...prev]);
    }).subscribe();
    return ()=>supabase.removeChannel(ch);
  }, []);
  return { messages, setMessages, loading };
}

function useSupabaseAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from('alerts').select('*').order('created_at', { ascending: false });
      if (!error && data) setAlerts(data.map(a => ({
        id:a.id, node:a.station_name, component:a.component, severity:a.severity,
        message:a.message, time:a.created_at?new Date(a.created_at).toLocaleTimeString('az-AZ'):new Date().toLocaleTimeString('az-AZ'), note:a.note||""
      })));
      setLoading(false);
    };
    load();
    const ch = supabase.channel('alerts-sync').on('postgres_changes',{event:'INSERT',schema:'public',table:'alerts'},(p)=>{
      setAlerts(prev=>[{id:p.new.id,node:p.new.station_name,component:p.new.component,severity:p.new.severity,message:p.new.message,time:new Date(p.new.created_at).toLocaleTimeString('az-AZ'),note:p.new.note||""},...prev]);
    }).subscribe();
    return ()=>supabase.removeChannel(ch);
  }, []);
  return { alerts, setAlerts, loading };
}

function useSupabaseDataEntries() {
  const [dataEntries, setDataEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from('data_entries').select('*').order('created_at', { ascending: false });
      if (!error && data) setDataEntries(data.map(e => ({
        id:e.id, timestamp:e.created_at, actor:e.actor_name, actorRole:e.actor_role,
        targetType:e.target_type, target:e.target_name, field:e.field_name,
        value:e.value, note:e.note||"", color:e.color||"#38bdf8"
      })));
      setLoading(false);
    };
    load();
    const ch = supabase.channel('data-entries-sync').on('postgres_changes',{event:'INSERT',schema:'public',table:'data_entries'},(p)=>{
      setDataEntries(prev=>[{id:p.new.id,timestamp:p.new.created_at,actor:p.new.actor_name,actorRole:p.new.actor_role,targetType:p.new.target_type,target:p.new.target_name,field:p.new.field_name,value:p.new.value,note:p.new.note||"",color:p.new.color||"#38bdf8"},...prev]);
    }).subscribe();
    return ()=>supabase.removeChannel(ch);
  }, []);
  return { dataEntries, setDataEntries, loading };
}

function useSupabaseStrategies() {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from('strategies').select('*').order('created_at', { ascending: false });
      if (!error && data) setStrategies(data.map(s => ({
        id:s.id, title:s.title, category:s.category, categoryColor:s.category_color||"#3b82f6",
        desc:s.description, roi:s.roi, duration:s.duration, annualSavings:s.annual_savings||"",
        impact:s.impact||"", priority:s.priority||"Orta", priorityColor:s.priority_color||"#f59e0b",
        status:s.status||"Planlaşdırılıb", statusColor:s.status_color||"#f59e0b",
        energySaved:s.energy_saved||"", co2Reduction:s.co2_reduction||"",
        progress:s.progress||0, completed:s.completed||false
      })));
      setLoading(false);
    };
    load();
    const ch = supabase.channel('strategies-sync').on('postgres_changes',{event:'*',schema:'public',table:'strategies'},()=>load()).subscribe();
    return ()=>supabase.removeChannel(ch);
  }, []);
  return { strategies, setStrategies, loading };
}

// ── PANELS ──────────────────────────────────────────────────────────────────

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
  const accessibleStations = NODES.filter(n => isAllAccess ? true : n.label === userArea || n.region === userArea);
  const accessibleZones = DIST_ZONES.filter(z => isAllAccess ? true : z.name === userArea || userArea.includes(z.name) || z.name.includes(userArea.replace(" Rayonu","").replace(" Şəhər","")));
  const stationOpts = accessibleStations.map(n=>({value:n.id, label:n.label, colorDot:n.color}));
  const zoneOpts = accessibleZones.map(z=>({value:z.name, label:z.name, colorDot:"#38bdf8"}));
  const selectedNode = NODES.find(n=>n.id===selectedStation);
  const sensorLabels = {boilerTemp:"Qazan Temperaturu (°C)",steamPressure:"Buxar Təzyiqi (MPa)",output:"Çıxış Gücü (MW)",waterLevel:"Su Səviyyəsi (m)",turbineRpm:"Türbin RPM",panelTemp:"Panel Temperaturu (°C)",efficiency:"Səmərəlilik (%)",rpm:"Fırlanma (RPM)",bearingTemp:"Yataq Temperaturu (°C)",vibration:"Vibrasiya (mm/s)"};
  const zoneFieldLabels = { load:"Yük (MW)", capacity:"Güc (MW)", health:"Sağlamlıq (%)" };
  const stationFieldOpts = selectedNode ? Object.keys(selectedNode.sensors).map(k=>({value:k, label:sensorLabels[k]||k})) : [];
  const zoneFieldOpts = Object.entries(zoneFieldLabels).map(([k,v])=>({value:k, label:v}));
  const inp = {width:"100%",boxSizing:"border-box",background:"linear-gradient(135deg,rgba(6,12,28,0.95),rgba(4,8,20,0.98))",border:"1px solid rgba(56,189,248,0.18)",borderRadius:9,padding:"9px 12px",color:"#e2e8f0",fontSize:"0.76rem",fontFamily:"inherit",outline:"none"};

  const handleSubmit = async () => {
    setError("");
    if (targetType==="station" && (!selectedStation || !fieldKey || fieldValue==="")) { setError("Stansiyanı, sahəni və dəyəri doldurun."); return; }
    if (targetType==="grid" && (!selectedZone || !fieldKey || fieldValue==="")) { setError("Zonu, sahəni və dəyəri doldurun."); return; }
    const numVal = parseFloat(fieldValue);
    if (isNaN(numVal)) { setError("Dəyər rəqəm olmalıdır."); return; }
    if (targetType==="station") setSensorOverrides(prev=>({...prev,[selectedStation]:{...(prev[selectedStation]||{}),[fieldKey]:numVal}}));
    const label = targetType==="station" ? NODES.find(n=>n.id===selectedStation)?.label : selectedZone;
    const fLabel = targetType==="station" ? (sensorLabels[fieldKey]||fieldKey) : (zoneFieldLabels[fieldKey]||fieldKey);
    const { error: insertError } = await supabase.from('data_entries').insert([{
      actor_name:currentUser.name, actor_role:currentUser.role, target_type:targetType,
      target_name:label, field_name:fLabel, value:numVal, note,
      color:targetType==="station"?(NODES.find(n=>n.id===selectedStation)?.color||"#38bdf8"):"#38bdf8"
    }]);
    if (insertError) { setError("Məlumat qeydə alınmadı: "+insertError.message); return; }
    setFieldValue(""); setNote(""); setSaved(true); setTimeout(()=>setSaved(false), 2500);
  };

  if (!perms.canEnterData) return <PermissionBanner message="Məlumat daxil etmək üçün Operator və ya yuxarı hüquq lazımdır."/>;
  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
        <PenLine size={16} style={{color:"#38bdf8"}}/>
        <h3 style={{color:"#f1f5f9",fontSize:"0.85rem",fontWeight:800,margin:0}}>Manuel Məlumat Daxiletmə</h3>
      </div>
      {!isAllAccess&&<div style={{background:"rgba(56,189,248,0.06)",border:"1px solid rgba(56,189,248,0.15)",borderRadius:8,padding:"8px 12px",marginBottom:14,fontSize:"0.66rem",color:"#7dd3fc",display:"flex",alignItems:"center",gap:6}}><Shield size={11}/> Xidmət sahəniz: <strong>{userArea}</strong></div>}
      {saved&&<div style={{background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.25)",borderRadius:8,padding:"8px 12px",marginBottom:12,fontSize:"0.72rem",color:"#34d399",display:"flex",alignItems:"center",gap:6}}><CheckCircle size={12}/> Məlumat uğurla qeydə alındı</div>}
      {error&&<div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:8,padding:"8px 12px",marginBottom:12,fontSize:"0.7rem",color:"#fca5a5"}}>{error}</div>}
      <div style={{display:"flex",gap:6,marginBottom:14}}>
        {[{k:"station",l:"Stansiya",Icon:Cpu},{k:"grid",l:"Şəbəkə Zonu",Icon:Activity}].map(({k,l,Icon})=>(
          <button key={k} onClick={()=>{setTargetType(k);setFieldKey("");setStation("");setZone("");}} style={{flex:1,padding:"8px",borderRadius:8,border:`1px solid ${targetType===k?"rgba(56,189,248,0.4)":"rgba(56,189,248,0.1)"}`,background:targetType===k?"rgba(56,189,248,0.12)":"transparent",color:targetType===k?"#38bdf8":"#475569",cursor:"pointer",fontSize:"0.68rem",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}><Icon size={12}/>{l}</button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {targetType==="station"?(
          <><DarkSelect value={selectedStation} onChange={v=>{setStation(v);setFieldKey("");}} options={stationOpts} placeholder="Stansiyanı seçin"/>
          {selectedStation&&<DarkSelect value={fieldKey} onChange={setFieldKey} options={stationFieldOpts} placeholder="Sensor sahəsini seçin"/>}</>
        ):(
          <><DarkSelect value={selectedZone} onChange={v=>{setZone(v);setFieldKey("");}} options={zoneOpts} placeholder="Zonu seçin"/>
          {selectedZone&&<DarkSelect value={fieldKey} onChange={setFieldKey} options={zoneFieldOpts} placeholder="Sahəni seçin"/>}</>
        )}
        {fieldKey&&(<>
          <input type="number" step="0.01" placeholder="Yeni dəyər" value={fieldValue} onChange={e=>setFieldValue(e.target.value)} style={inp}/>
          <textarea placeholder="Qeyd (ixtiyari)" value={note} onChange={e=>setNote(e.target.value)} rows={2} style={{...inp,resize:"none"}}/>
          <button onClick={handleSubmit} style={{padding:"10px",borderRadius:9,background:"linear-gradient(135deg,rgba(56,189,248,0.18),rgba(14,165,233,0.1))",border:"1px solid rgba(56,189,248,0.35)",color:"#38bdf8",fontWeight:800,fontSize:"0.76rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Save size={13}/> Yadda Saxla</button>
        </>)}
      </div>
      {dataEntries.length>0&&(
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

// ── GRID PANEL ───────────────────────────────────────────────────────────────
function GridPanel({ sensors }) {
  const [liveZones, setLiveZones] = useState(DIST_ZONES.map(z=>({...z})));
  useEffect(()=>{
    const iv = setInterval(()=>{
      setLiveZones(prev=>prev.map(z=>({
        ...z,
        load: Math.max(1, Math.min(z.capacity, z.load + (Math.random()-0.48)*1.5)),
        health: Math.max(60, Math.min(100, z.health + (Math.random()-0.5)*0.3))
      })));
    }, 3000);
    return ()=>clearInterval(iv);
  },[]);

  const totalLoad = liveZones.reduce((s,z)=>s+z.load,0);
  const totalCap  = liveZones.reduce((s,z)=>s+z.capacity,0);
  const avgHealth = (liveZones.reduce((s,z)=>s+z.health,0)/liveZones.length).toFixed(1);
  const overloaded = liveZones.filter(z=>(z.load/z.capacity)>0.9).length;

  const loadBarData = liveZones.map(z=>({name:z.name.replace(" Rayonu","").replace(" Şəhər",""),load:+z.load.toFixed(1),cap:z.capacity}));

  return (
    <div>
      {/* KPI row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12,marginBottom:18}}>
        {[
          {label:"Ümumi Yük",    value:`${totalLoad.toFixed(1)} MW`,  sub:`${totalCap} MW gücün ${((totalLoad/totalCap)*100).toFixed(1)}%-i`, color:"#38bdf8", Icon:Activity},
          {label:"Şəbəkə Gücü", value:`${totalCap} MW`,              sub:`${liveZones.length} paylama zonu`,                                  color:"#10b981", Icon:Zap},
          {label:"Orta Sağlamlıq",value:`${avgHealth}%`,             sub:"Xətt infrastrukturu",                                               color:"#eab308", Icon:Shield},
          {label:"Həddaşımı",   value:overloaded,                    sub:`zona 90%-dən çox yüklü`,                                            color:overloaded>0?"#ef4444":"#10b981", Icon:AlertTriangle},
        ].map(({label,value,sub,color,Icon})=>(
          <div key={label} style={{background:"linear-gradient(135deg,rgba(6,12,28,0.9),rgba(4,8,20,0.95))",border:"1px solid rgba(56,189,248,0.12)",borderRadius:14,padding:16,display:"flex",gap:12,alignItems:"flex-start"}}>
            <div style={{width:36,height:36,borderRadius:10,background:`${color}15`,border:`1px solid ${color}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon size={17} style={{color}}/></div>
            <div>
              <div style={{fontSize:"0.6rem",color:"#475569",marginBottom:2}}>{label}</div>
              <div style={{fontSize:"1.1rem",fontWeight:900,color:"#f1f5f9",lineHeight:1}}>{value}</div>
              <div style={{fontSize:"0.58rem",color:"#334155",marginTop:2}}>{sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:14}}>
        {/* Zone cards */}
        <div>
          <div style={{fontSize:"0.65rem",color:"#64748b",fontWeight:700,letterSpacing:"0.08em",marginBottom:12,display:"flex",alignItems:"center",gap:6}}><Layers size={12}/> PAYLAMA ZONALARI – REAL VAXT</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:10}}>
            {liveZones.map(z=>{
              const pct = (z.load/z.capacity)*100;
              const col = pct>90?"#ef4444":pct>70?"#f59e0b":"#10b981";
              const healthCol = z.health>=90?"#10b981":z.health>=75?"#f59e0b":"#ef4444";
              return (
                <div key={z.name} style={{background:"linear-gradient(135deg,rgba(6,12,28,0.9),rgba(4,8,20,0.95))",border:`1px solid ${col}25`,borderRadius:12,padding:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div>
                      <div style={{fontSize:"0.72rem",fontWeight:800,color:"#f1f5f9"}}>{z.name}</div>
                      <div style={{fontSize:"0.58rem",color:"#334155",marginTop:2}}>Maks. güc: {z.capacity} MW</div>
                    </div>
                    <span style={{fontSize:"0.56rem",color:col,background:`${col}15`,border:`1px solid ${col}30`,borderRadius:4,padding:"2px 7px",fontWeight:800}}>
                      {pct>90?"HƏDD":"NORMAl"}
                    </span>
                  </div>
                  {/* Load bar */}
                  <div style={{marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:"0.6rem",color:"#64748b"}}>Yük</span>
                      <span style={{fontSize:"0.64rem",color:col,fontWeight:800}}>{z.load.toFixed(1)} / {z.capacity} MW ({pct.toFixed(0)}%)</span>
                    </div>
                    <div style={{height:6,background:"rgba(255,255,255,0.05)",borderRadius:99,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${Math.min(100,pct)}%`,background:`linear-gradient(90deg,${col}99,${col})`,borderRadius:99,transition:"width 0.6s ease",boxShadow:`0 0 6px ${col}60`}}/>
                    </div>
                  </div>
                  {/* Health bar */}
                  <div>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:"0.6rem",color:"#64748b"}}>İnfrastruktur Sağlamlığı</span>
                      <span style={{fontSize:"0.64rem",color:healthCol,fontWeight:800}}>{z.health.toFixed(1)}%</span>
                    </div>
                    <div style={{height:4,background:"rgba(255,255,255,0.05)",borderRadius:99,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${z.health}%`,background:`linear-gradient(90deg,${healthCol}80,${healthCol})`,borderRadius:99,transition:"width 0.6s ease"}}/>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {/* Load bar chart */}
          <div style={{background:"linear-gradient(135deg,rgba(6,12,28,0.9),rgba(4,8,20,0.95))",border:"1px solid rgba(56,189,248,0.12)",borderRadius:14,padding:16}}>
            <div style={{fontSize:"0.65rem",color:"#64748b",fontWeight:700,marginBottom:12}}>ZON YÜKÜ (MW)</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={loadBarData} margin={{top:0,right:0,bottom:0,left:-20}}>
                <CartesianGrid strokeDasharray="2 6" stroke="rgba(148,163,184,0.06)" vertical={false}/>
                <XAxis dataKey="name" tick={{fontSize:9,fill:"#475569"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:9,fill:"#475569"}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{background:"rgba(6,12,28,0.97)",border:"1px solid rgba(56,189,248,0.2)",borderRadius:8,fontSize:11}}/>
                <Bar dataKey="load" name="Yük" fill="#38bdf8" radius={[4,4,0,0]} opacity={0.85}/>
                <Bar dataKey="cap"  name="Güc" fill="rgba(56,189,248,0.12)" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Energy sources table */}
          <div style={{background:"linear-gradient(135deg,rgba(6,12,28,0.9),rgba(4,8,20,0.95))",border:"1px solid rgba(56,189,248,0.12)",borderRadius:14,padding:16,flex:1}}>
            <div style={{fontSize:"0.65rem",color:"#64748b",fontWeight:700,marginBottom:12,display:"flex",alignItems:"center",gap:6}}><Zap size={11}/> ENERJİ MƏNBƏLƏRİ – YÜKLƏMƏ</div>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {ENERGY_SOURCES.map(e=>{
                const pct = (e.cur/e.cap)*100;
                return (
                  <div key={e.name}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                      <span style={{fontSize:"0.62rem",color:"#94a3b8",display:"flex",alignItems:"center",gap:5}}>
                        <e.icon size={10} style={{color:e.color}}/>{e.name}
                      </span>
                      <span style={{fontSize:"0.62rem",color:e.color,fontWeight:700}}>{e.cur}/{e.cap} MW</span>
                    </div>
                    <div style={{height:4,background:"rgba(255,255,255,0.04)",borderRadius:99,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${pct}%`,background:e.color,borderRadius:99,opacity:0.8}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── STRATEGIES PANEL ─────────────────────────────────────────────────────────
function StrategiesPanel({ strategies, saveStrategy, perms, currentUser }) {
  const [showForm, setShowForm] = useState(false);
  const [filterCat, setFilterCat] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState("");
  const emptyForm = { title:"", category:"Enerji Səmərəliliyi", desc:"", roi:"", duration:"", annualSavings:"", impact:"", priority:"Orta", status:"Planlaşdırılıb", energySaved:"", co2Reduction:"", progress:0 };
  const [form, setForm] = useState(emptyForm);

  const inp = {width:"100%",boxSizing:"border-box",background:"linear-gradient(135deg,rgba(6,12,28,0.95),rgba(4,8,20,0.98))",border:"1px solid rgba(56,189,248,0.18)",borderRadius:9,padding:"9px 12px",color:"#e2e8f0",fontSize:"0.76rem",fontFamily:"inherit",outline:"none"};

  const filteredS = strategies.filter(s=>{
    if(filterCat!=="all" && s.category!==filterCat) return false;
    if(filterStatus!=="all" && s.status!==filterStatus) return false;
    return true;
  });

  const catOpts = [{value:"all",label:"Bütün Kateqoriyalar",colorDot:"#64748b"},...STRATEGY_CATEGORIES.map(c=>({value:c.value,label:c.value,colorDot:c.color}))];
  const statusOpts = [{value:"all",label:"Bütün Statuslar",colorDot:"#64748b"},...STATUS_OPTS.map(s=>({value:s.value,label:s.value,colorDot:s.color}))];

  const handleSave = async () => {
    if (!form.title) { setFormErr("Başlıq daxil edin."); return; }
    setSaving(true); setFormErr("");
    const catColor = STRATEGY_CATEGORIES.find(c=>c.value===form.category)?.color||"#3b82f6";
    const priColor = PRIORITY_OPTS.find(p=>p.value===form.priority)?.color||"#f59e0b";
    const stColor  = STATUS_OPTS.find(s=>s.value===form.status)?.color||"#64748b";
    await saveStrategy({ ...form, categoryColor:catColor, priorityColor:priColor, statusColor:stColor });
    setForm(emptyForm); setSaving(false); setShowForm(false);
  };

  // stats
  const completed = strategies.filter(s=>s.status==="Tamamlandı").length;
  const inProgress = strategies.filter(s=>s.status==="Davam edir").length;

  return (
    <div>
      {/* Header KPI */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:18}}>
        {[
          {label:"Cəmi Strategiya", value:strategies.length, color:"#38bdf8", Icon:Target},
          {label:"Davam Edir",      value:inProgress,        color:"#3b82f6", Icon:TrendingUp},
          {label:"Tamamlandı",      value:completed,         color:"#10b981", Icon:Award},
          {label:"Planlaşdırılıb",  value:strategies.filter(s=>s.status==="Planlaşdırılıb").length, color:"#f59e0b", Icon:Lightbulb},
        ].map(({label,value,color,Icon})=>(
          <div key={label} style={{background:"linear-gradient(135deg,rgba(6,12,28,0.9),rgba(4,8,20,0.95))",border:`1px solid ${color}20`,borderRadius:12,padding:"14px 16px",display:"flex",gap:12,alignItems:"center"}}>
            <div style={{width:34,height:34,borderRadius:9,background:`${color}15`,border:`1px solid ${color}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon size={16} style={{color}}/></div>
            <div>
              <div style={{fontSize:"0.6rem",color:"#475569"}}>{label}</div>
              <div style={{fontSize:"1.2rem",fontWeight:900,color:"#f1f5f9",lineHeight:1.1}}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:160}}>
          <DarkSelect value={filterCat} onChange={setFilterCat} options={catOpts} placeholder="Kateqoriya"/>
        </div>
        <div style={{flex:1,minWidth:140}}>
          <DarkSelect value={filterStatus} onChange={setFilterStatus} options={statusOpts} placeholder="Status"/>
        </div>
        {perms.canEditStrategies&&(
          <button onClick={()=>setShowForm(f=>!f)} style={{padding:"9px 16px",borderRadius:9,background:showForm?"rgba(56,189,248,0.15)":"rgba(56,189,248,0.08)",border:"1px solid rgba(56,189,248,0.3)",color:"#38bdf8",fontSize:"0.7rem",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>
            <Plus size={13}/> Yeni Strategiya
          </button>
        )}
      </div>

      {/* Add form */}
      {showForm&&perms.canEditStrategies&&(
        <div style={{background:"linear-gradient(135deg,rgba(6,12,28,0.95),rgba(4,8,20,0.98))",border:"1px solid rgba(56,189,248,0.2)",borderRadius:14,padding:20,marginBottom:18,animation:"fadeIn 0.2s ease"}}>
          <h3 style={{color:"#f1f5f9",fontSize:"0.82rem",fontWeight:800,marginBottom:14,margin:"0 0 14px"}}>Yeni Strategiya Əlavə Et</h3>
          {formErr&&<div style={{color:"#ef4444",fontSize:"0.7rem",background:"rgba(239,68,68,0.08)",borderRadius:7,padding:"7px 12px",marginBottom:12}}>{formErr}</div>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <input placeholder="Başlıq *" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} style={{...inp,gridColumn:"1/-1"}}/>
            <DarkSelect value={form.category} onChange={v=>setForm(f=>({...f,category:v}))} options={STRATEGY_CATEGORIES.map(c=>({value:c.value,label:c.value,colorDot:c.color}))} placeholder="Kateqoriya"/>
            <DarkSelect value={form.priority} onChange={v=>setForm(f=>({...f,priority:v}))} options={PRIORITY_OPTS.map(p=>({value:p.value,label:p.value,colorDot:p.color}))} placeholder="Prioritet"/>
            <DarkSelect value={form.status} onChange={v=>setForm(f=>({...f,status:v}))} options={STATUS_OPTS.map(s=>({value:s.value,label:s.value,colorDot:s.color}))} placeholder="Status"/>
            <input placeholder="ROI (məs: 24 ay)" value={form.roi} onChange={e=>setForm(f=>({...f,roi:e.target.value}))} style={inp}/>
            <input placeholder="Müddət (məs: 6 ay)" value={form.duration} onChange={e=>setForm(f=>({...f,duration:e.target.value}))} style={inp}/>
            <input placeholder="İllik qənaət (məs: 850,000 AZN)" value={form.annualSavings} onChange={e=>setForm(f=>({...f,annualSavings:e.target.value}))} style={inp}/>
            <input placeholder="Enerji qənaəti (məs: 2.1 GWh/il)" value={form.energySaved} onChange={e=>setForm(f=>({...f,energySaved:e.target.value}))} style={inp}/>
            <input placeholder="CO₂ azalması (məs: 1,470 ton/il)" value={form.co2Reduction} onChange={e=>setForm(f=>({...f,co2Reduction:e.target.value}))} style={inp}/>
            <input placeholder="Təsir (məs: Yüksək)" value={form.impact} onChange={e=>setForm(f=>({...f,impact:e.target.value}))} style={inp}/>
            <textarea placeholder="Açıqlama" value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} rows={2} style={{...inp,resize:"none",gridColumn:"1/-1"}}/>
          </div>
          <div style={{display:"flex",gap:8,marginTop:12}}>
            <button onClick={handleSave} disabled={saving} style={{flex:1,padding:"10px",borderRadius:9,background:"rgba(56,189,248,0.15)",border:"1px solid rgba(56,189,248,0.3)",color:"#38bdf8",fontWeight:800,fontSize:"0.76rem",cursor:saving?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,opacity:saving?0.6:1}}>
              {saving?<RefreshCw size={13} style={{animation:"spin 1s linear infinite"}}/>:<><Save size={13}/> Saxla</>}
            </button>
            <button onClick={()=>{setShowForm(false);setFormErr("");}} style={{padding:"10px 16px",borderRadius:9,background:"transparent",border:"1px solid rgba(255,255,255,0.08)",color:"#64748b",cursor:"pointer",fontSize:"0.76rem"}}>Ləğv Et</button>
          </div>
        </div>
      )}

      {/* Strategy cards */}
      {filteredS.length===0&&(
        <div style={{background:"linear-gradient(135deg,rgba(6,12,28,0.9),rgba(4,8,20,0.95))",border:"1px solid rgba(56,189,248,0.1)",borderRadius:14,padding:40,textAlign:"center",color:"#334155",fontSize:"0.76rem"}}>Strategiya tapılmadı</div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:12}}>
        {filteredS.map(s=>(
          <div key={s.id} style={{background:"linear-gradient(135deg,rgba(6,12,28,0.9),rgba(4,8,20,0.95))",border:`1px solid ${s.categoryColor}22`,borderRadius:14,padding:18,position:"relative",overflow:"hidden"}}>
            {/* top accent line */}
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${s.categoryColor},transparent)`}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,gap:8}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:"0.76rem",fontWeight:800,color:"#f1f5f9",marginBottom:4,lineHeight:1.3}}>{s.title}</div>
                <span style={{fontSize:"0.56rem",color:s.categoryColor,background:`${s.categoryColor}15`,border:`1px solid ${s.categoryColor}30`,borderRadius:4,padding:"2px 7px",fontWeight:700}}>{s.category}</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end",flexShrink:0}}>
                <span style={{fontSize:"0.56rem",color:s.priorityColor,background:`${s.priorityColor}12`,border:`1px solid ${s.priorityColor}25`,borderRadius:4,padding:"2px 7px",fontWeight:700}}>{s.priority}</span>
                <span style={{fontSize:"0.56rem",color:s.statusColor,background:`${s.statusColor}12`,border:`1px solid ${s.statusColor}25`,borderRadius:4,padding:"2px 7px",fontWeight:700}}>{s.status}</span>
              </div>
            </div>
            {s.desc&&<p style={{fontSize:"0.68rem",color:"#64748b",lineHeight:1.55,marginBottom:12,margin:"0 0 12px"}}>{s.desc}</p>}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:12}}>
              {[
                s.roi&&{l:"ROI",v:s.roi,c:"#eab308"},
                s.duration&&{l:"Müddət",v:s.duration,c:"#38bdf8"},
                s.annualSavings&&{l:"Qənaət",v:s.annualSavings,c:"#10b981"},
                s.energySaved&&{l:"Enerji",v:s.energySaved,c:"#f59e0b"},
                s.co2Reduction&&{l:"CO₂",v:s.co2Reduction,c:"#34d399"},
                s.impact&&{l:"Təsir",v:s.impact,c:"#a78bfa"},
              ].filter(Boolean).map(({l,v,c})=>(
                <div key={l} style={{background:`${c}08`,border:`1px solid ${c}18`,borderRadius:7,padding:"7px 10px"}}>
                  <div style={{fontSize:"0.56rem",color:"#475569",marginBottom:2}}>{l}</div>
                  <div style={{fontSize:"0.68rem",fontWeight:800,color:c}}>{v}</div>
                </div>
              ))}
            </div>
            {s.progress>0&&(
              <div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:"0.58rem",color:"#475569"}}>Tərəqqi</span>
                  <span style={{fontSize:"0.62rem",color:s.categoryColor,fontWeight:700}}>{s.progress}%</span>
                </div>
                <div style={{height:4,background:"rgba(255,255,255,0.04)",borderRadius:99,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${s.progress}%`,background:s.categoryColor,borderRadius:99}}/>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ADMIN PANEL ──────────────────────────────────────────────────────────────
function AdminPanel({ currentUser, perms, users, pending, activityLog }) {
  const [tab, setTab] = useState("pending");
  const [actionMsg, setActionMsg] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const showMsg = (m) => { setActionMsg(m); setTimeout(()=>setActionMsg(""), 3000); };

  const approveUser = async (user, assignRole) => {
    setProcessingId(user.id);
    const { error } = await supabase.from('users').update({ status:'approved', role: assignRole||user.role }).eq('id', user.id);
    if (error) showMsg("Xəta: "+error.message);
    else showMsg(`✓ ${user.full_name||user.username} təsdiqləndi`);
    setProcessingId(null);
  };

  const rejectUser = async (user) => {
    setProcessingId(user.id);
    const { error } = await supabase.from('users').update({ status:'rejected' }).eq('id', user.id);
    if (error) showMsg("Xəta: "+error.message);
    else showMsg(`✗ ${user.full_name||user.username} rədd edildi`);
    setProcessingId(null);
  };

  const blockUser = async (user) => {
    setProcessingId(user.id);
    const { error } = await supabase.from('users').update({ status:'blocked' }).eq('id', user.id);
    if (error) showMsg("Xəta: "+error.message);
    else showMsg(`⊘ ${user.full_name||user.username} bloklandı`);
    setProcessingId(null);
  };

  const changeRole = async (userId, newRole) => {
    const { error } = await supabase.from('users').update({ role: newRole }).eq('id', userId);
    if (!error) showMsg("Rol yeniləndi");
  };

  const adminTabs = [
    {k:"pending", l:"Gözləyənlər", Icon:Bell, badge:pending.length},
    {k:"users",   l:"İstifadəçilər", Icon:Users},
    ...(perms.canSeeActivityLog?[{k:"log", l:"Fəaliyyət Jurnalı", Icon:History}]:[])
  ];

  return (
    <div>
      {/* Action message */}
      {actionMsg&&(
        <div style={{background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.25)",borderRadius:9,padding:"9px 14px",marginBottom:14,fontSize:"0.72rem",color:"#34d399",display:"flex",alignItems:"center",gap:8,animation:"fadeIn 0.2s ease"}}>
          <CheckCircle size={13}/> {actionMsg}
        </div>
      )}

      {!perms.canSeeAdminTab&&<PermissionBanner message="Bu bölməyə daxil olmaq üçün Administrator və ya Baş Müavin hüququ lazımdır."/>}
      {perms.canSeeAdminTab&&(
        <>
          {/* inner tabs */}
          <div style={{display:"flex",gap:6,marginBottom:16,borderBottom:"1px solid rgba(56,189,248,0.08)",paddingBottom:0}}>
            {adminTabs.map(({k,l,Icon,badge})=>(
              <button key={k} onClick={()=>setTab(k)} style={{padding:"8px 14px",border:"none",borderBottom:`2px solid ${tab===k?"#38bdf8":"transparent"}`,background:"transparent",color:tab===k?"#38bdf8":"#475569",cursor:"pointer",fontSize:"0.68rem",fontWeight:700,display:"flex",alignItems:"center",gap:6,transition:"all 0.2s"}}>
                <Icon size={12}/>{l}
                {badge>0&&<span style={{background:"#ef4444",color:"#fff",fontSize:"0.5rem",borderRadius:"50%",width:14,height:14,display:"inline-flex",alignItems:"center",justifyContent:"center",fontWeight:900}}>{badge}</span>}
              </button>
            ))}
          </div>

          {/* Pending users */}
          {tab==="pending"&&(
            <div>
              <div style={{fontSize:"0.65rem",color:"#64748b",fontWeight:700,marginBottom:12,display:"flex",alignItems:"center",gap:6}}><Bell size={11}/> TƏSDİQ GÖZLƏYƏN MÜRACİƏTLƏR ({pending.length})</div>
              {pending.length===0&&<div style={{background:"linear-gradient(135deg,rgba(6,12,28,0.9),rgba(4,8,20,0.95))",border:"1px solid rgba(56,189,248,0.1)",borderRadius:12,padding:32,textAlign:"center",color:"#334155",fontSize:"0.76rem"}}>Gözləyən müraciət yoxdur</div>}
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {pending.map(u=>{
                  const rd = ROLES_DEF.find(r=>r.id===normalizeRole(u.role))||ROLES_DEF[3];
                  const isProc = processingId===u.id;
                  return (
                    <div key={u.id} style={{background:"linear-gradient(135deg,rgba(6,12,28,0.9),rgba(4,8,20,0.95))",border:"1px solid rgba(245,158,11,0.2)",borderRadius:12,padding:16}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:10}}>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                            <div style={{width:32,height:32,borderRadius:8,background:`${rd.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.65rem",fontWeight:900,color:rd.color,flexShrink:0}}>
                              {(u.full_name||u.username||"??").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
                            </div>
                            <div>
                              <div style={{fontSize:"0.76rem",fontWeight:800,color:"#f1f5f9"}}>{u.full_name||u.username}</div>
                              <div style={{fontSize:"0.62rem",color:"#475569",marginTop:1}}>@{u.username} · {u.email}</div>
                            </div>
                          </div>
                          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                            <RoleBadge role={normalizeRole(u.role)} size="sm"/>
                            {u.service_region&&<span style={{fontSize:"0.58rem",color:"#64748b",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:4,padding:"2px 7px"}}>{u.service_region}</span>}
                          </div>
                          {u.note&&<div style={{fontSize:"0.62rem",color:"#475569",marginTop:6,fontStyle:"italic",padding:"6px 10px",background:"rgba(255,255,255,0.02)",borderRadius:6}}>"{u.note}"</div>}
                        </div>
                        <div style={{fontSize:"0.58rem",color:"#334155",whiteSpace:"nowrap"}}>{relTime(u.created_at)}</div>
                      </div>
                      <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                        {perms.canManageAdmins&&(
                          <select onChange={e=>approveUser(u, e.target.value)} disabled={isProc}
                            style={{padding:"7px 10px",borderRadius:7,background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.3)",color:"#34d399",cursor:"pointer",fontSize:"0.65rem",fontWeight:700}}>
                            <option value="">✓ Təsdiqlə (rol seç)</option>
                            {ROLES_DEF.map(r=><option key={r.id} value={r.id}>{r.label}</option>)}
                          </select>
                        )}
                        {!perms.canManageAdmins&&(
                          <button onClick={()=>approveUser(u)} disabled={isProc} style={{padding:"7px 14px",borderRadius:7,background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.3)",color:"#34d399",cursor:"pointer",fontSize:"0.65rem",fontWeight:700,display:"flex",alignItems:"center",gap:5,opacity:isProc?0.5:1}}>
                            <UserCheck size={12}/> Təsdiqlə
                          </button>
                        )}
                        <button onClick={()=>rejectUser(u)} disabled={isProc} style={{padding:"7px 14px",borderRadius:7,background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",color:"#ef4444",cursor:"pointer",fontSize:"0.65rem",fontWeight:700,display:"flex",alignItems:"center",gap:5,opacity:isProc?0.5:1}}>
                          <UserX size={12}/> Rədd Et
                        </button>
                        {isProc&&<RefreshCw size={14} style={{color:"#64748b",animation:"spin 1s linear infinite"}}/>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Users list */}
          {tab==="users"&&(
            <div>
              <div style={{fontSize:"0.65rem",color:"#64748b",fontWeight:700,marginBottom:12,display:"flex",alignItems:"center",gap:6}}><Users size={11}/> AKTİV İSTİFADƏÇİLƏR ({users.length})</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {users.map(u=>{
                  const rd = ROLES_DEF.find(r=>r.id===u.role)||ROLES_DEF[3];
                  const isMe = u.id===currentUser.id;
                  return (
                    <div key={u.id} style={{background:"linear-gradient(135deg,rgba(6,12,28,0.9),rgba(4,8,20,0.95))",border:`1px solid ${rd.color}18`,borderRadius:11,padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
                      <div style={{width:34,height:34,borderRadius:9,background:`${rd.color}18`,border:`1px solid ${rd.color}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.62rem",fontWeight:900,color:rd.color,flexShrink:0}}>
                        {(u.name||u.username||"??").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                          <span style={{fontSize:"0.73rem",fontWeight:800,color:"#f1f5f9"}}>{u.name||u.username}</span>
                          {isMe&&<span style={{fontSize:"0.52rem",color:"#38bdf8",background:"rgba(56,189,248,0.1)",border:"1px solid rgba(56,189,248,0.2)",borderRadius:3,padding:"1px 5px"}}>SİZ</span>}
                        </div>
                        <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                          <RoleBadge role={u.role} size="xs"/>
                          {u.serviceArea&&<span style={{fontSize:"0.56rem",color:"#475569"}}>{u.serviceArea}</span>}
                        </div>
                      </div>
                      {perms.canManageOps&&!isMe&&(
                        <div style={{display:"flex",gap:6,alignItems:"center"}}>
                          <select value={u.role} onChange={e=>changeRole(u.id, e.target.value)}
                            style={{padding:"5px 8px",borderRadius:6,background:"rgba(56,189,248,0.06)",border:"1px solid rgba(56,189,248,0.15)",color:"#94a3b8",cursor:"pointer",fontSize:"0.62rem"}}>
                            {ROLES_DEF.filter(r=>perms.canManageAdmins?true:r.id!=="admin"&&r.id!=="vice_admin").map(r=>
                              <option key={r.id} value={r.id}>{r.label}</option>
                            )}
                          </select>
                          <button onClick={()=>blockUser(u)} title="Blokla" style={{padding:"5px 8px",borderRadius:6,background:"rgba(239,68,68,0.07)",border:"1px solid rgba(239,68,68,0.18)",color:"#ef4444",cursor:"pointer",fontSize:"0.6rem",display:"flex",alignItems:"center",gap:4}}>
                            <ShieldOff size={10}/> Blokla
                          </button>
                        </div>
                      )}
                      <span style={{fontSize:"0.56rem",color:`${u.status==="blocked"?"#ef4444":u.status==="active"?"#10b981":"#64748b"}`,background:`${u.status==="blocked"?"rgba(239,68,68,0.08)":u.status==="active"?"rgba(16,185,129,0.08)":"rgba(100,116,139,0.08)"}`,border:`1px solid ${u.status==="blocked"?"rgba(239,68,68,0.2)":u.status==="active"?"rgba(16,185,129,0.2)":"rgba(100,116,139,0.15)"}`,borderRadius:4,padding:"2px 7px",fontWeight:700,flexShrink:0}}>
                        {u.status==="blocked"?"BLOK":u.status==="active"?"AKTİV":"—"}
                      </span>
                    </div>
                  );
                })}
                {users.length===0&&<div style={{textAlign:"center",color:"#334155",padding:32,fontSize:"0.76rem"}}>İstifadəçi yoxdur</div>}
              </div>
            </div>
          )}

          {/* Activity log */}
          {tab==="log"&&perms.canSeeActivityLog&&(
            <div>
              <div style={{fontSize:"0.65rem",color:"#64748b",fontWeight:700,marginBottom:12,display:"flex",alignItems:"center",gap:6}}><History size={11}/> FƏALİYYƏT JURNALI</div>
              {activityLog.length===0&&<div style={{background:"linear-gradient(135deg,rgba(6,12,28,0.9),rgba(4,8,20,0.95))",border:"1px solid rgba(56,189,248,0.1)",borderRadius:12,padding:32,textAlign:"center",color:"#334155",fontSize:"0.76rem"}}>Hələ heç bir fəaliyyət qeydə alınmayıb</div>}
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {activityLog.map((entry,i)=>(
                  <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"10px 14px",background:"rgba(255,255,255,0.02)",borderRadius:9,border:"1px solid rgba(56,189,248,0.07)"}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:"#38bdf8",marginTop:5,flexShrink:0}}/>
                    <div style={{flex:1}}>
                      <span style={{fontSize:"0.7rem",color:"#e2e8f0"}}>{entry.action}</span>
                      <div style={{fontSize:"0.58rem",color:"#334155",marginTop:2}}>{entry.actor} · {relTime(entry.time)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── AUTH ─────────────────────────────────────────────────────────────────────
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
    setError(""); setLoading(true);
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
          <div style={{width:52,height:52,borderRadius:14,background:"linear-gradient(135deg,rgba(56,189,248,0.2),rgba(14,165,233,0.1))",border:"1px solid rgba(56,189,248,0.3)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}><Zap size={26} style={{color:"#38bdf8"}}/></div>
          <h1 style={{color:"#f1f5f9",fontSize:"1.1rem",fontWeight:900,marginBottom:4}}>Naxçıvan Enerji İdarəetmə Sistemi</h1>
          <p style={{color:"#334155",fontSize:"0.7rem"}}>{mode==="login"?"Hesabınıza daxil olun":"Yeni hesab tələb edin"}</p>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:22}}>
          {[{k:"login",l:"Giriş",Icon:LogIn},{k:"register",l:"Qeydiyyat",Icon:UserPlus}].map(({k,l,Icon})=>(
            <button key={k} onClick={()=>{setMode(k);setError("");}} style={{flex:1,padding:"8px",borderRadius:8,border:`1px solid ${mode===k?"rgba(56,189,248,0.4)":"rgba(56,189,248,0.1)"}`,background:mode===k?"rgba(56,189,248,0.12)":"transparent",color:mode===k?"#38bdf8":"#475569",cursor:"pointer",fontSize:"0.72rem",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Icon size={13}/>{l}</button>
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
            {loading?<RefreshCw size={14} style={{animation:"spin 1s linear infinite"}}/>:mode==="login"?<><LogIn size={14}/>Daxil Ol</>:<><UserPlus size={14}/>Müraciət Et</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MESSAGING PANEL ───────────────────────────────────────────────────────────
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
    if(tab==="sent") return m.fromId===currentUser.id;
    return false;
  });
  const unread = messages.filter(m=>(m.toId===currentUser.id||(m.type==="broadcast"&&m.fromId!==currentUser.id))&&!(m.readBy||[]).includes(currentUser.id)).length;
  const recipientOpts = [
    ...(perms.canBroadcast?[{value:"broadcast",label:"📢 Hər Kəs (Broadcast)",colorDot:"#f97316"}]:[]),
    ...users.filter(u=>u.id!==currentUser.id).map(u=>({value:String(u.id),label:u.name,sub:ROLES_DEF.find(r=>r.id===u.role)?.label,colorDot:ROLES_DEF.find(r=>r.id===u.role)?.color||"#64748b"}))
  ];
  const handleSend = async () => {
    if (!subject||!body) return;
    const isBroadcast = recipient==="broadcast";
    const toUser = isBroadcast?null:users.find(u=>String(u.id)===recipient);
    const { error } = await supabase.from('messages').insert([{from_id:currentUser.id,from_name:currentUser.name,from_avatar:currentUser.avatar,from_role:currentUser.role,to_id:isBroadcast?null:(toUser?.id||null),to_name:isBroadcast?"Hamı":(toUser?.name||""),subject,body,priority,type:isBroadcast?"broadcast":"direct",read_by:[currentUser.id]}]);
    if (!error) { setCompose(false);setSubj("");setBody("");setRec("broadcast");setPri("normal"); }
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
              <div style={{fontSize:"0.65rem",color:"#475569",marginTop:4}}><span style={{color:"#94a3b8"}}>{msg.fromName}</span> → <span style={{color:"#94a3b8"}}>{msg.toName||"Hamı"}</span> · {relTime(msg.timestamp)}</div>
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

// ── ANA KOMPONENT ─────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [pending, setPending] = useState([]);
  const [activityLog, setActLog] = useState([]);
  const { messages, setMessages } = useSupabaseMessages();
  const { alerts, setAlerts } = useSupabaseAlerts();
  const { dataEntries, setDataEntries } = useSupabaseDataEntries();
  const { strategies, setStrategies } = useSupabaseStrategies();
  const [sensorOverrides, setSensorOverrides] = useState({});

  useEffect(() => {
    const loadPending = async () => {
      const { data, error } = await supabase.from('users').select('*').eq('status','pending');
      if (!error && data) setPending(data);
    };
    loadPending();
    const ch = supabase.channel('pending-users').on('postgres_changes',{event:'*',schema:'public',table:'users'},()=>loadPending()).subscribe();
    return ()=>supabase.removeChannel(ch);
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      const { data, error } = await supabase.from('users').select('*').eq('status','approved');
      if (!error && data) setUsers((data||[]).map(u=>({...u,name:u.full_name||u.name||u.username,role:normalizeRole(u.role),serviceArea:u.service_region||"Bütün Ərazilər",avatar:(u.full_name||u.name||u.username||"??").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(),status:u.status||"active"})));
    };
    loadUsers();
    const ch = supabase.channel('approved-users').on('postgres_changes',{event:'*',schema:'public',table:'users'},()=>loadUsers()).subscribe();
    return ()=>supabase.removeChannel(ch);
  }, []);

  const [activeTab, setTab] = useState("overview");
  const [selNodeIds, setSelNodeIds] = useState([NODES[0].id, NODES[1].id]);
  const [chartHistory, setChartHist] = useState(CONS_HISTORY);
  const [filterSev, setFilterSev] = useState("all");

  const rawSensors = useSensors();
  const sensors = Object.fromEntries(NODES.map(n=>[n.id,{...rawSensors[n.id],...(sensorOverrides[n.id]||{})}]));

  useEffect(() => {
    const iv = setInterval(() => {
      const now = new Date();
      const label = `${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`;
      const totalOutput = ENERGY_SOURCES.reduce((s,e)=>s+e.cur,0);
      const noise = (Math.random()-0.5)*4;
      setChartHist(prev=>[...prev.slice(-23),{t:label,i:+(totalOutput+noise).toFixed(1),p:+(totalOutput-1+noise).toFixed(1)}]);
    }, 8000);
    return ()=>clearInterval(iv);
  }, []);

  const handleLogin = async (username, password) => {
    if (!username||!password) return {ok:false,msg:"İstifadəçi adı və şifrəni daxil edin."};
    const {data,error} = await supabase.from('users').select('*').eq('username',username).eq('password',password).single();
    if (error||!data) return {ok:false,msg:"İstifadəçi adı və ya şifrə yanlışdır."};
    if (data.status==='pending') return {ok:false,msg:"Hesabınız hələ təsdiqlənməyib."};
    if (data.status==='rejected') return {ok:false,msg:"Hesab müraciətiniz rədd edilib."};
    if (data.status==='blocked') return {ok:false,msg:"Hesabınız bloklanıb."};
    const normalizedRole = normalizeRole(data.role);
    const userName = data.full_name||data.name||data.username;
    setCurrentUser({...data,id:data.id,name:userName,role:normalizedRole,serviceArea:data.service_region||"Bütün Ərazilər",avatar:userName.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()});
    return {ok:true};
  };

  const handleRegister = async (formData) => {
    try {
      const {data:existing} = await supabase.from('users').select('id').eq('username',formData.username).maybeSingle();
      if (existing) return {error:"Bu istifadəçi adı artıq mövcuddur."};
      const {data:existingEmail} = await supabase.from('users').select('id').eq('email',formData.email).maybeSingle();
      if (existingEmail) return {error:"Bu e-poçt artıq qeydiyyatdadır."};
      const {error} = await supabase.from('users').insert([{username:formData.username,password:formData.password,full_name:formData.name,email:formData.email,role:formData.requestedRole||'viewer',status:'pending',service_region:formData.serviceArea,note:formData.note||""}]).select();
      if (error) return {error:`Xəta: ${error.message}`};
      return {ok:true};
    } catch(err) { return {error:"Gözlənilməz xəta baş verdi."}; }
  };

  const handleLogout = () => { setCurrentUser(null); setTab("overview"); };

  const saveStrategy = async (s) => {
    const {error} = await supabase.from('strategies').insert([{title:s.title,category:s.category,category_color:s.categoryColor||"#3b82f6",description:s.desc,roi:s.roi,duration:s.duration,annual_savings:s.annualSavings||"",impact:s.impact||"",priority:s.priority||"Orta",priority_color:s.priorityColor||"#f59e0b",status:s.status||"Planlaşdırılıb",status_color:s.statusColor||"#f59e0b",energy_saved:s.energySaved||"",co2_reduction:s.co2Reduction||"",progress:s.progress||0,completed:s.completed||false}]);
    if (error) console.error("Strategy insert error:",error);
  };

  const addAlert = async (a) => {
    const {error} = await supabase.from('alerts').insert([{station_name:a.node,component:a.component,severity:a.severity,message:a.message,note:a.note}]);
    if (error) console.error("Alert insert error:",error);
  };

  const removeAlert = async (id) => { await supabase.from('alerts').delete().eq('id',id); };

  const toggleNode = (id) => setSelNodeIds(prev=>prev.includes(id)?(prev.length>1?prev.filter(x=>x!==id):prev):[...prev,id]);

  const filteredAlerts = alerts.filter(a=>filterSev==="all"||a.severity===filterSev);
  const unreadMsgs = currentUser ? messages.filter(m=>(m.toId===currentUser.id||(m.type==="broadcast"&&m.fromId!==currentUser.id))&&!(m.readBy||[]).includes(currentUser.id)).length : 0;
  const perms = getPerms(currentUser);

  if (!currentUser) return <AuthScreen onLogin={handleLogin} onRegister={handleRegister}/>;

  const TABS = [
    {k:"overview",   l:"Ümumi Baxış",    Icon:BarChart2},
    {k:"stations",   l:"Stansiyalar",    Icon:Cpu},
    {k:"grid",       l:"Şəbəkə",         Icon:Activity},
    {k:"dataentry",  l:"Məlumat Daxilet",Icon:PenLine},
    {k:"strategies", l:"Strategiyalar",  Icon:Leaf},
    {k:"incidents",  l:"Hadisələr",      Icon:AlertTriangle},
    {k:"messages",   l:"Mesajlar",       Icon:MessageSquare, badge:unreadMsgs},
    ...(perms.canSeeAdminTab?[{k:"admin",l:"Admin",Icon:Crown,badge:pending.length}]:[])
  ];

  const card = (extra={}) => ({background:"linear-gradient(135deg,rgba(6,12,28,0.9),rgba(4,8,20,0.95))",border:"1px solid rgba(56,189,248,0.12)",borderRadius:14,padding:18,backdropFilter:"blur(10px)",...extra});

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
          <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,rgba(56,189,248,0.2),rgba(14,165,233,0.1))",border:"1px solid rgba(56,189,248,0.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Zap size={20} style={{color:"#38bdf8"}}/></div>
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
          <button onClick={handleLogout} style={{padding:"5px 10px",borderRadius:7,background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",color:"#ef4444",cursor:"pointer",fontSize:"0.62rem",display:"flex",alignItems:"center",gap:4}}><LogOut size={10}/>Çıx</button>
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

        {/* OVERVIEW */}
        {activeTab==="overview"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14,marginBottom:20}}>
              {[
                {label:"Ümumi İstehsal",   value:`${totalOutput.toFixed(1)} MW`,   sub:`Gücün ${gridEfficiency}%-i`,          color:"#38bdf8", Icon:Zap},
                {label:"Sistem Gücü",      value:`${totalCapacity} MW`,             sub:`${ENERGY_SOURCES.length} mənbə`,     color:"#10b981", Icon:Battery},
                {label:"Şəbəkə Fəallığı", value:`${gridEfficiency}%`,              sub:"Real vaxt",                          color:"#eab308", Icon:TrendingUp},
                {label:"Aktiv Hadisələr",  value:filteredAlerts.filter(a=>a.severity==="yüksək").length, sub:`${filteredAlerts.length} ümumilikdə`, color:"#ef4444", Icon:AlertTriangle},
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
              </div>
            </div>
          </div>
        )}

        {/* STATIONS */}
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
                        const labels={boilerTemp:"Qazan Temp",steamPressure:"Buxar Təzyiqi",output:"Çıxış Gücü",waterLevel:"Su Səviyyəsi",turbineRpm:"Türbin RPM",panelTemp:"Panel Temp",efficiency:"Səmərəlilik",rpm:"Fırlanma",bearingTemp:"Yataq Temp",vibration:"Vibrasiya"};
                        const units={boilerTemp:"°C",steamPressure:"MPa",output:"MW",waterLevel:"m",turbineRpm:"RPM",panelTemp:"°C",efficiency:"%",rpm:"RPM",bearingTemp:"°C",vibration:"mm/s"};
                        const isOverridden = sensorOverrides[n.id]?.[k]!==undefined;
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

        {/* GRID */}
        {activeTab==="grid"&&(
          <GridPanel sensors={sensors}/>
        )}

        {/* DATA ENTRY */}
        {activeTab==="dataentry"&&(
          <div style={{display:"grid",gridTemplateColumns:"380px 1fr",gap:14}}>
            <div style={card()}>
              <ManualDataEntryPanel currentUser={currentUser} perms={perms} sensors={sensors} setSensorOverrides={setSensorOverrides} dataEntries={dataEntries} setDataEntries={setDataEntries}/>
            </div>
            <div style={card()}>
              <div style={{fontSize:"0.7rem",color:"#64748b",fontWeight:700,marginBottom:14,display:"flex",alignItems:"center",gap:6}}><Database size={13}/> MƏLUMAT GİRİŞ TARİXÇƏSİ</div>
              {dataEntries.length===0?(
                <div style={{textAlign:"center",padding:"32px 0",color:"#334155",fontSize:"0.72rem"}}>Hələ heç bir məlumat daxil edilməyib</div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {dataEntries.slice(0,15).map(e=>(
                    <div key={e.id} style={{display:"grid",gridTemplateColumns:"auto 1fr auto auto auto",gap:12,alignItems:"center",padding:"10px 14px",background:"rgba(255,255,255,0.02)",borderRadius:9,border:`1px solid ${e.color}18`}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:e.color,boxShadow:`0 0 6px ${e.color}60`}}/>
                      <div>
                        <div style={{fontSize:"0.7rem",color:"#e2e8f0",fontWeight:700}}>{e.target}</div>
                        <div style={{fontSize:"0.62rem",color:"#475569",marginTop:1}}>{e.field}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:"0.75rem",fontWeight:800,color:e.color}}>{e.value}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:"0.65rem",color:"#64748b"}}>{e.actor}</div>
                      </div>
                      <RoleBadge role={e.actorRole} size="xs"/>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STRATEGIES */}
        {activeTab==="strategies"&&(
          <StrategiesPanel strategies={strategies} saveStrategy={saveStrategy} perms={perms} currentUser={currentUser}/>
        )}

        {/* INCIDENTS */}
        {activeTab==="incidents"&&(
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
                          <span style={{fontSize:"0.65rem",color:"#94a3b8",fontWeight:700}}>{a.node}</span>
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
        )}

        {/* MESSAGES */}
        {activeTab==="messages"&&(
          <div style={card()}>
            <MessagingPanel currentUser={currentUser} users={users} messages={messages} onSend={()=>{}} perms={perms}/>
          </div>
        )}

        {/* ADMIN */}
        {activeTab==="admin"&&(
          <div style={card()}>
            <AdminPanel currentUser={currentUser} perms={perms} users={users} pending={pending} activityLog={activityLog}/>
          </div>
        )}

      </main>
    </div>
  );
}
