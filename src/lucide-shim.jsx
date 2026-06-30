import React from "react";
const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
export function Copy({ size = 16, ...p }) { return (<svg width={size} height={size} {...base} {...p}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>); }
export function Check({ size = 16, ...p }) { return (<svg width={size} height={size} {...base} {...p}><polyline points="20 6 9 17 4 12"/></svg>); }
export function ChevronRight({ size = 16, ...p }) { return (<svg width={size} height={size} {...base} {...p}><path d="m9 18 6-6-6-6"/></svg>); }
export function ChevronLeft({ size = 16, ...p }) { return (<svg width={size} height={size} {...base} {...p}><path d="m15 18-6-6 6-6"/></svg>); }
export function AlertTriangle({ size = 16, ...p }) { return (<svg width={size} height={size} {...base} {...p}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>); }
export function Search({ size = 16, ...p }) { return (<svg width={size} height={size} {...base} {...p}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>); }
export function ExternalLink({ size = 16, ...p }) { return (<svg width={size} height={size} {...base} {...p}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>); }
