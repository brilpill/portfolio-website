/* The design system's icons (Figma brilpill · icon/*), from the andrsrxn/icons kit (https://github.com/andrsrxn/icons); stroke and fill
 * in currentColor so they follow the theme tokens. */

type Props = { size?: number; className?: string };
const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** icon/sparkle (1342:6926) */
export function IconSparkle({ size = 20, className }: Props) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M9.99333 18.3347C9.60758 18.3347 9.28758 18.0472 9.21375 17.6286C8.40133 12.1606 7.70378 11.5037 2.3944 10.7895C1.96769 10.732 1.66406 10.4036 1.66406 10.0013C1.66406 9.59082 1.9759 9.2624 2.40261 9.21315C7.71198 8.62199 8.47516 7.85024 9.21375 2.37404C9.27933 1.95533 9.59941 1.66797 9.99333 1.66797C10.3872 1.66797 10.7072 1.95533 10.7729 2.37404C11.5607 7.84202 12.291 8.5809 17.6004 9.21315C18.0189 9.2624 18.3307 9.59082 18.3307 10.0013C18.3307 10.4036 18.0107 10.7402 17.5922 10.7895C12.2746 11.3806 11.5114 12.1524 10.7729 17.6286C10.7072 18.0472 10.3954 18.3347 9.99333 18.3347Z" />
    </svg>
  );
}

/** icon/x (1342:6935) */
export function IconX({ size = 24, className }: Props) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" {...line} aria-hidden><path d="M5.30078 5.30078L18.7008 18.7008M5.30078 18.7008L18.7008 5.30078" /></svg>;
}

/** andrsrxn/icons ui/reload */
export function IconReload({ size = 24, className }: Props) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" {...line} aria-hidden>
      <path d="M20.62 7.9c-3.12-4.09-6.2-4.86-8.67-4.86a9.08 9.08 0 1 0 6.36 15.55" />
      <path d="M21.4 2.77v2.02c0 1.89 0 2.83-.58 3.42s-1.53.59-3.41.59h-2.03" />
    </svg>
  );
}

/** icon/cursor (1342:6938) */
export function IconCursor({ size = 15, className }: Props) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 15 15" fill="currentColor" aria-hidden>
      <path d="M13.199 3.3706C13.506 2.40438 12.5955 1.49392 11.6293 1.80083L1.55909 4.99959C0.36474 5.37898 0.409432 7.08415 1.622 7.40046L6.36271 8.63715L7.5994 13.3778C7.91571 14.5904 9.6209 14.6351 10.0003 13.4408L13.199 3.3706Z" />
    </svg>
  );
}

/** icon/chevron-end (1342:6932) */
export function IconChevronEnd({ size = 20, className }: Props) {
  return <svg className={className} width={size} height={size} viewBox="0 0 20 20" {...line} aria-hidden><path d="M7.5 3.7666L11.3667 7.63327C12.4833 8.74994 13.0333 9.29993 13.0333 9.9916C13.0333 10.6833 12.4833 11.2416 11.3667 12.3499L7.5 16.2333" /></svg>;
}

/** icon/sound-on (1342:6941) and icon/sound-off (1342:6944) */
export function IconSound({ on, size = 20, className }: Props & { on: boolean }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 20 20" {...line} aria-hidden>
      <path d={on
        ? "M1.45703 12.8327V7.16602M18.5404 12.8327V7.16602M11.707 12.6077V7.39102M8.29036 14.4327V5.56602M4.8737 16.341V3.66602M15.1237 16.341V3.66602"
        : "M1.45703 12.8331V7.16641M18.5404 12.8331V7.16641M11.707 11.6664V7.39141M8.29036 14.4331V5.56641M4.8737 16.3414V4.91641M15.1237 14.9997V3.65807M2.19036 2.19141L17.807 17.8081"} />
    </svg>
  );
}

/** The theme switcher's icon for the theme in use: sun ("light", 1303:7355), icon/moon (1342:6947), waves or leaf. */
export function IconTheme({ theme, size = 20, className }: Props & { theme: "light" | "dark" | "vistula" | "moss" }) {
  // Waves (the Vistula) and leaf (moss) are from andrsrxn/icons, drawn on a 24 grid: a wider stroke keeps them as heavy as
  // the sun and moon at the same size.
  if (theme === "vistula" || theme === "moss") return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" {...line} strokeWidth={1.8} aria-hidden>
      {theme === "vistula"
        ? <><path d="M3.45 6.58A7.8 7.8 0 0 1 8.5 4.84c2.52 0 5.54 2.22 7.99 2.22s3.59-1.2 4.07-1.85" /><path d="M3.45 12.62A7.8 7.8 0 0 1 8.5 10.9c2.52 0 5.54 2.22 7.99 2.22s3.59-1.2 4.07-1.85" /><path d="M3.45 18.67a7.8 7.8 0 0 1 5.04-1.73c2.52 0 5.54 2.22 7.99 2.22s3.59-1.2 4.07-1.86" /></>
        : <><path d="M6.52 5.59c3.67-3.27 8.38-3.8 11.23-3.79 1.1.01 1.66.02 2.23.56s.6 1.08.68 2.16c.17 2.81-.22 7.48-3.75 11.39-3.76 4.15-8.78 3.36-11.27 1.12-2.27-2.05-3.5-7.55.88-11.44" /><path d="M11.9 10.43c-2.22 1.39-6.96 5.74-8.12 12.09" /></>}
    </svg>
  );
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 20 20" {...line} aria-hidden>
      {theme === "dark"
        ? <path d="M3.8954 14.8837C2.71633 13.4158 2.07137 11.5907 2.06641 9.70789C2.06913 8.25099 2.45376 6.82026 3.18193 5.55839C3.9101 4.29651 4.95638 3.24759 6.21641 2.51623L6.23397 2.50619C6.98055 2.07956 7.35148 1.86758 7.57474 2.04123C7.79141 2.21623 7.64974 2.70789 7.34974 3.68289C6.92991 4.92087 6.87399 6.25328 7.18861 7.52208C7.50322 8.79088 8.17517 9.94281 9.12474 10.8412C11.5997 13.3246 14.8081 12.8412 16.7497 12.1996C17.5831 11.9246 17.9997 11.7912 18.1831 11.9912C18.3664 12.1996 18.1997 12.5496 17.8664 13.2412C17.0599 14.9426 15.699 16.3191 14.007 17.145C12.3149 17.9708 10.3924 18.1968 8.555 17.7859C6.71759 17.375 5.07447 16.3516 3.8954 14.8837Z" />
        : <><path d="M9.975 13.9333C7.79808 13.9333 6.03333 12.1686 6.03333 9.99167C6.03333 7.81474 7.79808 6.05 9.975 6.05C12.1519 6.05 13.9167 7.81474 13.9167 9.99167C13.9167 12.1686 12.1519 13.9333 9.975 13.9333Z" /><path d="M1.3 9.99167H3.58333M16.4583 10H18.7083M9.95833 18.6167V16.4333M9.95833 3.61667V1.38333M15 4.89167L16.6833 3.20833M3.33333 16.5583L4.79167 15.1M4.85 4.81667L3.25 3.20833M16.675 16.6417L15.125 15.0917" /></>}
    </svg>
  );
}
