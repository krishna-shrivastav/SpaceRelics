// SPACE RELICS V3 — browser-local research tools, mission registry, NASA APOD and learning academy.
(() => {
  const $ = (s) => document.querySelector(s);
  const safe = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } };
  const missions = [
    {id:"apollo11",name:"Apollo 11",body:"Moon",year:1969,craft:"Lunar Module Eagle",place:"Sea of Tranquility",type:"Crewed lunar landing",summary:"The first crewed lunar landing. Neil Armstrong and Buzz Aldrin explored the surface while Michael Collins remained in lunar orbit. Eagle's ascent stage returned the surface crew to orbit; its descent stage stayed behind.",link:"https://science.nasa.gov/mission/apollo-11/"},
    {id:"apollo12",name:"Apollo 12",body:"Moon",year:1969,craft:"Lunar Module Intrepid",place:"Ocean of Storms",type:"Precision lunar landing",summary:"The second crewed lunar landing demonstrated precision landing capability and visited the Surveyor 3 spacecraft.",link:"https://science.nasa.gov/mission/apollo-12/"},
    {id:"apollo14",name:"Apollo 14",body:"Moon",year:1971,craft:"Lunar Module Antares",place:"Fra Mauro",type:"Crewed lunar landing",summary:"Apollo 14 explored the Fra Mauro region and continued the scientific exploration of the lunar highlands.",link:"https://science.nasa.gov/mission/apollo-14/"},
    {id:"apollo15",name:"Apollo 15",body:"Moon",year:1971,craft:"Lunar Module Falcon",place:"Hadley–Apennine",type:"Extended lunar exploration",summary:"Apollo 15 introduced the Lunar Roving Vehicle on the Moon and expanded surface exploration with longer traverses.",link:"https://science.nasa.gov/mission/apollo-15/"},
    {id:"apollo16",name:"Apollo 16",body:"Moon",year:1972,craft:"Lunar Module Orion",place:"Descartes Highlands",type:"Crewed lunar landing",summary:"Apollo 16 investigated the lunar highlands and returned samples and observations that improved understanding of lunar geology.",link:"https://science.nasa.gov/mission/apollo-16/"},
    {id:"apollo17",name:"Apollo 17",body:"Moon",year:1972,craft:"Lunar Module Challenger",place:"Taurus–Littrow",type:"Final Apollo lunar landing",summary:"The final crewed Apollo lunar landing combined extensive field geology with the longest Apollo lunar surface stay.",link:"https://science.nasa.gov/mission/apollo-17/"},
    {id:"viking1",name:"Viking 1",body:"Mars",year:1976,craft:"Viking lander",place:"Chryse Planitia",type:"Robotic lander",summary:"Viking 1 became the first US spacecraft to successfully operate on the Martian surface and returned images and biological experiment results.",link:"https://science.nasa.gov/mission/viking-1/"},
    {id:"pathfinder",name:"Mars Pathfinder",body:"Mars",year:1997,craft:"Pathfinder + Sojourner",place:"Ares Vallis",type:"Lander and rover",summary:"Pathfinder delivered Sojourner, the first rover to operate on Mars, demonstrating a lower-cost landing and surface mobility approach.",link:"https://science.nasa.gov/mission/mars-pathfinder/"},
    {id:"spirit",name:"Mars Exploration Rover Spirit",body:"Mars",year:2004,craft:"Spirit rover",place:"Gusev Crater",type:"Robotic rover",summary:"Spirit investigated rocks and soils in Gusev Crater and found evidence of past water-related environments.",link:"https://science.nasa.gov/mission/mer-spirit/"},
    {id:"opportunity",name:"Mars Exploration Rover Opportunity",body:"Mars",year:2004,craft:"Opportunity rover",place:"Meridiani Planum",type:"Robotic rover",summary:"Opportunity explored Meridiani Planum and uncovered geological evidence that liquid water had influenced the region in the past.",link:"https://science.nasa.gov/mission/mer-opportunity/"},
    {id:"curiosity",name:"Mars Science Laboratory",body:"Mars",year:2012,craft:"Curiosity rover",place:"Gale Crater",type:"Robotic science laboratory",summary:"Curiosity studies Mars habitability, geology and climate while climbing the layered terrain of Mount Sharp.",link:"https://science.nasa.gov/mission/msl-curiosity/"},
    {id:"insight",name:"InSight",body:"Mars",year:2018,craft:"InSight lander",place:"Elysium Planitia",type:"Geophysical lander",summary:"InSight studied the deep interior of Mars using seismic measurements and heat-flow investigations.",link:"https://science.nasa.gov/mission/insight/"},
    {id:"perseverance",name:"Mars 2020",body:"Mars",year:2021,craft:"Perseverance rover + Ingenuity",place:"Jezero Crater",type:"Sample-caching rover",summary:"Perseverance explores Jezero Crater, studies ancient environments and collects samples for possible future return. Ingenuity demonstrated powered flight on another world.",link:"https://science.nasa.gov/mission/mars-2020-perseverance/"},
    {id:"viper",name:"VIPER",body:"Moon",year:2020,craft:"Volatiles Investigating Polar Exploration Rover",place:"Lunar South Pole (planned)",type:"Robotic lunar rover programme",summary:"VIPER was developed to investigate lunar polar resources. NASA cancelled the agency-led rover project in 2024; this record is included as a programme-history case study, not as a completed lunar landing.",link:"https://www.nasa.gov/"},
    {id:"lro",name:"Lunar Reconnaissance Orbiter",body:"Moon",year:2009,craft:"LRO orbiter",place:"Lunar orbit",type:"Orbital science mission",summary:"LRO maps the Moon and provides data used to understand surface topography, illumination, temperature and potential landing regions.",link:"https://science.nasa.gov/mission/lro/"}
  ];
  const era = y => `${Math.floor(y/10)*10}s`;
  const missionGrid=$("#missionGrid"), missionDetail=$("#missionDetail");
  function renderMissions(){
    const q=($("#missionSearch")?.value||"").toLowerCase(), body=$("#missionBody")?.value||"all", decade=$("#missionEra")?.value||"all";
    const filtered=missions.filter(m=>(body==="all"||m.body===body)&&(decade==="all"||era(m.year)===decade)&&`${m.name} ${m.craft} ${m.place} ${m.summary}`.toLowerCase().includes(q));
    $("#missionCount").textContent=`${filtered.length} / ${missions.length} MISSIONS`;
    missionGrid.innerHTML=filtered.map(m=>`<article class="mission-card" data-mission="${m.id}"><span class="mission-year">${m.year}</span><small>${m.body.toUpperCase()} · ${safe(m.type.toUpperCase())}</small><h4>${safe(m.name)}</h4><p>${safe(m.craft)} · ${safe(m.place)}</p><button data-open-mission="${m.id}">OPEN DOSSIER ↗</button></article>`).join("")||`<div class="detail-placeholder"><b>No matching mission</b><p>Try a different keyword or filter.</p></div>`;
  }
  function openMission(id){
    const m=missions.find(x=>x.id===id);if(!m)return;
    document.querySelectorAll(".mission-card").forEach(c=>c.classList.toggle("active",c.dataset.mission===id));
    missionDetail.innerHTML=`<small class="eyebrow">${m.body.toUpperCase()} · ${m.year} · ${safe(m.type.toUpperCase())}</small><h3>${safe(m.name)}</h3><p><b>Spacecraft:</b> ${safe(m.craft)} &nbsp;·&nbsp; <b>Destination:</b> ${safe(m.place)}</p><p>${safe(m.summary)}</p><div class="mission-detail-links"><a href="${m.link}" target="_blank" rel="noopener">NASA MISSION RECORD ↗</a><button class="outline-btn small" data-save-mission="${m.id}">☆ SAVE TO COLLECTION</button></div>`;
  }
  ["missionSearch","missionBody","missionEra"].forEach(id=>$("#"+id)?.addEventListener(id==="missionSearch"?"input":"change",renderMissions));
  missionGrid?.addEventListener("click",e=>{const b=e.target.closest("[data-open-mission]");if(b)openMission(b.dataset.openMission);});
  renderMissions();

  // NASA APOD — current WordPress-based endpoint listed by NASA's API portal.
  async function loadAPOD(){
    $("#apodTitle").textContent="Loading today's astronomy feature…";$("#apodMedia").innerHTML='<div class="apod-loading">REQUESTING NASA DAILY FEATURE…</div>';
    try{
      const r=await fetch("https://science.nasa.gov/wp-json/wp/v2/apod-basic/?api_key=DEMO_KEY");
      if(!r.ok)throw new Error(`NASA service returned ${r.status}`);
      const payload=await r.json(), a=Array.isArray(payload)?payload[0]:payload;
      if(!a)throw new Error("No APOD record was returned");
      $("#apodDate").textContent=`NASA DAILY FEATURE · ${safe(a.date||"LATEST")}`;
      $("#apodTitle").textContent=a.title||"Astronomy Picture of the Day";
      $("#apodExplanation").textContent=a.explanation||a.basic_html||"Open the NASA feature for its full explanation.";
      $("#apodCredit").textContent=[a.credit,a.copyright].filter(Boolean).join(" · ");
      $("#apodLink").href=a.permalink||a.url||"https://science.nasa.gov/solar-system/";
      const media=a.media_type==="video"?`<iframe title="NASA astronomy video" src="${safe(a.url||"")}" allowfullscreen loading="lazy"></iframe>`:`<img src="${safe(a.hdurl||a.url||"")}" alt="${safe(a.alt||a.title||"NASA Astronomy Picture of the Day")}" loading="lazy">`;
      $("#apodMedia").innerHTML=media;
    }catch(err){$("#apodMedia").innerHTML='<div class="apod-loading">NASA DAILY FEATURE IS TEMPORARILY UNAVAILABLE</div>';$("#apodTitle").textContent="The universe is still out there.";$("#apodExplanation").textContent=`${err.message}. Try again later or explore the NASA archive search above.`;}
  }
  $("#apodRefresh")?.addEventListener("click",loadAPOD);loadAPOD();

  // Browser-local research desk
  let notes=read("sr_v3_notes",[]), saved=read("sr_v3_saved",[]);
  function renderNotes(){
    $("#noteList").innerHTML=notes.map((n,i)=>`<article class="note-item"><b>${safe(n.title)}</b><p>${safe(n.body.slice(0,170))}${n.body.length>170?"…":""}</p><button data-delete-note="${i}">DELETE NOTE ×</button></article>`).join("")||'<p class="workspace-hint">No notes yet. Save your first field note above.</p>';
  }
  function renderSaved(){
    $("#savedCount").textContent=`${saved.length} SAVED`;
    $("#savedCollection").innerHTML=saved.map((s,i)=>`<article class="saved-item"><b>${safe(s.name)}</b><p>${safe(s.meta||"SPACE RELICS ARCHIVE")}</p><button data-remove-saved="${i}">REMOVE ×</button></article>`).join("")||'<div class="detail-placeholder"><span>☆</span><b>Your collection is waiting</b><p>Save a mission or relic from its card.</p></div>';
  }
  function saveItem(item){
    if(saved.some(x=>x.id===item.id)){toast("Already saved to your collection.");return;}
    saved.unshift(item);write("sr_v3_saved",saved);renderSaved();toast("Added to your research collection.");
  }
  function toast(msg){const t=$("#toast");if(t){t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200);}}
  $("#saveFieldNote")?.addEventListener("click",()=>{
    const title=$("#fieldNoteTitle").value.trim(),body=$("#fieldNoteBody").value.trim();
    if(!title||!body){toast("Add a title and note before saving.");return;}
    notes.unshift({title,body,date:new Date().toISOString()});write("sr_v3_notes",notes);$("#fieldNoteTitle").value="";$("#fieldNoteBody").value="";renderNotes();$("#noteSavedState").textContent="SAVED LOCALLY";toast("Field note saved on this device.");
  });
  $("#noteList")?.addEventListener("click",e=>{const b=e.target.closest("[data-delete-note]");if(b){notes.splice(Number(b.dataset.deleteNote),1);write("sr_v3_notes",notes);renderNotes();}});
  $("#savedCollection")?.addEventListener("click",e=>{const b=e.target.closest("[data-remove-saved]");if(b){saved.splice(Number(b.dataset.removeSaved),1);write("sr_v3_saved",saved);renderSaved();}});
  $("#clearSaved")?.addEventListener("click",()=>{if(confirm("Clear all saved items from this browser?")){saved=[];write("sr_v3_saved",saved);renderSaved();}});
  $("#exportResearch")?.addEventListener("click",()=>{
    const payload={exportedAt:new Date().toISOString(),notes,saved,notice:"SPACE RELICS local research export. Verify facts and cite original sources."};
    download("space-relics-research.json",JSON.stringify(payload,null,2),"application/json");
  });
  document.addEventListener("click",e=>{
    const b=e.target.closest("[data-save-mission]");if(b){const m=missions.find(x=>x.id===b.dataset.saveMission);if(m)saveItem({id:m.id,name:m.name,meta:`${m.body} · ${m.year} · ${m.place}`});}
    const relic=e.target.closest("[data-save-relic]");if(relic){saveItem({id:relic.dataset.saveRelic,name:relic.dataset.name||relic.dataset.saveRelic,meta:"SPACE RELICS ARCHIVE"});}
  });
  renderNotes();renderSaved();

  // Expedition planner uses the same curated mission site registry as the interactive globe.
  const sites={
    Moon:[
      ["Apollo 11 · Tranquility Base","Historic first crewed lunar landing"],
      ["Apollo 12 · Ocean of Storms","Precision landing and Surveyor 3 visit"],
      ["Apollo 14 · Fra Mauro","Lunar highlands field geology"],
      ["Apollo 15 · Hadley–Apennine","Lunar rover and extended traverses"],
      ["Apollo 16 · Descartes Highlands","Highlands geology"],
      ["Apollo 17 · Taurus–Littrow","Final Apollo lunar landing"]
    ],
    Mars:[
      ["Viking 1 · Chryse Planitia","Early long-duration robotic lander"],
      ["Pathfinder · Ares Vallis","First Mars rover technology demonstration"],
      ["Spirit · Gusev Crater","Evidence of ancient water environments"],
      ["Opportunity · Meridiani Planum","Sedimentary geology and water history"],
      ["Curiosity · Gale Crater","Habitability and layered geology"],
      ["Perseverance · Jezero Crater","Ancient lake environment and sample caching"]
    ]
  };
  let expedition=[];
  function updateStops(){
    const body=$("#expeditionDestination").value,select=$("#expeditionStop");
    select.innerHTML=sites[body].map((s,i)=>`<option value="${i}">${safe(s[0])}</option>`).join("");
  }
  function renderExpedition(){
    $("#expeditionCount").textContent=`${expedition.length} STOPS`;
    $("#expeditionStops").innerHTML=expedition.map((s,i)=>`<li><b>${safe(s.name)}</b><small>${safe(s.objective||s.description)}</small><button class="outline-btn small" data-remove-stop="${i}">REMOVE</button></li>`).join("")||'<li class="empty-expedition">No stops added yet. Choose a destination and add your first site.</li>';
  }
  $("#expeditionDestination")?.addEventListener("change",updateStops);updateStops();
  $("#addExpeditionStop")?.addEventListener("click",()=>{
    const body=$("#expeditionDestination").value,site=sites[body][Number($("#expeditionStop").value)],objective=$("#expeditionObjective").value.trim();
    if(expedition.length>=12){toast("Maximum 12 stops per expedition.");return;}
    expedition.push({body,name:site[0],description:site[1],objective:objective||site[1]});renderExpedition();$("#expeditionObjective").value="";
  });
  $("#expeditionStops")?.addEventListener("click",e=>{const b=e.target.closest("[data-remove-stop]");if(b){expedition.splice(Number(b.dataset.removeStop),1);renderExpedition();}});
  const expeditionText=()=>["SPACE RELICS — STUDENT EXPEDITION PLAN","",...expedition.map((s,i)=>`${i+1}. ${s.name} (${s.body})\n   Learning objective: ${s.objective}`)].join("\n");
  $("#copyExpedition")?.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(expeditionText());toast("Expedition plan copied.");}catch{toast("Clipboard unavailable. Use Download Plan instead.");}});
  $("#downloadExpedition")?.addEventListener("click",()=>download("space-relics-expedition.txt",expeditionText(),"text/plain"));
  $("#clearExpedition")?.addEventListener("click",()=>{expedition=[];renderExpedition();});

  function download(name,content,type){
    const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);
  }

  // Ten-question assessment with answer explanations and browser-local best score.
  const questions=[
    ["What remained on the Moon after Apollo 11 astronauts returned to lunar orbit?",["Command Module","Descent Stage","Service Module","Launch Escape Tower"],1,"The descent stage stayed on the lunar surface. The ascent stage carried Armstrong and Aldrin back to lunar orbit."],
    ["What was the primary job of the Lunar Module descent stage?",["Return to Earth","Land on the Moon","Orbit the Sun","Transmit TV from Earth"],1,"The descent stage provided powered descent, landing support, landing gear and equipment."],
    ["Which instrument mapped lunar surface elevation from orbit?",["LOLA","Hubble camera","Voyager magnetometer","Webb spectrograph"],0,"LOLA, aboard Lunar Reconnaissance Orbiter, is the Lunar Orbiter Laser Altimeter."],
    ["What does MOLA stand for?",["Mars Optical Landing Array","Mars Orbiter Laser Altimeter","Moon Orbital Laser Apparatus","Martian Orbit Lander Antenna"],1,"MOLA is the Mars Orbiter Laser Altimeter, flown on Mars Global Surveyor."],
    ["Which mission delivered the Sojourner rover to Mars?",["Viking 1","Mars Pathfinder","InSight","Mariner 4"],1,"Mars Pathfinder landed in 1997 and deployed the Sojourner rover."],
    ["What was the role of the Apollo Lunar Module ascent stage?",["Carry astronauts back to lunar orbit","Land the Saturn V","Orbit Earth for months","Deploy the lunar rover"],0,"The ascent stage lifted the crew cabin from the surface and rendezvoused with the Command/Service Module."],
    ["Which Apollo mission was the final crewed lunar landing?",["Apollo 11","Apollo 14","Apollo 17","Apollo 15"],2,"Apollo 17 landed in December 1972 and was the final crewed Apollo lunar landing."],
    ["What is a DEM?",["Digital Elevation Model","Deep Exploration Module","Data Exchange Mission","Dynamic Engine Monitor"],0,"A Digital Elevation Model represents surface elevation on a spatial grid."],
    ["What is the best way to cite a NASA archive image?",["Use only a social media repost","Cite the original NASA media record and its credit","Remove its metadata","Assume all images have identical terms"],1,"Open the original record and check its metadata, credit and usage guidance before reuse."],
    ["Why should an educational 3D globe be labelled schematic?",["Because it is always wrong","To distinguish a teaching visualization from measured terrain data","Because planets are flat","Because mission markers cannot be shown"],1,"A schematic globe is useful for learning, but it should not be represented as a precision DEM or navigation map."]
  ];
  let qi=0,score=0,answered=false;
  const best=read("sr_v3_quiz_best",0);
  function renderQuestion(){
    const q=questions[qi];answered=false;$("#quizScore").textContent=`${score} / ${questions.length}`;
    $("#quizProgressBar").style.width=`${qi/questions.length*100}%`;
    $("#quizQuestion").innerHTML=`<small>QUESTION ${String(qi+1).padStart(2,"0")} / ${questions.length} · BEST ${best}/${questions.length}</small><h4>${safe(q[0])}</h4><div class="quiz-options">${q[1].map((a,i)=>`<button data-answer="${i}">${String.fromCharCode(65+i)}. ${safe(a)}</button>`).join("")}</div>`;
    $("#quizFeedback").textContent="Choose the best answer. An explanation will appear after your selection.";
    $("#quizNext").disabled=true;$("#quizNext").textContent=qi===questions.length-1?"VIEW RESULTS →":"NEXT QUESTION →";
  }
  $("#quizQuestion")?.addEventListener("click",e=>{
    const b=e.target.closest("[data-answer]");if(!b||answered)return;answered=true;
    const q=questions[qi],choice=Number(b.dataset.answer),correct=choice===q[2];if(correct)score++;
    $("#quizQuestion").querySelectorAll("[data-answer]").forEach((x,i)=>{x.disabled=true;if(i===q[2])x.classList.add("correct");else if(i===choice)x.classList.add("incorrect");});
    $("#quizScore").textContent=`${score} / ${questions.length}`;
    $("#quizFeedback").textContent=`${correct?"Correct. ":"Not quite. "}${q[3]}`;
    $("#quizProgressBar").style.width=`${(qi+1)/questions.length*100}%`;
    $("#quizNext").disabled=false;
  });
  $("#quizNext")?.addEventListener("click",()=>{
    if(qi<questions.length-1){qi++;renderQuestion();}
    else{
      const previous=read("sr_v3_quiz_best",0),newBest=Math.max(previous,score);write("sr_v3_quiz_best",newBest);
      $("#quizQuestion").innerHTML=`<small>ASSESSMENT COMPLETE</small><h4>${score>=8?"Excellent mission specialist work!":score>=5?"Good progress. Keep exploring!":"Your next mission is to keep learning."}</h4><p>You scored <b>${score} out of ${questions.length}</b>. Your best score on this browser is ${newBest}/${questions.length}.</p>`;
      $("#quizFeedback").textContent="Review the mission dossiers, planetary data lab and engineering guide, then try again.";
      $("#quizNext").disabled=true;$("#quizProgressBar").style.width="100%";
    }
  });
  $("#quizRestart")?.addEventListener("click",()=>{qi=0;score=0;renderQuestion();});
  renderQuestion();

  // Installability and offline shell caching.
  if("serviceWorker" in navigator && location.protocol.startsWith("http")){
    window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
  }
})();
// Add a bookmark action to relic cards generated by the original archive UI.
document.addEventListener("DOMContentLoaded",()=>{
  const observer=new MutationObserver(()=>{
    document.querySelectorAll(".relic-card,.artifact-card,[data-relic-id]").forEach((card)=>{
      if(card.querySelector("[data-save-relic]"))return;
      const id=card.dataset.id||card.dataset.relicId||card.id;
      if(!id)return;
      const title=card.querySelector("h3,h4,.card-title")?.textContent?.trim()||id;
      const button=document.createElement("button");
      button.className="outline-btn small";button.textContent="☆ SAVE";
      button.dataset.saveRelic=id;button.dataset.name=title;
      card.appendChild(button);
    });
  });
  observer.observe(document.body,{childList:true,subtree:true});
});