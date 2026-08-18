import {
  Code,
  FileText,
  Folder,
  FolderGit2,
  Image,
  Music,
  StickyNote,
  Terminal,
  type LucideIcon,
} from "lucide-react";

export type Wallpaper = {
  src: string;
  alt: string;
  location: string;
};

export type DockItem = {
  id: "code" | "spotify" | "terminal" | "photos" | "notes";
  label: string;
  icon: LucideIcon;
  accent: string;
  iconClassName?: string;
};

export type DesktopIcon = {
  label: string;
  icon: LucideIcon;
  accent: string;
};

export const WALLPAPERS: readonly Wallpaper[] = [
  {
    src: "/wallpapers/wallpaper1.jpg",
    alt: "Cat watching a city sunset from a window ledge",
    location: "Window Seat",
  },
  {
    src: "/wallpapers/wallpaper2.jpg",
    alt: "Rooftop view over a pink city skyline at dusk",
    location: "Rooftop, Golden Hour",
  },
  {
    src: "/wallpapers/wallpaper3.jpg",
    alt: "Tall grass glowing in a hillside sunrise",
    location: "Live In The Moment",
  },
  {
    src: "/wallpapers/wallpaper4.jpg",
    alt: "Surfer paddling into a wave at sunset",
    location: "No Mistakes, Only Waves",
  },
  {
    src: "/wallpapers/wallpaper5.jpg",
    alt: "Two orange cats by a rainy window overlooking the city",
    location: "Rainy Afternoon",
  },
  {
    src: "/wallpapers/wallpaper6.jpg",
    alt: "Two black cats watching a moonlit city from bed",
    location: "Midnight Window",
  },
  {
    src: "/wallpapers/wallpaper7.jpeg",
    alt: "Black cat on a stone ledge overlooking a sunset cityscape",
    location: "Overlook at Dusk",
  },
] as const;

export const DOCK_ITEMS: readonly DockItem[] = [
  { id: "code", label: "Code", icon: Code, accent: "#c7ceea" },
  { id: "spotify", label: "Spotify", icon: Music, accent: "#b5ead7" },
  {
    id: "terminal",
    label: ">_",
    icon: Terminal,
    accent: "#1a1625",
    iconClassName: "text-mint",
  },
  { id: "photos", label: "Photos", icon: Image, accent: "#ffb7b2" },
  { id: "notes", label: "Notes", icon: StickyNote, accent: "#fff2a8" },
] as const;

export const DESKTOP_ICONS: readonly DesktopIcon[] = [
  { label: "tandem", icon: Folder, accent: "#c7ceea" },
  { label: "worktrees", icon: FolderGit2, accent: "#b5ead7" },
  { label: "screenshots", icon: Image, accent: "#ffb7b2" },
  { label: "wrapped.md", icon: FileText, accent: "#fff2a8" },
] as const;

/** Weather falls back to this when geolocation is unavailable or not yet granted. */
export const DEFAULT_WEATHER_LOCATION = {
  label: "Berkeley",
  latitude: 37.8715,
  longitude: -122.273,
} as const;
