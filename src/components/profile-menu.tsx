"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import { MoonIcon, MouseScrollIcon, PaletteIcon, RowsIcon, SidebarIcon, SidebarSimpleIcon, SunIcon, WaveformIcon, WaveformSlashIcon } from "@phosphor-icons/react";
import { UserMenu } from "./arc/user-menu";
import { setSectionSnap, useSectionSnap } from "./settings-store";

const user = { name: "Oleh Bril", detail: "UX/UI Designer & Engineer", avatarSrc: "/figma/avatar.png" };
/** The sidebar footer is 240px with Ask AI beside the profile, so it shows the short role; the menu header keeps the full one. */
const sidebarRole = "Designer & Engineer";
/** Phones have no rail to collapse to, so the Sidebar switch shows only where the desktop sidebar does. */
const wideQuery = "(min-width: 768px)";
const subscribeWide = (change: () => void) => { const query = window.matchMedia(wideQuery); query.addEventListener("change", change); return () => query.removeEventListener("change", change); };
export type AppearanceSetting = { value: "light" | "dark"; onChange: (value: "light" | "dark") => void };

/**
 * The profile menu (Arc UI User menu, adapted): only the settings, Appearance, Sound, Scrolling and (on wider screens,
 * where the sidebar can collapse to the icon rail) Sidebar, as inline switches
 * that keep the menu open. The trigger already shows the avatar, name and role, so the menu does not repeat them; the
 * dropdown is as wide as the expanded sidebar's rows, in the rail too. On phones it rises as a bottom sheet
 * inside the navigation sheet.
 */
export function ProfileMenu({ compact, soundEnabled, onSound, sidebarExpanded, onSidebar, onOpenChange, appearance }: { compact: boolean; soundEnabled: boolean; onSound: () => void; sidebarExpanded: boolean; onSidebar: (expanded: boolean) => void; onOpenChange: (open: boolean) => void; appearance?: AppearanceSetting }) {
  const snap = useSectionSnap();
  const wide = useSyncExternalStore(subscribeWide, () => window.matchMedia(wideQuery).matches, () => true);
  return <UserMenu user={user} align="start" onOpenChange={onOpenChange} showHeader={false} panelClassName={`profile-menu-panel${appearance?.value === "dark" ? " profile-menu-panel-dark" : ""}`}
    getSheetContainer={() => document.querySelector<HTMLElement>(".portfolio-menu")}
    triggerClassName={compact ? "rail-avatar" : "home-profile"}
    trigger={<>
      <Image src={user.avatarSrc} width={compact ? 28 : 36} height={compact ? 28 : 36} alt="" />
      {!compact && <span><span className="home-profile-name">{user.name}</span><span className="home-profile-role" title={user.detail}>{sidebarRole}</span></span>}
    </>}
    switches={[
      { label: "Appearance", icon: <PaletteIcon />, value: appearance?.value ?? "light", onChange: (value) => appearance?.onChange(value as "light" | "dark"), options: [
        { value: "light", label: "Light", icon: <SunIcon /> },
        { value: "dark", label: appearance ? "Dark" : "Dark, coming soon", icon: <MoonIcon />, disabled: !appearance },
      ] },
      { label: "Sound", icon: soundEnabled ? <WaveformIcon /> : <WaveformSlashIcon />, value: soundEnabled ? "on" : "off", onChange: (value) => { if ((value === "on") !== soundEnabled) onSound(); },
        // The page's click sound skips this switch; onSound plays its single confirmation cue.
        buttonProps: { "data-sound-toggle": "" }, options: [
        { value: "off", label: "Sound off", icon: <WaveformSlashIcon /> },
        { value: "on", label: "Sound on", icon: <WaveformIcon /> },
      ] },
      { label: "Scrolling", icon: snap ? <RowsIcon /> : <MouseScrollIcon />, value: snap ? "snap" : "free", onChange: (value) => setSectionSnap(value === "snap"), options: [
        { value: "free", label: "Free scroll", icon: <MouseScrollIcon /> },
        { value: "snap", label: "Snap to sections", icon: <RowsIcon /> },
      ] },
      // Collapsed: the outline only, like the narrow rail; expanded: the side panel filled in.
      ...(wide ? [{ label: "Sidebar", icon: sidebarExpanded ? <SidebarIcon weight="fill" /> : <SidebarSimpleIcon />, value: sidebarExpanded ? "expanded" : "collapsed", onChange: (value: string) => onSidebar(value === "expanded"), options: [
        { value: "collapsed", label: "Collapse sidebar", icon: <SidebarSimpleIcon /> },
        { value: "expanded", label: "Expand sidebar", icon: <SidebarIcon weight="fill" /> },
      ] }] : []),
    ]} />;
}
