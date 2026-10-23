"use client";

import Image from "next/image";
import { EnvelopeSimpleIcon, MoonIcon, PaletteIcon, SunIcon, WaveformIcon, WaveformSlashIcon } from "@phosphor-icons/react";
import { UserMenu } from "./arc/user-menu";

const user = { name: "Oleh Bril", detail: "UX/UI Designer & Engineer", avatarSrc: "/figma/avatar.png" };
/** The sidebar footer is 240px with Ask AI beside the profile, so it shows the short role; the menu header keeps the full one. */
const sidebarRole = "Designer & Engineer";

/**
 * The profile menu (Arc UI User menu, adapted): Contact, then Appearance and Sound as inline switches that keep
 * the menu open. Contact no longer takes a row in the sidebar navigation. On phones it rises as a bottom sheet
 * inside the navigation sheet.
 */
export function ProfileMenu({ compact, soundEnabled, onSound, onContact, onOpenChange }: { compact: boolean; soundEnabled: boolean; onSound: () => void; onContact: () => void; onOpenChange: (open: boolean) => void }) {
  return <UserMenu user={user} align="start" onOpenChange={onOpenChange}
    getSheetContainer={() => document.querySelector<HTMLElement>(".portfolio-menu")}
    triggerClassName={compact ? "rail-avatar" : "home-profile"}
    trigger={<>
      <Image src={user.avatarSrc} width={compact ? 28 : 36} height={compact ? 28 : 36} alt="" />
      {!compact && <span><span className="home-profile-name">{user.name}</span><span className="home-profile-role" title={user.detail}>{sidebarRole}</span></span>}
    </>}
    items={[{ label: "Contact", icon: <EnvelopeSimpleIcon />, onSelect: onContact }]}
    switches={[
      { label: "Appearance", icon: <PaletteIcon />, value: "light", onChange: () => {}, options: [
        { value: "light", label: "Light", icon: <SunIcon /> },
        { value: "dark", label: "Dark, coming soon", icon: <MoonIcon />, disabled: true },
      ] },
      { label: "Sound", icon: soundEnabled ? <WaveformIcon /> : <WaveformSlashIcon />, value: soundEnabled ? "on" : "off", onChange: (value) => { if ((value === "on") !== soundEnabled) onSound(); },
        // The page's click sound skips this switch: turning sound on plays one cue (onSound), turning it off stays silent.
        buttonProps: { "data-sound-toggle": "" }, options: [
        { value: "off", label: "Sound off", icon: <WaveformSlashIcon /> },
        { value: "on", label: "Sound on", icon: <WaveformIcon /> },
      ] },
    ]} />;
}
