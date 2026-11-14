import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const canvas = document.querySelector("#planetCanvas");
const status = document.querySelector("#planetLoadStatus");
const hudName = document.querySelector("#planetHudName");
const hudFact = document.querySelector("#planetHudFact");
const siteTitle = document.querySelector("#planetSiteTitle");
const siteDescription = document.querySelector("#planetSiteDescription");
const siteCoords = document.querySelector("#planetSiteCoords");
const siteSource = document.querySelector("#planetSiteSource");

if (canvas) {
  const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, canvas.clientWidth/canvas.clientHeight, .1, 100);
  camera.position.set(0,0,5.1);
  scene.add(new THREE.AmbientLight(0x9bb8d9, 1.2));
  const key = new THREE.DirectionalLight(0xffe0b2, 2.5); key.position.set(-3,2,4); scene.add(key);
  const rim = new THREE.DirectionalLight(0x4b85d4, 1.1); rim.position.set(4,-2,-3); scene.add(rim);
  const root = new THREE.Group(); scene.add(root);
  const sphereGeo = new THREE.SphereGeometry(1.45, 96, 72);
  const loader = new THREE.TextureLoader();
  let body = "Moon", autoRotate = true, dragging = false, lastX=0, lastY=0, selected = null;
  const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
  let markers = [];
  const sites = {
    Moon: [
      {name:"Apollo 11 · Tranquility Base",lat:0.674,lon:23.473,coords:"0.674° N · 23.473° E",desc:"Apollo 11's Lunar Module landed in the Sea of Tranquility on 20 July 1969. The descent stage remained on the lunar surface.",url:"https://science.nasa.gov/resource/apollo-11-landing-site/",id:"apollo11"},
      {name:"Apollo 12 · Ocean of Storms",lat:-3.012,lon:-23.422,coords:"3.012° S · 23.422° W",desc:"Apollo 12 achieved a precision landing near the Surveyor 3 spacecraft in November 1969.",url:"https://science.nasa.gov/3d-resources/",id:"apollo12"},
      {name:"Apollo 14 · Fra Mauro",lat:-3.645,lon:-17.471,coords:"3.645° S · 17.471° W",desc:"Apollo 14 explored the Fra Mauro highlands in February 1971.",url:"https://science.nasa.gov/3d-resources/",id:"apollo14"},
      {name:"Apollo 15 · Hadley–Apennine",lat:26.132,lon:3.634,coords:"26.132° N · 3.634° E",desc:"Apollo 15 carried the first Lunar Roving Vehicle and explored the Hadley–Apennine region.",url:"https://science.nasa.gov/3d-resources/",id:"apollo15"},
      {name:"Apollo 16 · Descartes Highlands",lat:-8.973,lon:15.501,coords:"8.973° S · 15.501° E",desc:"Apollo 16 investigated the lunar highlands in April 1972.",url:"https://science.nasa.gov/3d-resources/",id:"apollo16"},
      {name:"Apollo 17 · Taurus–Littrow",lat:20.190,lon:30.772,coords:"20.190° N · 30.772° E",desc:"Apollo 17 was the final crewed Apollo lunar landing, in December 1972.",url:"https://science.nasa.gov/3d-resources/",id:"apollo17"}
    ],
    Mars: [
      {name:"Viking 1 · Chryse Planitia",lat:22.48,lon:-47.97,coords:"22.48° N · 47.97° W",desc:"Viking 1 landed in 1976 and returned images and experiments from the Martian surface.",url:"https://science.nasa.gov/mission/viking-1/",id:"viking1"},
      {name:"Pathfinder · Ares Vallis",lat:19.13,lon: -33.22,coords:"19.13° N · 33.22° W",desc:"Mars Pathfinder delivered the Sojourner rover in 1997.",url:"https://science.nasa.gov/mission/mars-pathfinder/",id:"sojourner"},
      {name:"Spirit · Gusev Crater",lat:-14.57,lon:175.47,coords:"14.57° S · 175.47° E",desc:"Spirit explored Gusev Crater and investigated rocks and soils for evidence of past water.",url:"https://science.nasa.gov/mission/mer-spirit/",id:"spirit"},
      {name:"Opportunity · Meridiani Planum",lat:-1.95,lon:-5.53,coords:"1.95° S · 5.53° W",desc:"Opportunity explored Meridiani Planum and found geological evidence of ancient water.",url:"https://science.nasa.gov/mission/mer-opportunity/",id:"opportunity"},
      {name:"InSight · Elysium Planitia",lat:4.50,lon:135.62,coords:"4.50° N · 135.62° E",desc:"InSight measured marsquakes and helped reveal the planet's internal structure.",url:"https://science.nasa.gov/mission/insight/",id:"insight"},
      {name:"Perseverance · Jezero Crater",lat:18.44,lon:77.45,coords:"18.44° N · 77.45° E",desc:"Perseverance is exploring Jezero Crater and collecting samples for future study.",url:"https://science.nasa.gov/mission/mars-2020-perseverance/",id:"perseverance"}
    ]
  };
  function proceduralTexture(kind) {
    const c = document.createElement("canvas"); c.width=1024; c.height=512;
    const ctx=c.getContext("2d");
    const grd=ctx.createLinearGradient(0,0,1024,512);
    if(kind==="Moon"){grd.addColorStop(0,"#bfc0b9");grd.addColorStop(.45,"#777f87");grd.addColorStop(1,"#4d5862");}
    else {grd.addColorStop(0,"#d58b60");grd.addColorStop(.45,"#9c4c37");grd.addColorStop(1,"#5d2a27");}
    ctx.fillStyle=grd;ctx.fillRect(0,0,1024,512);
    let seed=kind==="Moon"?27:61;
    const rand=()=>{seed=(seed*9301+49297)%233280;return seed/233280;};
    for(let i=0;i<2400;i++){
      const x=rand()*1024,y=rand()*512,r=1+rand()*(kind==="Moon"?13:8);
      ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);
      ctx.fillStyle=kind==="Moon"?`rgba(${rand()>.5?30:235},${rand()>.5?35:235},${rand()>.5?40:230},${.06+rand()*.16})`:`rgba(${rand()>.5?55:230},${rand()>.5?25:125},${rand()>.5?20:85},${.05+rand()*.14})`;ctx.fill();
    }
    for(let i=0;i<90;i++){
      const x=rand()*1024,y=rand()*512,r=3+rand()*22;
      ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.strokeStyle=kind==="Moon"?"rgba(28,34,42,.25)":"rgba(65,27,24,.22)";ctx.lineWidth=1+rand()*2;ctx.stroke();
    }
    const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;return tex;
  }
  function latLonToVec(lat,lon,r=1.47){
    const phi=(90-lat)*Math.PI/180, theta=(lon+180)*Math.PI/180;
    return new THREE.Vector3(-r*Math.sin(phi)*Math.cos(theta),r*Math.cos(phi),r*Math.sin(phi)*Math.sin(theta));
  }
  function clearRoot(){while(root.children.length){const o=root.children.pop();o.geometry?.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose();}}markers=[];}
  function addStars(){
    const geo=new THREE.BufferGeometry(),arr=[];
    for(let i=0;i<1200;i++){const r=7+Math.random()*18,t=Math.random()*Math.PI*2,p=Math.acos(2*Math.random()-1);arr.push(r*Math.sin(p)*Math.cos(t),r*Math.cos(p),r*Math.sin(p)*Math.sin(t));}
    geo.setAttribute("position",new THREE.Float32BufferAttribute(arr,3));
    const pts=new THREE.Points(geo,new THREE.PointsMaterial({color:0xb7c9df,size:.035,transparent:true,opacity:.8}));
    scene.add(pts);
  }
  addStars();
  function selectSite(site, marker){
    selected=site;
    markers.forEach(m=>m.material.color.set(m.userData.site===site?0x72e0bd:0xf4b25f));
    siteTitle.textContent=site.name;siteDescription.textContent=site.desc;siteCoords.textContent=site.coords;siteSource.href=site.url;
    siteSource.textContent="OPEN PRIMARY SOURCE ↗";
  }
  function buildWorld(){
    clearRoot();
    const tex=proceduralTexture(body);
    const mat=new THREE.MeshStandardMaterial({map:tex,roughness:.96,metalness:0});
    const globe=new THREE.Mesh(sphereGeo,mat);root.add(globe);
    const wire=new THREE.Mesh(new THREE.SphereGeometry(1.454,48,32),new THREE.MeshBasicMaterial({color:body==="Moon"?0x8b9baa:0xd17a55,wireframe:true,transparent:true,opacity:.055}));root.add(wire);
    sites[body].forEach((site,i)=>{
      const dot=new THREE.Mesh(new THREE.SphereGeometry(.035,16,12),new THREE.MeshBasicMaterial({color:0xf4b25f,emissive:0x7c4212,emissiveIntensity:1.4}));
      dot.position.copy(latLonToVec(site.lat,site.lon));dot.userData.site=site;root.add(dot);markers.push(dot);
      const ring=new THREE.Mesh(new THREE.RingGeometry(.045,.052,24),new THREE.MeshBasicMaterial({color:0xf4b25f,side:THREE.DoubleSide,transparent:true,opacity:.8}));
      ring.position.copy(dot.position.clone().multiplyScalar(1.015));ring.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),ring.position.clone().normalize());ring.userData.site=site;root.add(ring);markers.push(ring);
    });
    hudName.textContent=body==="Moon"?"LUNA / MOON":"ARES / MARS";
    hudFact.textContent=body==="Moon"?"Six Apollo landing sites are plotted using rounded reference coordinates.":"Historic robotic landing sites are plotted using rounded reference coordinates.";
    status.textContent=`${body.toUpperCase()} GLOBE READY · ${sites[body].length} MISSION SITES`;
    selectSite(sites[body][0]);
  }
  buildWorld();
  document.querySelectorAll("[data-body]").forEach(btn=>btn.addEventListener("click",()=>{
    document.querySelectorAll("[data-body]").forEach(x=>x.classList.toggle("active",x===btn));body=btn.dataset.body;buildWorld();
  }));
  $("#planetAutoRotate")?.addEventListener("click",()=>{autoRotate=!autoRotate;$("#planetAutoRotate").textContent=autoRotate?"PAUSE ROTATION":"RESUME ROTATION";});
  $("#planetReset")?.addEventListener("click",()=>{root.rotation.set(0,0,0);camera.position.set(0,0,5.1);});
  canvas.addEventListener("pointerdown",e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener("pointermove",e=>{if(!dragging)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;root.rotation.y+=dx*.006;root.rotation.x+=dy*.006;lastX=e.clientX;lastY=e.clientY;});
  canvas.addEventListener("pointerup",()=>dragging=false);canvas.addEventListener("pointercancel",()=>dragging=false);
  canvas.addEventListener("wheel",e=>{e.preventDefault();camera.position.z=THREE.MathUtils.clamp(camera.position.z+e.deltaY*.003,3.2,8);},{passive:false});
  canvas.addEventListener("click",e=>{
    const rect=canvas.getBoundingClientRect();pointer.x=((e.clientX-rect.left)/rect.width)*2-1;pointer.y=-((e.clientY-rect.top)/rect.height)*2+1;
    raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(markers,false);
    if(hits.length){const site=hits[0].object.userData.site;if(site)selectSite(site);}
  });
  const resize=()=>{const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};
  new ResizeObserver(resize).observe(canvas);
  function animate(){requestAnimationFrame(animate);if(autoRotate&&!dragging)root.rotation.y+=.0017;renderer.render(scene,camera);}
  animate();
}