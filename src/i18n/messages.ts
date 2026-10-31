import type { AccentId } from '../lib/accent'
import type { AmbienceKind } from '../lib/ambience'
import type { BackgroundId } from '../lib/assets'
import type { Range } from '../lib/stats'
import type { Mode, TimeDisplay } from '../lib/timer'
import { defineMessages } from './locales'

type Strings = {
  appName: string
  language: string
  toLight: string
  toDark: string
  settings: string
  close: string
  modes: Record<Mode, string>
  round: (current: number, total: number) => string
  start: string
  pause: string
  resume: string
  back: string
  paused: string
  reset: string
  skip: string
  openFloating: string
  closeFloating: string
  floatingFailed: string
  category: string
  addCategory: string
  newCategory: string
  removeCategory: (name: string) => string
  defaultCategories: Record<string, string>
  stats: string
  ranges: Record<Range, string>
  noSessions: string
  total: string
  clear: string
  play: string
  volume: string
  music: string
  musicPlaceholder: string
  musicInvalid: string
  musicRemove: string
  tracks: Record<AmbienceKind, string>
  fields: {
    focus: string
    short: string
    long: string
    rounds: string
    timeDisplay: string
    autoStart: string
    sound: string
    ringAnimation: string
    notify: string
    dim: string
    blur: string
    glass: string
    accent: string
    customAccent: string
  }
  accents: Record<AccentId, string>
  timeDisplays: Record<TimeDisplay, string>
  background: string
  backgrounds: Record<BackgroundId, string>
  exportData: string
  importData: string
  importFailed: string
  notificationsBlocked: string
  notification: {
    focusDone: string
    breakDone: string
    toFocus: string
    toBreak: string
  }
  developedBy: string
}

