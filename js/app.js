const sidebar=document.querySelector('#sidebar');
const backdrop=document.querySelector('#sidebarBackdrop');
const titles={dashboard:'Resumen general',inventario:'Control de inventario',produccion:'Control de producción',ventas:'Gestión de ventas',caja:'Flujo de caja','tipo-cambio':'Tipo de cambio',reportes:'Reportes',clientes:'Directorio de clientes',empleados:'Gestión de empleados'};
function showView(id){if(!document.getElementById(id))id='dashboard';document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));document.querySelectorAll('[data-view]').forEach(a=>a.classList.toggle('active',a.dataset.view===id&&a.classList.contains('nav-link')));document.querySelector('#pageTitle').textContent=titles[id];sidebar.classList.remove('open');backdrop.classList.remove('show');}
document.querySelectorAll('[data-view]').forEach(link=>link.addEventListener('click',e=>{e.preventDefault();const id=link.dataset.view;history.replaceState(null,'',`#${id}`);showView(id)}));
document.querySelector('#menuBtn').addEventListener('click',()=>{sidebar.classList.toggle('open');backdrop.classList.toggle('show')});backdrop.addEventListener('click',()=>{sidebar.classList.remove('open');backdrop.classList.remove('show')});
const search=document.querySelector('#inventorySearch'),filter=document.querySelector('#typeFilter');function filterInventory(){const q=search.value.toLowerCase(),type=filter.value;document.querySelectorAll('#inventoryTable tbody tr').forEach(row=>{row.hidden=!(row.textContent.toLowerCase().includes(q)&&(!type||row.children[2].textContent===type))})}search.addEventListener('input',filterInventory);filter.addEventListener('change',filterInventory);
document.querySelectorAll('.demo-form').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();bootstrap.Modal.getInstance(form.closest('.modal')).hide();bootstrap.Toast.getOrCreateInstance('#successToast').show();form.reset()}));
document.querySelectorAll('#quickModal [data-target]').forEach(btn=>btn.addEventListener('click',()=>setTimeout(()=>bootstrap.Modal.getOrCreateInstance(document.querySelector(`#${btn.dataset.target}`)).show(),250)));

const exchangeForm=document.querySelector('#exchangeForm');
const exchangeAmount=document.querySelector('#exchangeAmount');
const baseCurrency=document.querySelector('#baseCurrency');
const quoteCurrency=document.querySelector('#quoteCurrency');
const exchangeSubmit=document.querySelector('#exchangeSubmit');
const exchangeLoading=document.querySelector('#exchangeLoading');
const exchangeError=document.querySelector('#exchangeError');
const exchangeData=document.querySelector('#exchangeData');
const exchangePair=document.querySelector('#exchangePair');
const convertedValue=document.querySelector('#convertedValue');
const exchangeRate=document.querySelector('#exchangeRate');
const exchangeDate=document.querySelector('#exchangeDate');
const exchangeErrorMessage=document.querySelector('#exchangeErrorMessage');

function currencyFormat(value,currency){
  return new Intl.NumberFormat('es-MX',{style:'currency',currency,maximumFractionDigits:2}).format(value);
}

async function loadExchangeRate(){
  const amount=Number(exchangeAmount.value);
  const base=baseCurrency.value;
  const quote=quoteCurrency.value;

  exchangePair.textContent=`${base} → ${quote}`;
  exchangeError.classList.add('d-none');

  if(!Number.isFinite(amount)||amount<=0){
    exchangeErrorMessage.textContent='Ingresa un importe mayor que cero.';
    exchangeError.classList.remove('d-none');
    return;
  }

  if(base===quote){
    exchangeLoading.classList.add('d-none');
    exchangeData.classList.remove('d-none');
    convertedValue.textContent=currencyFormat(amount,quote);
    exchangeRate.textContent=`1 ${base} = 1 ${quote}`;
    exchangeDate.textContent='No requiere consulta';
    return;
  }

  exchangeLoading.classList.remove('d-none');
  exchangeData.classList.add('d-none');
  exchangeSubmit.disabled=true;

  try{
    const response=await fetch(`https://api.frankfurter.dev/v2/rate/${base}/${quote}`);
    const data=await response.json();

    if(!response.ok){
      throw new Error(data.message||`Error HTTP ${response.status}`);
    }

    if(typeof data.rate!=='number'){
      throw new Error('La respuesta no contiene una tasa válida.');
    }

    convertedValue.textContent=currencyFormat(amount*data.rate,quote);
    exchangeRate.textContent=`1 ${data.base} = ${data.rate.toLocaleString('es-MX',{maximumFractionDigits:6})} ${data.quote}`;
    exchangeDate.textContent=new Intl.DateTimeFormat('es-MX',{dateStyle:'long',timeZone:'UTC'}).format(new Date(`${data.date}T00:00:00Z`));
    exchangeData.classList.remove('d-none');
  }catch(error){
    exchangeErrorMessage.textContent=error.message||'Comprueba tu conexión e inténtalo nuevamente.';
    exchangeError.classList.remove('d-none');
  }finally{
    exchangeLoading.classList.add('d-none');
    exchangeSubmit.disabled=false;
  }
}

exchangeForm?.addEventListener('submit',event=>{event.preventDefault();loadExchangeRate();});
document.querySelector('#retryExchange')?.addEventListener('click',loadExchangeRate);
document.querySelector('#swapCurrencies')?.addEventListener('click',()=>{
  const previousBase=baseCurrency.value;
  baseCurrency.value=quoteCurrency.value;
  quoteCurrency.value=previousBase;
  loadExchangeRate();
});

window.addEventListener('hashchange',()=>showView(location.hash.slice(1)));showView(location.hash.slice(1)||'dashboard');
