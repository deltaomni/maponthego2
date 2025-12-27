
// Variável global
let loadedCity = [];

function buildLegend() {

    var legendHTML = criarLegenda(loadedCity);
    document.getElementById('legend-container').innerHTML = legendHTML;
}

function criarCardNegocio(n) {
    const logo = n.logo ? n.logo : 'img/logos/logo-generic.png';
    const premiumStars = n.premium ? criarStars(3) : '';
    const ratingHtml = !n.premium && n.rating
        ? `<span class="text-primary text-center w-100">
         <i class="fa-solid fa-star fa-xs text-warning"></i>
         <strong><small>${n.rating.toFixed(1)}</small></strong>
       </span>`
        : '<i class="fa-solid fa-award text-warning"></i>';

    return `
<li class="list-group-item d-flex py-3">
  <img src="${logo}" class="business-logo" />

  <div class="w-100 d-flex flex-column ms-2">
    <div class="w-100 d-flex justify-content-between">
      <div class="fw-bold">${n.nome}</div>
      ${premiumStars}
    </div>

    <small>${n.descricao || ''}</small>

    <div class="d-flex justify-content-between align-items-center">
      ${ratingHtml}
      ${criarBotoes(n)}
    </div>
  </div>
</li>`;
}

function criarStars(qtd) {
    let stars = '<span>';
    for (let i = 0; i < qtd; i++) {
        stars += `<i class="fa-solid fa-star fa-xs text-warning"></i>`;
    }
    stars += '</span>';
    return stars;
}

function criarBotoes(n) {
    var site_opacity = !n.premium || !n.website ? 'opacity-0 disabled' : 'opacity-100';


    const websiteBtn = `<button type="button"
        class="btn text-info px-3 ${site_opacity}"
        title="website"
        onclick="openBusinessModal('${n.id}')">
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </button>`;


    const direcoesBtn = `
<button type="button"
        class="btn text-info px-3 ${n.premium ? '' : 'border-0'}"
        title="Direções">
  <i class="fa-solid fa-diamond-turn-right"></i>
</button>`;

    const disabledBtn = `
<button type="button"
        class="btn text-secondary opacity-25 px-3 border-0 disabled">
  <i class="fa-solid fa-share-nodes"></i>
</button>
<button type="button"
        class="btn text-secondary opacity-25 px-3 border-0 disabled">
  <i class="fa-brands fa-whatsapp"></i>
</button>`;

    const premiumExtras = `
<button type="button" class="btn text-info px-3" title="Compartilhar">
  <i class="fa-solid fa-share-nodes"></i>
</button>
<button type="button" class="btn text-info px-3" title="WhatsApp">
  <i class="fa-brands fa-whatsapp"></i>
</button>`;

    return `
<div class="btn-group btn-group-sm" role="group">
  ${websiteBtn}
  ${direcoesBtn}
  ${n.premium ? premiumExtras : disabledBtn}
</div>`;
}

function criarUrlWebsite(n) {
    if (n.website?.type === 'internal') {
        /* return `/negocio/${n.slug}/index.html`;*/
        return `negocio/index.html?city=${loadedCity.slug}&site=${n.slug}`;
    }
    return '#';
}



function criarLegenda(loadedCity) {
    if (!loadedCity || !loadedCity.negocios) return '';

    let html = `<ol class="list-group">`;

    loadedCity.negocios.forEach(negocio => {
        html += criarCardNegocio(negocio);
    });

    html += `</ol>`;
    return html;
}


// Função para carregar a cidade com base na URL
async function loadCityFromURL() {
    const params = new URLSearchParams(window.location.search);
    const city = params.get('city');

    if (!city) {
        console.warn('Parâmetro "city" não encontrado na URL.');
        return;
    }

    const jsonPath = `data/cities/${city}.json`;

    try {
        const response = await fetch(jsonPath);

        if (!response.ok) {
            throw new Error(`Erro ao carregar ${jsonPath}`);
        }

        loadedCity = await response.json();
        console.log('Cidade carregada:', loadedCity);
        buildLegend();

    } catch (error) {
        console.error('Falha ao carregar o JSON da cidade:', error);
    }
}

// Executa ao carregar a página
// loadCityFromURL();

function openBusinessModal(businessId) {
    const negocio = loadedCity.negocios.find(n => n.id === businessId);
    if (!negocio) return;

    const modal = new bootstrap.Modal(document.getElementById('fullModal'));
    const modalBody = document.getElementById('modalBody');
    const modalTitle = document.getElementById('modalTitle');
    const externalLink = document.getElementById('externalLink');

    modalBody.innerHTML = '';
    externalLink.style.display = 'none';

    modalTitle.innerText = negocio.nome;

    if (negocio.premium) {
        openPremiumBusiness(negocio, modalBody);
    } else if (negocio.website?.type) {
        openNonPremiumBusiness(negocio, modalBody, externalLink);
    } else {
        return; // sem site → não abre
    }

    modal.show();
}

async function openPremiumBusiness(negocio, container) {

    // 1. carrega template
    const templateHtml = await fetch('negocio/index.html')
        .then(r => r.text());

    container.innerHTML = templateHtml;

    // 2. popula dados diretamente
    preencherTemplateNegocio(negocio, loadedCity);
}

function openNonPremiumBusiness(negocio, container, externalLink) {

    const iframe = document.createElement('iframe');
    iframe.src = criarUrlWebsite(negocio);
    iframe.style.width = '100%';
    iframe.style.height = '100vh';
    iframe.style.border = '0';

    container.appendChild(iframe);

    externalLink.href = iframe.src;
    externalLink.style.display = 'block';
}


// Função para carregar a cidade com base na URL
async function loadCityFromURL() {
    console.log('loadCityFromURL()');
    document.getElementById("motg_content").style.display = "block";

    const params = new URLSearchParams(window.location.search);
    var city = params.get('city');
    var siteSlug = params.get('site');

    if (!city) {
        console.warn('Parâmetro "city" não encontrado na URL.');
        city = "tres-rios";
        siteSlug = null;
        //return;
    }

    const jsonPath = `data/cities/${city}.json`;
    console.log('Carregando cidade de:', jsonPath);

    try {
        const response = await fetch(jsonPath);

        if (!response.ok) {
            throw new Error(`Erro ao carregar ${jsonPath}`);
        }

        loadedCity = await response.json();
        console.log('Cidade carregada:', loadedCity);
        buildLegend();

    } catch (error) {
        console.error('Falha ao carregar o JSON da cidade:', error);
    }

    if (siteSlug) {
        openBusinessModal(siteSlug);
    }

}

// Executa ao carregar a página
// loadCityFromURL();