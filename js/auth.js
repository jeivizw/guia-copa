import { supabase } from './supabase.js'

const authForm = document.getElementById('auth-form')
const emailInput = document.getElementById('email') // Este campo agora aceita qualquer texto/identificador
const passwordInput = document.getElementById('password')
const wrapperName = document.getElementById('wrapper-name')
const fullNameInput = document.getElementById('full-name')
const btnSubmit = document.getElementById('btn-submit')
const btnToggle = document.getElementById('btn-toggle')

let isLoginMode = true

// VERIFICAÇÃO DE SESSÃO LOCAL
window.addEventListener('DOMContentLoaded', () => {
  const userId = localStorage.getItem('guia_user_id')
  if (userId) {
    window.location.href = 'feed.html'
  }
})

// ALTERNADOR ENTRE LOGIN E CADASTRO
btnToggle.addEventListener('click', (e) => {
  e.preventDefault()
  isLoginMode = !isLoginMode

  if (isLoginMode) {
    wrapperName.classList.add('hidden')
    fullNameInput.removeAttribute('required')
    btnSubmit.innerText = 'Entrar no Guia'
    btnToggle.innerText = 'Não tem conta? Cadastre-se aqui'
  } else {
    wrapperName.classList.remove('hidden')
    fullNameInput.setAttribute('required', 'true')
    btnSubmit.innerText = 'Criar Minha Conta'
    btnToggle.innerText = 'Já tem conta? Faça o Login'
  }
})

// ENVIO DO FORMULÁRIO (LOGIN OU CADASTRO ADAPTADO)
authForm.addEventListener('submit', async (e) => {
  e.preventDefault()

  const username = emailInput.value.trim().toLowerCase() // Deixa tudo minúsculo para facilitar
  const password = passwordInput.value.trim()
  const fullName = fullNameInput.value.trim()

  btnSubmit.disabled = true
  btnSubmit.innerText = 'Carregando...'

  try {
    if (isLoginMode) {
      // --- NOVO LOGIN VIA BANCO DE DADOS ---
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .maybeSingle() // Retorna o usuário ou nulo se não achar

      if (error) throw error

      if (!user) {
        alert('Usuário ou senha incorretos!')
        return
      }

      // Salva a sessão localmente e redireciona
      localStorage.setItem('guia_user_id', user.id)
      window.location.href = 'feed.html'

    } else {
      // --- NOVO CADASTRO VIA BANCO DE DADOS ---
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          username: username,
          password: password,
          full_name: fullName
        })
        .select()
        .single()

      if (error) {
        if (error.code === '23505') {
          alert('Este usuário já está cadastrado!')
        } else {
          throw error
        }
        return
      }

      alert('Conta criada com sucesso! Faça o login para entrar.')
      isLoginMode = false
      btnToggle.click() // Volta para a tela de login automaticamente
    }
  } catch (error) {
    alert(`Erro na operação: ${error.message}`)
  } finally {
    btnSubmit.disabled = false
    btnSubmit.innerText = isLoginMode ? 'Entrar no Guia' : 'Criar Minha Conta'
  }
})