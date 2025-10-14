import { writable } from 'svelte/store';

export type Language = 'en' | 'pt';

export interface Translations {
  // Common
  loading: string;
  error: string;
  success: string;
  cancel: string;
  confirm: string;
  close: string;
  back: string;
  next: string;
  previous: string;
  search: string;
  login: string;
  logout: string;
  register: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  showPassword: string;
  hidePassword: string;
  
  // App specific
  appName: string;
  searchArtists: string;
  searchArtistsPlaceholder: string;
  loginToSearch: string;
  hello: string;
  user: string;
  
  // Auth
  welcomeBack: string;
  enterAccount: string;
  createAccount: string;
  fillData: string;
  enterUsername: string;
  enterEmail: string;
  enterPassword: string;
  confirmPasswordPlaceholder: string;
  fillAllFields: string;
  validEmail: string;
  passwordMinLength: string;
  passwordsDontMatch: string;
  accountCreated: string;
  loginError: string;
  registerError: string;
  continueWithGoogle: string;
  noAccount: string;
  haveAccount: string;
  createAccountLink: string;
  loginLink: string;
  entering: string;
  creatingAccount: string;
  
  // Artist related
  about: string;
  followers: string;
  popularity: string;
  genres: string;
  relatedArtists: string;
  artistDetails: string;
  openInSpotify: string;
  
  // Albums and tracks
  discography: string;
  tracks: string;
  track: string;
  album: string;
  releaseDate: string;
  totalTracks: string;
  duration: string;
  noAlbumsFound: string;
  loadingDiscography: string;
  loadingTracks: string;
  errorLoadingDiscography: string;
  tryAgain: string;
  
  // Welcome section
  welcomeTitle: string;
  welcomeSubtitle: string;
  welcomeDescription: string;
  getStarted: string;
  
  // Sidebar
  menu: string;
  home: string;
  settings: string;
  aboutApp: string;
  
  // Timeline
  timeline: string;
  showTimeline: string;
  
  // Errors
  errorLoadingArtist: string;
  errorLoadingData: string;
  unknownError: string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    search: 'Search',
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    
    // App specific
    appName: 'Bandline',
    searchArtists: 'Search artists...',
    searchArtistsPlaceholder: 'Search artists...',
    loginToSearch: 'Login to search artists',
    hello: 'Hello',
    user: 'User',
    
    // Auth
    welcomeBack: 'Welcome back',
    enterAccount: 'Sign in to your account to continue',
    createAccount: 'Create account',
    fillData: 'Fill in the data to get started',
    enterUsername: 'Enter your username or email',
    enterEmail: 'Enter your email',
    enterPassword: 'Enter your password',
    confirmPasswordPlaceholder: 'Enter your password again',
    fillAllFields: 'Please fill in all fields',
    validEmail: 'Please enter a valid email',
    passwordMinLength: 'Password must be at least 8 characters',
    passwordsDontMatch: 'Passwords do not match',
    accountCreated: 'Account created successfully!',
    loginError: 'Login error',
    registerError: 'Registration error',
    continueWithGoogle: 'Continue with Google',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    createAccountLink: 'Create account',
    loginLink: 'Sign in',
    entering: 'Signing in...',
    creatingAccount: 'Creating account...',
    
    // Artist related
    about: 'About:',
    followers: 'Followers',
    popularity: 'Popularity',
    genres: 'Genres',
    relatedArtists: 'Related Artists',
    artistDetails: 'Artist Details',
    openInSpotify: 'Open in Spotify',
    
    // Albums and tracks
    discography: 'Discography',
    tracks: 'tracks',
    track: 'track',
    album: 'Album',
    releaseDate: 'Release Date',
    totalTracks: 'Total Tracks',
    duration: 'Duration',
    noAlbumsFound: 'No albums found for this artist.',
    loadingDiscography: 'Loading discography...',
    loadingTracks: 'Loading tracks...',
    errorLoadingDiscography: 'Error loading discography:',
    tryAgain: 'Try again',
    
    // Welcome section
    welcomeTitle: 'Welcome to Bandline',
    welcomeSubtitle: 'Discover your favorite artists',
    welcomeDescription: 'Explore discographies, discover new music, and dive deep into the world of your favorite artists.',
    getStarted: 'Get Started',
    
    // Sidebar
    menu: 'Menu',
    home: 'Home',
    settings: 'Settings',
    aboutApp: 'About',
    
    // Timeline
    timeline: 'Timeline',
    showTimeline: 'Show Timeline',
    
