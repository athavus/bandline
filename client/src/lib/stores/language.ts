import { writable, derived } from "svelte/store";

export type Language = "en" | "pt" | "es";

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
  login: string; // não faz sentido mas isso aqui na realidade é a palavra "buscas" em todas as línguas.
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
  firstWord: string;
  lastWord: string;
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

  // History
  firstHistoryWord: string;
  lastHistoryWord: string;
  loadingHistory: string;
  errorLoadingHistory: string;
  historyEmpty: string;
  historyEmptyDescription: string;
  discoverArtists: string;
  errorOccurred: string;
  noArtistsFound: string;
  clearFilter: string;
  searchArtistsHistory: string;
  clearSearch: string;
  artist: string;
  artists: string; // não faz sentido mas isso aqui na realidade é a palavra "buscas" em todas as línguas.
  gridView: string;
  listView: string;
  timeAgo: {
    now: string;
    minutesAgo: string;
    hoursAgo: string;
    daysAgo: string;
  };

  // Favorites
  firstFavoritesWord: string;
  lastFavoritesWord: string;
  loadingFavorites: string;
  retry: string;
  noFavoritesYet: string;

  // CompletedAlbums
  firstCompletedWord: string;
  lastCompletedWord: string;

  // Sidebar
  menu: string;
  home: string;
  aboutApp: string;
  favorites: string;
  history: string;
  completeAlbums: string;
  account: string;
  profile: string;
  explore: string;
  searchArtists: string;
  topCharts: string;
  welcome: string;
  signInToAccess: string;

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
    loading: "Loading...",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    confirm: "Confirm",
    close: "Close",
    back: "Back",
    next: "Next",
    previous: "Previous",
    search: "Search",
    login: "Login",
    logout: "Logout",
    register: "Register",
    username: "Username",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    showPassword: "Show password",
    hidePassword: "Hide password",

    // App specific
    appName: "Bandline",
    searchArtistsPlaceholder: "Search artists...",
    loginToSearch: "Login to search artists",
    hello: "Hello",
    user: "User",

    // Auth
    welcomeBack: "Welcome back",
    enterAccount: "Sign in to your account to continue",
    createAccount: "Create account",
    fillData: "Fill in the data to get started",
    enterUsername: "Enter your username or email",
    enterEmail: "Enter your email",
    enterPassword: "Enter your password",
    confirmPasswordPlaceholder: "Enter your password again",
    fillAllFields: "Please fill in all fields",
    validEmail: "Please enter a valid email",
    passwordMinLength: "Password must be at least 8 characters",
    passwordsDontMatch: "Passwords do not match",
    accountCreated: "Account created successfully!",
    loginError: "Login error",
    registerError: "Registration error",
    continueWithGoogle: "Continue with Google",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    createAccountLink: "Create account",
    loginLink: "Sign in",
    entering: "Signing in...",
    creatingAccount: "Creating account...",

    // Artist related
    about: "About:",
    followers: "Followers",
    popularity: "Popularity",
    genres: "Genres",
    relatedArtists: "Related Artists",
    artistDetails: "Artist Details",
    openInSpotify: "Open in Spotify",

    // Albums and tracks
    firstWord: "Disco",
    lastWord: "Graphy",
    discography: "Discography",
    tracks: "tracks",
    track: "track",
    album: "Album",
    releaseDate: "Release Date",
    totalTracks: "Total Tracks",
    duration: "Duration",
    noAlbumsFound: "No albums found for this artist.",
    loadingDiscography: "Loading discography...",
    loadingTracks: "Loading tracks...",
    errorLoadingDiscography: "Error loading discography:",
    tryAgain: "Try again",

    // Welcome section
    welcomeTitle: "Welcome to Bandline",
    welcomeSubtitle: "Discover your favorite artists",
    welcomeDescription:
      "Explore discographies, discover new music, and dive deep into the world of your favorite artists.",
    getStarted: "Get Started",

    // History
    firstHistoryWord: "Hist",
    lastHistoryWord: "ory",
    loadingHistory: "Loading history...",
    errorLoadingHistory:
      "Could not load history. Please check if you are authenticated.",
    historyEmpty: "Your history is empty",
    historyEmptyDescription:
      "Start exploring artists and build your musical journey!",
    discoverArtists: "Discover Artists",
    errorOccurred: "Oops! Something went wrong",
    noArtistsFound: "No artists found with",
    clearFilter: "Clear filter",
    searchArtistsHistory: "Search artists...",
    clearSearch: "Clear search",
    artist: "artist",
    artists: "buscas",
    gridView: "Grid view",
    listView: "List view",
    timeAgo: {
      now: "Now",
      minutesAgo: "min ago",
      hoursAgo: "h ago",
      daysAgo: "d ago",
    },

    // Favorites
    firstFavoritesWord: "Favo",
    lastFavoritesWord: "rites",
    loadingFavorites: "Loading Favorites...",
    retry: "Try Again",
    noFavoritesYet: "You haven't favorited any albums yet.",

    // Completed Albums
    firstCompletedWord: "My",
    lastCompletedWord: "Collection",

    // Sidebar
    menu: "Menu",
    home: "Home",
    aboutApp: "About",
    favorites: "Favorites",
    history: "History",
    completeAlbums: "Complete Albums",
    account: "Account",
    profile: "Profile",
    explore: "Explore",
    searchArtists: "Search Artists",
    topCharts: "Top Charts",
    welcome: "Welcome!",
    signInToAccess: "Sign in or create an account to access all features",

    // Timeline
    timeline: "Timeline",
    showTimeline: "Show Timeline",

    // Errors
    errorLoadingArtist: "Error loading artist data:",
    errorLoadingData: "Error loading data:",
    unknownError: "Unknown error",
  },
  pt: {
    // Common
    loading: "Carregando...",
    error: "Erro",
    success: "Sucesso",
    cancel: "Cancelar",
    confirm: "Confirmar",
    close: "Fechar",
    back: "Voltar",
    next: "Próximo",
    previous: "Anterior",
    search: "Buscar",
    login: "Entrar",
    logout: "Sair",
    register: "Registrar",
    username: "Nome de usuário",
    email: "Email",
    password: "Senha",
    confirmPassword: "Confirmar senha",
    showPassword: "Mostrar senha",
    hidePassword: "Ocultar senha",

    // App specific
    appName: "Bandline",
    searchArtistsPlaceholder: "Buscar artistas...",
    loginToSearch: "Faça login para buscar artistas",
    hello: "Olá",
    user: "Usuário",

    // Auth
    welcomeBack: "Bem-vindo de volta",
    enterAccount: "Entre na sua conta para continuar",
    createAccount: "Criar conta",
    fillData: "Preencha os dados para começar",
    enterUsername: "Digite seu nome de usuário ou email",
    enterEmail: "Digite seu email",
    enterPassword: "Digite sua senha",
    confirmPasswordPlaceholder: "Digite novamente sua senha",
    fillAllFields: "Por favor, preencha todos os campos",
    validEmail: "Por favor, digite um email válido",
    passwordMinLength: "A senha deve ter pelo menos 8 caracteres",
    passwordsDontMatch: "As senhas não conferem",
    accountCreated: "Conta criada com sucesso!",
    loginError: "Erro no login",
    registerError: "Erro ao criar conta",
    continueWithGoogle: "Continuar com Google",
    noAccount: "Não tem uma conta?",
    haveAccount: "Já tem uma conta?",
    createAccountLink: "Criar conta",
    loginLink: "Fazer login",
    entering: "Entrando...",
    creatingAccount: "Criando conta...",

    // Artist related
    about: "Sobre:",
    followers: "Seguidores",
    popularity: "Popularidade",
    genres: "Gêneros",
    relatedArtists: "Artistas Relacionados",
    artistDetails: "Detalhes do Artista",
    openInSpotify: "Abrir no Spotify",

    // Albums and tracks
    firstWord: "Disco",
    lastWord: "Grafia",
    discography: "Discografia",
    tracks: "faixas",
    track: "faixa",
    album: "Álbum",
    releaseDate: "Data de Lançamento",
    totalTracks: "Total de Faixas",
    duration: "Duração",
    noAlbumsFound: "Nenhum álbum encontrado para este artista.",
    loadingDiscography: "Carregando discografia...",
    loadingTracks: "Carregando faixas...",
    errorLoadingDiscography: "Erro ao carregar discografia:",
    tryAgain: "Tentar novamente",

    // Welcome section
    welcomeTitle: "Bem-vindo ao Bandline",
    welcomeSubtitle: "Descubra seus artistas favoritos",
    welcomeDescription:
      "Explore discografias, descubra novas músicas e mergulhe no mundo dos seus artistas favoritos.",
    getStarted: "Começar",

    // History
    firstHistoryWord: "Histó",
    lastHistoryWord: "rico",
    loadingHistory: "Carregando histórico...",
    errorLoadingHistory:
      "Não foi possível carregar o histórico. Verifique se está autenticado.",
    historyEmpty: "Seu histórico está vazio",
    historyEmptyDescription:
      "Comece a explorar artistas e construa sua jornada musical!",
    discoverArtists: "Descobrir Artistas",
    errorOccurred: "Ops! Algo deu errado",
    noArtistsFound: "Nenhum artista encontrado com",
    clearFilter: "Limpar filtro",
    searchArtistsHistory: "Pesquisar artistas...",
    clearSearch: "Limpar busca",
    artist: "artista",
    artists: "buscas",
    gridView: "Visualização em grid",
    listView: "Visualização em lista",
    timeAgo: {
      now: "Agora",
      minutesAgo: "min atrás",
      hoursAgo: "h atrás",
      daysAgo: "d atrás",
    },

    // Favorites
    firstFavoritesWord: "Favo",
    lastFavoritesWord: "ritos",
    loadingFavorites: "Carregando Favoritos...",
    retry: "Tentar Novamente",
    noFavoritesYet: "Você ainda não favoritou nenhum álbum.",

    // Completed Albums
    firstCompletedWord: "Minha",
    lastCompletedWord: "Coleção",

    // Sidebar
    menu: "Menu",
    home: "Início",
    aboutApp: "Sobre",
    favorites: "Favoritos",
    history: "Histórico",
    completeAlbums: "Álbuns Completos",
    account: "Conta",
    profile: "Perfil",
    explore: "Explorar",
    searchArtists: "Buscar Artistas",
    topCharts: "Top Charts",
    welcome: "Bem-vindo!",
    signInToAccess: "Entre ou crie uma conta para acessar todos os recursos",

    // Timeline
    timeline: "Linha do Tempo",
    showTimeline: "Mostrar Linha do Tempo",

    // Errors
    errorLoadingArtist: "Erro ao buscar dados do artista:",
    errorLoadingData: "Erro ao carregar dados:",
    unknownError: "Erro desconhecido",
  },
  es: {
    // Common
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",
    cancel: "Cancelar",
    confirm: "Confirmar",
    close: "Cerrar",
    back: "Atrás",
    next: "Siguiente",
    previous: "Anterior",
    search: "Buscar",
    login: "Iniciar sesión",
    logout: "Cerrar sesión",
    register: "Registrarse",
    username: "Nombre de usuario",
    email: "Email",
    password: "Contraseña",
    confirmPassword: "Confirmar contraseña",
    showPassword: "Mostrar contraseña",
    hidePassword: "Ocultar contraseña",

    // App specific
    appName: "Bandline",
    searchArtistsPlaceholder: "Buscar artistas...",
    loginToSearch: "Inicia sesión para buscar artistas",
    hello: "Hola",
    user: "Usuario",

    // Auth
    welcomeBack: "Bienvenido de vuelta",
    enterAccount: "Inicia sesión en tu cuenta para continuar",
    createAccount: "Crear cuenta",
    fillData: "Completa los datos para comenzar",
    enterUsername: "Ingresa tu nombre de usuario o email",
    enterEmail: "Ingresa tu email",
    enterPassword: "Ingresa tu contraseña",
    confirmPasswordPlaceholder: "Ingresa tu contraseña nuevamente",
    fillAllFields: "Por favor, completa todos los campos",
    validEmail: "Por favor, ingresa un email válido",
    passwordMinLength: "La contraseña debe tener al menos 8 caracteres",
    passwordsDontMatch: "Las contraseñas no coinciden",
    accountCreated: "¡Cuenta creada exitosamente!",
    loginError: "Error al iniciar sesión",
    registerError: "Error al registrarse",
    continueWithGoogle: "Continuar con Google",
    noAccount: "¿No tienes una cuenta?",
    haveAccount: "¿Ya tienes una cuenta?",
    createAccountLink: "Crear cuenta",
    loginLink: "Iniciar sesión",
    entering: "Iniciando sesión...",
    creatingAccount: "Creando cuenta...",

    // Artist related
    about: "Acerca de:",
    followers: "Seguidores",
    popularity: "Popularidad",
    genres: "Géneros",
    relatedArtists: "Artistas Relacionados",
    artistDetails: "Detalles del Artista",
    openInSpotify: "Abrir en Spotify",

    // Albums and tracks
    firstWord: "Disco",
    lastWord: "Grafía",
    discography: "Discografía",
    tracks: "canciones",
    track: "canción",
    album: "Álbum",
    releaseDate: "Fecha de Lanzamiento",
    totalTracks: "Total de Canciones",
    duration: "Duración",
    noAlbumsFound: "No se encontraron álbumes para este artista.",
    loadingDiscography: "Cargando discografía...",
    loadingTracks: "Cargando canciones...",
    errorLoadingDiscography: "Error al cargar discografía:",
    tryAgain: "Intentar de nuevo",

    // Welcome section
    welcomeTitle: "Bienvenido a Bandline",
    welcomeSubtitle: "Descubre tus artistas favoritos",
    welcomeDescription:
      "Explora discografías, descubre nueva música y sumérgete en el mundo de tus artistas favoritos.",
    getStarted: "Comenzar",

    // History
    firstHistoryWord: "Hist",
    lastHistoryWord: "oria",
    loadingHistory: "Cargando historial...",
    errorLoadingHistory:
      "No se pudo cargar el historial. Verifica que estés autenticado.",
    historyEmpty: "Tu historial está vacío",
    historyEmptyDescription:
      "¡Comienza a explorar artistas y construye tu viaje musical!",
    discoverArtists: "Descubrir Artistas",
    errorOccurred: "¡Ups! Algo salió mal",
    noArtistsFound: "No se encontraron artistas con",
    clearFilter: "Limpiar filtro",
    searchArtistsHistory: "Buscar artistas...",
    clearSearch: "Limpiar búsqueda",
    artist: "artista",
    artists: "búsquedas",
    gridView: "Vista de cuadrícula",
    listView: "Vista de lista",
    timeAgo: {
      now: "Ahora",
      minutesAgo: "min atrás",
      hoursAgo: "h atrás",
      daysAgo: "d atrás",
    },

    // Favorites
    firstFavoritesWord: "Favo",
    lastFavoritesWord: "ritos",
    loadingFavorites: "Cargando favoritos...",
    retry: "Intentar otra vez",
    noFavoritesYet: "Aún no has añadido ningún álbum a favoritos.",

    // Completed Albums
    firstCompletedWord: "Mi",
    lastCompletedWord: "Colección",

    // Sidebar
    menu: "Menú",
    home: "Inicio",
    aboutApp: "Acerca de",
    favorites: "Favoritos",
    history: "Historial",
    completeAlbums: "Álbumes Completos",
    account: "Cuenta",
    profile: "Perfil",
    explore: "Explorar",
    searchArtists: "Buscar Artistas",
    topCharts: "Top Charts",
    welcome: "¡Bienvenido!",
    signInToAccess:
      "Inicia sesión o crea una cuenta para acceder a todas las funciones",

    // Timeline
    timeline: "Línea de Tiempo",
    showTimeline: "Mostrar Línea de Tiempo",

    // Errors
    errorLoadingArtist: "Error al cargar datos del artista:",
    errorLoadingData: "Error al cargar datos:",
    unknownError: "Error desconocido",
  },
};

const currentLanguage = writable<Language>("en");

// Store derivada para traduções reativas
export const translations$ = derived(
  currentLanguage,
  ($lang) => translations[$lang],
);

export const language = {
  subscribe: currentLanguage.subscribe,
  set: currentLanguage.set,
  get: () => {
    let lang: Language = "en";
    currentLanguage.subscribe((value) => (lang = value))();
    return lang;
  },
};

// Função de tradução (uso direto)
export function t(key: keyof Translations): string {
  let lang: Language = "en";
  currentLanguage.subscribe((value) => (lang = value))();
  return translations[lang][key] || translations.en[key] || key;
}

// Hook para componentes que precisam de reatividade
export function useTranslations() {
  return derived(currentLanguage, ($lang) => ({
    t: (key: keyof Translations) =>
      translations[$lang][key] || translations.en[key] || key,
    lang: $lang,
  }));
}

export function setLanguage(lang: Language) {
  currentLanguage.set(lang);
  localStorage.setItem("bandline-language", lang);
}

export function initLanguage() {
  const saved = localStorage.getItem("bandline-language") as Language;
  if (saved && (saved === "en" || saved === "pt" || saved === "es")) {
    currentLanguage.set(saved);
  }
}
