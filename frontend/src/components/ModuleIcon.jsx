import {
  Users, Scan, TrendingUp, Droplet, Scissors, Mic, AlertTriangle, CheckSquare,
  Clipboard, Compass, Image, Target, Bone, HeartPulse, Box, GitBranch, Glasses,
  Navigation, Layers, Monitor, MessageCircle, BookOpen, Book, ListChecks, Copy,
  Pill, GitMerge, Stethoscope, Type, FileText, Languages, Headphones, Mic2,
  Volume2, MessagesSquare, Siren, Globe, UsersRound, Building2, UserCheck,
  Video, Network, Share2, Share, Watch, Activity, CalendarClock, LineChart,
  RotateCcw, ShieldAlert, Calendar, MapPin, Truck,
} from 'lucide-react'

const ICON_MAP = {
  users: Users, scan: Scan, 'trending-up': TrendingUp, droplet: Droplet,
  scissors: Scissors, mic: Mic, 'alert-triangle': AlertTriangle,
  'check-square': CheckSquare, clipboard: Clipboard, compass: Compass,
  image: Image, target: Target, bone: Bone, 'heart-pulse': HeartPulse,
  box: Box, 'git-branch': GitBranch, glasses: Glasses, navigation: Navigation,
  layers: Layers, monitor: Monitor, 'message-circle': MessageCircle,
  'book-open': BookOpen, book: Book, 'list-checks': ListChecks, copy: Copy,
  pill: Pill, 'git-merge': GitMerge, stethoscope: Stethoscope, type: Type,
  'file-text': FileText, languages: Languages, headphones: Headphones,
  'mic-2': Mic2, 'volume-2': Volume2, 'messages-square': MessagesSquare,
  siren: Siren, globe: Globe, 'users-round': UsersRound, 'building-2': Building2,
  'user-check': UserCheck, video: Video, network: Network, 'share-2': Share2,
  share: Share, watch: Watch, activity: Activity, 'calendar-clock': CalendarClock,
  'line-chart': LineChart, 'rotate-ccw': RotateCcw, 'shield-alert': ShieldAlert,
  calendar: Calendar, 'map-pin': MapPin, truck: Truck,
}

export default function ModuleIcon({ name, size = 18 }) {
  const Icon = ICON_MAP[name] || Box
  return <Icon size={size} />
}