    // Errors
    errorLoadingArtist: 'Error loading artist data:',
    errorLoadingData: 'Error loading data:',
    unknownError: 'Unknown error'
  },
  pt: {
    // Common
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    close: 'Fechar',
    back: 'Voltar',
    next: 'Próximo',
    previous: 'Anterior',
    search: 'Buscar',
    login: 'Entrar',
    logout: 'Sair',
    register: 'Registrar',
    username: 'Nome de usuário',
    email: 'Email',
    password: 'Senha',
    confirmPassword: 'Confirmar senha',
    showPassword: 'Mostrar senha',
    hidePassword: 'Ocultar senha',
    
    // App specific
    appName: 'Bandline',
    searchArtists: 'Buscar artistas...',
    searchArtistsPlaceholder: 'Buscar artistas...',
    loginToSearch: 'Faça login para buscar artistas',
    hello: 'Olá',
    user: 'Usuário',
    
    // Auth
    welcomeBack: 'Bem-vindo de volta',
    enterAccount: 'Entre na sua conta para continuar',
    createAccount: 'Criar conta',
    fillData: 'Preencha os dados para começar',
    enterUsername: 'Digite seu nome de usuário ou email',
    enterEmail: 'Digite seu email',
    enterPassword: 'Digite sua senha',
    confirmPasswordPlaceholder: 'Digite novamente sua senha',
    fillAllFields: 'Por favor, preencha todos os campos',
    validEmail: 'Por favor, digite um email válido',
    passwordMinLength: 'A senha deve ter pelo menos 8 caracteres',
    passwordsDontMatch: 'As senhas não conferem',
    accountCreated: 'Conta criada com sucesso!',
    loginError: 'Erro no login',
    registerError: 'Erro ao criar conta',
    continueWithGoogle: 'Continuar com Google',
    noAccount: 'Não tem uma conta?',
    haveAccount: 'Já tem uma conta?',
    createAccountLink: 'Criar conta',
    loginLink: 'Fazer login',
    entering: 'Entrando...',
    creatingAccount: 'Criando conta...',
    
    // Artist related
    about: 'Sobre:',
    followers: 'Seguidores',
    popularity: 'Popularidade',
    genres: 'Gêneros',
    relatedArtists: 'Artistas Relacionados',
    artistDetails: 'Detalhes do Artista',
    openInSpotify: 'Abrir no Spotify',
    
    // Albums and tracks
    discography: 'Discografia',
    tracks: 'faixas',
    track: 'faixa',
    album: 'Álbum',
    releaseDate: 'Data de Lançamento',
    totalTracks: 'Total de Faixas',
    duration: 'Duração',
    noAlbumsFound: 'Nenhum álbum encontrado para este artista.',
    loadingDiscography: 'Carregando discografia...',
    loadingTracks: 'Carregando faixas...',
    errorLoadingDiscography: 'Erro ao carregar discografia:',
    tryAgain: 'Tentar novamente',
    
    // Welcome section
    welcomeTitle: 'Bem-vindo ao Bandline',
    welcomeSubtitle: 'Descubra seus artistas favoritos',
    welcomeDescription: 'Explore discografias, descubra novas músicas e mergulhe no mundo dos seus artistas favoritos.',
    getStarted: 'Começar',
    
    // Sidebar
    menu: 'Menu',
    home: 'Início',
    settings: 'Configurações',
    aboutApp: 'Sobre',
    
    // Timeline
    timeline: 'Linha do Tempo',
    showTimeline: 'Mostrar Linha do Tempo',
    
    // Errors
    errorLoadingArtist: 'Erro ao buscar dados do artista:',
    errorLoadingData: 'Erro ao carregar dados:',
    unknownError: 'Erro desconhecido'
  }
};

const currentLanguage = writable<Language>('en');

export const language = {
  subscribe: currentLanguage.subscribe,
  set: currentLanguage.set,
  get: () => {
    let lang: Language = 'en';
    currentLanguage.subscribe(value => lang = value)();
    return lang;
  }
};

export function t(key: keyof Translations): string {
  let lang: Language = 'en';
  currentLanguage.subscribe(value => lang = value)();
  return translations[lang][key] || translations.en[key] || key;
}

export function setLanguage(lang: Language) {
  currentLanguage.set(lang);
  localStorage.setItem('bandline-language', lang);
}

export function initLanguage() {
  const saved = localStorage.getItem('bandline-language') as Language;
  if (saved && (saved === 'en' || saved === 'pt')) {
    currentLanguage.set(saved);
  }
}
