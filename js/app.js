import { supabase } from './supabase.js'

const placesList = document.getElementById('places-list')
const userWelcome = document.getElementById('user-welcome')
const btnLogout = document.getElementById('btn-logout')
const categoryButtons = document.querySelectorAll('.category-btn')

let allPlaces = []
let currentFilter = 'Todos'

// 1. VERIFICAÇÃO DE SESSÃO LOCAL
window.addEventListener('DOMContentLoaded', async () => {
  const userId = localStorage.getItem('guia_user_id')

  if (!userId) {
    window.location.href = 'index.html'
    return
  }

  try {
    // Busca o perfil do usuário logado na nova tabela 'users'
    const { data: user, error } = await supabase
      .from('users')
      .select('full_name')
      .eq('id', userId)
      .maybeSingle()

    if (user) {
      userWelcome.innerText = `Olá, ${user.full_name}! 🇧🇷`
    } else {
      userWelcome.innerText = `Olá, Torcedor!`
    }
  } catch (err) {
    console.error("Erro ao carregar dados do usuário:", err)
    userWelcome.innerText = `Olá, Torcedor!`
  }

  // Carrega os estádios
  await fetchPlaces()
})

// 2. BUSCA OS LOCAIS NO BANCO DE DADOS
async function fetchPlaces() {
  try {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error

    allPlaces = data || []
    renderPlaces()

  } catch (error) {
    console.error("Erro Supabase:", error)
    if (placesList) {
      placesList.innerHTML = `<p class="text-red-400 text-xs text-center py-4">Erro ao carregar locais: ${error.message}</p>`
    }
  }
}

// 3. RENDERIZA OS CARDS NA TELA
function renderPlaces() {
  if (!placesList) return

  const filteredPlaces = currentFilter === 'Todos' 
    ? allPlaces 
    : allPlaces.filter(place => place.category === currentFilter)

  if (filteredPlaces.length === 0) {
    placesList.innerHTML = `<p class="text-slate-400 text-xs text-center py-8">Nenhum local cadastrado nesta categoria.</p>`
    return
  }

  placesList.innerHTML = filteredPlaces.map(place => {
    let icon = '📍'
    if (place.category === 'Estádio') icon = '🏟️'
    if (place.category === 'Alimentação') icon = '🍔'
    if (place.category === 'Transporte') icon = '🚇'
    if (place.category === 'Lazer') icon = '🏖️'

    return `
      <div onclick="window.location.href='place.html?id=${place.id}'" 
           class="bg-slate-800 border border-slate-700 hover:border-green-500/50 rounded-xl p-4 shadow-md transition active:scale-[0.98] cursor-pointer flex flex-col justify-between">
        <div>
          <div class="flex justify-between items-start gap-2">
            <span class="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-slate-700 text-slate-300">
              ${icon} ${place.category}
            </span>
            <span class="text-[10px] text-slate-400 font-medium">${place.city}</span>
          </div>
          <h4 class="text-sm font-bold text-white mt-2 line-clamp-1">${place.name}</h4>
          <p class="text-xs text-slate-400 mt-1 line-clamp-2">${place.description || 'Sem descrição cadastrada.'}</p>
        </div>
        
        <div class="border-t border-slate-700/60 mt-3 pt-2 flex justify-between items-center text-[11px] text-slate-400">
          <span class="truncate max-w-[180px]">📍 ${place.address || 'Ver mapa'}</span>
          <span class="text-green-400 font-bold shrink-0 flex items-center gap-0.5">
            Avaliar →
          </span>
        </div>
      </div>
    `
  }).join('')
}

// 4. LÓGICA DE FILTROS DOS BOTÕES
categoryButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    categoryButtons.forEach(btn => {
      btn.classList.remove('bg-green-500', 'text-slate-900', 'font-bold', 'shadow-md')
      btn.classList.add('bg-slate-800', 'text-slate-300')
    })

    const target = e.currentTarget
    target.classList.remove('bg-slate-800', 'text-slate-300')
    target.classList.add('bg-green-500', 'text-slate-900', 'font-bold', 'shadow-md')

    currentFilter = target.getAttribute('data-category')
    renderPlaces()
  })
})

// 5. EVENTO DE LOGOUT
if (btnLogout) {
  btnLogout.addEventListener('click', () => {
    if (confirm('Deseja mesmo sair do aplicativo?')) {
      localStorage.removeItem('guia_user_id')
      window.location.href = 'index.html'
    }
  })
}