export const messages = defineMessages<Strings>({
  en: {
    appName: 'Simple Pomodoro',
    language: 'Language',
    toLight: 'Switch to light mode',
    toDark: 'Switch to dark mode',
    settings: 'Settings',
    close: 'Close',
    modes: { focus: 'Focus', short: 'Short break', long: 'Long break' },
    round: (current, total) => `Round ${current} of ${total}`,
    start: 'Start',
    pause: 'Pause',
    resume: 'Resume',
    back: 'Back',
    paused: 'Paused',
    reset: 'Reset',
    skip: 'Skip',
    openFloating: 'Open floating timer',
    closeFloating: 'Close floating timer',
    floatingFailed: 'Could not open the floating timer.',
    category: 'Category',
    addCategory: 'Add',
    newCategory: 'New category',
    removeCategory: (name) => `Remove ${name}`,
    defaultCategories: {},
    stats: 'Stats',
    ranges: { today: 'Today', week: 'Week', all: 'All' },
    noSessions: 'No focus sessions yet.',
    total: 'Total',
    clear: 'Clear',
    play: 'Play',
    volume: 'Volume',
    music: 'Your music',
    musicPlaceholder: 'YouTube, Spotify or SoundCloud link',
    musicInvalid: 'Use a YouTube, Spotify or SoundCloud link.',
    musicRemove: 'Remove',
    tracks: { rain: 'Rain', waves: 'Waves', brown: 'Brown noise' },
    fields: {
      focus: 'Focus (min)',
      short: 'Short break (min)',
      long: 'Long break (min)',
      rounds: 'Rounds before long',
      timeDisplay: 'Time display',
      autoStart: 'Auto-start next',
      sound: 'Completion sound',
      ringAnimation: 'Animated ring',
      notify: 'Notification',
      dim: 'Dim',
      blur: 'Blur',
      glass: 'Glass cards',
      accent: 'Main color',
      customAccent: 'Custom color',
    },
    accents: {
      indigo: 'Indigo',
      violet: 'Violet',
      pink: 'Pink',
      red: 'Red',
      orange: 'Orange',
      amber: 'Amber',
      green: 'Green',
      teal: 'Teal',
    },
    timeDisplays: {
      full: 'Minutes and seconds',
      minutes: 'Minutes only',
      lastMinute: 'Minutes, then seconds in the last minute',
    },
    background: 'Background',
    backgrounds: {
      plain: 'Plain',
      midnight: 'Midnight',
      dusk: 'Dusk',
      forest: 'Forest',
      ember: 'Ember',
      ocean: 'Ocean',
      mountains: 'Mountains',
      sunset: 'Sunset',
      night: 'Night',
    },
    exportData: 'Export',
    importData: 'Import',
    importFailed: 'Could not import that file.',
    notificationsBlocked: 'Notifications are blocked in this browser.',
    notification: {
      focusDone: 'Focus finished',
      breakDone: 'Break finished',
      toFocus: 'Time to focus.',
      toBreak: 'Time for a break.',
    },
    developedBy: 'Developed by',
  },
  es: {
    appName: 'Pomodoro Simple',
    language: 'Idioma',
    toLight: 'Cambiar a modo claro',
    toDark: 'Cambiar a modo oscuro',
    settings: 'Ajustes',
    close: 'Cerrar',
    modes: { focus: 'Enfoque', short: 'Pausa corta', long: 'Pausa larga' },
    round: (current, total) => `Ronda ${current} de ${total}`,
    start: 'Empezar',
    pause: 'Pausar',
    resume: 'Continuar',
    back: 'Volver',
    paused: 'En pausa',
    reset: 'Reiniciar',
    skip: 'Saltar',
    openFloating: 'Abrir temporizador flotante',
    closeFloating: 'Cerrar temporizador flotante',
    floatingFailed: 'No se pudo abrir el temporizador flotante.',
    category: 'Categoría',
    addCategory: 'Añadir',
    newCategory: 'Nueva categoría',
    removeCategory: (name) => `Quitar ${name}`,
    defaultCategories: { Work: 'Trabajo', Study: 'Estudio', Read: 'Lectura' },
    stats: 'Estadísticas',
    ranges: { today: 'Hoy', week: 'Semana', all: 'Todo' },
    noSessions: 'Aún no hay sesiones de enfoque.',
    total: 'Total',
    clear: 'Borrar',
    play: 'Reproducir',
    volume: 'Volumen',
    music: 'Tu música',
    musicPlaceholder: 'Link de YouTube, Spotify o SoundCloud',
    musicInvalid: 'Usa un link de YouTube, Spotify o SoundCloud.',
    musicRemove: 'Quitar',
    tracks: { rain: 'Lluvia', waves: 'Olas', brown: 'Ruido marrón' },
    fields: {
      focus: 'Enfoque (min)',
      short: 'Pausa corta (min)',
      long: 'Pausa larga (min)',
      rounds: 'Rondas antes de la larga',
      timeDisplay: 'Mostrar el tiempo',
      autoStart: 'Iniciar lo siguiente solo',
      sound: 'Sonido al terminar',
      ringAnimation: 'Anillo animado',
      notify: 'Notificación',
      dim: 'Oscurecer',
      blur: 'Desenfoque',
      glass: 'Tarjetas de cristal',
      accent: 'Color principal',
      customAccent: 'Color personalizado',
    },
    accents: {
      indigo: 'Índigo',
      violet: 'Violeta',
      pink: 'Rosa',
      red: 'Rojo',
      orange: 'Naranja',
      amber: 'Ámbar',
      green: 'Verde',
      teal: 'Turquesa',
    },
    timeDisplays: {
      full: 'Minutos y segundos',
      minutes: 'Solo minutos',
      lastMinute: 'Minutos, y segundos en el último minuto',
    },
    background: 'Fondo',
    backgrounds: {
      plain: 'Liso',
      midnight: 'Medianoche',
      dusk: 'Crepúsculo',
      forest: 'Bosque',
      ember: 'Brasa',
      ocean: 'Océano',
      mountains: 'Montañas',
      sunset: 'Atardecer',
      night: 'Noche',
    },
    exportData: 'Exportar',
    importData: 'Importar',
    importFailed: 'No se pudo importar ese archivo.',
    notificationsBlocked: 'Las notificaciones están bloqueadas en este navegador.',
    notification: {
      focusDone: 'Enfoque terminado',
      breakDone: 'Pausa terminada',
      toFocus: 'Hora de enfocarse.',
      toBreak: 'Hora de una pausa.',
    },
    developedBy: 'Desarrollado por',
  },
})
